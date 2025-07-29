"use client";

import Link from "next/link";
import { useState } from "react";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { Edit } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import * as v from "valibot";

import Button from "@/components/Button/Button";
import DatePicker from "@/components/DatePicker/DatePicker";
import Checkbox from "@/components/Form/Checkbox";
import Input from "@/components/Form/Input";
import { Select } from "@/components/Form/Select";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";
import { useTabs } from "@/components/Tabs/Tabs";

// Define units
const weightUnits = [
  { value: "kg", label: "kg" },
  {
    value: "liter",
    label: "Liter",
  },
  {
    value: "ton",
    label: "Ton",
  },
];

const dimensionUnits = [
  { value: "m", label: "m" },
  { value: "cm", label: "cm" },
];

const defaultInformasiMuatan = {
  namaMuatan: {
    label: "",
    value: null,
  },
  beratMuatan: {
    berat: "",
    unit: "kg",
  },
  dimensiMuatan: {
    panjang: "",
    lebar: "",
    tinggi: "",
    unit: "m",
  },
};

const informasiMuatanSchema = v.object({
  namaMuatan: v.object({
    label: v.pipe(v.string(), v.minLength(1, "Nama muatan harus diisi")),
    value: v.nullable(v.string()),
  }),
  beratMuatan: v.object({
    berat: v.pipe(v.number("Wajib diisi"), v.minValue(1, "Wajib diisi")),
    unit: v.string(),
  }),
  dimensiMuatan: v.object({
    // the value might be empty string or a number, so make sure to transform it to a number
    panjang: v.pipe(
      v.any(),
      v.transform((input) => (input ? Number(input) : 0))
    ),
    lebar: v.pipe(
      v.any(),
      v.transform((input) => (input ? Number(input) : 0))
    ),
    tinggi: v.pipe(
      v.any(),
      v.transform((input) => (input ? Number(input) : 0))
    ),
    unit: v.string(),
  }),
});

