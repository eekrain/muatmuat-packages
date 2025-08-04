"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { Controller, useForm } from "react-hook-form";
import * as v from "valibot";

import { Alert } from "@/components/Alert/Alert";
import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Button from "@/components/Button/Button";
import Card from "@/components/Card/Card";
import DatePicker from "@/components/DatePicker/DatePicker";
import FileUpload from "@/components/FileUpload/FileUpload";
import { FormLabel } from "@/components/Form/Form";
import Input from "@/components/Form/Input";
import ImageUploaderWeb from "@/components/ImageUploader/ImageUploaderWeb";
import {
  LightboxProvider,
  LightboxTrigger,
} from "@/components/Lightbox/Lightbox";
import LoadingStatic from "@/components/Loading/LoadingStatic";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import PageTitle from "@/components/PageTitle/PageTitle";
import { toast } from "@/lib/toast";
import { useUploadFile } from "@/services/Shared/uploadFile";
// Import the SWR hooks for getting details and updating
import { useGetDriverDetail } from "@/services/Transporter/manajemen-driver/getDriverDetail";
import { useUpdateDriver } from "@/services/Transporter/manajemen-driver/updateDriver";

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// --- FIX: Updated schema to accept File, string (URL), or null ---
const optionalFileSchema = (acceptedFormats) =>
  v.union(
    [
      v.string("File tidak valid"), // Allows existing URL strings
      v.null_(), // Allows null if the file is removed
      v.pipe(
        // Validates only if a new File object is present
        v.instance(File),
        v.check((file) => {
          const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
          return acceptedFormats.includes(fileExtension);
        }, "Format file tidak sesuai ketentuan"),
        v.check(
          (file) => file.size <= MAX_FILE_SIZE_BYTES,
          `Ukuran file melebihi ${MAX_FILE_SIZE_MB}MB`
        )
      ),
    ],
    "File tidak valid"
  );
// --- END FIX ---

