"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import * as v from "valibot";

import Button from "@/components/Button/Button";
import FileUploadDocument from "@/components/FileUpload/FileUploadDocument";
import { FormContainer, FormLabel } from "@/components/Form/Form";
import Input from "@/components/Form/Input";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "application/pdf"];

// Simplified file validation
const fileValidation = v.optional(
  v.custom((value) => {
    if (!value) return true; // Allow undefined/null for optional fields
    if (!(value instanceof File)) return false;
    return value.size <= MAX_FILE_SIZE && ACCEPTED_TYPES.includes(value.type);
  }, "Format file harus .jpg/.png/.pdf dan maksimal 10MB")
);

// Array validation for multiple files
const fileArrayValidation = v.optional(
  v.array(
    v.custom((value) => {
      if (!(value instanceof File)) return false;
      return value.size <= MAX_FILE_SIZE && ACCEPTED_TYPES.includes(value.type);
    }, "Format file harus .jpg/.png/.pdf dan maksimal 10MB")
  )
);

export const kelengkapanLegalitasSchema = v.object({
  nibNumber: v.pipe(
    v.string("Nomor NIB wajib diisi"),
    v.minLength(13, "Nomor NIB harus 13 digit"),
    v.maxLength(13, "Nomor NIB harus 13 digit")
  ),
  npwpNumber: v.pipe(
    v.string("Nomor NPWP wajib diisi"),
    v.minLength(15, "Nomor NPWP harus 15 digit"),
    v.maxLength(15, "Nomor NPWP harus 15 digit")
  ),
  ktpNumber: v.pipe(
    v.string("Nomor KTP wajib diisi"),
    v.minLength(16, "Nomor KTP harus 16 digit"),
    v.maxLength(16, "Nomor KTP harus 16 digit")
  ),

  documents: v.object({
    nib: fileArrayValidation,
    aktaPendirian: fileArrayValidation,
    skKemenkumham: fileArrayValidation,
    aktaPerubahan: fileArrayValidation,
    skKemenkumhamPerubahan: fileArrayValidation,
    sertifikatStandar: fileArrayValidation,
    npwp: fileValidation,
    ktp: fileValidation,
  }),
});

