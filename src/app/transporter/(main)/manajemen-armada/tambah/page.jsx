"use client";

import { useState } from "react";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Button from "@/components/Button/Button";
import Card, { CardContent, CardHeader } from "@/components/Card/Card";
import DatePicker from "@/components/DatePicker/DatePicker";
import FileUpload from "@/components/FileUpload/FileUpload";
import DimensionInput from "@/components/Form/DimensionInput";
import Input from "@/components/Form/Input";
import { Select } from "@/components/Form/Select";
import ImageUploaderWeb from "@/components/ImageUploader/ImageUploaderWeb";
import PageTitle from "@/components/PageTitle/PageTitle";
import {
  useGetBrandsVehicles,
  useGetDataJenisTruk,
  useGetDataTypeCarrier,
  useGetVehiclesTypes,
} from "@/services/Transporter/manajemen-armada/getDataFormArmada";

const BREADCRUMB = [
  { name: "Manajemen Armada", href: "/manajemen-armada" },
  { name: "Tambah Armada" },
];

const inputAppearance = {
  containerClassName: "rounded-[7px] bg-white",
};

const selectClass =
  "w-[328px] rounded-[7px] px-4 disabled:bg-gray-200 disabled:text-gray-700 disabled:border-gray-700";
const labelClass = "w-[220px] text-sm text-[#7B7B7B] flex items-center";
const labelClassOptional =
  "w-[220px] font-medium italic text-neutral-500 text-right flex items-center";

