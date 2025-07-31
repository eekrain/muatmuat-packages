"use client";

import { useState } from "react";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import * as v from "valibot";

import Button from "@/components/Button/Button";
import ImageUploudWithModal from "@/components/FileUpload/ImageUploudWithModal";
import { FormContainer, FormLabel } from "@/components/Form/Form";
import Input from "@/components/Form/Input";
import { Select } from "@/components/Form/Select";
import TextArea from "@/components/TextArea/TextArea";

const informasiPendaftarSchema = v.object({
  transporterId: v.optional(v.string()),

  registrantName: v.pipe(
    v.string(),
    v.minLength(1, "Nama pendaftar wajib diisi")
  ),
  registrantPosition: v.pipe(v.string(), v.minLength(1, "Jabatan wajib diisi")),
  registrantWhatsapp: v.pipe(
    v.string(),
    v.minLength(1, "Nomor Whatsapp wajib diisi"),
    v.regex(
      /^08[0-9]{8,11}$/,
      "Format nomor Whatsapp tidak valid (contoh: 08xxxxxxxxxx)"
    )
  ),
  registrantEmail: v.pipe(
    v.string(),
    v.minLength(1, "Email wajib diisi"),
    v.email("Format email tidak valid")
  ),

  companyLogo: v.optional(
    v.custom((value) => {
      if (!value || !(value instanceof File)) return true; // Optional field
      const validTypes = ["image/jpeg", "image/png"];
      const maxSize = 10 * 1024 * 1024;
      return validTypes.includes(value.type) && value.size <= maxSize;
    }, "Logo harus berupa file JPG/PNG dengan ukuran maksimal 10MB")
  ),

  companyName: v.pipe(
    v.string(),
    v.minLength(1, "Nama perusahaan wajib diisi")
  ),
  businessEntityType: v.enum(
    ["PT", "CV", "UD", "Koperasi", "Lainnya"],
    "Bentuk usaha tidak valid"
  ),
  companyPhone: v.pipe(
    v.string(),
    v.minLength(1, "Nomor telepon wajib diisi"),
    v.regex(
      /^08[0-9]{8,11}$/,
      "Format nomor telepon tidak valid (contoh: 08xxxxxxxxxx)"
    )
  ),

  companyAddress: v.pipe(
    v.string(),
    v.minLength(1, "Alamat perusahaan wajib diisi")
  ),
  addressType: v.optional(v.string()),
  locationData: v.object({
    latitude: v.pipe(v.string(), v.minLength(1, "Latitude wajib diisi")),
    longitude: v.pipe(v.string(), v.minLength(1, "Longitude wajib diisi")),
    district: v.pipe(v.string(), v.minLength(1, "Kecamatan wajib diisi")),
    city: v.optional(v.string()),
    province: v.optional(v.string()),
    postalCode: v.pipe(v.string(), v.minLength(1, "Kode pos wajib diisi")),
    placeId: v.pipe(
      v.string(),
      v.minLength(1, "Lokasi harus dipilih dari Google Maps")
    ),
  }),

  bankId: v.pipe(v.string(), v.minLength(1, "Bank wajib diisi")),
  accountNumber: v.pipe(
    v.string(),
    v.minLength(1, "Nomor rekening wajib diisi")
  ),
  accountName: v.pipe(
    v.string(),
    v.minLength(1, "Nama pemilik rekening wajib diisi")
  ),
});

