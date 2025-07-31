"use client";

import { useState } from "react";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import * as v from "valibot";

import { FormContainer, FormLabel } from "@/components/Form/Form";
import Input from "@/components/Form/Input";

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

  companyLogo:
    v.custom <
    File >
    ((value) => {
      if (!(value instanceof File)) return false;
      const validTypes = ["image/jpeg", "image/png"];
      const maxSize = 10 * 1024 * 1024;
      return validTypes.includes(value.type) && value.size <= maxSize;
    },
    "Logo harus berupa file JPG/PNG dengan ukuran maksimal 10MB"),

  companyName: v.pipe(
    v.string(),
    v.minLength(1, "Nama perusahaan wajib diisi")
  ),
  businessEntityType: v.enum(
    ["PT", "CV", "Firma", "Perorangan"],
    "Bentuk usaha tidak valid"
  ),
  companyPhone: v.pipe(v.string(), v.minLength(1, "Nomor telepon wajib diisi")),

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
  const [namaLengkapPendaftar, setNamaLengkapPendaftar] = useState("");
  const [jabatanPendaftar, setJabatanPendaftar] = useState("");
  const [noWhatsappPendaftar, setNoWhatsappPendaftar] = useState("");
  const [emailPendaftar, setEmailPendaftar] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
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

  return (
    <div>
      <h3 className="mb-6 text-sm font-semibold">Informasi Pendaftar</h3>
      <FormContainer>
        <FormLabel required>Nama Lengkap Pendaftar</FormLabel>
        <Input
          type="text"
          placeholder="Masukkan Nama Lengkap Pendaftar"
          value={namaLengkapPendaftar}
          onChange={(e) => setNamaLengkapPendaftar(e.target.value)}
        />
        <FormLabel required>Jabatan Pendaftar</FormLabel>
        <Input
          type="text"
          placeholder="Masukkan Jabatan Pendaftar"
          value={jabatanPendaftar}
          onChange={(e) => setJabatanPendaftar(e.target.value)}
        />
        <FormLabel required>No. Whatsapp Pendaftar</FormLabel>
        <Input
          type="text"
          placeholder="Contoh: 08xxxxxxxxxx"
          value={noWhatsappPendaftar}
          onChange={(e) => setNoWhatsappPendaftar(e.target.value)}
        />
        <FormLabel required>Email Pendaftar</FormLabel>
        <Input
          type="email"
          placeholder="Masukkan Email Pendaftar"
          value={emailPendaftar}
          onChange={(e) => setEmailPendaftar(e.target.value)}
        />
      </FormContainer>
    </div>
  );
}

export default InformasiPendaftar;
