// pages/shipping/form/page.tsx
"use client";

import { useState } from "react";

import Checkbox from "@/components/Checkbox/Checkbox";
import IconComponent from "@/components/IconComponent/IconComponent";
import Input from "@/components/Input/Input";

// pages/shipping/form/page.tsx

// pages/shipping/form/page.tsx

// pages/shipping/form/page.tsx

// pages/shipping/form/page.tsx

// pages/shipping/form/page.tsx

// pages/shipping/form/page.tsx

// pages/shipping/form/page.tsx

// pages/shipping/form/page.tsx

// pages/shipping/form/page.tsx

// pages/shipping/form/page.tsx

// pages/shipping/form/page.tsx

// pages/shipping/form/page.tsx

// pages/shipping/form/page.tsx

// pages/shipping/form/page.tsx

const ShippingFormPage = () => {
  const [formData, setFormData] = useState({
    bukti_fisik: true,
    nama_penerima: "Sani",
    nomor_hp: "0881212213",
    alamat_tujuan:
      "Kedungsari no. 50, Kec Tegalsari, Kota Surabaya, Jawa Timur 60261",
    detail_alamat: "",
    kecamatan: "Tegalsari",
    kode_pos: "60261",
  });

  const [detailAlamatCount, setDetailAlamatCount] = useState(0);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "detail_alamat") {
      setDetailAlamatCount(value.length);
    }
  };

  const handleCheckboxChange = (data) => {
    setFormData((prev) => ({
      ...prev,
      bukti_fisik: data.checked,
    }));
  };

  return (
    <div
      className="h-screen w-full bg-neutral-200"
      style={{ top: "96px", height: "853px" }}
    >
      {/* Main Form Container */}
      <div className="flex w-full flex-col items-start gap-2 p-0">
        {/* Form Section */}
        <div
          className="flex w-full flex-col items-start gap-6 rounded-none bg-white p-5 px-4"
          style={{ height: "785px" }}
        >
          {/* Header Section with Checkbox */}
          <div className="flex w-full flex-col items-start justify-center gap-2 p-0">
            <div className="flex w-full flex-row items-center gap-1 p-0">
              {/* Checkbox Section */}
              <div className="flex flex-grow flex-row items-center gap-2 p-0">
                <Checkbox
                  checked={formData.bukti_fisik}
                  onChange={handleCheckboxChange}
                  label="Kirim Bukti Fisik Penerimaan Barang"
                  className="w-full"
                />
              </div>

              {/* Info Icon */}
              <div className="w-4">
                <IconComponent
                  src="/icons/info.svg"
                  width={16}
                  height={16}
                  className="text-neutral-700"
                />
              </div>
            </div>

            {/* Price Info */}
            <div className="flex h-2 w-12 flex-row items-center justify-center gap-2 p-0 pl-6">
              <span className="text-sm font-medium leading-4 text-neutral-600">
                Rp
              </span>
            </div>
          </div>

          {/* Form Fields Container */}
          <div
            className="flex w-full flex-col items-start gap-6 p-0"
            style={{ height: "687px" }}
          >
            {/* Nama Penerima Field */}
            <div className="flex w-full flex-col items-end gap-4 p-0">
              <span className="flex h-2 w-full items-center text-sm font-semibold leading-4 text-neutral-900">
                Nama Penerima*
              </span>
              <Input
                name="nama_penerima"
                // value={formData.nama_penerima}
                placeholder="Nama Penerima"
                // onCahnge={(e) =>
                //   handleInputChange("nama_penerima", e.target.value)
                // }
                icon={{ right: "/icons/list-users.svg" }}
                className="w-full"
              />
            </div>

            {/* Nomor Handphone Field */}
            <div className="flex w-full flex-col items-end gap-4 p-0">
              <span className="flex h-2 w-full items-center text-sm font-semibold leading-4 text-neutral-900">
                Nomor Handphone Penerima*
              </span>
              <Input
                name="nomor_hp"
                // value={formData.nomor_hp}
                placeholder="Nomor Handphone"
                // onCahnge={(e) => handleInputChange("nomor_hp", e.target.value)}
                className="w-full"
              />
            </div>

            {/* Alamat Tujuan Field */}
            <div className="flex w-full flex-col items-end gap-4 p-0">
              <span className="flex h-2 w-full items-center text-sm font-semibold leading-4 text-neutral-900">
                Alamat Tujuan*
              </span>
              <div className="flex h-12 w-full flex-col items-start gap-3 p-0">
                <Input
                  name="alamat_tujuan"
                  //   value={formData.alamat_tujuan}
                  placeholder="Alamat Tujuan"
                  //   onCahnge={(e) =>
                  //     handleInputChange("alamat_tujuan", e.target.value)
                  //   }
                  className="w-full"
                />
              </div>
            </div>

            {/* Detail Alamat Tujuan Field */}
            <div className="flex h-20 w-full flex-col items-end gap-4 p-0">
              <span className="flex h-2 w-full items-center text-sm font-semibold leading-4 text-neutral-900">
                Detail Alamat Tujuan*
              </span>
              <div className="flex w-full flex-col items-start gap-3 p-0">
                <Input
                  name="detail_alamat"
                  //   value={formData.detail_alamat}
                  placeholder="Masukkan Detail Alamat Tujuan"
                  //   onCahnge={(e) =>
                  //     handleInputChange("detail_alamat", e.target.value)
                  //   }
                  className="w-full"
                />
                <div className="flex h-2 w-full flex-row items-start gap-6 p-0">
                  <span className="flex-grow text-xs font-medium leading-3 text-neutral-600 opacity-0">
                    notes
                  </span>
                  <span className="text-right text-xs font-medium leading-3 text-neutral-600">
                    {detailAlamatCount}/500
                  </span>
                </div>
              </div>
            </div>

            {/* Kecamatan Field */}
            <div className="flex w-full flex-col items-end gap-4 p-0">
              <span className="flex h-2 w-full items-center text-sm font-semibold leading-4 text-neutral-900">
                Kecamatan*
              </span>
              <Input
                name="kecamatan"
                // value={formData.kecamatan}
                placeholder="Kecamatan"
                // onCahnge={(e) => handleInputChange("kecamatan", e.target.value)}
                icon={{ left: "/icons/location.svg" }}
                className="w-full"
              />
            </div>

            {/* Kabupaten/Kota Display */}
            <div className="flex w-full flex-col items-end gap-4 p-0">
              <span className="flex h-2 w-full items-center text-sm font-semibold leading-4 text-neutral-900">
                Kabupaten/Kota
              </span>
              <span className="flex h-2 w-full items-center text-xs font-semibold leading-3 text-neutral-900">
                Kota Surabaya
              </span>
            </div>

            {/* Provinsi Display */}
            <div className="flex w-full flex-col items-end gap-4 p-0">
              <span className="flex h-2 w-full items-center text-sm font-semibold leading-4 text-neutral-900">
                Provinsi
              </span>
              <span className="flex h-2 w-full items-center text-xs font-semibold leading-3 text-neutral-900">
                Jawa Timur
              </span>
            </div>

            {/* Kode Pos Field */}
            <div className="flex w-full flex-col items-end gap-4 p-0">
              <span className="flex h-2 w-full items-center text-sm font-semibold leading-4 text-neutral-900">
                Kode Pos*
              </span>
              <Input
                name="kode_pos"
                // value={formData.kode_pos}
                placeholder="Kode Pos"
                // onCahnge={(e) => handleInputChange("kode_pos", e.target.value)}
                icon={{ right: "/icons/chevron-down.svg" }}
                className="w-full"
              />
            </div>

            {/* Pilih Opsi Pengiriman Button */}
            <div className="flex h-11 w-full flex-row items-center justify-between gap-3 rounded-md bg-primary-50 p-2 px-4">
              <div className="m-auto flex h-7 w-44 flex-row items-center gap-3 p-0">
                <div className="flex h-7 w-7 flex-row items-center justify-center gap-2 rounded-full bg-white p-1.5">
                  <IconComponent
                    src="/icons/truck.svg"
                    width={16}
                    height={16}
                    className="text-neutral-700"
                  />
                </div>
                <span className="text-sm font-semibold leading-4 text-primary-700">
                  Pilih Opsi Pengiriman
                </span>
              </div>
              <IconComponent
                src="/icons/chevron-right.svg"
                width={24}
                height={24}
                className="m-auto text-neutral-700"
              />
            </div>
          </div>
        </div>

        {/* Layanan Tambahan Section */}
        <div className="h-15 flex w-full flex-col items-start gap-6 rounded-none bg-white p-5 px-4">
          <div className="flex h-5 w-full flex-row items-center justify-between gap-4 p-0">
            <span className="m-auto flex items-center text-sm font-bold leading-4 text-neutral-900">
              Layanan Tambahan Lainnya
            </span>
            <IconComponent
              src="/icons/chevron-down.svg"
              width={20}
              height={20}
              className="m-auto text-neutral-700"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingFormPage;
