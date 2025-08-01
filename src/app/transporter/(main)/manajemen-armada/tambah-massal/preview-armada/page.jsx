"use client";

import { redirect } from "next/navigation";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Button from "@/components/Button/Button";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import PageTitle from "@/components/PageTitle/PageTitle";
import {
  handleVehicleCellValueChange,
  handleVehicleSaveAsDraft,
  handleVehicleSubmit,
  validateVehicleForm,
  vehicleDefaultValues,
  vehicleFormSchema,
} from "@/config/forms/vehicleFormConfig";
import { useTableForm } from "@/hooks/useTableForm";

import ArmadaTable from "../components/ArmadaTable/ArmadaTable";

// Define units (kept for schema validation)
const breadcrumbData = [
  { name: "Manajemen Armada", href: "/manajemen-armada" },
  { name: "Tambah Armada Massal", href: "/manajemen-armada/tambah-massal" },
  { name: "Detail Armada" },
];

export default function PreviewArmada() {
  // Custom submit handler for this page
  const handleSubmit = (value) => {
    handleVehicleSubmit(value);
  };

  // Custom save as draft handler for this page
  const handleSaveAsDraft = (value) => {
    handleVehicleSaveAsDraft(value);
    redirect("/manajemen-armada/tambah-massal");
  };

  // Use the reusable table form hook
  const {
    errors,
    watch,
    handleSubmit: onSubmit,
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
    handleSaveAsDraft: onSaveAsDraft,
  } = useTableForm({
    defaultValues: vehicleDefaultValues,
    schema: vehicleFormSchema,
    onSubmit: handleSubmit,
    onSaveAsDraft: handleSaveAsDraft,
    validateAndShowErrors: validateVehicleForm,
    handleCellValueChange: handleVehicleCellValueChange,
    fieldArrayName: "informasiMuatan",
  });
  return (
    <div className="my-6 px-6">
      <div className="flex flex-col gap-4 p-3">
        <BreadCrumb data={breadcrumbData} />
        <PageTitle>Preview Armada</PageTitle>
      </div>
      <form onSubmit={onSubmit}>
        <div className="rounded-lg bg-white shadow-muat">
          {/* Header Table */}
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
            errors={errors.informasiMuatan}
          />
        </div>
        <div className="mt-4 flex w-full items-end justify-end gap-3">
          <Button
            onClick={onSaveAsDraft}
            variant="muattrans-primary-secondary"
            type="button"
          >
            Simpan Sebagai Draft
          </Button>
          <Button type="submit">Simpan</Button>
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
    </div>
  );
}