function KelengkapanLegalitas() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: valibotResolver(kelengkapanLegalitasSchema),
    defaultValues: {
      nibNumber: "",
      npwpNumber: "",
      ktpNumber: "",
      documents: {
        nib: [],
        npwp: null,
        ktp: null,
        aktaPendirian: [],
        skKemenkumham: [],
        aktaPerubahan: [],
        skKemenkumhamPerubahan: [],
        sertifikatStandar: [],
      },
    },
  });

  // Watch form values for real-time validation
  const watchedValues = watch();

  const onSubmit = (data) => {
    console.log("Form data:", data);
    // Handle form submission here
  };

  const handleFileUpload = (fieldName, file) => {
    setValue(`documents.${fieldName}`, file);
  };

  const handleMultipleFileUpload = (fieldName, files) => {
    setValue(`documents.${fieldName}`, files);
  };

  const handleFileError = (error) => {
    console.error("File upload error:", error);
    // Handle file upload errors
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <h3 className="mb-6 text-lg font-semibold">Kelengkapan Legalitas</h3>
        <FormContainer>
          {/* NIB */}
          <FormLabel required>NIB</FormLabel>
          <FileUploadDocument
            maxSize={5}
            acceptedFormats={[".jpg", ".jpeg", ".png", ".pdf"]}
            onSuccess={(files) => handleMultipleFileUpload("nib", files)}
            onError={handleFileError}
            value={watchedValues.documents?.nib || []}
            label="Upload"
            className="mb-2"
            multiple={true}
          />
          {errors.documents?.nib && (
            <p className="mt-1 text-sm text-error-500">
              {errors.documents.nib.message}
            </p>
          )}

          <FormLabel required>Nomor NIB</FormLabel>
          <Input
            type="text"
            placeholder="13 Digit No. NIB"
            {...register("nibNumber")}
            className={
              errors.nibNumber ? "border-error-500" : "border-neutral-600"
            }
          />
          {errors.nibNumber && (
            <p className="mt-1 text-sm text-error-500">
              {errors.nibNumber.message}
            </p>
          )}

          {/* NPWP */}
          <FormLabel required>NPWP Perusahaan</FormLabel>
          <FileUploadDocument
            maxSize={5}
            acceptedFormats={[".jpg", ".jpeg", ".png", ".pdf"]}
            onSuccess={(file) => handleFileUpload("npwp", file)}
            onError={handleFileError}
            value={watchedValues.documents?.npwp}
            label="Upload"
            className="mb-2"
          />
          {errors.documents?.npwp && (
            <p className="mt-1 text-sm text-error-500">
              {errors.documents.npwp.message}
            </p>
          )}

          <FormLabel required>Nomor NPWP Perusahaan</FormLabel>
          <Input
            type="text"
            placeholder="Min. 15 Digit No. NPWP"
            {...register("npwpNumber")}
            className={
              errors.npwpNumber ? "border-error-500" : "border-neutral-600"
            }
          />
          {errors.npwpNumber && (
            <p className="mt-1 text-sm text-error-500">
              {errors.npwpNumber.message}
            </p>
          )}

          {/* KTP */}
          <FormLabel required>KTP Pendaftar/Pemegang Akun</FormLabel>
          <FileUploadDocument
            maxSize={5}
            acceptedFormats={[".jpg", ".jpeg", ".png", ".pdf"]}
            onSuccess={(file) => handleFileUpload("ktp", file)}
            onError={handleFileError}
            value={watchedValues.documents?.ktp}
            label="Upload"
            className="mb-2"
          />
          {errors.documents?.ktp && (
            <p className="mt-1 text-sm text-error-500">
              {errors.documents.ktp.message}
            </p>
          )}

          <FormLabel required>Nomor KTP Pendaftar</FormLabel>
          <Input
            type="text"
            placeholder="16 Digit No. KTP Pendaftar"
            {...register("ktpNumber")}
            className={
              errors.ktpNumber ? "border-error-500" : "border-neutral-600"
            }
          />
          {errors.ktpNumber && (
            <p className="mt-1 text-sm text-error-500">
              {errors.ktpNumber.message}
            </p>
          )}

          {/* Cover Akta Pendirian */}
          <FormLabel required>Cover Akta Pendirian</FormLabel>
          <FileUploadDocument
            maxSize={5}
            acceptedFormats={[".jpg", ".jpeg", ".png", ".pdf"]}
            onSuccess={(files) =>
              handleMultipleFileUpload("aktaPendirian", files)
            }
            onError={handleFileError}
            value={watchedValues.documents?.aktaPendirian || []}
            label="Upload"
            multiple={true}
          />
          {errors.documents?.aktaPendirian && (
            <p className="mt-1 text-sm text-error-500">
              {errors.documents.aktaPendirian.message}
            </p>
          )}

          {/* SK Kemenkumham dan Akta Pendirian */}
          <FormLabel required>SK Kemenkumham dan Akta Pendirian</FormLabel>
          <FileUploadDocument
            maxSize={5}
            acceptedFormats={[".jpg", ".jpeg", ".png", ".pdf"]}
            onSuccess={(files) =>
              handleMultipleFileUpload("skKemenkumham", files)
            }
            onError={handleFileError}
            value={watchedValues.documents?.skKemenkumham || []}
            label="Upload"
            multiple={true}
          />
          {errors.documents?.skKemenkumham && (
            <p className="mt-1 text-sm text-error-500">
              {errors.documents.skKemenkumham.message}
            </p>
          )}

          {/* Cover Akta Perubahan (bila ada) */}
          <FormLabel>Cover Akta Perubahan (bila ada)</FormLabel>
          <FileUploadDocument
            maxSize={5}
            acceptedFormats={[".jpg", ".jpeg", ".png", ".pdf"]}
            onSuccess={(files) =>
              handleMultipleFileUpload("aktaPerubahan", files)
            }
            onError={handleFileError}
            value={watchedValues.documents?.aktaPerubahan || []}
            label="Upload"
            multiple={true}
          />
          {errors.documents?.aktaPerubahan && (
            <p className="mt-1 text-sm text-error-500">
              {errors.documents.aktaPerubahan.message}
            </p>
          )}

          {/* SK Kemenkumham dan Akta Perubahan (bila ada) */}
          <FormLabel>SK Kemenkumham dan Akta Perubahan (bila ada)</FormLabel>
          <FileUploadDocument
            maxSize={5}
            acceptedFormats={[".jpg", ".jpeg", ".png", ".pdf"]}
            onSuccess={(files) =>
              handleMultipleFileUpload("skKemenkumhamPerubahan", files)
            }
            onError={handleFileError}
            value={watchedValues.documents?.skKemenkumhamPerubahan || []}
            label="Upload"
            multiple={true}
          />
          {errors.documents?.skKemenkumhamPerubahan && (
            <p className="mt-1 text-sm text-error-500">
              {errors.documents.skKemenkumhamPerubahan.message}
            </p>
          )}

          {/* Sertifikat Standar (bila ada) */}
          <FormLabel>Sertifikat Standar (bila ada)</FormLabel>
          <FileUploadDocument
            maxSize={5}
            acceptedFormats={[".jpg", ".jpeg", ".png", ".pdf"]}
            onSuccess={(files) =>
              handleMultipleFileUpload("sertifikatStandar", files)
            }
            onError={handleFileError}
            value={watchedValues.documents?.sertifikatStandar || []}
            label="Upload"
            multiple={true}
          />
          {errors.documents?.sertifikatStandar && (
            <p className="mt-1 text-sm text-error-500">
              {errors.documents.sertifikatStandar.message}
            </p>
          )}
        </FormContainer>
      </div>

      <div className="mt-6 flex justify-end">
        <Button type="submit" variant="muattrans-primary" className="px-8">
          Simpan Data
        </Button>
      </div>
    </form>
  );
}

export default KelengkapanLegalitas;
