"use client";

import { useEffect, useState } from "react";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import * as v from "valibot";

import Button from "@/components/Button/Button";
import Card from "@/components/Card/Card";
import FileUploadMultiple from "@/components/FileUpload/FileUploudMultiple";
import { FormContainer, FormLabel } from "@/components/Form/Form";
import Input from "@/components/Form/Input";
import { toast } from "@/lib/toast";
// 1. Import hook untuk validasi
import { useCheckTransporterField } from "@/services/CS/register/checkTransporterField";
import { useTransporterFormStore } from "@/store/CS/forms/registerTransporter";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "application/pdf"];

const fileValidation = (isRequired = false) =>
  v.custom((value) => {
    if (!value) return !isRequired;
    if (value instanceof File) {
      if (value.size > MAX_FILE_SIZE) {
        throw new Error("Ukuran file maksimal 10MB");
      }
      if (!ACCEPTED_TYPES.includes(value.type)) {
        throw new Error("Format file harus .jpg/.png/.pdf");
      }
      return true;
    }
    if (typeof value === "object" && value.url) {
      return true;
    }
    return false;
  }, "File tidak valid. Pastikan format .jpg/.png/.pdf dan ukuran maks. 10MB.");

const fileArrayValidation = (
  isRequired = false,
  message = "File wajib diunggah"
) =>
  v.pipe(
    v.array(fileValidation(true)),
    v.minLength(isRequired ? 1 : 0, message)
  );

export const kelengkapanLegalitasSchema = v.object({
  nibNumber: v.pipe(
    v.string("No. NIB wajib diisi"),
    v.minLength(1, "No. NIB wajib diisi"),
    v.regex(/^\d+$/, "Nomor NIB hanya boleh berisi angka"),
    v.length(13, "No. NIB harus 13 digit")
  ),
  npwpNumber: v.pipe(
    v.string("No. NPWP Perusahaan wajib diisi"),
    v.minLength(1, "No. NPWP Perusahaan wajib diisi"),
    v.regex(/^\d+$/, "Nomor NPWP hanya boleh berisi angka"),
    v.minLength(15, "No. NPWP Perusahaan harus terdiri dari 15-16 digit"),
    v.maxLength(16, "No. NPWP Perusahaan harus terdiri dari 15-16 digit")
  ),
  ktpNumber: v.pipe(
    v.string("No. KTP Pendaftar wajib diisi"),
    v.minLength(1, "No. KTP Pendaftar wajib diisi"),
    v.regex(/^\d+$/, "Nomor KTP hanya boleh berisi angka"),
    v.length(16, "No. KTP Pendaftar harus 16 digit")
  ),

  documents: v.object({
    nib: fileArrayValidation(true, "NIB wajib diisi"),
    npwp: fileArrayValidation(true, "NPWP Perusahaan wajib diisi"),
    ktp: fileArrayValidation(true, "KTP Pendaftar wajib diisi"),
    aktaPendirian: fileArrayValidation(
      true,
      "Cover Akta Pendirian wajib diisi"
    ),
    skKemenkumham: fileArrayValidation(true, "SK Kemenkumham wajib diisi"),
    aktaPerubahan: fileArrayValidation(false),
    skKemenkumhamPerubahan: fileArrayValidation(false),
    sertifikatStandar: fileArrayValidation(false),
  }),
});

