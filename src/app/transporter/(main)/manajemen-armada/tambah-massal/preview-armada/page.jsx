"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useFieldArray, useForm } from "react-hook-form";
import * as v from "valibot";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Button from "@/components/Button/Button";
// import { Select } from "@/components/Form/Select";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import PageTitle from "@/components/PageTitle/PageTitle";
import { toast } from "@/lib/toast";

import ArmadaTable from "../components/ArmadaTable/ArmadaTable";

// Define units (kept for schema validation)
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

  const [selectAll, setSelectAll] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState([]);
  const [searchValue, setSearchValue] = useState("");

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
  const { control, reset, setValue, watch } = formMethods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "informasiMuatan",
  });

  const handleAddRow = () => {
    append(defaultInformasiMuatan);
  };

  const handleDeleteRows = () => {
    if (selectedRowIndex.length === 0) {
      toast.error("Harap pilih 1 armada untuk menghapus");
      return;
    }
    setConfirmDeleteModal(true);
  };

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
  };

  const handleSelectRow = (selectedRows) => {
    setSelectedRowIndex(selectedRows);
  };

  const handleCellValueChange = (rowIndex, fieldPath, value) => {
    console.log("handleCellValueChange", rowIndex, fieldPath, value);
    setValue(`informasiMuatan.${rowIndex}.${fieldPath}`, value);
  };

  const handleSearchChange = (value) => {
    setSearchValue(value);
    // Add search logic here if needed
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
  }, [selectAll, fields]);
  return (
    <div className="my-6 px-6">
      <div className="flex flex-col gap-4 p-3">
        <BreadCrumb data={breadcrumbData} />
        <PageTitle>Preview Armada</PageTitle>
      </div>
      <div className="rounded-lg bg-white shadow-muat">
        {/* Header Table */}
        <ArmadaTable
          // data={control._formValues.informasiMuatan}
          data={watch("informasiMuatan")}
          selectedRows={selectedRowIndex}
          selectAll={selectAll}
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          onSelectAll={handleSelectAll}
          onSelectRow={handleSelectRow}
          onAddRow={handleAddRow}
          onDeleteRows={handleDeleteRows}
          onCellValueChange={handleCellValueChange}
        />
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
    </div>
  );
}
