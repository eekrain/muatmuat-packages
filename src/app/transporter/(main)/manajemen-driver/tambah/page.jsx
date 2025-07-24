"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ChevronLeft } from "lucide-react";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Button from "@/components/Button/Button";
import Card from "@/components/Card/Card";
import DatePicker from "@/components/DatePicker/DatePicker";
import FileUpload from "@/components/FileUpload/FileUpload";
import { FormContainer, FormLabel } from "@/components/Form/Form";
import Input from "@/components/Form/Input";
import ImageUploaderWeb from "@/components/ImageUploader/ImageUploaderWeb";
import { toast } from "@/lib/toast";

export default function TambahDriverPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    namaLengkap: "",
    noWhatsapp: "",
    fotoKTP: null,
    masaBerlakuSIM: null,
    fotoSIM: null,
    fotoDriver: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const breadcrumbItems = [
    { name: "Manajemen Driver", href: "/transporter/manajemen-driver" },
    { name: "Tambah Driver" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.namaLengkap.trim()) {
      newErrors.namaLengkap = "Nama lengkap wajib diisi";
    }

    if (!formData.noWhatsapp.trim()) {
      newErrors.noWhatsapp = "Nomor WhatsApp wajib diisi";
    } else if (!/^08\d{8,}$/.test(formData.noWhatsapp)) {
      newErrors.noWhatsapp = "Nomor WhatsApp tidak valid";
    }

    if (!formData.fotoKTP) {
      newErrors.fotoKTP = "Foto KTP wajib diunggah";
    }

    if (!formData.masaBerlakuSIM) {
      newErrors.masaBerlakuSIM = "Masa berlaku SIM wajib diisi";
    }

    if (!formData.fotoSIM) {
      newErrors.fotoSIM = "Foto SIM wajib diunggah";
    }

    if (!formData.fotoDriver) {
      newErrors.fotoDriver = "Foto driver wajib diunggah";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Mohon lengkapi semua field yang diperlukan");
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Driver berhasil ditambahkan");
      router.push("/transporter/manajemen-driver");
    } catch (error) {
      toast.error("Gagal menambahkan driver. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/transporter/manajemen-driver");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto w-full max-w-[818px] px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-4">
          <BreadCrumb data={breadcrumbItems} />
        </div>

        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex h-6 w-6 items-center justify-center"
          >
            <ChevronLeft className="h-6 w-6 text-primary-700" />
          </button>
          <h1 className="text-xl font-bold text-neutral-900">Tambah Driver</h1>
        </div>

        {/* Information Section */}
        <Card className="mb-6 p-8">
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-neutral-900">
              Informasi Driver
            </h2>

            <div className="grid gap-6 md:grid-cols-[178px_1fr]">
              {/* Nama Lengkap */}
              <FormLabel required className="text-neutral-600">
                Nama Lengkap*
              </FormLabel>
              <FormContainer>
                <Input
                  type="text"
                  placeholder="Masukkan Nama Lengkap"
                  value={formData.namaLengkap}
                  onChange={(e) =>
                    handleInputChange("namaLengkap", e.target.value)
                  }
                  error={errors.namaLengkap}
                  className="w-full max-w-[328px]"
                />
                {errors.namaLengkap && (
                  <span className="mt-1 text-xs text-error-600">
                    {errors.namaLengkap}
                  </span>
                )}
              </FormContainer>

              {/* No. WhatsApp */}
              <FormLabel required className="text-neutral-600">
                No. Whatsapp*
              </FormLabel>
              <FormContainer>
                <Input
                  type="text"
                  placeholder="Contoh : 08xxxxxxxxxxx"
                  value={formData.noWhatsapp}
                  onChange={(e) =>
                    handleInputChange("noWhatsapp", e.target.value)
                  }
                  error={errors.noWhatsapp}
                  className="w-full max-w-[328px]"
                />
                {errors.noWhatsapp && (
                  <span className="mt-1 text-xs text-error-600">
                    {errors.noWhatsapp}
                  </span>
                )}
              </FormContainer>
            </div>
          </div>
        </Card>

        {/* File and Photo Section */}
        <Card className="mb-6 p-8">
          <div className="space-y-6">
            <div>
              <h2 className="mb-4 text-lg font-semibold text-neutral-900">
                File dan Foto Driver
              </h2>
              <p className="text-xs text-neutral-700">
                Lihat contoh file dan foto{" "}
                <Link href="#" className="text-primary-700 underline">
                  di sini
                </Link>
              </p>
            </div>

            <div className="space-y-6">
              {/* Foto KTP */}
              <div className="grid gap-6 md:grid-cols-[178px_1fr]">
                <FormLabel required className="text-neutral-600">
                  Foto KTP*
                </FormLabel>
                <div className="flex items-center gap-2">
                  <FileUpload
                    value={formData.fotoKTP}
                    onSuccess={(file) => handleInputChange("fotoKTP", file)}
                    onError={(err) => toast.error(err)}
                    maxSize={10}
                    acceptedFormats={[".jpg", ".jpeg", ".png", ".pdf"]}
                    className="w-[112px]"
                    buttonText="Unggah"
                  />
                  <span className="text-xs text-neutral-600">
                    Format file jpg/png/pdf maks. 10MB
                  </span>
                </div>
              </div>

              {/* Masa Berlaku SIM B2 Umum */}
              <div className="grid gap-6 md:grid-cols-[178px_1fr]">
                <FormLabel required className="text-neutral-600">
                  Masa Berlaku SIM B2 Umum*
                </FormLabel>
                <FormContainer>
                  <DatePicker
                    value={formData.masaBerlakuSIM}
                    onChange={(date) =>
                      handleInputChange("masaBerlakuSIM", date)
                    }
                    placeholder="Pilih Tanggal"
                    error={errors.masaBerlakuSIM}
                    className="w-full max-w-[328px]"
                  />
                  {errors.masaBerlakuSIM && (
                    <span className="mt-1 text-xs text-error-600">
                      {errors.masaBerlakuSIM}
                    </span>
                  )}
                </FormContainer>
              </div>

              {/* Foto SIM B2 Umum */}
              <div className="grid gap-6 md:grid-cols-[178px_1fr]">
                <FormLabel required className="text-neutral-600">
                  Foto SIM B2 Umum*
                </FormLabel>
                <div className="flex items-center gap-2">
                  <FileUpload
                    value={formData.fotoSIM}
                    onSuccess={(file) => handleInputChange("fotoSIM", file)}
                    onError={(err) => toast.error(err)}
                    maxSize={10}
                    acceptedFormats={[".jpg", ".jpeg", ".png", ".pdf"]}
                    className="w-[112px]"
                    buttonText="Unggah"
                  />
                  <span className="text-xs text-neutral-600">
                    Format file jpg/png/pdf maks. 10MB
                  </span>
                </div>
              </div>

              {/* Foto Driver */}
              <div className="grid gap-6 md:grid-cols-[178px_1fr]">
                <FormLabel required className="text-neutral-600">
                  Foto Driver*
                </FormLabel>
                <div>
                  <ImageUploaderWeb
                    getImage={(image) => handleInputChange("fotoDriver", image)}
                    uploadText="Unggah"
                    errorText="Unggah Ulang"
                    maxSize={10}
                    onUpload={(image) => handleInputChange("fotoDriver", image)}
                    onError={(error) => toast.error(error)}
                    acceptedFormats={[".jpg", ".jpeg", ".png"]}
                    className="h-[124px] w-[124px]"
                  />
                  <p className="mt-2 text-xs text-neutral-600">
                    Unggah foto driver dengan format .jpg/.jpeg/.png, besar file
                    maks. 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            variant="muattrans-secondary"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="min-w-[112px]"
          >
            Batal
          </Button>
          <Button
            variant="muattrans-primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="min-w-[112px]"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </div>
    </div>
  );
}
