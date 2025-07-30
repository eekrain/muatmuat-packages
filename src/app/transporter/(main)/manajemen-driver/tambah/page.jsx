"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { Controller, useForm } from "react-hook-form";
import * as v from "valibot";

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
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import PageTitle from "@/components/PageTitle/PageTitle";
import { toast } from "@/lib/toast";

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const fileSchema = (requiredMessage, acceptedFormats) =>
  v.pipe(
    v.nonNullable(v.instance(File, requiredMessage), requiredMessage),
    v.check((file) => {
      const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
      return acceptedFormats.includes(fileExtension);
    }, "Format file tidak sesuai ketentuan"),
    v.check(
      (file) => file.size <= MAX_FILE_SIZE_BYTES,
      `Ukuran file melebihi ${MAX_FILE_SIZE_MB}MB`
    )
  );

const driverSchema = v.object({
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
    v.regex(/^08\d{8,}$/, "Format No. Whatsapp salah"),
    v.checkAsync(async (input) => {
      console.log(`[VALIDATION START] Checking number: ${input}`);
      await new Promise((resolve) => setTimeout(resolve, 500));
      const registeredNumbers = ["081234567890"];
      if (registeredNumbers.includes(input)) {
        console.log(`[VALIDATION FAIL] Number ${input} is already registered.`);
        return false;
      }
      console.log(`[VALIDATION PASS] Number ${input} is available.`);
      return true;
    }, "No. Whatsapp telah terdaftar")
  ),
  fotoKTP: fileSchema("Foto KTP wajib diunggah", [
    ".jpg",
    ".jpeg",
    ".png",
    ".pdf",
  ]),
  masaBerlakuSIM: v.nonNullable(
    v.instance(Date, "Masa berlaku SIM B2 Umum wajib diisi"),
    "Masa berlaku SIM B2 Umum wajib diisi"
  ),
  fotoSIM: fileSchema("Foto SIM wajib diunggah", [
    ".jpg",
    ".jpeg",
    ".png",
    ".pdf",
  ]),
  fotoDriver: fileSchema("Foto driver wajib diunggah", [
    ".jpg",
    ".jpeg",
    ".png",
  ]),
});

const exampleImages = [
  "https://picsum.photos/200/300",
  "https://picsum.photos/id/237/200/300",
  "https://picsum.photos/seed/picsum/200/300",
];

export default function TambahDriverPage() {
  const router = useRouter();
  // State for the submission confirmation modal
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [isSubmittingFinal, setIsSubmittingFinal] = useState(false);

  // State for the navigation confirmation modal
  const [isNavModalOpen, setIsNavModalOpen] = useState(false);
  const [nextPath, setNextPath] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: valibotResolver(driverSchema),
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

  // --- Handlers for Submission Flow ---
  const handleOpenSubmitModal = (data) => {
    setFormData(data);
    setIsSubmitModalOpen(true);
  };

  const handleFinalSubmit = async () => {
    if (!formData) return;
    setIsSubmitModalOpen(false);
    setIsSubmittingFinal(true);

    toast.info("Mengunggah data dan file...");

    const apiFormData = new FormData();
    apiFormData.append("namaLengkap", formData.namaLengkap);
    apiFormData.append("noWhatsapp", formData.noWhatsapp);
    apiFormData.append("masaBerlakuSIM", formData.masaBerlakuSIM.toISOString());
    apiFormData.append("fotoKTP", formData.fotoKTP);
    apiFormData.append("fotoSIM", formData.fotoSIM);
    apiFormData.append("fotoDriver", formData.fotoDriver);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Driver baru berhasil ditambahkan!");
      router.push("/manajemen-driver");
    } catch (error) {
      toast.error("Gagal menambahkan driver. Silakan coba lagi.");
    } finally {
      setIsSubmittingFinal(false);
    }
  };

  // --- Handlers for Navigation Flow ---
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
    { name: "Tambah Driver" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto w-full max-w-[818px] gap-4 px-4 py-6">
        <div className="mb-4 space-y-4">
          <BreadCrumb data={breadcrumbItems} />
          <PageTitle>Tambah Driver</PageTitle>
        </div>

        <form onSubmit={handleSubmit(handleOpenSubmitModal)}>
          {/* Form Content ... (shortened for brevity) */}
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

          <Card className="mb-6 border-none p-8">
            <div className="mb-4 space-y-3">
              <h2 className="text-lg font-semibold text-neutral-900">
                File dan Foto Driver
              </h2>
              <div className="flex flex-row items-center gap-1 text-xs text-neutral-700">
                Lihat contoh file dan foto{" "}
                <LightboxProvider
                  images={exampleImages}
                  title="Contoh File dan Foto"
                >
                  <LightboxTrigger>
                    <a className="cursor-pointer font-semibold text-primary-700">
                      di sini
                    </a>
                  </LightboxTrigger>
                </LightboxProvider>
              </div>
            </div>
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-[178px_1fr]">
                <FormLabel required className="text-neutral-600">
                  Foto KTP
                </FormLabel>
                <Controller
                  name="fotoKTP"
                  control={control}
                  render={({ field }) => (
                    <div className="w-full max-w-[328px] place-content-center">
                      <FileUpload
                        value={field.value}
                        onSuccess={(file) => field.onChange(file)}
                        onError={(err) => toast.error(err)}
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
                <FormLabel required className="text-neutral-600">
                  Foto SIM B2
                </FormLabel>
                <Controller
                  name="fotoSIM"
                  control={control}
                  render={({ field }) => (
                    <div className="w-full max-w-[328px] place-content-center">
                      <FileUpload
                        value={field.value}
                        onSuccess={(file) => field.onChange(file)}
                        onError={(err) => toast.error(err)}
                        maxSize={MAX_FILE_SIZE_MB}
                        acceptedFormats={[".jpg", ".jpeg", ".png", ".pdf"]}
                        errorMessage={errors.fotoSIM?.message}
                      />
                    </div>
                  )}
                />
              </div>
              <div className="grid gap-6 md:grid-cols-[178px_1fr]">
                <FormLabel required className="text-neutral-600">
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
                        cropperTitle="Upload Foto Driver"
                      />
                      {errors.fotoDriver ? (
                        <span className="mt-2 block text-xs text-error-400">
                          {errors.fotoDriver.message}
                        </span>
                      ) : (
                        <p className="mt-2 min-w-[595px] text-xs font-medium text-neutral-600">
                          Unggah foto driver dengan format .jpg/.jpeg/.png,
                          besar file maks. {MAX_FILE_SIZE_MB}MB
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>
          </Card>

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
              disabled={isSubmitting || isSubmittingFinal}
              className="min-w-[112px]"
            >
              {isSubmitting || isSubmittingFinal ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </div>

      {/* Modal for Submitting */}
      <ConfirmationModal
        isOpen={isSubmitModalOpen}
        setIsOpen={setIsSubmitModalOpen}
        description={{
          text: "Apakah kamu yakin menyimpan data ini?",
        }}
        cancel={{ text: "Tidak" }}
        confirm={{ text: "Ya", onClick: handleFinalSubmit }}
      />

      {/* Modal for Navigating Away */}
      <ConfirmationModal
        isOpen={isNavModalOpen}
        setIsOpen={setIsNavModalOpen}
        description={{
          text: "Apakah kamu yakin ingin berpindah halaman? Data yang telah diisi tidak akan disimpan",
        }}
        cancel={{ text: "Batal" }}
        confirm={{ text: "Yakin", onClick: handleConfirmNavigation }}
      />
    </div>
  );
}
