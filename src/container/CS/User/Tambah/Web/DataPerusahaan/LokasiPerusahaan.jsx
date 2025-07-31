"use client";

import { useState } from "react";

import Button from "@/components/Button/Button";
import { FormContainer, FormLabel } from "@/components/Form/Form";
import Input from "@/components/Form/Input";
import SelectFilterRadix from "@/components/Form/SelectFilterRadix";
import { MyTextArea } from "@/components/Form/TextArea";
import { MapContainer } from "@/components/MapContainer/MapContainer";

function LokasiPerusahaan() {
  const [alamat, setAlamat] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [kecamatan, setKecamatan] = useState("");
  const [kota, setKota] = useState("");
  const [provinsi, setProvinsi] = useState("");
  const [kodePos, setKodePos] = useState("");
  const [coordinates, setCoordinates] = useState({
    latitude: -7.2575,
    longitude: 112.7521,
  });

  // Example options for dropdowns
  const kecamatanOptions = [
    { label: "Gubeng", value: "gubeng" },
    { label: "Tambaksari", value: "tambaksari" },
    // Add more options as needed
  ];

  const kodePosOptions = [
    { label: "60282", value: "60282" },
    { label: "60283", value: "60283" },
    // Add more options as needed
  ];

  return (
    <div className="flex flex-col">
      <h3 className="my-6 text-sm font-semibold">Informasi Lokasi</h3>
      <FormContainer>
        {/* Alamat */}
        <FormLabel required>Alamat</FormLabel>
        <MyTextArea
          placeholder="Contoh : Nama Jalan (bila tidak diemukan), Gedung, No. Rumah/Patokan, Blok/Unit"
          maxLength={225}
          hasCharCount
          appearance={{
            inputClassName: "h-[80px]",
          }}
          withCharCount={true}
          value={alamat}
          onChange={(e) => setAlamat(e.target.value)}
        />

        {/* Lokasi */}
        <FormLabel required>Lokasi</FormLabel>
        <Input
          type="text"
          placeholder="Masukkan Lokasi Perusahaan"
          value={lokasi}
          onChange={(e) => setLokasi(e.target.value)}
        />

        {/* Kecamatan */}
        <FormLabel required>Kecamatan</FormLabel>
        <SelectFilterRadix
          options={kecamatanOptions}
          value={kecamatan}
          onChange={(value) => setKecamatan(value)}
          placeholder="Pilih Kecamatan"
          searchable={true}
          className="w-full"
        />

        {/* Kota and Provinsi are disabled as they depend on Kecamatan */}
        <FormLabel required>Kota</FormLabel>
        <p className="text-xs font-bold">-</p>

        <FormLabel required>Provinsi</FormLabel>
        <p className="text-xs font-bold">-</p>

        {/* Kode Pos */}
        <FormLabel required>Kode Pos</FormLabel>
        <SelectFilterRadix
          options={kodePosOptions}
          value={kodePos}
          onChange={(value) => setKodePos(value)}
          placeholder="Pilih Kode Pos"
          searchable={true}
          className="w-full"
        />

        {/* Titik Lokasi Map */}
        <FormLabel required>Titik Lokasi</FormLabel>
        <div className="h-[200px] w-full overflow-hidden rounded-lg">
          <MapContainer
            coordinates={coordinates}
            onPositionChange={setCoordinates}
            className="h-full w-full"
          />
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
  );
}

export default LokasiPerusahaan;