// Main schema for updating a driver (no changes needed here)
const updateDriverSchema = v.object({
  namaLengkap: v.pipe(
    v.string("Nama lengkap wajib diisi"),
    v.minLength(1, "Nama lengkap wajib diisi"),
    v.minLength(3, "Nama lengkap minimal 3 karakter"),
    v.regex(
      /^[a-zA-Z\s.'-]*$/,
      "Nama lengkap hanya boleh mengandung huruf, spasi, dan karakter ', . -"
    )
  ),
  noWhatsapp: v.pipe(
    v.string("Nomor WhatsApp wajib diisi"),
    v.minLength(1, "Nomor WhatsApp wajib diisi"),
    v.minLength(10, "No. Whatsapp minimal 8 digit"),
    v.regex(/^08\d{8,}$/, "Format No. Whatsapp salah")
  ),
  fotoKTP: optionalFileSchema([".jpg", ".jpeg", ".png", ".pdf"]),
  masaBerlakuSIM: v.nonNullable(
    v.instance(Date, "Masa berlaku SIM B2 Umum wajib diisi"),
    "Masa berlaku SIM B2 Umum wajib diisi"
  ),
  fotoSIM: optionalFileSchema([".jpg", ".jpeg", ".png", ".pdf"]),
  fotoDriver: optionalFileSchema([".jpg", ".jpeg", ".png"]),
});

const exampleImages = [
  "https://picsum.photos/200/300",
  "https://picsum.photos/id/237/200/300",
  "https://picsum.photos/seed/picsum/200/300",
];

export default function UbahDriverPage() {
  const router = useRouter();
  const params = useParams();
  const driverId = params.uuid;

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [isNavModalOpen, setIsNavModalOpen] = useState(false);
  const [nextPath, setNextPath] = useState("");

  const {
    data: driverDetail,
    isLoading: isLoadingDriver,
    error: driverError,
  } = useGetDriverDetail(driverId);
  const { trigger: updateDriver, isMutating: isUpdatingDriver } =
    useUpdateDriver(driverId);
  const { trigger: uploadFile, isMutating: isUploading } = useUploadFile();

  const isSubmittingFinal = isUpdatingDriver || isUploading;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    setError,
    reset,
  } = useForm({
    resolver: valibotResolver(updateDriverSchema, { abortEarly: false }),
    defaultValues: {
      namaLengkap: "",
      noWhatsapp: "",
      fotoKTP: null,
      masaBerlakuSIM: null,
      fotoSIM: null,
      fotoDriver: null,
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (driverDetail) {
      const ktpDocument = driverDetail.documents?.find(
        (doc) => doc.documentType === "KTP"
      );
      const simDocument = driverDetail.documents?.find(
        (doc) => doc.documentType === "SIM_B2_UMUM"
      );
      const profilePhoto = driverDetail.photos?.find(
        (photo) => photo.photoType === "PROFILE"
      );

      reset({
        namaLengkap: driverDetail.name,
        noWhatsapp: driverDetail.phoneNumber,
        masaBerlakuSIM: new Date(driverDetail.simExpiryDate),
        fotoKTP: ktpDocument?.documentUrl || null,
        fotoSIM: simDocument?.documentUrl || null,
        fotoDriver: profilePhoto?.photoUrl || null,
      });
    }
  }, [driverDetail, reset]);

  const handleOpenSubmitModal = (data) => {
    setFormData(data);
    setIsSubmitModalOpen(true);
  };

  const handleInvalidSubmit = () => {
    toast.error("Terdapat field yang kosong atau data tidak valid.");
  };

  const handleFinalSubmit = async () => {
    if (!formData || !driverDetail) return;
    setIsSubmitModalOpen(false);

    try {
      const uploadIfNeeded = async (fileOrUrl) => {
        if (fileOrUrl instanceof File) {
          const response = await uploadFile(fileOrUrl);
          return {
            url: response.Data.fileUrl,
            name: fileOrUrl.name,
          };
        }
        return null; // No new file to upload
      };

      const [ktpUploadResult, simUploadResult, driverUploadResult] =
        await Promise.all([
          uploadIfNeeded(formData.fotoKTP),
          uploadIfNeeded(formData.fotoSIM),
          uploadIfNeeded(formData.fotoDriver),
        ]);

      const originalKtp = driverDetail.documents?.find(
        (doc) => doc.documentType === "KTP"
      );
      const originalSim = driverDetail.documents?.find(
        (doc) => doc.documentType === "SIM_B2_UMUM"
      );
      const originalPhoto = driverDetail.photos?.find(
        (p) => p.photoType === "PROFILE"
      );

      const documentsPayload = [];
      const photosPayload = [];
      const simExpiryDateString = formData.masaBerlakuSIM
        .toISOString()
        .split("T")[0];

      if (originalKtp || ktpUploadResult) {
        documentsPayload.push({
          id: originalKtp?.id,
          documentType: "KTP",
          documentUrl: ktpUploadResult?.url || originalKtp?.documentUrl,
          documentName: ktpUploadResult?.name || originalKtp?.documentName,
        });
      }

      if (originalSim || simUploadResult) {
        documentsPayload.push({
          id: originalSim?.id,
          documentType: "SIM_B2_UMUM",
          documentUrl: simUploadResult?.url || originalSim?.documentUrl,
          documentName: simUploadResult?.name || originalSim?.documentName,
          expiryDate: simExpiryDateString,
        });
      }

      if (originalPhoto || driverUploadResult) {
        photosPayload.push({
          id: originalPhoto?.id,
          photoType: "PROFILE",
          photoUrl: driverUploadResult?.url || originalPhoto?.photoUrl,
          photoName: driverUploadResult?.name || originalPhoto?.photoName,
        });
      }

      const apiPayload = {
        name: formData.namaLengkap,
        phoneNumber: formData.noWhatsapp,
        simExpiryDate: simExpiryDateString,
        documents: documentsPayload,
        photos: photosPayload,
      };

      await updateDriver(apiPayload);
      toast.success("Berhasil memperbarui driver");
      router.push("/manajemen-driver?tabs=process");
    } catch (error) {
      const validationErrors = error?.response?.data?.Data?.validationErrors;
      if (
        validationErrors &&
        validationErrors[0]?.message === "labelPhoneNumberSudahDigunakan"
      ) {
        setError("noWhatsapp", {
          type: "manual",
          message: "No. Whatsapp telah terdaftar",
        });
        toast.error(
          "Gagal memperbarui driver: Nomor Whatsapp telah terdaftar."
        );
      } else {
        toast.error("Gagal memperbarui driver. Silakan coba lagi.");
      }
    }
  };

  const handleNavigation = (path) => {
    if (!isDirty) {
      router.push(path);
    } else {
      setNextPath(path);
      setIsNavModalOpen(true);
    }
  };

  const handleConfirmNavigation = () => {
    setIsNavModalOpen(false);
    router.push(nextPath);
  };

  const breadcrumbItems = [
    { name: "Manajemen Driver", href: "/manajemen-driver" },
    { name: "Proses Pendaftaran", href: "/manajemen-driver?from=inactive" },
    { name: "Ubah Driver" },
  ];

  if (isLoadingDriver) {
    return <LoadingStatic />;
  }

  if (driverError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <p className="text-lg text-neutral-700">Gagal memuat data driver.</p>
        <Button onClick={() => router.back()} className="mt-4">
          Kembali
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto w-full max-w-[818px] gap-4 px-4 py-6">
        <div className="mb-4 space-y-4">
          <BreadCrumb
            data={breadcrumbItems}
            onItemClick={(href) => handleNavigation(href)}
          />
          <PageTitle>Ubah Driver</PageTitle>
          <Alert variant="secondary">
            <div className="my-2 flex flex-col gap-2 text-xs text-neutral-900">
              <h1 className="font-bold">
                Hal yang perlu diperhatikan sebelum ubah data driver
              </h1>
              <p className="font-medium">
                Setelah kamu melakukan pembaruan pada data driver, kami perlu
                memverifikasi kembali data tersebut. Driver yang di-edit tidak
                dapat ditugaskan untuk sementara waktu hingga kami selesai
                melakukan verifikasi data
              </p>
            </div>
          </Alert>
        </div>

        <form
          onSubmit={handleSubmit(handleOpenSubmitModal, handleInvalidSubmit)}
        >
          <Card className="mb-6 border-none p-8">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">
              Informasi Driver
            </h2>
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-[178px_1fr]">
                <FormLabel required className="text-neutral-600">
                  Nama Lengkap
                </FormLabel>
                <Controller
                  name="namaLengkap"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Masukan Nama Lengkap"
                      errorMessage={errors.namaLengkap?.message}
                      className="w-full max-w-[328px]"
                    />
                  )}
                />
              </div>
              <div className="grid gap-6 md:grid-cols-[178px_1fr]">
                <FormLabel required className="text-neutral-600">
                  No. Whatsapp
                </FormLabel>
                <Controller
                  name="noWhatsapp"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="tel"
                      inputMode="numeric"
                      onChange={(e) =>
                        field.onChange(e.target.value.replace(/[^0-9]/g, ""))
                      }
                      placeholder="Contoh: 08xxxxxxxxxxx"
                      errorMessage={errors.noWhatsapp?.message}
                      className="w-full max-w-[328px]"
                    />
                  )}
                />
              </div>
            </div>
          </Card>

          <LightboxProvider images={exampleImages} title="Contoh File dan Foto">
            <Card className="mb-6 border-none p-8">
              <div className="mb-4 space-y-4">
                <h2 className="text-lg font-semibold text-neutral-900">
                  File dan Foto Driver
                </h2>
                <div className="flex flex-row items-center gap-1 text-xs text-neutral-700">
                  Lihat contoh file dan foto{" "}
                  <LightboxTrigger>
                    <a className="cursor-pointer font-semibold text-primary-700">
                      di sini
                    </a>
                  </LightboxTrigger>
                </div>
              </div>
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-[178px_1fr]">
                  <FormLabel className="text-neutral-600">Foto KTP</FormLabel>
                  <Controller
                    name="fotoKTP"
                    control={control}
                    render={({ field }) => (
                      <div className="w-full max-w-[328px]">
                        <FileUpload
                          value={field.value}
                          onSuccess={(file) => field.onChange(file)}
                          maxSize={MAX_FILE_SIZE_MB}
                          acceptedFormats={[".jpg", ".jpeg", ".png", ".pdf"]}
                          errorMessage={errors.fotoKTP?.message}
                        />
                      </div>
                    )}
                  />
                </div>
                <div className="grid items-start gap-6 md:grid-cols-[178px_1fr]">
                  <FormLabel required className="pt-1.5 text-neutral-600">
                    Masa Berlaku SIM B2 Umum
                  </FormLabel>
                  <Controller
                    name="masaBerlakuSIM"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                        placeholder="Pilih Tanggal Masa Berlaku SIM B2 Umum"
                        errorMessage={errors.masaBerlakuSIM?.message}
                        className="w-full max-w-[328px]"
                      />
                    )}
                  />
                </div>
                <div className="grid gap-6 md:grid-cols-[178px_1fr]">
                  <FormLabel className="text-neutral-600">
                    Foto SIM B2
                  </FormLabel>
                  <Controller
                    name="fotoSIM"
                    control={control}
                    render={({ field }) => (
                      <div className="w-full max-w-[328px]">
                        <FileUpload
                          value={field.value}
                          onSuccess={(file) => field.onChange(file)}
                          maxSize={MAX_FILE_SIZE_MB}
                          acceptedFormats={[".jpg", ".jpeg", ".png", ".pdf"]}
                          errorMessage={errors.fotoSIM?.message}
                        />
                      </div>
                    )}
                  />
                </div>
                <div className="grid gap-6 md:grid-cols-[178px_1fr]">
                  <FormLabel className="text-neutral-600">
                    Foto Driver
                  </FormLabel>
                  <Controller
                    name="fotoDriver"
                    control={control}
                    render={({ field }) => (
                      <div className="w-full max-w-[328px]">
                        <ImageUploaderWeb
                          value={field.value}
                          onUpload={(image) => field.onChange(image)}
                          isNull={!!errors.fotoDriver}
                          className="h-[124px] w-[124px]"
                          uploadText="Unggah"
                          errorText="Unggah Ulang"
                          maxSize={MAX_FILE_SIZE_MB}
                          acceptedFormats={[".jpg", ".jpeg", ".png"]}
                          cropperTitle="Sesuaikan Foto Driver"
                        />
                        {errors.fotoDriver ? (
                          <span className="mt-2 block text-xs text-error-400">
                            {errors.fotoDriver.message}
                          </span>
                        ) : (
                          <p className="mt-2 text-xs text-neutral-600">
                            Format .jpg/.jpeg/.png, maks. {MAX_FILE_SIZE_MB}MB
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>
              </div>
            </Card>
          </LightboxProvider>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="muattrans-primary-secondary"
              onClick={() => handleNavigation("/manajemen-driver")}
              disabled={isSubmitting || isSubmittingFinal}
              className="min-w-[112px]"
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="muattrans-primary"
              disabled={isSubmitting || isSubmittingFinal || !isDirty}
              className="min-w-[112px]"
            >
              {isSubmitting || isSubmittingFinal ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </div>

      <ConfirmationModal
        isOpen={isSubmitModalOpen}
        setIsOpen={setIsSubmitModalOpen}
        description={{
          text: "Apakah kamu yakin memperbarui data ini?",
        }}
        cancel={{ text: "Batal" }}
        confirm={{ text: "Yakin", onClick: handleFinalSubmit }}
      />

      <ConfirmationModal
        isOpen={isNavModalOpen}
        setIsOpen={setIsNavModalOpen}
        description={{
          text: "Apakah kamu yakin ingin berpindah halaman? Data yang telah diubah tidak akan disimpan",
        }}
        cancel={{ text: "Batal" }}
        confirm={{ text: "Yakin", onClick: handleConfirmNavigation }}
      />
    </div>
  );
}
