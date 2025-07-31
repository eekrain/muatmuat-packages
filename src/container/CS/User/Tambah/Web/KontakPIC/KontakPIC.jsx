"use client";

import { useState } from "react";

import { FormContainer, FormLabel } from "@/components/Form/Form";
import Input from "@/components/Form/Input";

function KontakPIC() {
  // PIC 1
  const [namaPIC1, setNamaPIC1] = useState("");
  const [jabatanPIC1, setJabatanPIC1] = useState("");
  const [noHPPIC1, setNoHPPIC1] = useState("");

  // PIC 2
  const [namaPIC2, setNamaPIC2] = useState("");
  const [jabatanPIC2, setJabatanPIC2] = useState("");
  const [noHPPIC2, setNoHPPIC2] = useState("");

  // PIC 3
  const [namaPIC3, setNamaPIC3] = useState("");
  const [jabatanPIC3, setJabatanPIC3] = useState("");
  const [noHPPIC3, setNoHPPIC3] = useState("");

  return (
    <div>
      <h3 className="mb-6 text-lg font-semibold">Kontak PIC</h3>
      <FormContainer>
        {/* PIC 1 */}
        <FormLabel required>Nama PIC 1</FormLabel>
        <Input
          type="text"
          placeholder="Nama PIC 1"
          value={namaPIC1}
          onChange={(e) => setNamaPIC1(e.target.value)}
        />

        <FormLabel required>Jabatan PIC 1</FormLabel>
        <Input
          type="text"
          placeholder="Jabatan PIC 1"
          value={jabatanPIC1}
          onChange={(e) => setJabatanPIC1(e.target.value)}
        />

        <FormLabel required>No. HP PIC 1</FormLabel>
        <Input
          type="text"
          placeholder="Contoh : 08xxxxxxxxxx"
          value={noHPPIC1}
          onChange={(e) => setNoHPPIC1(e.target.value)}
        />

        {/* PIC 2 */}
        <FormLabel>Nama PIC 2</FormLabel>
        <Input
          type="text"
          placeholder="Nama PIC 2"
          value={namaPIC2}
          onChange={(e) => setNamaPIC2(e.target.value)}
        />

        <FormLabel>Jabatan PIC 2</FormLabel>
        <Input
          type="text"
          placeholder="Jabatan PIC 2"
          value={jabatanPIC2}
          onChange={(e) => setJabatanPIC2(e.target.value)}
        />

        <FormLabel>No. HP PIC 2</FormLabel>
        <Input
          type="text"
          placeholder="Contoh : 08xxxxxxxxxx"
          value={noHPPIC2}
          onChange={(e) => setNoHPPIC2(e.target.value)}
        />

        {/* PIC 3 */}
        <FormLabel>Nama PIC 3</FormLabel>
        <Input
          type="text"
          placeholder="Nama PIC 3"
          value={namaPIC3}
          onChange={(e) => setNamaPIC3(e.target.value)}
        />

        <FormLabel>Jabatan PIC 3</FormLabel>
        <Input
          type="text"
          placeholder="Jabatan PIC 3"
          value={jabatanPIC3}
          onChange={(e) => setJabatanPIC3(e.target.value)}
        />

        <FormLabel>No. HP PIC 3</FormLabel>
        <Input
          type="text"
          placeholder="Contoh : 08xxxxxxxxxx"
          value={noHPPIC3}
          onChange={(e) => setNoHPPIC3(e.target.value)}
        />
      </FormContainer>
    </div>
  );
}

export default KontakPIC;
