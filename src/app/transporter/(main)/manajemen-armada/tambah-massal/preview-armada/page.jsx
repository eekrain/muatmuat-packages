"use client";

import { useEffect, useState } from "react";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useFieldArray, useForm } from "react-hook-form";
import * as v from "valibot";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Button from "@/components/Button/Button";
import DatePicker from "@/components/DatePicker/DatePicker";
import Checkbox from "@/components/Form/Checkbox";
import DimensionInput from "@/components/Form/DimensionInput";
import Input from "@/components/Form/Input";
import { Select } from "@/components/Form/Select";
import IconComponent from "@/components/IconComponent/IconComponent";
import PageTitle from "@/components/PageTitle/PageTitle";

import ModalAddArmadaImage from "./components/ModalAddImage";

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

const breadcrumbData = [
  { name: "Manajemen Armada", href: "/manajemen-armada" },
  { name: "Tambah Armada Massal", href: "/manajemen-armada/tambah-massal" },
  { name: "Detail Armada" },
];

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

export default function PreviewArmada() {
  // const { success, error } = toast;

  const [stateToggle, setStateToggle] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState([]);

  const [addArmadaImageModal, setAddArmadaImageModal] = useState(false);

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

  const handleRemove = () => {
    if (selectedRowIndex.length === 0) {
      // error("Tidak ada baris yang dipilih");
      return;
    }
    const newFields = fields.filter(
      (_, index) => !selectedRowIndex.includes(index)
    );
    remove(selectedRowIndex);
    setSelectedRowIndex([]);
    setSelectAll(false);
    reset({ informasiMuatan: newFields });
    if (newFields.length === 0) {
      append(defaultInformasiMuatan);
    }
  };

  useEffect(() => {
    if (selectAll) {
      setSelectedRowIndex(fields.map((_, index) => index));
    } else {
      setSelectedRowIndex([]);
    }
  }, [selectAll]);
  return (
    <div className="my-6 px-6">
      <div className="flex flex-col gap-4 p-3">
        <BreadCrumb data={breadcrumbData} />
        <PageTitle>Preview Armada</PageTitle>
      </div>
      <div className="rounded-lg bg-white shadow-muat">
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
            <Button
              onClick={() => {
                handleRemove();
              }}
              variant="muatparts-error-secondary"
            >
              Hapus
            </Button>
          </div>
          <p className="font-semibold">
            Total : {control._formValues.informasiMuatan.length} Armada
          </p>
        </div>
        <div className="p-4">
          <div className="max-h-[296px] w-full overflow-auto rounded-lg border border-neutral-600">
            <table className="table-tambah-armada-massal w-full table-fixed overflow-auto">
              <thead className="sticky top-0 z-50 border-b border-neutral-500 bg-white text-left">
                <th className="w-[16px] px-4 py-5">
                  <Checkbox
                    label=""
                    checked={selectAll}
                    onChange={() => {
                      setSelectAll(!selectAll);
                    }}
                  />
                </th>
                <th className="w-[232px]">
                  <span className="text-xs font-semibold text-gray-500">
                    Armada*
                  </span>
                </th>
                <th className="w-[180px]">
                  <span className="text-xs font-semibold text-gray-500">
                    Jenis Truk*
                  </span>
                </th>
                <th className="w-[180px]">
                  <span className="text-xs font-semibold text-gray-500">
                    Jenis Carrier*
                  </span>
                </th>
                <th className="w-[180px]">
                  <span className="text-xs font-semibold text-gray-500">
                    Merek Kendaraan*
                  </span>
                </th>
                <th className="w-[180px]">
                  <span className="text-xs font-semibold text-gray-500">
                    Tipe Kendaraan*
                  </span>
                </th>
                <th className="w-[180px]">
                  <span className="text-xs font-semibold text-gray-500">
                    Tahun Registrasi Kendaraan*
                  </span>
                </th>
                <th className="w-[261px]">
                  <span className="text-xs font-semibold text-gray-500">
                    Dimensi Carrier (Opsional)
                  </span>
                </th>
                <th className="w-[180px]">
                  <span className="text-xs font-semibold text-gray-500">
                    Nomor Rangka*
                  </span>
                </th>
                <th className="w-[180px]">
                  <span className="text-xs font-semibold text-gray-500">
                    Masa Berlaku STNK*
                  </span>
                </th>
                <th className="w-[98px]">
                  <span className="text-xs font-semibold text-gray-500">
                    Foto STNK*
                  </span>
                </th>
                <th className="w-[133px]">
                  <span className="text-xs font-semibold text-gray-500">
                    Foto Pajak Kendaraan*
                  </span>
                </th>
                <th className="w-[180px]">
                  <span className="text-xs font-semibold text-gray-500">
                    KIR Kendaraan*
                  </span>
                </th>
                <th className="w-[180px]">
                  <span className="text-xs font-semibold text-gray-500">
                    Masa Berlaku KIR*
                  </span>
                </th>
                <th className="w-[98px]">
                  <span className="text-xs font-semibold text-gray-500">
                    Foto Buku KIR*
                  </span>
                </th>
                <th className="w-[394px]">
                  <span className="text-xs font-semibold text-gray-500">
                    Estimasi Tanggal Pemasangan GPS*
                  </span>
                </th>
              </thead>
              <tbody>
                {control._formValues.informasiMuatan.map((_, index) => (
                  <tr key={`item-${index}`} className="px-4">
                    <td key={index} className="py-5">
                      <Checkbox
                        label=""
                        checked={selectedRowIndex.includes(index)}
                        onChange={() => {
                          if (selectedRowIndex.includes(index)) {
                            setSelectedRowIndex(
                              selectedRowIndex.filter((i) => i !== index)
                            );
                          } else {
                            setSelectedRowIndex([...selectedRowIndex, index]);
                          }
                        }}
                      />
                    </td>
                    {/* <div>
                  <button className="rounded-[100%] bg-neutral-200 p-2 text-neutral-700 hover:bg-neutral-300 hover:text-neutral-800">
                    <Edit className="size-4" />
                  </button>
                </div> */}
                    <td className="flex gap-3 py-5">
                      <label
                        onClick={() => {
                          setAddArmadaImageModal(true);
                        }}
                        htmlFor={`foto-armada-${index}`}
                      >
                        <div className="w-fit cursor-pointer rounded-lg border border-dashed border-neutral-600 p-2 hover:border-primary-700 hover:text-primary-700">
                          <IconComponent src="/icons/add-image20.svg" />
                        </div>
                      </label>
                      {/* <input
                        type="file"
                        id={`foto-armada-${index}`}
                        className="hidden"
                      /> */}

                      <Input placeholder="Contoh : L 1234 TY" />
                    </td>
                    <td>
                      <Select
                        options={[
                          {
                            value: "truk",
                            label: "Truk",
                          },
                        ]}
                        placeholder="Pilih Jenis Truk"
                      />
                    </td>
                    <td>
                      <Select
                        options={[
                          {
                            value: "truk",
                            label: "Truk",
                          },
                        ]}
                        placeholder="Pilih Jenis Carrier"
                      />
                    </td>
                    <td>
                      <Select
                        options={[
                          {
                            value: "truk",
                            label: "Truk",
                          },
                        ]}
                        placeholder="Pilih Merek Kendaraan"
                      />
                    </td>
                    <td>
                      <Select
                        options={[
                          {
                            value: "truk",
                            label: "Truk",
                          },
                        ]}
                        placeholder="Pilih Tipe Kendaraan"
                      />
                    </td>
                    <td>
                      <Select
                        options={[
                          {
                            value: "truk",
                            label: "Truk",
                          },
                        ]}
                        placeholder="Pilih Tahun"
                      />
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <DimensionInput />
                        <Select defaultValue="m" options={dimensionUnits} />
                      </div>
                    </td>
                    <td>
                      <Input placeholder="Maksimal 17 Digit" />
                    </td>
                    <td className="relative">
                      <DatePicker placeholder="Pilih Tanggal" />
                    </td>
                    <td>
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
                    </td>
                    <td>
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
                    </td>
                    <td>
                      <Input placeholder="Contoh: SBY 123456" />
                    </td>
                    <td className="relative">
                      <DatePicker placeholder="Pilih Tanggal" />
                    </td>
                    <td>
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
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {/* <DatePicker placeholder="Pilih Tanggal" /> */}
                        <input
                          className="rounded-lg border border-neutral-400 p-2 text-xs font-medium"
                          type="date"
                        />
                        <span className="text-xs font-medium">s/d</span>
                        <DatePicker placeholder="Pilih Tanggal" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Table */}
      </div>
      <ModalAddArmadaImage
        isOpen={addArmadaImageModal}
        onClose={() => {
          setAddArmadaImageModal(false);
        }}
        images={[]}
      />
    </div>
  );
}