const Page = () => {
  const [formData, setFormData] = useState({
    plat: "",
    jenisTruk: "",
    jenisCarrier: "",
    merekKendaraan: "",
    tipeKendaraan: "",
    tahunRegistrasi: "",
    nomorRangka: "",
    tanggalStnk: null,
    satuanTanggal: "m",
    dimension: { p: "", l: "", t: "" },
    tanggalPasangMulai: null,
    tanggalPasangSelesai: null,
    // tambahkan field lain jika perlu
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDimensionChange = (dim) => {
    setFormData((prev) => ({ ...prev, dimension: dim }));
  };

  // Handler plat (auto-format)
  const handlePlatChange = (e) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    let depan = value.slice(0, 2).replace(/[^A-Z]/g, "");
    let sisa = value.slice(depan.length);
    let tengah = "";
    let belakang = "";
    for (let i = 0; i < sisa.length; i++) {
      if (tengah.length < 4 && /[0-9]/.test(sisa[i])) {
        tengah += sisa[i];
      } else if (tengah.length < 1 && /[A-Z]/.test(sisa[i])) {
        break;
      } else if (tengah.length >= 1 && /[A-Z]/.test(sisa[i])) {
        belakang += sisa[i];
        if (belakang.length === 3) break;
      }
    }
    let formatted = depan;
    if (tengah) formatted += ` ${tengah}`;
    if (belakang) formatted += ` ${belakang}`;
    handleChange("plat", formatted.trim());
  };

  // Handler nomor rangka
  const handleNomorRangkaChange = (e) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    handleChange("nomorRangka", value.slice(0, 17));
  };

  const { data: truckTypes, isLoading: isLoadingTruckTypes } =
    useGetDataJenisTruk();
  const { data: carrierTypes, isLoading: isLoadingCarrier } =
    useGetDataTypeCarrier();
  const { data: brands, isLoading: isLoadingBrands } = useGetBrandsVehicles();
  const { data: vehicleTypes, isLoading: isLoadingTypes } =
    useGetVehiclesTypes();
  const filteredTypes = vehicleTypes.filter(
    (item) => item.vehicleBrandId === formData.merekKendaraan
  );

  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear; y >= 2000; y--) {
    years.push({ label: y.toString(), value: y.toString() });
  }
  return (
    <div className="mx-auto max-w-[818px] p-4">
      <BreadCrumb data={BREADCRUMB} />
      <PageTitle>Tambah Armada</PageTitle>

      {/* Informasi Armada */}
      <Card className="mb-6 !border-none">
        <CardHeader className="!border-b-0 pb-4 text-xl font-semibold">
          Informasi Armada
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-[220px_400px] gap-x-6 gap-y-5">
            <div className={labelClass}>No. Polisi Kendaraan*</div>
            <Input
              placeholder="Contoh : L 1234 TY"
              value={formData.plat}
              onChange={handlePlatChange}
              appearance={inputAppearance}
              className="w-[328px]"
            />

            <div className={labelClass}>Jenis Truk*</div>
            <Select
              options={
                isLoadingTruckTypes
                  ? []
                  : truckTypes.map((item) => ({
                      label: item.name,
                      value: item.id,
                    }))
              }
              value={formData.jenisTruk}
              onChange={(val) => {
                handleChange("jenisTruk", val);
                handleChange("jenisCarrier", "");
              }}
              placeholder="Pilih Jenis Truk"
              className={selectClass}
            />

            <div className={labelClass}>Jenis Carrier*</div>
            <Select
              options={
                formData.jenisTruk && !isLoadingCarrier
                  ? carrierTypes
                      .filter((item) => item.truckTypeId === formData.jenisTruk)
                      .map((item) => ({ label: item.name, value: item.id }))
                  : []
              }
              value={formData.jenisCarrier}
              onChange={(val) => handleChange("jenisCarrier", val)}
              placeholder="Pilih Jenis Carrier"
              className={selectClass}
              disabled={!formData.jenisTruk || isLoadingCarrier}
            />

            <div className={labelClass}>Merek Kendaraan*</div>
            <Select
              options={brands.map((item) => ({
                label: item.name,
                value: item.id,
              }))}
              value={formData.merekKendaraan}
              onChange={(val) => {
                handleChange("merekKendaraan", val);
                handleChange("tipeKendaraan", "");
              }}
              placeholder="Pilih Merek Kendaraan"
              className={selectClass}
              disabled={isLoadingBrands}
            />

            <div className={labelClass}>Tipe Kendaraan*</div>
            <Select
              options={
                formData.merekKendaraan && !isLoadingTypes
                  ? filteredTypes.map((item) => ({
                      label: item.name,
                      value: item.id,
                    }))
                  : []
              }
              value={formData.tipeKendaraan}
              onChange={(val) => handleChange("tipeKendaraan", val)}
              placeholder="Pilih Tipe Kendaraan"
              className={selectClass}
              disabled={!formData.merekKendaraan || isLoadingTypes}
            />

            <div className={labelClass}>Tahun Registrasi Kendaraan*</div>
            <Select
              options={years}
              value={formData.tahunRegistrasi}
              onChange={(val) => handleChange("tahunRegistrasi", val)}
              placeholder="Pilih Tahun"
              className={
                selectClass +
                (formData.tahunRegistrasi ? " text-neutral-900" : "")
              }
            />

            <div className={labelClass}>Dimensi Carrier (Optional)</div>
            <div className="flex w-[328px] gap-2">
              <DimensionInput
                value={formData.dimension}
                onChange={handleDimensionChange}
              />
              <Select
                options={[
                  { label: "m", value: "m" },
                  { label: "cm", value: "cm" },
                ]}
                value={formData.satuanTanggal}
                onChange={(val) => handleChange("satuanTanggal", val)}
                placeholder="m"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Foto Armada */}
      <Card className="mb-6 !border-none">
        <CardHeader className="!border-b-0 pb-0 text-xl font-semibold">
          Foto Armada
          <div className="mt-2 flex items-center gap-1 text-sm">
            <span className="font-normal">Lihat contoh foto armada</span>
            <a href="#" className="font-medium text-blue-600 hover:underline">
              di sini
            </a>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <div className="mt-2 grid grid-cols-[180px_1fr] items-start gap-x-3 gap-y-2">
              <div>
                <div className="mb-1 text-sm font-normal text-neutral-500">
                  Foto Armada*
                </div>
                <div className="text-xs text-neutral-500">
                  Pastikan plat kendaraan terlihat jelas.
                </div>
              </div>
              <div className="flex gap-4">
                <ImageUploaderWeb
                  uploadText={"Tampak Depan"}
                  className="h-[120px] w-[120px]"
                />
                <ImageUploaderWeb
                  uploadText={"Tampak Belakang"}
                  className="h-[120px] w-[120px]"
                />
                <ImageUploaderWeb
                  uploadText={"Tampak Kanan"}
                  className="h-[120px] w-[120px]"
                />
                <ImageUploaderWeb
                  uploadText={"Tampak Kiri"}
                  className="h-[120px] w-[120px]"
                />
              </div>
            </div>
            <div className="ms-44 mt-2 text-center text-xs text-neutral-500">
              Unggah 1 gambar pada masing-masing tipe dengan format
              .jpg/.jpeg/.png, besar file maks. 10MB
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dokumen Armada */}
      <Card className="mb-6 !border-none">
        <CardHeader className="!border-b-0 pb-4 text-xl font-semibold">
          Dokumen Armada
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-[220px_328px] gap-x-6 gap-y-5">
            <div className={labelClass}>Nomor Rangka*</div>
            <Input
              placeholder="Nomor Rangka Maksimal 17 Digit"
              value={formData.nomorRangka}
              onChange={handleNomorRangkaChange}
              appearance={inputAppearance}
              className="w-[328px]"
            />

            <div className={labelClass}>Masa Berlaku STNK*</div>
            <div className="flex w-[328px] items-center gap-2">
              <DatePicker
                value={formData.tanggalStnk}
                onChange={(val) => handleChange("tanggalStnk", val)}
                placeholder="Pilih Tanggal Masa Berlaku STNK"
                className="w-[328px]"
              />
            </div>

            <div className={labelClass}>Foto STNK*</div>
            <div className="w-[500px]">
              <FileUpload />
            </div>

            <div className={labelClass}>Foto Pajak Kendaraan*</div>
            <div className="w-[328px]">
              <FileUpload />
            </div>

            <div className={labelClass}>KIR Kendaraan*</div>
            <Input
              placeholder="Contoh : SBY 123456"
              appearance={inputAppearance}
              className="w-[328px]"
            />

            <div className={labelClass}>Masa Berlaku KIR*</div>
            <div className="w-[328px]">
              <DatePicker
                value={formData.tanggalKir}
                onChange={(val) => handleChange("tanggalKir", val)}
                placeholder="Pilih Tanggal Masa Berlaku KIR"
              />
            </div>

            <div className={labelClass}>Foto Buku KIR*</div>
            <div className="w-[328px]">
              <FileUpload />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informasi Pemasangan GPS */}
      <Card className="mb-6 !border-none">
        <CardHeader className="!border-b-0 pb-4 text-xl font-semibold">
          Informasi Pemasangan GPS
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-[220px_400px] items-center gap-x-6 gap-y-5">
            <div className={labelClass}>Estimasi Tanggal Pemasangan GPS*</div>
            <div className="flex w-[460px] items-center gap-2">
              <DatePicker
                value={formData.tanggalPasangMulai}
                onChange={(val) => handleChange("tanggalPasangMulai", val)}
                placeholder="Tanggal Mulai"
              />
              <span className="mx-2">s/d</span>
              <DatePicker
                value={formData.tanggalPasangSelesai}
                onChange={(val) => handleChange("tanggalPasangSelesai", val)}
                placeholder="Tanggal Selesai"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="ml-auto mt-8 flex w-[620px] justify-end gap-4">
        <Button
          variant="muattrans-primary-secondary"
          className="h-[44px] w-[120px] text-base"
        >
          Batal
        </Button>
        <Button
          variant="muattrans-primary"
          className="h-[44px] w-[120px] text-base"
        >
          Simpan
        </Button>
      </div>
    </div>
  );
};

export default Page;