const TambahArmadaMassal = () => {
  // const { success, error } = toast;
  const { onValueChange } = useTabs();

  const [stateToggle, setStateToggle] = useState(false);
  const [isDraft, setIsDraft] = useState(false);

  const formMethods = useForm({
    defaultValues: {
      informasiMuatan: [defaultInformasiMuatan],
    },
    resolver: valibotResolver(
      v.object({
        informasiMuatan: v.array(informasiMuatanSchema),
      })
    ),
  });
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = formMethods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "informasiMuatan",
  });
  return (
    <div className="rounded-lg bg-white shadow-muat">
      {/* Temporary Toggle (use it to toggle between success upload or fail upload) */}
      {/* {isDev && (
        <div className="md:col-span-2">
          <Toggle
            value={stateToggle}
            textActive="Sukses unggah file"
            textInactive="Gagal unggah file"
            onClick={() => setStateToggle(!stateToggle)}
          />
        </div>
      )} */}
      {/* Header Table */}
      <div className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <Input
            icon={{ left: "/icons/search.svg" }}
            appearance={{ iconClassName: "text-neutral-700" }}
            className="!w-fit !p-0 font-medium"
            placeholder="Cari Armada"
          />
          <Button
            onClick={() => {
              append(defaultInformasiMuatan);
            }}
            variant="muatparts-primary-secondary"
          >
            Tambah
          </Button>
          <Button variant="muatparts-error-secondary">Hapus</Button>
        </div>
        <p className="font-semibold">Total : 20 Armada</p>
      </div>
      {/* Table */}
      <div className="p-4">
        {/* Table Header */}
        <div className="grid w-full grid-cols-[16px_32px_232px_180px_180px_180px_180px_180px_261px_180px_180px_98px_133px_180px_180px_98px_394px] gap-4 overflow-x-auto rounded-lg border border-neutral-500 p-4">
          <div className="flex items-center">
            <Checkbox label="" />
          </div>
          <div className="flex items-center">
            <span className="text-xs font-semibold text-gray-500">Aksi</span>
          </div>
          <div className="flex items-center">
            <span className="text-xs font-semibold text-gray-500">Armada*</span>
          </div>
          <div className="flex items-center">
            <span className="text-xs font-semibold text-gray-500">
              Jenis Truk*
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-xs font-semibold text-gray-500">
              Jenis Carrier*
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-xs font-semibold text-gray-500">
              Merek Kendaraan*
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-xs font-semibold text-gray-500">
              Tipe Kendaraan*
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-xs font-semibold text-gray-500">
              Tahun Registrasi Kendaraan*
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-xs font-semibold text-gray-500">
              Dimensi Carrier (Opsional)
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-xs font-semibold text-gray-500">
              Nomor Rangka*
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-xs font-semibold text-gray-500">
              Masa Berlaku STNK*
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-xs font-semibold text-gray-500">
              Foto STNK*
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-xs font-semibold text-gray-500">
              Foto Pajak Kendaraan*
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-xs font-semibold text-gray-500">
              KIR Kendaraan*
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-xs font-semibold text-gray-500">
              Masa Berlaku KIR*
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-xs font-semibold text-gray-500">
              Foto Buku KIR*
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-xs font-semibold text-gray-500">
              Estimasi Tanggal Pemasangan GPS*
            </span>
          </div>
          {control._formValues.informasiMuatan.map((_, index) => (
            <>
              <div key={index} className="flex items-center">
                <Checkbox label="" />
              </div>
              <div>
                <button className="rounded-[100%] bg-neutral-200 p-2 text-neutral-700 hover:bg-neutral-300 hover:text-neutral-800">
                  <Edit className="size-4" />
                </button>
              </div>
              <div className="flex gap-3">
                <div>
                  <label
                    onClick={() => {
                      setAddArmadaImageModal(true);
                    }}
                    htmlFor={`foto-armada-${index}`}
                  >
                    <div className="w-fit cursor-pointer rounded-lg border-2 border-dashed border-neutral-300 p-2">
                      <IconComponent src="/icons/add-image20.svg" />
                    </div>
                  </label>
                  {/* <input
                    type="file"
                    id={`foto-armada-${index}`}
                    className="hidden"
                  /> */}
                </div>
                <Input placeholder="Contoh : L 1234 TY" />
              </div>
              <div>
                <Select
                  options={[
                    {
                      value: "truk",
                      label: "Truk",
                    },
                  ]}
                  placeholder="Pilih Jenis Truk"
                />
              </div>
              <div>
                <Select
                  options={[
                    {
                      value: "truk",
                      label: "Truk",
                    },
                  ]}
                  placeholder="Pilih Jenis Carrier"
                />
              </div>
              <div>
                <Select
                  options={[
                    {
                      value: "truk",
                      label: "Truk",
                    },
                  ]}
                  placeholder="Pilih Merek Kendaraan"
                />
              </div>
              <div>
                <Select
                  options={[
                    {
                      value: "truk",
                      label: "Truk",
                    },
                  ]}
                  placeholder="Pilih Tipe Kendaraan"
                />
              </div>
              <div>
                <Select
                  options={[
                    {
                      value: "truk",
                      label: "Truk",
                    },
                  ]}
                  placeholder="Pilih Tahun"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 rounded-lg border border-neutral-600 p-2 text-xs font-medium">
                  <input placeholder="p" className="w-8 text-center" />
                  <span>x</span>
                  <input placeholder="l" className="w-8 text-center" />
                  <span>x</span>
                  <input placeholder="t" className="w-8 text-center" />
                </div>
                <Select defaultValue="m" options={dimensionUnits} />
              </div>
              <div>
                <Input placeholder="Maksimal 17 Digit" />
              </div>
              <div className="relative">
                <DatePicker placeholder="Pilih Tanggal" />
              </div>
              <div>
                <label
                  htmlFor={`foto-stnk-${index}`}
                  className="text-xs font-medium text-primary-700"
                >
                  Upload File
                </label>
                <input
                  type="file"
                  id={`foto-stnk-${index}`}
                  className="hidden"
                />
              </div>
              <div>
                <label
                  htmlFor={`foto-pajak-kendaraan-${index}`}
                  className="text-xs font-medium text-primary-700"
                >
                  Upload File
                </label>
                <input
                  type="file"
                  id={`foto-pajak-kendaraan-${index}`}
                  className="hidden"
                />
              </div>
              <div>
                <Input placeholder="Contoh: SBY 123456" />
              </div>
              <div className="relative">
                <DatePicker placeholder="Pilih Tanggal" />
              </div>
              <div>
                <label
                  htmlFor={`foto-buku-kir-${index}`}
                  className="text-xs font-medium text-primary-700 hover:cursor-pointer hover:text-primary-800 hover:underline"
                >
                  Upload File
                </label>
                <input
                  type="file"
                  id={`foto-buku-kir-${index}`}
                  className="hidden"
                />
              </div>
              <div className="flex items-center gap-2">
                <DatePicker placeholder="Pilih Tanggal" />
                <span className="text-xs font-medium">s/d</span>
                <DatePicker placeholder="Pilih Tanggal" />
              </div>
            </>
          ))}
        </div>
      </div>

      <Modal open={isDraft} onOpenChange={() => setIsDraft(!isDraft)}>
        <ModalContent className="w-modal-small text-center">
          <ModalHeader size="small" />
          <div className="flex flex-col items-center gap-4 px-6 py-9 text-black">
            <h2 className="text-base font-bold">Pemberitahuan</h2>
            <p className="text-sm font-medium">
              Harap selesaikan data pada menu Draft terlebih dahulu.
              <br />
              <br />
              Kamu memiliki draft tambah armada yang belum selesai. Silakan
              simpan data tersebut atau hapus draft sebelum menambahkan armada
              baru
            </p>
            <Link href="#">
              <Button
                onClick={() => {
                  onValueChange("draft");
                }}
              >
                Selesaikan Draft
              </Button>
            </Link>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default TambahArmadaMassal;
