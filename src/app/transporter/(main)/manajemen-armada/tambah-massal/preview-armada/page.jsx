"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useFieldArray, useForm } from "react-hook-form";
import * as v from "valibot";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Button from "@/components/Button/Button";
import DatePicker from "@/components/DatePicker/DatePicker";
import Checkbox from "@/components/Form/Checkbox";
import DimensionInput from "@/components/Form/DimensionInput";
import Dropdown from "@/components/Form/Dropdown";
import Input from "@/components/Form/Input";
// import { Select } from "@/components/Form/Select";
import IconComponent from "@/components/IconComponent/IconComponent";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import PageTitle from "@/components/PageTitle/PageTitle";
import Select from "@/components/Select";
import SelectExample from "@/components/Select/SelectExample";
import { toast } from "@/lib/toast";

import FileUploadInput from "./components/FileUploadInput";
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
  informasi_armada: {
    images: {
      image_armada_depan: null,
      image_armada_kiri: null,
      image_armada_kanan: null,
      image_armada_belakang: null,
    },
  },
  jenis_truk: "",
  jenis_carrier: "",
  merek_kendaraan: "",
  tipe_kendaraan: "",
  tahun_registrasi_kendaraan: "",
  dimensi_carrier: {
    panjang: "",
    lebar: "",
    tinggi: "",
    unit: "m",
  },
  nomor_rangka: "",
  masa_berlaku_stnk: "",
  foto_stnk: null,
  foto_pajak_kendaraan: null,
  nomor_kir: "",
  masa_berlaku_kir: "",
  foto_buku_kir: null,
  estimasi_tanggal_pemasangan_gps: {
    mulai: "",
    selesai: "",
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
  const [activeIndex, setActiveIndex] = useState();

  const [addArmadaImageModal, setAddArmadaImageModal] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

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
    setValue,
    watch,
    formState: { errors },
  } = formMethods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "informasiMuatan",
  });

  const onClickHapus = () => {
    if (selectedRowIndex.length === 0) {
      // error("Tidak ada baris yang dipilih");
      toast.error("Harap pilih 1 armada untuk menghapus");
      return;
    }
    setConfirmDeleteModal(true);
  };

  const handleRemove = () => {
    if (selectedRowIndex.length === 0) {
      // error("Tidak ada baris yang dipilih");
      toast.error("Harap pilih 1 armada untuk menghapus");
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
    setConfirmDeleteModal(false);
    toast.success("Berhasil hapus armada");
  };

  const handleSaveAsDraft = () => {
    toast.success("Berhasil tambah sebagai draft");
    redirect("/manajemen-armada/tambah-massal");
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
                onClickHapus();
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
                <tr>
                  <th className="sticky left-0 w-[16px] bg-white px-4 py-5">
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
                </tr>
              </thead>
              <tbody>
                {control._formValues.informasiMuatan.map((_, index) => (
                  <tr key={`item-${index}`} className="px-4">
                    <td
                      key={index}
                      className="sticky left-0 z-50 bg-white py-5 pr-4"
                    >
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
                          setActiveIndex(index);
                          setAddArmadaImageModal(true);
                        }}
                        htmlFor={`foto-armada-${index}`}
                      >
                        {watch(
                          `informasiMuatan.${index}.informasi_armada.images.image_armada_depan`
                        ) ? (
                          <img
                            src={URL.createObjectURL(
                              watch(
                                `informasiMuatan.${index}.informasi_armada.images.image_armada_depan`
                              )
                            )}
                            alt="Foto Armada Depan"
                            className="w-12 shrink cursor-pointer rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-fit cursor-pointer rounded-lg border border-dashed border-neutral-600 p-2 hover:border-primary-700 hover:text-primary-700">
                            <IconComponent src="/icons/add-image20.svg" />
                          </div>
                        )}
                      </label>

                      <Input placeholder="Contoh : L 1234 TY" />
                    </td>
                    <td>
                      <Dropdown
                        value={watch(`informasiMuatan.${index}.jenis_truk`)}
                        onChange={(value) => {
                          setValue(
                            `informasiMuatan.${index}.jenis_truk`,
                            value
                          );
                        }}
                        placeholder="Pilih Jenis Truk"
                      />
                    </td>
                    <td>
                      <Dropdown
                        disabled={!watch(`informasiMuatan.${index}.jenis_truk`)}
                        value={watch(`informasiMuatan.${index}.jenis_carrier`)}
                        onChange={(value) => {
                          setValue(
                            `informasiMuatan.${index}.jenis_carrier`,
                            value
                          );
                        }}
                        placeholder="Pilih Jenis Carrier"
                      />
                    </td>
                    <td>
                      <Dropdown
                        value={watch(
                          `informasiMuatan.${index}.merek_kendaraan`
                        )}
                        onChange={(value) => {
                          setValue(
                            `informasiMuatan.${index}.merek_kendaraan`,
                            value
                          );
                        }}
                        placeholder="Pilih Jenis Merek Kendaraan"
                      />
                    </td>
                    <td>
                      <Dropdown
                        disabled={
                          !watch(`informasiMuatan.${index}.merek_kendaraan`)
                        }
                        value={watch(`informasiMuatan.${index}.tipe_kendaraan`)}
                        onChange={(value) => {
                          setValue(
                            `informasiMuatan.${index}.tipe_kendaraan`,
                            value
                          );
                        }}
                        placeholder="Pilih Tipe Kendaraan"
                      />
                    </td>
                    <td>
                      <Select.Root
                        onValueChange={(value) => {
                          setValue(
                            `informasiMuatan.${index}.tahun_registrasi_kendaraan`,
                            value
                          );
                        }}
                        value={watch(
                          `informasiMuatan.${index}.tahun_registrasi_kendaraan`
                        )}
                      >
                        <Select.Trigger>
                          <Select.Value placeholder="Pilih Tipe Kendaraan" />
                        </Select.Trigger>
                        <Select.Content>
                          {Array.from({ length: 100 }, (_, i) => {
                            const year = new Date().getFullYear() - i;
                            return (
                              <Select.Item
                                key={year}
                                value={year.toString()}
                                className="py-2 text-xs font-medium"
                              >
                                {year}
                              </Select.Item>
                            );
                          })}
                        </Select.Content>
                      </Select.Root>
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <DimensionInput
                          manual={{
                            lebar: {
                              value: watch(
                                `informasiMuatan.${index}.dimensi_carrier.lebar`
                              ),
                              setValue: (value) =>
                                setValue(
                                  `informasiMuatan.${index}.dimensi_carrier.lebar`,
                                  value
                                ),
                            },
                            panjang: {
                              value: watch(
                                `informasiMuatan.${index}.dimensi_carrier.panjang`
                              ),
                              setValue: (value) =>
                                setValue(
                                  `informasiMuatan.${index}.dimensi_carrier.panjang`,
                                  value
                                ),
                            },
                            tinggi: {
                              value: watch(
                                `informasiMuatan.${index}.dimensi_carrier.tinggi`
                              ),
                              setValue: (value) =>
                                setValue(
                                  `informasiMuatan.${index}.dimensi_carrier.tinggi`,
                                  value
                                ),
                            },
                          }}
                        />
                        <Select.Root
                          onValueChange={(value) => {
                            setValue(
                              `informasiMuatan.${index}.dimensi_carrier.unit`,
                              value
                            );
                          }}
                          value={watch(
                            `informasiMuatan.${index}.dimensi_carrier.unit`
                          )}
                        >
                          <Select.Trigger>
                            <Select.Value placeholder="Pilih Tipe Kendaraan" />
                          </Select.Trigger>
                          <Select.Content>
                            {dimensionUnits.map((unit) => (
                              <Select.Item
                                key={unit.value}
                                value={unit.value}
                                className="py-2 text-xs font-medium"
                              >
                                {unit.label}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Root>
                        {/* <Select defaultValue="m" options={dimensionUnits} /> */}
                      </div>
                    </td>
                    <td>
                      <Input placeholder="Maksimal 17 Digit" />
                    </td>
                    <td className="relative">
                      <DatePicker placeholder="Pilih Tanggal" />
                    </td>
                    <td>
                      <FileUploadInput
                        id={`foto-stnk-${index}`}
                        value={watch(`informasiMuatan.${index}.foto_stnk`)}
                        onChange={(file) => {
                          setValue(`informasiMuatan.${index}.foto_stnk`, file);
                        }}
                      />
                    </td>
                    <td>
                      <FileUploadInput
                        id={`foto-pajak-kendaraan-${index}`}
                        value={watch(
                          `informasiMuatan.${index}.foto_pajak_kendaraan`
                        )}
                        onChange={(file) => {
                          setValue(
                            `informasiMuatan.${index}.foto_pajak_kendaraan`,
                            file
                          );
                        }}
                      />
                    </td>
                    <td>
                      <Input placeholder="Contoh: SBY 123456" />
                    </td>
                    <td className="relative">
                      <DatePicker placeholder="Pilih Tanggal" />
                    </td>
                    <td>
                      <FileUploadInput
                        id={`foto-buku-kir-${index}`}
                        value={watch(`informasiMuatan.${index}.foto_buku_kir`)}
                        onChange={(file) => {
                          setValue(
                            `informasiMuatan.${index}.foto_buku_kir`,
                            file
                          );
                        }}
                      />
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <DatePicker placeholder="Pilih Tanggal" />
                        {/* <input
                          className="rounded-lg border border-neutral-400 p-2 text-xs font-medium"
                          type="date"
                        /> */}
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
      <div className="mt-4 flex w-full items-end justify-end gap-3">
        <Button
          onClick={() => {
            handleSaveAsDraft();
          }}
          variant="muattrans-primary-secondary"
        >
          Simpan Sebagai Draft
        </Button>
        <Button>Simpan</Button>
      </div>
      <ConfirmationModal
        isOpen={confirmDeleteModal}
        setIsOpen={setConfirmDeleteModal}
        title={{
          text: "Apakah kamu yakin untuk menghapus armada ?",
          className: "text-sm font-medium text-center",
        }}
        confirm={{
          text: "Hapus",
          onClick: () => {
            // Handle delete action
            handleRemove();
          },
        }}
        cancel={{
          text: "Batal",
          onClick: () => {
            setConfirmDeleteModal(false);
          },
        }}
      >
        Apakah kamu yakin ingin menghapus armada yang telah dipilih? Tindakan
        ini tidak dapat dibatalkan.
      </ConfirmationModal>
      <ModalAddArmadaImage
        isOpen={addArmadaImageModal}
        onClose={() => {
          setAddArmadaImageModal(false);
        }}
        value={watch(`informasiMuatan.${activeIndex}.informasi_armada.images`)}
        onSave={(images) => {
          setValue(
            `informasiMuatan.${activeIndex}.informasi_armada.images`,
            images
          );
          setAddArmadaImageModal(false);
        }}
      />
      <SelectExample />
    </div>
  );
}
