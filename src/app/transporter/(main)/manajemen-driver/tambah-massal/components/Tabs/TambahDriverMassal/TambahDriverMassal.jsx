"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import Button from "@/components/Button/Button";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";
import { useTabs } from "@/components/Tabs/Tabs";
import {
  driverDefaultValues,
  driverFormSchema,
  handleDriverCellValueChange,
  validateDriverForm,
} from "@/config/forms/driverFormConfig";
import { useDriverTableForm } from "@/hooks/useDriverTableForm";
import { usePostFleetBulkCreate } from "@/services/Transporter/manajemen-armada/postFleetBulkCreate";

import DriverTable from "../../DriverTable/DriverTable";

const TambahDriverMassal = ({ isDraftAvailable }) => {
  const router = useRouter();
  const { onValueChange } = useTabs();

  const [isDraft] = useState(isDraftAvailable);

  const { trigger: handlePostFleetBulkCreate, isMutating } =
    usePostFleetBulkCreate();

  // Custom submit handler for this page
  const handleSubmit = (value) => {
    // const payload = normalizePayloadTambahDriverMassal(value);
    void value; // Temporarily silence unused variable warning
    console.log("value", value);
    // const payload = normalizePayloadTambahDriverMassal(value);
    // console.log("payload", payload);
    // console.log("payload", payload);
  };

  // Custom save as draft handler for this page
  const handleSaveAsDraft = (value) => {
    // console.log("value", value);
    // const payload = normalizePayloadTambahDriverMassal(value);
    // console.log("payload", payload);
    // handlePostFleetBulkCreate(payload)
    //   .then(() => {
    //     // Show success message
    //     toast.success("Draft driver berhasil disimpan.");
    //   })
    //   .catch((_error) => {
    //     // Show error message
    //     toast.error(
    //       "Gagal menyimpan draft driver. Periksa kembali data yang dimasukkan."
    //     );
    //   });
    router.push(`/manajemen-driver?tab=process`);
  };

  // Use the reusable table form hook for driver data
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
  } = useDriverTableForm({
    defaultValues: driverDefaultValues,
    schema: driverFormSchema,
    onSubmit: handleSubmit,
    onSaveAsDraft: handleSaveAsDraft,
    validateAndShowErrors: validateDriverForm,
    handleCellValueChange: handleDriverCellValueChange,
    fieldArrayName: "driverList",
  });

  return (
    <div className="rounded-lg">
      {/* Header Table */}
      <form onSubmit={onSubmit}>
        <DriverTable
          data={watch("driverList")}
          selectedRows={selectedRowIndex}
          selectAll={selectAll}
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          onSelectAll={handleSelectAll}
          onSelectRow={handleSelectRow}
          onAddRow={handleAddRow}
          onDeleteRows={handleDeleteRows}
          onCellValueChange={handleCellValueChange}
          errors={errors.driverList}
        />
        <div className="flex items-center justify-end">
          <div className="mt-4 flex w-full items-end justify-end gap-3">
            <Button
              disabled={isMutating}
              onClick={handleSaveAsDraft}
              variant="muattrans-primary-secondary"
              type="button"
            >
              Simpan Sebagai Draft
            </Button>
            <Button
              disabled={isMutating}
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
              Kamu memiliki draft tambah driver yang belum selesai. Silakan
              simpan data tersebut atau hapus draft sebelum menambahkan driver
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
          text: "Apakah kamu yakin untuk menghapus driver ?",
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
        Apakah kamu yakin ingin menghapus driver yang telah dipilih? Tindakan
        ini tidak dapat dibatalkan.
      </ConfirmationModal>
    </div>
  );
};

export default TambahDriverMassal;
