"use client";

import { useState } from "react";

import Button from "@/components/Button/Button";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
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

const Draft = ({ isDraftAvailable }) => {
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

  if (!isDraftAvailable) {
    return (
      <div className="flex h-[280px] w-full items-center justify-center rounded-xl bg-white p-8 shadow-md">
        <DataNotFound type="data" title="Belum ada Draft Armada" />
      </div>
    );
  }
  return (
    <div className="">
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

export default Draft;
