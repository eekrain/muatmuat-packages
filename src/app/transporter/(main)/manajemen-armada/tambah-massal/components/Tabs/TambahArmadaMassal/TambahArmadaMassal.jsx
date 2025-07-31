"use client";

import Link from "next/link";
import { useState } from "react";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useFieldArray, useForm } from "react-hook-form";
import * as v from "valibot";

import Button from "@/components/Button/Button";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";
import { useTabs } from "@/components/Tabs/Tabs";
import { toast } from "@/lib/toast";

import ModalAddArmadaImage from "../../../preview-armada/components/ModalAddImage/ModalAddImage";
import ArmadaTable from "../../ArmadaTable/ArmadaTable";

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
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState([]);
  const [activeIndex, setActiveIndex] = useState();
  const [searchValue, setSearchValue] = useState("");

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

  const handleImageClick = (index) => {
    setActiveIndex(index);
    setAddArmadaImageModal(true);
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
        onImageClick={handleImageClick}
      />

      <Modal
        open={isDraft}
        onOpenChange={() => {
          onValueChange("draft");
        }}
      >
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
    </div>
  );
};

export default TambahArmadaMassal;