function KelengkapanLegalitas({ onSave, onFormChange, setActiveIdx }) {
  const FORM_KEY = "newTransporterRegistration";
  const setForm = useTransporterFormStore((state) => state.setForm);
  const initialData = useTransporterFormStore((state) =>
    state.getForm(FORM_KEY)
  );

  // 2. Tambahkan state loading dan inisialisasi hook
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { trigger: checkField } = useCheckTransporterField();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitSuccessful },
    reset,
    setValue,
    getValues,
    watch,
    // Ambil setError untuk validasi API
    setError,
  } = useForm({
    resolver: valibotResolver(kelengkapanLegalitasSchema),
    defaultValues: initialData?.nibNumber
      ? initialData
      : {
          nibNumber: null,
          npwpNumber: null,
          ktpNumber: null,
          documents: {
            nib: [],
            npwp: [],
            ktp: [],
            aktaPendirian: [],
            skKemenkumham: [],
            aktaPerubahan: [],
            skKemenkumhamPerubahan: [],
            sertifikatStandar: [],
          },
        },
  });

  const watchedValues = watch();

  useEffect(() => {
    if (isDirty) {
      onFormChange();
    }
  }, [isDirty, onFormChange]);

  // 3. Tambahkan fungsi helper untuk auto-scroll
  const scrollToFirstError = (fieldNames) => {
    const elements = fieldNames
      .map((name) => document.querySelector(`[name="${name}"]`))
      .filter((el) => el);

    if (elements.length === 0) return;

    const firstErrorElement = elements.reduce((first, current) => {
      return current.getBoundingClientRect().top <
        first.getBoundingClientRect().top
        ? current
        : first;
    });

    firstErrorElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const isAllRequiredLegalitasFieldsEmpty = (values) => {
    const requiredFields = [
      "nibNumber",
      "npwpNumber",
      "ktpNumber",
      "documents.nib",
      "documents.npwp",
      "documents.ktp",
      "documents.aktaPendirian",
      "documents.skKemenkumham",
    ];

    return requiredFields.every((path) => {
      const value = path.split(".").reduce((acc, key) => acc?.[key], values);
      if (Array.isArray(value)) return value.length === 0;
      return value === null || value === undefined || value === "";
    });
  };

  // 4. Perbarui onInvalidSubmit untuk scroll
  const onInvalidSubmit = (errors) => {
    const values = getValues();
    if (isAllRequiredLegalitasFieldsEmpty(values)) {
      toast.error("Isi semua inputan yang bertanda bintang (*)");
    } else {
      toast.error("Periksa kembali data Anda, ada input yang belum valid.");
    }
    scrollToFirstError(Object.keys(errors));
  };

  // 5. Perbarui onSubmit dengan validasi API
  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const npwpResult = await checkField({
        type: "NPWP",
        value: data.npwpNumber,
      });

      if (npwpResult?.Data?.duplicate === true) {
        setError("npwpNumber", {
          type: "manual",
          message: "No. NPWP Perusahaan sudah terdaftar",
        });
        scrollToFirstError(["npwpNumber"]);
        return; // Hentikan proses
      }

      // Lanjutkan penyimpanan ke Zustand jika NPWP unik
      const existingData =
        useTransporterFormStore.getState().getForm(FORM_KEY) || {};
      const updatedData = { ...existingData, ...data };
      setForm(FORM_KEY, updatedData);
      if (onSave) {
        onSave();
      }
      reset(data);
      toast.success("Kelengkapan legalitas berhasil disimpan!");
    } catch (error) {
      console.error("API Validation Error:", error);
      toast.error("Terjadi kesalahan saat validasi data. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      const latestData = useTransporterFormStore.getState().getForm(FORM_KEY);
      reset(latestData);
    }
  }, [isSubmitSuccessful, reset]);

  const handleMultipleFileUpload = (fieldName, files) => {
    setValue(`documents.${fieldName}`, files, { shouldValidate: true });
  };

  const handleFileError = (error) => {
    console.error("File upload error:", error);
  };

  return (
    // 6. Hubungkan kedua handler ke form
    <form onSubmit={handleSubmit(onSubmit, onInvalidSubmit)} className="w-full">
      <Card className={"rounded-xl border-none p-8"}>
        <div className="w-full max-w-[75%]">
          <div>
            <h3 className="mb-6 text-lg font-semibold">
              Kelengkapan Legalitas
            </h3>
            <FormContainer className={"!gap-6"}>
              {/* NIB */}
              <FormLabel required>NIB</FormLabel>
              <FileUploadMultiple
                maxSize={5}
                acceptedFormats={[".jpg", ".jpeg", ".png", ".pdf"]}
                onSuccess={(files) => handleMultipleFileUpload("nib", files)}
                onError={handleFileError}
                value={watchedValues.documents?.nib || []}
                label="Upload"
                className="mb-2"
                errorMessage={errors.documents?.nib?.message}
              />

              <FormLabel required>Nomor NIB</FormLabel>
              <Input
                type="number"
                placeholder="13 Digit No. NIB"
                {...register("nibNumber")}
                errorMessage={errors.nibNumber?.message}
                className="!w-[328px]"
              />

              {/* NPWP */}
              <FormLabel required>NPWP Perusahaan</FormLabel>
              <FileUploadMultiple
                maxSize={5}
                acceptedFormats={[".jpg", ".jpeg", ".png", ".pdf"]}
                onSuccess={(files) => handleMultipleFileUpload("npwp", files)}
                onError={handleFileError}
                value={watchedValues.documents?.npwp || []}
                label="Upload"
                className="self-center"
                errorMessage={errors.documents?.npwp?.message}
                single
              />

              <FormLabel required>Nomor NPWP Perusahaan</FormLabel>
              <Input
                type="number"
                placeholder="Min. 15 Digit No. NPWP"
                {...register("npwpNumber")}
                errorMessage={errors.npwpNumber?.message}
                className="!w-[328px]"
              />

              {/* KTP */}
              <FormLabel required>KTP Pendaftar/Pemegang Akun</FormLabel>
              <FileUploadMultiple
                maxSize={5}
                acceptedFormats={[".jpg", ".jpeg", ".png", ".pdf"]}
                onSuccess={(files) => handleMultipleFileUpload("ktp", files)}
                onError={handleFileError}
                value={watchedValues.documents?.ktp || []}
                label="Upload"
                className="self-center"
                errorMessage={errors.documents?.ktp?.message}
                single
              />

              <FormLabel required>Nomor KTP Pendaftar</FormLabel>
              <Input
                type="number"
                placeholder="16 Digit No. KTP Pendaftar"
                {...register("ktpNumber")}
                errorMessage={errors.ktpNumber?.message}
                className="!w-[328px]"
              />

              {/* Cover Akta Pendirian */}
              <FormLabel required>Cover Akta Pendirian</FormLabel>
              <FileUploadMultiple
                maxSize={5}
                acceptedFormats={[".jpg", ".jpeg", ".png", ".pdf"]}
                onSuccess={(files) =>
                  handleMultipleFileUpload("aktaPendirian", files)
                }
                onError={handleFileError}
                value={watchedValues.documents?.aktaPendirian || []}
                label="Upload"
                errorMessage={errors.documents?.aktaPendirian?.message}
              />

              {/* SK Kemenkumham dan Akta Pendirian */}
              <FormLabel required>SK Kemenkumham dan Akta Pendirian</FormLabel>
              <FileUploadMultiple
                maxSize={5}
                acceptedFormats={[".jpg", ".jpeg", ".png", ".pdf"]}
                onSuccess={(files) =>
                  handleMultipleFileUpload("skKemenkumham", files)
                }
                onError={handleFileError}
                value={watchedValues.documents?.skKemenkumham || []}
                label="Upload"
                errorMessage={errors.documents?.skKemenkumham?.message}
              />

              {/* Cover Akta Perubahan (bila ada) */}
              <FormLabel>Cover Akta Perubahan (bila ada)</FormLabel>
              <FileUploadMultiple
                maxSize={5}
                acceptedFormats={[".jpg", ".jpeg", ".png", ".pdf"]}
                onSuccess={(files) =>
                  handleMultipleFileUpload("aktaPerubahan", files)
                }
                onError={handleFileError}
                value={watchedValues.documents?.aktaPerubahan || []}
                label="Upload"
                errorMessage={errors.documents?.aktaPerubahan?.message}
              />

              {/* SK Kemenkumham dan Akta Perubahan (bila ada) */}
              <FormLabel>
                SK Kemenkumham dan Akta Perubahan (bila ada)
              </FormLabel>
              <FileUploadMultiple
                maxSize={5}
                acceptedFormats={[".jpg", ".jpeg", ".png", ".pdf"]}
                onSuccess={(files) =>
                  handleMultipleFileUpload("skKemenkumhamPerubahan", files)
                }
                onError={handleFileError}
                value={watchedValues.documents?.skKemenkumhamPerubahan || []}
                label="Upload"
                errorMessage={errors.documents?.skKemenkumhamPerubahan?.message}
              />

              {/* Sertifikat Standar (bila ada) */}
              <FormLabel>Sertifikat Standar (bila ada)</FormLabel>
              <FileUploadMultiple
                maxSize={5}
                acceptedFormats={[".jpg", ".jpeg", ".png", ".pdf"]}
                onSuccess={(files) =>
                  handleMultipleFileUpload("sertifikatStandar", files)
                }
                onError={handleFileError}
                value={watchedValues.documents?.sertifikatStandar || []}
                label="Upload"
                errorMessage={errors.documents?.sertifikatStandar?.message}
              />
            </FormContainer>
          </div>
        </div>
      </Card>
      <div className="mt-6 flex items-end justify-end gap-3">
        <Button
          variant="muattrans-primary-secondary"
          onClick={() => setActiveIdx(0)}
        >
          Sebelumnya
        </Button>
        <Button
          type="submit"
          variant="muattrans-primary"
          className="!w-[112px]"
          // 7. Tambahkan state loading ke tombol
          isLoading={isSubmitting}
        >
          Simpan
        </Button>
      </div>
    </form>
  );
}

export default KelengkapanLegalitas;
