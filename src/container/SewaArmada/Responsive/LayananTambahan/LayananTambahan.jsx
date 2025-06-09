import { useState } from "react";

import Button from "@/components/Button/Button";
import Checkbox from "@/components/Checkbox/Checkbox";
import { ResponsiveFooter } from "@/components/Footer/ResponsiveFooter";
import IconComponent from "@/components/IconComponent/IconComponent";
import Input from "@/components/Input/Input";
import FormResponsiveLayout from "@/layout/ResponsiveLayout/FormResponsiveLayout";

const LayananTambahan = () => {
  // State untuk form fields
  const [formData, setFormData] = useState({
    namaPenerima: "",
    nomorHandphone: "",
    alamatTujuan: "",
    detailAlamat: "",
    kecamatan: "",
    kodePos: "",
  });

  // State untuk checkboxes
  const [kirimBuktiFisik, setKirimBuktiFisik] = useState(false);
  const [bantuanTambahan, setBantuanTambahan] = useState(false);
  const [troli, setTroli] = useState(false);

  // Handler untuk form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <FormResponsiveLayout
      title={{
        label: "Layanan Tambahan",
      }}
    >
      <div className="bg-neutral-200">
        {/* Form Container Utama */}
        <div className="flex h-[770px] flex-col items-start gap-6 rounded-none bg-white p-5 px-4">
          {/* Section 1: Checkbox Kirim Bukti Fisik */}
          <div className="flex h-[34px] w-[328px] flex-col items-start justify-center gap-2">
            <div className="flex h-4 w-[328px] flex-row items-center gap-1">
              <div className="flex h-4 w-[259px] flex-row items-center gap-2">
                <Checkbox
                  label="Kirim Bukti Fisik Penerimaan Barang"
                  checked={kirimBuktiFisik}
                  onChange={setKirimBuktiFisik}
                />
              </div>
              <div className="flex h-[10px] w-[46px] flex-row items-center justify-center gap-2.5 pl-6">
                <IconComponent
                  src="/icons/info.svg"
                  width={16}
                  height={16}
                  className="bg-neutral-700"
                />
                <span className="text-[14px] font-medium leading-[15.4px] text-neutral-600">
                  Rp-
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Form Fields */}
          <div className="flex h-[672px] w-[328px] flex-col items-start gap-6">
            {/* Nama Penerima Field */}
            <div className="flex h-[58px] w-[328px] flex-col items-end gap-4">
              <span className="flex h-[10px] w-[328px] items-center text-[14px] font-semibold leading-[15.4px] text-black">
                Nama Penerima*
              </span>
              <Input
                placeholder="Masukkan Nama Penerima"
                icon={{ right: "/icons/ic-actions-list-users.svg" }}
                name="namaPenerima"
                type="text"
                value={formData.namaPenerima}
                onChange={handleInputChange}
              />
            </div>

            {/* Nomor Handphone Penerima Field */}
            <div className="flex h-[58px] w-[328px] flex-col items-end gap-4">
              <span className="flex h-[10px] w-[328px] items-center text-[14px] font-semibold leading-[15.4px] text-black">
                Nomor Handphone Penerima*
              </span>
              <Input
                placeholder="Contoh: 08xxxxxxxx"
                name="nomorHandphone"
                type="text"
                value={formData.nomorHandphone}
                onChange={handleInputChange}
              />
            </div>

            {/* Alamat Tujuan Field */}
            <div className="flex h-[58px] w-[328px] flex-col items-end gap-4">
              <span className="flex h-[10px] w-[328px] items-center text-[14px] font-semibold leading-[15.4px] text-black">
                Alamat Tujuan*
              </span>
              <Input
                placeholder="Masukkan Alamat Tujuan"
                name="alamatTujuan"
                type="text"
                value={formData.alamatTujuan}
                onChange={handleInputChange}
              />
            </div>

            {/* Detail Alamat Tujuan Field */}
            <div className="flex h-[78px] w-[328px] flex-col items-end gap-4">
              <span className="flex h-[10px] w-[328px] items-center text-[14px] font-semibold leading-[15.4px] text-black">
                Detail Alamat Tujuan*
              </span>
              <Input
                placeholder="Masukkan Detail Alamat Tujuan"
                name="detailAlamat"
                type="text"
                supportiveText={{ desc: `${formData.detailAlamat.length}/500` }}
                value={formData.detailAlamat}
                onChange={handleInputChange}
              />
            </div>

            {/* Kecamatan Field */}
            <div className="flex h-[58px] w-[328px] flex-col items-end gap-4">
              <span className="flex h-[10px] w-[328px] items-center text-[14px] font-semibold leading-[15.4px] text-black">
                Kecamatan*
              </span>
              <Input
                placeholder="Pilih Kecamatan Tujuan"
                icon={{ left: "/icons/ic-sport-winner.svg" }}
                name="kecamatan"
                type="text"
                value={formData.kecamatan}
                onChange={handleInputChange}
              />
            </div>

            {/* Kabupaten/Kota Display */}
            <div className="flex h-[34px] w-[328px] flex-col items-end gap-4">
              <span className="flex h-[10px] w-[328px] items-center text-[14px] font-semibold leading-[15.4px] text-black">
                Kabupaten/Kota
              </span>
              <span className="flex h-2 w-[328px] items-center text-[12px] font-semibold leading-[13.2px] text-black">
                -
              </span>
            </div>

            {/* Provinsi Display */}
            <div className="flex h-[34px] w-[328px] flex-col items-end gap-4">
              <span className="flex h-[10px] w-[328px] items-center text-[14px] font-semibold leading-[15.4px] text-black">
                Provinsi
              </span>
              <span className="flex h-2 w-[328px] items-center text-[12px] font-semibold leading-[13.2px] text-black">
                -
              </span>
            </div>

            {/* Kode Pos Field */}
            <div className="flex h-[58px] w-[328px] flex-col items-end gap-4">
              <span className="flex h-[10px] w-[328px] items-center text-[14px] font-semibold leading-[15.4px] text-black">
                Kode Pos*
              </span>
              <Input
                placeholder="Pilih Kode Pos"
                icon={{ right: "/icons/arrow-down.svg" }}
                name="kodePos"
                type="text"
                value={formData.kodePos}
                onChange={handleInputChange}
              />
            </div>

            {/* Section 3: Pilih Opsi Pengiriman */}
            <div className="flex h-11 w-[328px] cursor-pointer flex-row items-center justify-between gap-3 rounded-md bg-neutral-200 p-2 px-4 transition-colors hover:bg-neutral-300">
              <div className="mx-auto flex h-7 w-[179px] flex-row items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white p-1.5">
                  <IconComponent
                    src="/icons/truck.svg"
                    width={16}
                    height={16}
                    className="bg-neutral-700"
                  />
                </div>
                <span className="text-[14px] font-semibold leading-[15.4px] text-neutral-700">
                  Pilih Opsi Pengiriman
                </span>
              </div>
              <IconComponent
                src="/icons/arrow-right.svg"
                width={24}
                height={24}
                className="mx-auto bg-neutral-700"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Layanan Tambahan Lainnya */}
        <div className="flex h-[168px] w-[360px] flex-col items-start gap-6 rounded-none bg-white p-5 px-4">
          {/* Section Header */}
          <div className="flex h-5 w-[328px] flex-row items-center justify-between gap-4">
            <span className="mx-auto flex w-[186px] items-center text-[14px] font-bold leading-[15.4px] text-black">
              Layanan Tambahan Lainnya
            </span>
            <IconComponent
              src="/icons/arrow-up.svg"
              width={20}
              height={20}
              className="mx-auto rotate-180 bg-neutral-700"
            />
          </div>

          {/* Services List Container */}
          <div className="flex h-[84px] w-[328px] flex-col items-start gap-4">
            {/* Bantuan Tambahan Checkbox */}
            <div className="flex h-[34px] w-[328px] flex-col items-start justify-center gap-2">
              <div className="flex h-4 w-[328px] flex-row items-center gap-1">
                <div className="flex h-4 w-[149px] flex-row items-center gap-2">
                  <Checkbox
                    label="Bantuan Tambahan"
                    checked={bantuanTambahan}
                    onChange={setBantuanTambahan}
                  />
                </div>
                <div className="flex h-[10px] w-[96px] flex-row items-center justify-center gap-2.5 pl-6">
                  <IconComponent
                    src="/icons/info.svg"
                    width={16}
                    height={16}
                    className="bg-neutral-700"
                  />
                  <span className="text-[14px] font-medium leading-[15.4px] text-neutral-600">
                    Rp100.000
                  </span>
                </div>
              </div>
            </div>

            {/* Troli Checkbox */}
            <div className="flex h-[34px] w-[328px] flex-col items-start justify-center gap-2">
              <div className="flex h-4 w-[328px] flex-row items-center gap-1">
                <div className="flex h-4 w-[52px] flex-row items-center gap-2">
                  <Checkbox label="Troli" checked={troli} onChange={setTroli} />
                </div>
                <div className="flex h-[10px] w-[87px] flex-row items-center justify-center gap-2.5 pl-6">
                  <IconComponent
                    src="/icons/info.svg"
                    width={16}
                    height={16}
                    className="bg-neutral-700"
                  />
                  <span className="text-[14px] font-medium leading-[15.4px] text-neutral-600">
                    Rp75.000
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ResponsiveFooter className="flex gap-3">
        <Button
          variant="muatparts-primary"
          className="flex-1"
          onClick={() => {}}
          type="button"
        >
          Simpan
        </Button>
      </ResponsiveFooter>
    </FormResponsiveLayout>
  );
};

export default LayananTambahan;
