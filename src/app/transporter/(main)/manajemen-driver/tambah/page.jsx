"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

// --- Imports for React Hook Form and Valibot ---
import { valibotResolver } from "@hookform/resolvers/valibot";
import { ChevronLeft } from "lucide-react";
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
import { toast } from "@/lib/toast";

// --- 1. Define the Valibot Schema ---
// This schema centralizes all validation logic based on your task list.
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
    v.regex(
      /^08\d{8,}$/,
      "Format nomor WhatsApp tidak valid (contoh: 081234567890)"
    )
  ),
  // For files and dates, we check that they are not null on submission.
  fotoKTP: v.nonNullable(
    v.instance(File, "Foto KTP wajib diunggah"),
    "Foto KTP wajib diunggah"
  ),
  masaBerlakuSIM: v.nonNullable(
    v.instance(Date, "Masa berlaku SIM B2 Umum wajib diisi"),
    "Masa berlaku SIM B2 Umum wajib diisi"
  ),
  fotoSIM: v.nonNullable(
    v.instance(File, "Foto SIM wajib diunggah"),
    "Foto SIM wajib diunggah"
  ),
  fotoDriver: v.nonNullable(
    v.instance(File, "Foto driver wajib diunggah"),
    "Foto driver wajib diunggah"
  ),
});

export default function TambahDriverPage() {
  const router = useRouter();

  const breadcrumbItems = [
    { name: "Manajemen Driver", href: "/transporter/manajemen-driver" },
    { name: "Tambah Driver" },
  ];

  // --- 2. Initialize React Hook Form ---
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    // Use the Valibot schema as the resolver
    resolver: valibotResolver(driverSchema),
    // Set default values for the form
    defaultValues: {
      namaLengkap: "",
      noWhatsapp: "",
      fotoKTP: null,
      masaBerlakuSIM: null,
      fotoSIM: null,
      fotoDriver: null,
    },
    // Validate on blur for a better user experience
    mode: "onBlur",
  });

  // --- 3. Create the Submit Handler ---
  // This function only runs if validation passes.
  const onSubmit = async (data) => {
    // `data` is the validated form data from the schema
    console.log("Validated Data:", data);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Driver berhasil ditambahkan");
      router.push("/transporter/manajemen-driver");
    } catch (error) {
      toast.error("Gagal menambahkan driver. Silakan coba lagi.");
    }
  };

  const handleCancel = () => {
    router.push("/transporter/manajemen-driver");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto w-full max-w-[818px] px-4 py-8">
        <div className="mb-4">
          <BreadCrumb data={breadcrumbItems} />
        </div>
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex h-6 w-6 items-center justify-center"
          >
            <ChevronLeft className="h-6 w-6 text-primary-700" />
          </button>
          <h1 className="text-xl font-bold text-neutral-900">Tambah Driver</h1>
        </div>

        {/* --- 4. Wrap Everything in a Form Element --- */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="mb-6 border-none p-8">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">
              Informasi Driver
            </h2>
            <div className="space-y-6">
              {/* Nama Lengkap */}
              <div className="grid gap-6 md:grid-cols-[178px_1fr]">
                <FormLabel required className="text-neutral-600">
                  Nama Lengkap
                </FormLabel>
                {/* --- 5. Use Controller for Each Input --- */}
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

              {/* No Whatsapp */}
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
                      // Sanitize input while typing
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
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-neutral-900">
                File dan Foto Driver
              </h2>
              <p className="text-xs text-neutral-700">
                Lihat contoh file dan foto{" "}
                <Link href="#" className="font-semibold text-primary-700">
                  di sini
                </Link>
              </p>
            </div>

            <div className="space-y-6">
              {/* Foto KTP */}
              <div className="grid gap-6 md:grid-cols-[178px_1fr]">
                <FormLabel required className="text-neutral-600">
                  Foto KTP
                </FormLabel>
                <Controller
                  name="fotoKTP"
                  control={control}
                  render={({ field }) => (
                    <div className="w-full max-w-[328px]">
                      <FileUpload
                        value={field.value}
                        onSuccess={(file) => field.onChange(file)}
                        onError={(err) => toast.error(err)}
                        maxSize={10}
                        acceptedFormats={[".jpg", ".jpeg", ".png", ".pdf"]}
                        buttonText="Unggah"
                        errorMessage={errors.fotoKTP?.message}
                      />
                    </div>
                  )}
                />
              </div>

              {/* Masa Berlaku SIM */}
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

              {/* Foto SIM */}
              <div className="grid gap-6 md:grid-cols-[178px_1fr]">
                <FormLabel required className="text-neutral-600">
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
                        onError={(err) => toast.error(err)}
                        maxSize={10}
                        acceptedFormats={[".jpg", ".jpeg", ".png", ".pdf"]}
                        buttonText="Unggah"
                        errorMessage={errors.fotoSIM?.message}
                      />
                    </div>
                  )}
                />
              </div>

              {/* Foto Driver */}
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
                        // RHF's `onChange` handles setting the value
                        onUpload={(image) => field.onChange(image)}
                        onError={(error) => toast.error(error)}
                        // Pass the error state to trigger the red border
                        isNull={!!errors.fotoDriver}
                        className="h-[124px] w-[124px]"
                        uploadText="Unggah"
                        errorText="Unggah Ulang"
                        maxSize={10}
                        acceptedFormats={[".jpg", ".jpeg", ".png"]}
                      />
                      {errors.fotoDriver ? (
                        <span className="mt-2 block text-xs text-error-400">
                          {errors.fotoDriver.message}
                        </span>
                      ) : (
                        <p className="mt-2 text-xs text-neutral-600">
                          Unggah foto driver dengan format .jpg/.jpeg/.png,
                          besar file maks. 10MB
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="muattrans-secondary"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="min-w-[112px]"
            >
              Batal
            </Button>
            <Button
              type="submit" // Use type="submit" to trigger form submission
              variant="muattrans-primary"
              disabled={isSubmitting}
              className="min-w-[112px]"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
