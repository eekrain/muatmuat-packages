"use client";

import { useState } from "react";

import ImageUploadWithCrop from "@/components/FileUpload/ImageUploudWithModal";
import ImageUploudWithModal from "@/components/FileUpload/ImageUploudWithModal";
import { FormContainer, FormLabel } from "@/components/Form/Form";
import Input from "@/components/Form/Input";
import { Select } from "@/components/Form/Select";

// Ensure this import path is correct

function InformasiPerusahaan() {
  const [logoFile, setLogoFile] = useState(null);

  const handleUploadSuccess = (file) => {
    setLogoFile(file);
    // Kamu bisa langsung upload ke server di sini jika perlu
    // atau simpan base64/blob/URL.createObjectURL
  };
  const [namaPerusahaan, setNamaPerusahaan] = useState("");
  // Initialize badanUsaha to an empty string so the placeholder is shown initially
  const [badanUsaha, setBadanUsaha] = useState("");
  const [noTeleponPerusahaan, setNoTeleponPerusahaan] = useState("");

  // Define options for "Badan Usaha"
  // REMOVE THE PLACEHOLDER OPTION FROM HERE
  const badanUsahaOptions = [
    { label: "PT (Perseroan Terbatas)", value: "PT" },
    { label: "CV (Commanditaire Vennootschap)", value: "CV" },
    { label: "UD (Usaha Dagang)", value: "UD" },
    { label: "Koperasi", value: "Koperasi" },
    { label: "Lainnya", value: "Lainnya" },
  ];

  return (
    <div>
      <h3 className="my-6 text-sm font-semibold">Informasi Perusahaan</h3>{" "}
      {/* Corrected title */}
      <FormContainer>
        {/* Logo Perusahaan */}
        <FormLabel required>Logo Perusahaan</FormLabel>
        <ImageUploudWithModal />

        {/* Nama Perusahaan */}
        <FormLabel required>Nama Perusahaan</FormLabel>
        <Input
          type="text"
          placeholder="Masukkan Nama Perusahaan"
          value={namaPerusahaan}
          onChange={(e) => setNamaPerusahaan(e.target.value)}
          className="border-neutral-600 placeholder:text-neutral-600"
        />

        {/* Badan Usaha */}
        <FormLabel required>Badan Usaha</FormLabel>
        <Select
          options={badanUsahaOptions}
          value={badanUsaha}
          onChange={(val) => setBadanUsaha(val)}
          placeholder="Pilih Badan Usaha"
          className="border-neutral-600"
        />

        {/* No. Telepon Perusahaan */}
        <FormLabel required>No. Telepon Perusahaan</FormLabel>
        <Input
          type="text"
          placeholder="Contoh: 08xxxxxxxxxx"
          value={noTeleponPerusahaan}
          onChange={(e) => setNoTeleponPerusahaan(e.target.value)}
          className="border-neutral-600 placeholder:text-neutral-600"
        />
      </FormContainer>
    </div>
  );
}

export default InformasiPerusahaan;
