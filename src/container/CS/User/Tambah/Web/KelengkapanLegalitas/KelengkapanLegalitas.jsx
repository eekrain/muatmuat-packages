"use client";

import { useState } from "react";

import FileUploadDocument from "@/components/FileUpload/FileUploadDocument";
import FileUploadMultiple from "@/components/FileUpload/FileUploudMultiple";
import { FormContainer, FormLabel } from "@/components/Form/Form";
import Input from "@/components/Form/Input";

function KelengkapanLegalitas() {
  const [nib, setNib] = useState(null);
  const [noNib, setNoNib] = useState("");
  const [npwp, setNpwp] = useState(null);
  const [noNpwp, setNoNpwp] = useState("");
  const [ktp, setKtp] = useState(null);
  const [noKtp, setNoKtp] = useState("");
  const [aktaPendirian, setAktaPendirian] = useState(null);
  const [skKemenkumham, setSkKemenkumham] = useState(null);
  const [aktaPerubahan, setAktaPerubahan] = useState(null);
  const [skKemenkumhamPerubahan, setSkKemenkumhamPerubahan] = useState(null);
  const [sertifikatStandar, setSertifikatStandar] = useState(null);

  const handleFileError = (error) => {
    console.error("File upload error:", error);
    // Handle error - show toast notification etc.
  };

  return (
    <div>
      <h3 className="mb-6 text-lg font-semibold">Kelengkapan Legalitas</h3>
      <FormContainer>
        {/* NIB */}
        <FormLabel required>NIB</FormLabel>
        <FileUploadMultiple
          maxSize={5}
          acceptedFormats={[".jpg", ".png", ".pdf", ".zip"]}
          onSuccess={setNib}
          onError={handleFileError}
          value={nib}
          label="Upload"
          className="mb-2"
        />
        <FormLabel required>Nomor NIB</FormLabel>
        <Input
          type="text"
          placeholder="13 Digit No. NIB"
          value={noNib}
          onChange={(e) => setNoNib(e.target.value)}
        />

        {/* NPWP */}
        <FormLabel required>NPWP Perusahaan</FormLabel>
        <FileUploadMultiple
          maxSize={5}
          acceptedFormats={[".jpg", ".png", ".pdf", ".zip"]}
          onSuccess={setNpwp}
          onError={handleFileError}
          value={npwp}
          label="Upload"
          className="mb-2"
        />
        <FormLabel required>Nomor NPWP Perusahaan</FormLabel>
        <Input
          type="text"
          placeholder="Min. 15 Digit No. NPWP"
          value={noNpwp}
          onChange={(e) => setNoNpwp(e.target.value)}
        />

        {/* KTP */}
        <FormLabel required>KTP Pendaftar/Pemegang Akun</FormLabel>
        <FileUploadMultiple
          maxSize={5}
          acceptedFormats={[".jpg", ".png", ".pdf", ".zip"]}
          onSuccess={setKtp}
          onError={handleFileError}
          value={ktp}
          label="Upload"
          className="mb-2"
        />

        <FormLabel required>Nomor KTP Pendaftar</FormLabel>
        <Input
          type="text"
          placeholder="16 Digit No. KTP Pendaftar"
          value={noKtp}
          onChange={(e) => setNoKtp(e.target.value)}
        />

        {/* Cover Akta Pendirian */}
        <FormLabel required>Cover Akta Pendirian</FormLabel>
        <FileUploadMultiple
          maxSize={5}
          acceptedFormats={[".jpg", ".png", ".pdf", ".zip"]}
          onSuccess={setAktaPendirian}
          onError={handleFileError}
          value={aktaPendirian}
          label="Upload"
        />

        {/* SK Kemenkumham dan Akta Pendirian */}
        <FormLabel required>SK Kemenkumham dan Akta Pendirian</FormLabel>
        <FileUploadMultiple
          maxSize={5}
          acceptedFormats={[".jpg", ".png", ".pdf", ".zip"]}
          onSuccess={setSkKemenkumham}
          onError={handleFileError}
          value={skKemenkumham}
          label="Upload"
        />

        {/* Cover Akta Perubahan (bila ada) */}
        <FormLabel>Cover Akta Perubahan (bila ada)</FormLabel>
        <FileUploadMultiple
          maxSize={5}
          acceptedFormats={[".jpg", ".png", ".pdf", ".zip"]}
          onSuccess={setAktaPerubahan}
          onError={handleFileError}
          value={aktaPerubahan}
          label="Upload"
        />

        {/* SK Kemenkumham dan Akta Perubahan (bila ada) */}
        <FormLabel>SK Kemenkumham dan Akta Perubahan (bila ada)</FormLabel>
        <FileUploadMultiple
          maxSize={5}
          acceptedFormats={[".jpg", ".png", ".pdf", ".zip"]}
          onSuccess={setSkKemenkumhamPerubahan}
          onError={handleFileError}
          value={skKemenkumhamPerubahan}
          label="Upload"
        />

        {/* Sertifikat Standar (bila ada) */}
        <FormLabel>Sertifikat Standar (bila ada)</FormLabel>
        <FileUploadMultiple
          maxSize={5}
          acceptedFormats={[".jpg", ".png", ".pdf", ".zip"]}
          onSuccess={setSertifikatStandar}
          onError={handleFileError}
          value={sertifikatStandar}
          label="Upload"
        />
      </FormContainer>
    </div>
  );
}

export default KelengkapanLegalitas;
