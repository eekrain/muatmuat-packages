"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import Button from "@/components/Button/Button";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";
import { useTabs } from "@/components/Tabs/Tabs";
import {
  handleVehicleCellValueChange,
  validateVehicleForm,
  vehicleDefaultValues,
  vehicleFormSchema,
} from "@/config/forms/vehicleFormConfig";
import { useTableForm } from "@/hooks/useTableForm";
import { normalizePayloadTambahArmadaMassal } from "@/lib/normalizers/transporter/tambah-armada-massal/normalizePayloadTambahArmadaMassal";
import { toast } from "@/lib/toast";
import { usePostFleetBulkCreate } from "@/services/Transporter/manajemen-armada/postFleetBulkCreate";
import { usePostFleetBulkDrafts } from "@/services/Transporter/manajemen-armada/postFleetsBulkDrafts";

import ArmadaTable from "../../ArmadaTable/ArmadaTable";

const TambahArmadaMassal = ({ isDraftAvailable }) => {
  const router = useRouter();
  const { onValueChange } = useTabs();

  const [isDraft] = useState(isDraftAvailable);

  const { trigger: handlePostFleetBulkCreate, isMutating } =
    usePostFleetBulkCreate();

  const { trigger: handlePostFleetBulkDraft, isMutating: isDraftMutating } =
    usePostFleetBulkDrafts();

  // Custom submit handler for this page
  const handleSubmit = (value) => {
    const payload = normalizePayloadTambahArmadaMassal(value);
    handlePostFleetBulkCreate(payload)
      .then((res) => {
        // Show success message
        toast.success(`Berhasil menambahkan ${res.Data.savedFleets} armada.`);
        router.push(`/manajemen-armada?tab=process`);
      })
      .catch((_error) => {
        // Show error message
        toast.error(
          "Gagal menyimpan draft armada. Periksa kembali data yang dimasukkan."
        );
      });
  };

  // Custom save as draft handler for this page
  const handleSaveAsDraft = (value) => {
    const payload = normalizePayloadTambahArmadaMassal(value);
    handlePostFleetBulkDraft(payload)
      .then(() => {
        // Show success message
        toast.success("Draft armada berhasil disimpan.");
        router.push(`/manajemen-armada?tab=process`);
      })
      .catch((_error) => {
        // Show error message
        toast.error(
          "Gagal menyimpan draft armada. Periksa kembali data yang dimasukkan."
        );
      });
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
    handleSaveAsDraft: saveAsDraft,
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
          errors={errors.informasiMuatan}
        />
        <div className="flex items-center justify-end">
          <div className="mt-4 flex w-full items-end justify-end gap-3">
            <Button
              disabled={isMutating || isDraftMutating}
              onClick={saveAsDraft}
              variant="muattrans-primary-secondary"
              type="button"
            >
              Simpan Sebagai Draft
            </Button>
            <Button disabled={isMutating || isDraftMutating} type="submit">
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
    </div>
  );
};

export default TambahArmadaMassal;
