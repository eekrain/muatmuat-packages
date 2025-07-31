"use client";

import { useState } from "react";

import { FormContainer, FormLabel } from "@/components/Form/Form";
import Input from "@/components/Form/Input";
import SelectFilterRadix from "@/components/Form/SelectFilterRadix";

function InformasiRekeningPerusahaan() {
  const [namaBank, setNamaBank] = useState("");
  const [nomorRekening, setNomorRekening] = useState("");
  const [namaPemilikRekening, setNamaPemilikRekening] = useState("");

  // Example options for bank selection
  const bankOptions = [
    { label: "Bank BCA", value: "bca" },
    { label: "Bank BNI", value: "bni" },
    { label: "Bank BRI", value: "bri" },
    { label: "Bank Mandiri", value: "mandiri" },
    // Add more bank options as needed
  ];

  return (
    <div>
      <h3 className="my-6 text-sm font-semibold">
        Informasi Rekening Perusahaan
      </h3>
      <FormContainer>
        {/* Nama Bank */}
        <FormLabel required>Nama Bank</FormLabel>
        <SelectFilterRadix
          options={bankOptions}
          value={namaBank}
          onChange={(value) => setNamaBank(value)}
          placeholder="Pilih Bank"
          searchable={true}
          className="w-full"
        />

        {/* Nomor Rekening */}
        <FormLabel required>Nomor Rekening</FormLabel>
        <Input
          type="text"
          placeholder="Masukkan Nomor Rekening"
          value={nomorRekening}
          onChange={(e) => setNomorRekening(e.target.value)}
        />

        {/* Nama Pemilik Rekening */}
        <FormLabel required>Nama Pemilik Rekening</FormLabel>
        <Input
          type="text"
          placeholder="Masukkan Nama Pemilik Rekening"
          value={namaPemilikRekening}
          onChange={(e) => setNamaPemilikRekening(e.target.value)}
        />
      </FormContainer>
    </div>
  );
}

export default InformasiRekeningPerusahaan;
