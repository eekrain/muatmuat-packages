"use client";

import Link from "next/link";
import { useState } from "react";

import Button from "@/components/Button/Button";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";
import { useTabs } from "@/components/Tabs/Tabs";
import {
  handleVehicleCellValueChange,
  handleVehicleSaveAsDraft,
  handleVehicleSubmit,
  validateVehicleForm,
  vehicleDefaultValues,
  vehicleFormSchema,
} from "@/config/forms/vehicleFormConfig";
import { useTableForm } from "@/hooks/useTableForm";

import ModalAddArmadaImage from "../../../preview-armada/components/ModalAddImage/ModalAddImage";
import ArmadaTable from "../../ArmadaTable/ArmadaTable";

const TambahArmadaMassal = ({ isDraftAvailable }) => {
  const { onValueChange } = useTabs();

  const [isDraft] = useState(isDraftAvailable);
  const [activeIndex, setActiveIndex] = useState();
  const [addArmadaImageModal, setAddArmadaImageModal] = useState(false);

  // Custom handlers for this vehicle form
  const handleSubmit = (value) => {
    handleVehicleSubmit(value);
  };

  const handleSaveAsDraft = (value) => {
    handleVehicleSaveAsDraft(value);
  };

  // Use the reusable table form hook for vehicle data
  const {
    errors,
    watch,
    selectAll,
    selectedRowIndex,
    searchValue,
    confirmDeleteModal,
    setConfirmDeleteModal,
    handleAddRow,
    handleDeleteRows,
    handleSelectAll,
    handleSelectRow,
    handleCellValueChange,
    handleSearchChange,
    handleRemove,
    handleSubmit: onSubmit,
    setValue,
  } = useTableForm({
    defaultValues: vehicleDefaultValues,
    schema: vehicleFormSchema,
    onSubmit: handleSubmit,
    onSaveAsDraft: handleSaveAsDraft,
    validateAndShowErrors: validateVehicleForm,
    handleCellValueChange: handleVehicleCellValueChange,
    fieldArrayName: "informasiMuatan",
  });

  const handleImageClick = (index) => {
    setActiveIndex(index);
    setAddArmadaImageModal(true);
  };
  return (
    <div className="rounded-lg">
      {/* Header Table */}
      <form onSubmit={onSubmit}>
        <ArmadaTable
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
          errors={errors.informasiMuatan}
        />
        <div className="flex items-center justify-end">
          <div className="mt-4 flex w-full items-end justify-end gap-3">
            <Button
              onClick={handleSaveAsDraft}
              variant="muattrans-primary-secondary"
              type="button"
            >
              Simpan Sebagai Draft
            </Button>
            <Button
              type="submit"
              onClick={() => {
                handleSubmit();
              }}
            >
              Simpan
            </Button>
          </div>
        </div>
      </form>

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
          onClick: handleRemove,
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
