"use client";

import { useState } from "react";

import { FormContainer, FormLabel } from "@/components/Form/Form";
import Input from "@/components/Form/Input";

function InformasiPendaftar() {
  const [namaLengkapPendaftar, setNamaLengkapPendaftar] = useState("");
  const [jabatanPendaftar, setJabatanPendaftar] = useState("");
  const [noWhatsappPendaftar, setNoWhatsappPendaftar] = useState("");
  const [emailPendaftar, setEmailPendaftar] = useState("");

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