function InformasiPendaftar() {
  const [coordinates, setCoordinates] = useState({
    lat: 7.2575,
    lng: 112.7521,
  });

  const {
    setValue,
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm({
    resolver: valibotResolver(informasiPendaftarSchema),
    defaultValues: {
      transporterId: "uuid-transporter",
      registrantName: "",
      registrantPosition: "",
      registrantWhatsapp: "",
      registrantEmail: "",
      companyLogo: null,
      companyName: "",
      businessEntityType: "",
      companyPhone: "",
      companyAddress: "",
      addressType: "HEAD_OFFICE",
      locationData: {
        latitude: "",
        longitude: "",
        district: "",
        city: "",
        province: "",
        postalCode: "",
        placeId: "",
      },
      bankId: "",
      accountNumber: "",
      accountName: "",
    },
  });

  // Watch form values for real-time validation
  const watchedValues = watch();

  // Define options for form fields
  const badanUsahaOptions = [
    { label: "PT (Perseroan Terbatas)", value: "PT" },
    { label: "CV (Commanditaire Vennootschap)", value: "CV" },
    { label: "UD (Usaha Dagang)", value: "UD" },
    { label: "Koperasi", value: "Koperasi" },
    { label: "Lainnya", value: "Lainnya" },
  ];

  const kecamatanOptions = [
    { label: "Gubeng", value: "gubeng" },
    { label: "Tambaksari", value: "tambaksari" },
    { label: "Wonokromo", value: "wonokromo" },
    { label: "Sawahan", value: "sawahan" },
    { label: "Tegalsari", value: "tegalsari" },
  ];

  const kodePosOptions = [
    { label: "60282", value: "60282" },
    { label: "60283", value: "60283" },
    { label: "60284", value: "60284" },
    { label: "60285", value: "60285" },
  ];

  const bankOptions = [
    { label: "Bank BCA", value: "bca" },
    { label: "Bank BNI", value: "bni" },
    { label: "Bank BRI", value: "bri" },
    { label: "Bank Mandiri", value: "mandiri" },
    { label: "Bank CIMB Niaga", value: "cimb" },
  ];

  const onSubmit = (data) => {
    console.log("Form data:", data);
    // Handle form submission here
  };

  const handleLogoUpload = (file) => {
    setValue("companyLogo", file);
  };

  const handleMapPositionChange = (newCoordinates) => {
    setCoordinates(newCoordinates);
    setValue("locationData.latitude", newCoordinates.lat.toString());
    setValue("locationData.longitude", newCoordinates.lng.toString());
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <h3 className="mb-6 text-sm font-semibold">Informasi Pendaftar</h3>
        <FormContainer>
          <FormLabel required>Nama Lengkap Pendaftar</FormLabel>
          <Input
            type="text"
            placeholder="Masukkan Nama Lengkap Pendaftar"
            {...register("registrantName")}
            className={
              errors.registrantName ? "border-error-500" : "border-neutral-600"
            }
          />
          {errors.registrantName && (
            <p className="mt-1 text-sm text-error-500">
              {errors.registrantName.message}
            </p>
          )}

          <FormLabel required>Jabatan Pendaftar</FormLabel>
          <Input
            type="text"
            placeholder="Masukkan Jabatan Pendaftar"
            {...register("registrantPosition")}
            className={
              errors.registrantPosition
                ? "border-error-500"
                : "border-neutral-600"
            }
          />
          {errors.registrantPosition && (
            <p className="mt-1 text-sm text-error-500">
              {errors.registrantPosition.message}
            </p>
          )}

          <FormLabel required>No. Whatsapp Pendaftar</FormLabel>
          <Input
            type="text"
            placeholder="Contoh: 08xxxxxxxxxx"
            {...register("registrantWhatsapp")}
            className={
              errors.registrantWhatsapp
                ? "border-error-500"
                : "border-neutral-600"
            }
          />
          {errors.registrantWhatsapp && (
            <p className="mt-1 text-sm text-error-500">
              {errors.registrantWhatsapp.message}
            </p>
          )}

          <FormLabel required>Email Pendaftar</FormLabel>
          <Input
            type="email"
            placeholder="Masukkan Email Pendaftar"
            {...register("registrantEmail")}
            className={
              errors.registrantEmail ? "border-error-500" : "border-neutral-600"
            }
          />
          {errors.registrantEmail && (
            <p className="mt-1 text-sm text-error-500">
              {errors.registrantEmail.message}
            </p>
          )}
        </FormContainer>
      </div>

      <div>
        <h3 className="my-6 text-sm font-semibold">Informasi Perusahaan</h3>
        <FormContainer>
          <FormLabel required>Logo Perusahaan</FormLabel>
          <ImageUploudWithModal onUploadSuccess={handleLogoUpload} />
          {errors.companyLogo && (
            <p className="mt-1 text-sm text-error-500">
              {errors.companyLogo.message}
            </p>
          )}

          <FormLabel required>Nama Perusahaan</FormLabel>
          <Input
            type="text"
            placeholder="Masukkan Nama Perusahaan"
            {...register("companyName")}
            className={
              errors.companyName ? "border-error-500" : "border-neutral-600"
            }
          />
          {errors.companyName && (
            <p className="mt-1 text-sm text-error-500">
              {errors.companyName.message}
            </p>
          )}

          <FormLabel required>Badan Usaha</FormLabel>
          <Select
            options={badanUsahaOptions}
            value={watchedValues.businessEntityType}
            onChange={(value) => setValue("businessEntityType", value)}
            placeholder="Pilih Badan Usaha"
            className={
              errors.businessEntityType
                ? "border-error-500"
                : "border-neutral-600"
            }
          />
          {errors.businessEntityType && (
            <p className="mt-1 text-sm text-error-500">
              {errors.businessEntityType.message}
            </p>
          )}

          <FormLabel required>No. Telepon Perusahaan</FormLabel>
          <Input
            type="text"
            placeholder="Contoh: 08xxxxxxxxxx"
            {...register("companyPhone")}
            className={
              errors.companyPhone ? "border-error-500" : "border-neutral-600"
            }
          />
          {errors.companyPhone && (
            <p className="mt-1 text-sm text-error-500">
              {errors.companyPhone.message}
            </p>
          )}
        </FormContainer>
      </div>

      <div className="flex flex-col">
        <h3 className="my-6 text-sm font-semibold">Informasi Lokasi</h3>
        <FormContainer>
          <FormLabel required>Alamat</FormLabel>
          <TextArea
            placeholder="Contoh : Nama Jalan (bila tidak diemukan), Gedung, No. Rumah/Patokan, Blok/Unit"
            maxLength={225}
            {...register("companyAddress")}
            className={
              errors.companyAddress ? "border-error-500" : "border-neutral-600"
            }
          />
          {errors.companyAddress && (
            <p className="mt-1 text-sm text-error-500">
              {errors.companyAddress.message}
            </p>
          )}

          <FormLabel required>Kecamatan</FormLabel>
          <Select
            options={kecamatanOptions}
            value={watchedValues.locationData?.district}
            onChange={(value) => setValue("locationData.district", value)}
            placeholder="Pilih Kecamatan"
            className={
              errors.locationData?.district
                ? "border-error-500"
                : "border-neutral-600"
            }
          />
          {errors.locationData?.district && (
            <p className="mt-1 text-sm text-error-500">
              {errors.locationData.district.message}
            </p>
          )}

          <FormLabel required>Kota</FormLabel>
          <p className="text-xs font-bold">Surabaya</p>

          <FormLabel required>Provinsi</FormLabel>
          <p className="text-xs font-bold">Jawa Timur</p>

          <FormLabel required>Kode Pos</FormLabel>
          <Select
            options={kodePosOptions}
            value={watchedValues.locationData?.postalCode}
            onChange={(value) => setValue("locationData.postalCode", value)}
            placeholder="Pilih Kode Pos"
            className={
              errors.locationData?.postalCode
                ? "border-error-500"
                : "border-neutral-600"
            }
          />
          {errors.locationData?.postalCode && (
            <p className="mt-1 text-sm text-error-500">
              {errors.locationData.postalCode.message}
            </p>
          )}

          <FormLabel required>Titik Lokasi</FormLabel>
          <div className="h-[200px] w-full overflow-hidden rounded-lg">
            {/* <MapContainer
              coordinates={coordinates}
              onPositionChange={handleMapPositionChange}
              className="h-full w-full"
            /> */}
          </div>
          <Button
            type="button"
            variant="muattrans-primary"
            className="mt-2"
            onClick={() => {
              // Handle pin location setting
              alert("Pin location button clicked");
            }}
          >
            Atur Pin Lokasi
          </Button>
        </FormContainer>
      </div>

      <div>
        <h3 className="my-6 text-sm font-semibold">
          Informasi Rekening Perusahaan
        </h3>
        <FormContainer>
          <FormLabel required>Nama Bank</FormLabel>
          <Select
            options={bankOptions}
            value={watchedValues.bankId}
            onChange={(value) => setValue("bankId", value)}
            placeholder="Pilih Bank"
            className={
              errors.bankId ? "border-error-500" : "border-neutral-600"
            }
          />
          {errors.bankId && (
            <p className="mt-1 text-sm text-error-500">
              {errors.bankId.message}
            </p>
          )}

          <FormLabel required>Nomor Rekening</FormLabel>
          <Input
            type="text"
            placeholder="Masukkan Nomor Rekening"
            {...register("accountNumber")}
            className={
              errors.accountNumber ? "border-error-500" : "border-neutral-600"
            }
          />
          {errors.accountNumber && (
            <p className="mt-1 text-sm text-error-500">
              {errors.accountNumber.message}
            </p>
          )}

          <FormLabel required>Nama Pemilik Rekening</FormLabel>
          <Input
            type="text"
            placeholder="Masukkan Nama Pemilik Rekening"
            {...register("accountName")}
            className={
              errors.accountName ? "border-error-500" : "border-neutral-600"
            }
          />
          {errors.accountName && (
            <p className="mt-1 text-sm text-error-500">
              {errors.accountName.message}
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

export default InformasiPendaftar;
