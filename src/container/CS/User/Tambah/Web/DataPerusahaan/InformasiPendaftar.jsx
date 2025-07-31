"use client";

import { useState } from "react";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import * as v from "valibot";

import Button from "@/components/Button/Button";
import Card from "@/components/Card/Card";
import ImageUploudWithModal from "@/components/FileUpload/ImageUploudWithModal";
import { FormContainer, FormLabel } from "@/components/Form/Form";
import Input from "@/components/Form/Input";
import { Select } from "@/components/Form/Select";
import SelectFilterRadix from "@/components/Form/SelectFilterRadix";
import { MyTextArea } from "@/components/Form/TextArea";

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
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <Card className={"rounded-xl border-none p-6"}>
        <div className="max-w-[70%]">
          <h3 className="mb-4 text-lg font-semibold">Data Perusahaan</h3>
          <div>
            <h3 className="mb-6 text-sm font-semibold">Informasi Pendaftar</h3>
            <FormContainer>
              <FormLabel required>Nama Lengkap Pendaftar</FormLabel>
              <Input
                type="text"
                placeholder="Masukkan Nama Lengkap Pendaftar"
                {...register("registrantName")}
                errorMessage={errors.registrantName?.message}
              />

              <FormLabel required>Jabatan Pendaftar</FormLabel>
              <Input
                type="text"
                placeholder="Masukkan Jabatan Pendaftar"
                {...register("registrantPosition")}
                errorMessage={errors.registrantPosition?.message}
              />

              <FormLabel required>No. Whatsapp Pendaftar</FormLabel>
              <Input
                type="text"
                placeholder="Contoh: 08xxxxxxxxxx"
                {...register("registrantWhatsapp")}
                errorMessage={errors.registrantWhatsapp?.message}
              />

              <FormLabel required>Email Pendaftar</FormLabel>
              <Input
                type="email"
                placeholder="Masukkan Email Pendaftar"
                {...register("registrantEmail")}
                errorMessage={errors.registrantEmail?.message}
              />
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
                errorMessage={errors.companyName?.message}
              />

              <FormLabel required>Badan Usaha</FormLabel>
              <Select
                options={badanUsahaOptions}
                value={watchedValues.businessEntityType}
                onChange={(value) => setValue("businessEntityType", value)}
                placeholder="Pilih Badan Usaha"
                errorMessage={errors.businessEntityType?.message}
              />

              <FormLabel required>No. Telepon Perusahaan</FormLabel>
              <Input
                type="text"
                placeholder="Contoh: 08xxxxxxxxxx"
                {...register("companyPhone")}
                errorMessage={errors.companyPhone?.message}
              />
            </FormContainer>
          </div>

          <div className="flex flex-col">
            <h3 className="my-6 text-sm font-semibold">Informasi Lokasi</h3>
            <FormContainer>
              <FormLabel required>Alamat</FormLabel>
              <MyTextArea
                placeholder="Contoh : Nama Jalan (bila tidak diemukan), Gedung, No. Rumah/Patokan, Blok/Unit"
                maxLength={225}
                value={watch("companyAddress")}
                onChange={(e) => setValue("companyAddress", e.target.value)}
                errorMessage={errors.companyAddress?.message}
                appearance={{
                  inputClassName: "h-[80px]",
                }}
              />

              <FormLabel required>Lokasi</FormLabel>
              <Input
                type="text"
                placeholder="Masukkan Lokasi"
                {...register("addressType")}
                errorMessage={errors.addressType?.message}
              />

              <FormLabel required>Kecamatan</FormLabel>
              <SelectFilterRadix
                options={kecamatanOptions}
                value={watchedValues.locationData?.district}
                onChange={(value) => setValue("locationData.district", value)}
                placeholder="Pilih Kecamatan"
                errorMessage={errors.locationData?.district?.message}
              />

              <FormLabel required>Kota</FormLabel>
              <p className="text-xs font-medium">Surabaya</p>

              <FormLabel required>Provinsi</FormLabel>
              <p className="text-xs font-medium">Jawa Timur</p>

              <FormLabel required>Kode Pos</FormLabel>
              <SelectFilterRadix
                options={kodePosOptions}
                value={watchedValues.locationData?.postalCode}
                onChange={(value) => setValue("locationData.postalCode", value)}
                placeholder="Pilih Kode Pos"
                errorMessage={errors.locationData?.postalCode?.message}
              />

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
              <SelectFilterRadix
                options={bankOptions}
                value={watchedValues.bankId}
                onChange={(value) => setValue("bankId", value)}
                placeholder="Pilih Bank"
                errorMessage={errors.bankId?.message}
              />

              <FormLabel required>Nomor Rekening</FormLabel>
              <Input
                type="text"
                placeholder="Masukkan Nomor Rekening"
                {...register("accountNumber")}
                errorMessage={errors.accountNumber?.message}
              />

              <FormLabel required>Nama Pemilik Rekening</FormLabel>
              <Input
                type="text"
                placeholder="Masukkan Nama Pemilik Rekening"
                {...register("accountName")}
                errorMessage={errors.accountName?.message}
              />
            </FormContainer>
          </div>
        </div>
      </Card>
      <div className="mt-6 flex items-end justify-end">
        <Button type="submit" variant="muattrans-primary" className="px-8">
          Simpan
        </Button>
      </div>
    </form>
  );
}

export default InformasiPendaftar;
