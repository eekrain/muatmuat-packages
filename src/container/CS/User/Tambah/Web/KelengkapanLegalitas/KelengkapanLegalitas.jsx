"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import * as v from "valibot";

import Button from "@/components/Button/Button";
import Card from "@/components/Card/Card";
import FileUploadMultiple from "@/components/FileUpload/FileUploudMultiple";
import { FormContainer, FormLabel } from "@/components/Form/Form";
import Input from "@/components/Form/Input";
import { toast } from "@/lib/toast";
import { useTransporterFormStore } from "@/store/CS/forms/registerTransporter";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "application/pdf"];

const fileValidation = (isRequired = false) =>
  v.custom((value) => {
    // Jika tidak ada nilai, valid jika tidak wajib
    if (!value) return !isRequired;

    // Jika nilainya adalah File (saat baru dipilih, sebelum diunggah)
    if (value instanceof File) {
      if (value.size > MAX_FILE_SIZE) {
        throw new Error("Ukuran file maksimal 10MB");
      }
      if (!ACCEPTED_TYPES.includes(value.type)) {
        throw new Error("Format file harus .jpg/.png/.pdf");
      }
      return true;
    }

    // Jika nilainya adalah objek dengan URL (setelah diunggah)
    if (typeof value === "object" && value.url) {
      return true; // Anggap valid jika sudah punya URL
    }

    // Jika bukan keduanya, berarti tidak valid
    return false;
  }, "File tidak valid. Pastikan format .jpg/.png/.pdf dan ukuran maks. 10MB.");

// Array validation for multiple files
const fileArrayValidation = (isRequired = false) =>
  v.pipe(
    v.array(fileValidation(true)),
    v.minLength(isRequired ? 1 : 0, "File wajib diunggah")
  );

export const kelengkapanLegalitasSchema = v.object({
  // Document number validations
  nibNumber: v.pipe(
    v.string("Nomor NIB wajib diisi"),
    v.regex(/^\d+$/, "Nomor NIB hanya boleh berisi angka"),
    v.length(13, "Nomor NIB harus 13 digit")
  ),
  npwpNumber: v.pipe(
    v.string("Nomor NPWP wajib diisi"),
    v.regex(/^\d+$/, "Nomor NPWP hanya boleh berisi angka"),
    v.length(15, "Nomor NPWP harus 15 digit")
  ),
  ktpNumber: v.pipe(
    v.string("Nomor KTP wajib diisi"),
    v.regex(/^\d+$/, "Nomor KTP hanya boleh berisi angka"),
    v.length(16, "Nomor KTP harus 16 digit")
  ),

  // Document file validations
  documents: v.object({
    // Mandatory files
    nib: fileArrayValidation(true), // Required
    npwp: fileArrayValidation(true), // Required
    ktp: fileArrayValidation(true), // Required
    aktaPendirian: fileArrayValidation(true), // Required
    skKemenkumham: fileArrayValidation(true), // Required

    // Optional files
    aktaPerubahan: fileArrayValidation(false), // Optional
    skKemenkumhamPerubahan: fileArrayValidation(false), // Optional
    sertifikatStandar: fileArrayValidation(false), // Optional
  }),
});

function KelengkapanLegalitas() {
  const FORM_KEY = "newTransporterRegistration";
  const setForm = useTransporterFormStore((state) => state.setForm);
  const initialData = useTransporterFormStore((state) =>
    state.getForm(FORM_KEY)
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    getValues,
    watch,
  } = useForm({
    resolver: valibotResolver(kelengkapanLegalitasSchema),
    defaultValues: initialData.nibNumber
      ? initialData
      : {
          nibNumber: null,
          npwpNumber: null,
          ktpNumber: null,
          documents: {
            nib: [], // Required
            npwp: [], // Required
            ktp: [], // Required
            aktaPendirian: [], // Required
            skKemenkumham: [], // Required
            aktaPerubahan: [], // Optional
            skKemenkumhamPerubahan: [], // Optional
            sertifikatStandar: [], // Optional
          },
        },
  });

  // Watch form values for real-time validation
  const watchedValues = watch();

  console.log("watchedValues", watchedValues);

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

  const handleValidateAndSubmit = handleSubmit((data) => {
    const values = getValues();

    if (isAllRequiredLegalitasFieldsEmpty(values)) {
      toast.error("Isi semua inputan yang bertanda bintang (*)");
      return;
    }
    console.log("NOT TRIGGERED");
    console.log("Form submitted:", data);

    const existingData =
      useTransporterFormStore.getState().getForm(FORM_KEY) || {};
    const updatedData = { ...existingData, ...data };
    setForm(FORM_KEY, updatedData);

    toast.success("Kelengkapan legalitas berhasil disimpan!");
  });

  const handleMultipleFileUpload = (fieldName, files) => {
    setValue(`documents.${fieldName}`, files, { shouldValidate: true });
  };

  const handleFileError = (error) => {
    console.error("File upload error:", error);
    // Handle file upload errors
  };

  return (
    <form onSubmit={handleValidateAndSubmit} className="w-full">
      <Card className={"rounded-xl border-none p-6"}>
        <div className="w-full max-w-[75%]">
          <div>
            <h3 className="mb-6 text-lg font-semibold">
              Kelengkapan Legalitas
            </h3>
            <FormContainer>
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
                className="mb-2"
                errorMessage={errors.documents?.npwp?.message}
                single
              />

              <FormLabel required>Nomor NPWP Perusahaan</FormLabel>
              <Input
                type="number"
                placeholder="Min. 15 Digit No. NPWP"
                {...register("npwpNumber")}
                errorMessage={errors.npwpNumber?.message}
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
                className="mb-2"
                errorMessage={errors.documents?.ktp?.message}
                single
              />

              <FormLabel required>Nomor KTP Pendaftar</FormLabel>
              <Input
                type="number"
                placeholder="16 Digit No. KTP Pendaftar"
                {...register("ktpNumber")}
                errorMessage={errors.ktpNumber?.message}
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
        <Button variant="muattrans-primary-secondary">Sebelumnya</Button>
        <Button type="submit" variant="muattrans-primary">
          Simpan
        </Button>
      </div>
    </form>
  );
}

export default KelengkapanLegalitas;
