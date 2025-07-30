"use client";

import { useState } from "react";

import Button from "@/components/Button/Button";
import { FormContainer, FormLabel } from "@/components/Form/Form";
import Input from "@/components/Form/Input";
import { Select } from "@/components/Form/Select";
// Ensure this import path is correct
import IconComponent from "@/components/IconComponent/IconComponent";

function InformasiPerusahaan() {
  // State for each field
  const [logoPerusahaan, setLogoPerusahaan] = useState(null); // For file upload
  const [namaPerusahaan, setNamaPerusahaan] = useState("");
  // Initialize badanUsaha to an empty string so the placeholder is shown initially
  const [badanUsaha, setBadanUsaha] = useState("");
  const [noTeleponPerusahaan, setNoTeleponPerusahaan] = useState("");

  // Function to handle file upload
  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // You might want to add validation here for file type and size
      setLogoPerusahaan(file);
      console.log("File selected:", file.name);
    }
  };

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
        <div className="mb-4 flex items-center space-x-4">
          <div className="flex h-[76px] w-[76px] cursor-pointer items-center justify-center overflow-hidden rounded-full border border-gray-500 bg-neutral-200">
            {logoPerusahaan ? (
              <img
                src={URL.createObjectURL(logoPerusahaan)}
                alt="Company Logo Preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <label htmlFor="logo-upload" className="cursor-pointer">
                {" "}
                {/* Wrap IconComponent with a label for clickability */}
                <IconComponent
                  src="/icons/photo.svg"
                  width={18}
                  height={18}
                  className="text-neutral-700"
                />
              </label>
            )}
            <input
              type="file"
              accept=".jpg,.png"
              onChange={handleLogoUpload}
              className="hidden"
              id="logo-upload"
            />
          </div>
          <Button
            type="button"
            onClick={() => document.getElementById("logo-upload").click()}
          >
            Upload Logo
          </Button>
          <span className="text-sm text-neutral-500">
            Format file jpg/png max. 10MB
          </span>
        </div>

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
