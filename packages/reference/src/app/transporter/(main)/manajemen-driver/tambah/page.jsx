"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { Controller, useForm } from "react-hook-form";
import * as v from "valibot";

import { useUploadFile } from "@/services/Shared/uploadFile";
// Import the SWR mutation hook and the upload service
import { useCreateDriver } from "@/services/Transporter/manajemen-driver/createDriver";

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

import { useTranslation } from "@/hooks/use-translation";

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
    v.regex(/^08\d{8,}$/, "Format No. Whatsapp salah")
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
  const { t } = useTranslation();
  const router = useRouter();
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [isNavModalOpen, setIsNavModalOpen] = useState(false);
  const [nextPath, setNextPath] = useState("");
  const { trigger: createDriver, isMutating: isCreatingDriver } =
    useCreateDriver();
  const { trigger: uploadFile, isMutating: isUploading } = useUploadFile();

  const isSubmittingFinal = isCreatingDriver || isUploading;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    setError,
  } = useForm({
    resolver: valibotResolver(driverSchema, { abortEarly: false }),
    defaultValues: {
      namaLengkap: "",
      noWhatsapp: "",
      fotoKTP: null,
      masaBerlakuSIM: null,
      fotoSIM: null,
      fotoDriver: null,
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const handleOpenSubmitModal = (data) => {
    setFormData(data);
    setIsSubmitModalOpen(true);
  };

  const handleInvalidSubmit = () => {
    toast.error(
      t(
        "TambahDriverPage.toastErrorFieldKosong",
        {},
        "Terdapat field yang kosong"
      )
    );
  };

  const handleFinalSubmit = async () => {
    if (!formData) return;
    setIsSubmitModalOpen(false);
    try {
      const [ktpResponse, simResponse, driverResponse] = await Promise.all([
        uploadFile(formData.fotoKTP),
        uploadFile(formData.fotoSIM),
        uploadFile(formData.fotoDriver),
      ]);

      const apiPayload = {
        name: formData.namaLengkap,
        phoneNumber: formData.noWhatsapp,
        simExpiryDate: formData.masaBerlakuSIM.toISOString().split("T")[0],
        documents: [
          {
            documentType: "KTP",
            documentUrl: ktpResponse.Data.fileUrl,
            documentName: formData.fotoKTP.name,
          },
          {
            documentType: "SIM_B2_UMUM",
            documentUrl: simResponse.Data.fileUrl,
            documentName: formData.fotoSIM.name,
          },
        ],
        photos: [
          {
            photoType: "PROFILE",
            photoUrl: driverResponse.Data.fileUrl,
            photoName: formData.fotoDriver.name,
          },
        ],
      };

      console.log("Payload:", apiPayload);
      await createDriver(apiPayload);
      toast.success(
        t(
          "TambahDriverPage.toastSuccessTambahDriver",
          {},
          "Berhasil menambahkan driver"
        )
      );
      router.push("/manajemen-driver");
    } catch (error) {
      const validationErrors = error?.response?.data?.Data?.validationErrors;
      if (
        validationErrors &&
        validationErrors[0]?.message === "labelPhoneNumberSudahDigunakan"
      ) {
        setError("noWhatsapp", {
          type: "manual",
          message: t(
            "TambahDriverPage.errorNoWhatsappTerdaftar",
            {},
            "No. Whatsapp telah terdaftar"
          ),
        });
        toast.error(
          t(
            "TambahDriverPage.toastErrorNoWhatsappTerdaftar",
            {},
            "Gagal menambahkan driver: Nomor Whatsapp telah terdaftar."
          )
        );
      } else {
        toast.error(
          t(
            "TambahDriverPage.toastErrorTambahDriver",
            {},
            "Gagal menambahkan driver. Silakan coba lagi."
          )
        );
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
    {
      name: t(
        "TambahDriverPage.breadcrumbManajemenDriver",
        {},
        "Manajemen Driver"
      ),
      href: "/manajemen-driver",
    },
    { name: t("TambahDriverPage.breadcrumbTambahDriver", {}, "Tambah Driver") },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto w-full max-w-[818px] gap-4 px-4 py-6">
        <div className="mb-4 space-y-4">
          <BreadCrumb data={breadcrumbItems} />
          <PageTitle>
            {t("TambahDriverPage.titleTambahDriver", {}, "Tambah Driver")}
          </PageTitle>
        </div>

        <form
          onSubmit={handleSubmit(handleOpenSubmitModal, handleInvalidSubmit)}
        >
          <Card className="mb-6 border-none p-8">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">
              {t(
                "TambahDriverPage.sectionInformasiDriver",
                {},
                "Informasi Driver"
              )}
            </h2>
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-[178px_1fr]">
                <FormLabel required className="text-neutral-600">
                  {t("TambahDriverPage.labelNamaLengkap", {}, "Nama Lengkap")}
                </FormLabel>
                <Controller
                  name="namaLengkap"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t(
                        "TambahDriverPage.placeholderNamaLengkap",
                        {},
                        "Masukan Nama Lengkap"
                      )}
                      errorMessage={errors.namaLengkap?.message}
                      className="w-full max-w-[328px]"
                    />
                  )}
                />
              </div>
              <div className="grid gap-6 md:grid-cols-[178px_1fr]">
                <FormLabel required className="text-neutral-600">
                  {t("TambahDriverPage.labelNoWhatsapp", {}, "No. Whatsapp")}
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
                      placeholder={t(
                        "TambahDriverPage.placeholderNoWhatsapp",
                        {},
                        "Contoh: 08xxxxxxxxxxx"
                      )}
                      errorMessage={errors.noWhatsapp?.message}
                      className="w-full max-w-[328px]"
                    />
                  )}
                />
              </div>
            </div>
          </Card>

          <LightboxProvider
            images={exampleImages}
            title={t(
              "TambahDriverPage.titleContohFileDanFoto",
              {},
              "Contoh File dan Foto"
            )}
          >
            <Card className="mb-6 border-none p-8">
              <div className="mb-4 space-y-4">
                <h2 className="text-lg font-semibold text-neutral-900">
                  {t(
                    "TambahDriverPage.sectionFileDanFotoDriver",
                    {},
                    "File dan Foto Driver"
                  )}
                </h2>
                <div className="flex flex-row items-center gap-1 text-xs text-neutral-700">
                  {t(
                    "TambahDriverPage.textLihatContohFile",
                    {},
                    "Lihat contoh file dan foto"
                  )}{" "}
                  <LightboxTrigger>
                    <a className="cursor-pointer font-semibold text-primary-700">
                      {t("TambahDriverPage.linkDiSini", {}, "di sini")}
                    </a>
                  </LightboxTrigger>
                </div>
              </div>
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-[178px_1fr]">
                  <FormLabel required className="text-neutral-600">
                    {t("TambahDriverPage.labelFotoKTP", {}, "Foto KTP")}
                  </FormLabel>
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
                    {t(
                      "TambahDriverPage.labelMasaBerlakuSIMB2",
                      {},
                      "Masa Berlaku SIM B2 Umum"
                    )}
                  </FormLabel>
                  <Controller
                    name="masaBerlakuSIM"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                        placeholder={t(
                          "TambahDriverPage.placeholderMasaBerlakuSIMB2",
                          {},
                          "Pilih Tanggal Masa Berlaku SIM B2 Umum"
                        )}
                        errorMessage={errors.masaBerlakuSIM?.message}
                        className="w-full max-w-[328px]"
                      />
                    )}
                  />
                </div>
                <div className="grid gap-6 md:grid-cols-[178px_1fr]">
                  <FormLabel required className="text-neutral-600">
                    {t("TambahDriverPage.labelFotoSIMB2", {}, "Foto SIM B2")}
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
                  <FormLabel required className="text-neutral-600">
                    {t("TambahDriverPage.labelFotoDriver", {}, "Foto Driver")}
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
                          uploadText={t(
                            "TambahDriverPage.buttonUnggah",
                            {},
                            "Unggah"
                          )}
                          errorText={t(
                            "TambahDriverPage.buttonUnggahUlang",
                            {},
                            "Unggah Ulang"
                          )}
                          maxSize={MAX_FILE_SIZE_MB}
                          acceptedFormats={[".jpg", ".jpeg", ".png"]}
                          cropperTitle={t(
                            "TambahDriverPage.titleSesuaikanFotoDriver",
                            {},
                            "Sesuaikan Foto Driver"
                          )}
                        />
                        {errors.fotoDriver ? (
                          <span className="mt-2 block text-xs text-error-400">
                            {errors.fotoDriver.message}
                          </span>
                        ) : (
                          <p className="mt-2 text-xs text-neutral-600">
                            {t(
                              "TambahDriverPage.textFormatFile",
                              {},
                              "Format .jpg/.jpeg/.png, maks. {max}MB",
                              { max: MAX_FILE_SIZE_MB }
                            )}
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
              {t("TambahDriverPage.buttonBatal", {}, "Batal")}
            </Button>
            <Button
              type="submit"
              variant="muattrans-primary"
              disabled={isSubmitting || isSubmittingFinal}
              className="min-w-[112px]"
            >
              {isSubmitting || isSubmittingFinal
                ? t("TambahDriverPage.buttonMenyimpan", {}, "Menyimpan...")
                : t("TambahDriverPage.buttonSimpan", {}, "Simpan")}
            </Button>
          </div>
        </form>
      </div>

      <ConfirmationModal
        isOpen={isSubmitModalOpen}
        setIsOpen={setIsSubmitModalOpen}
        description={{
          text: t(
            "TambahDriverPage.modalConfirmSimpanData",
            {},
            "Apakah kamu yakin menyimpan data ini?"
          ),
        }}
        cancel={{
          text: t("TambahDriverPage.buttonTidak", {}, "Tidak"),
          classname: "w-[112px]",
        }}
        confirm={{
          text: t("TambahDriverPage.buttonYa", {}, "Ya"),
          onClick: handleFinalSubmit,
          classname: "w-[112px]",
        }}
      />

      <ConfirmationModal
        isOpen={isNavModalOpen}
        setIsOpen={setIsNavModalOpen}
        description={{
          text: t(
            "TambahDriverPage.modalConfirmLeavePage",
            {},
            "Apakah kamu yakin ingin berpindah halaman? Data yang telah diisi tidak akan disimpan"
          ),
        }}
        cancel={{
          text: t("TambahDriverPage.buttonYa", {}, "Ya"),
          classname: "w-[112px]",
          onClick: handleConfirmNavigation,
        }}
        confirm={{
          text: t("TambahDriverPage.buttonBatal", {}, "Batal"),
          classname: "w-[112px]",
        }}
      />
    </div>
  );
}
