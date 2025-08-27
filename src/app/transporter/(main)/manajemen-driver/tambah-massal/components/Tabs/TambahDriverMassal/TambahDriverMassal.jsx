"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { usePostDriverBulkCreate } from "@/services/Transporter/manajemen-driver/postDriverBulkCreate";
import { usePostDriverBulkDrafts } from "@/services/Transporter/manajemen-driver/postDriverBulkDrafts";

import Button from "@/components/Button/Button";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";
import { useTabs } from "@/components/Tabs/Tabs";

import { useTranslation } from "@/hooks/use-translation";
import { useDriverTableForm } from "@/hooks/useDriverTableForm";

import { normalizePayloadTambahDriverMassal } from "@/lib/normalizers/transporter/tambah-driver-massal/normalizePayloadTambahDriverMassal";
import { toast } from "@/lib/toast";

import {
  driverDefaultValues,
  driverFormSchema,
  handleDriverCellValueChange,
  validateDriverForm,
} from "@/config/forms/driverFormConfig";

import DriverTable from "../../DriverTable/DriverTable";

const TambahDriverMassal = ({ isDraftAvailable }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { onValueChange } = useTabs();

  const [isDraft] = useState(isDraftAvailable);

  const { trigger: handlePostDriverBulkCreate, isMutating: isLoadingCreate } =
    usePostDriverBulkCreate();
  const { trigger: handlePostDriverBulkDrafts, isMutating: isLoadingDraft } =
    usePostDriverBulkDrafts();

  // Custom submit handler for this page
  const handleSubmit = (value) => {
    // const payload = normalizePayloadTambahDriverMassal(value);
    void value; // Temporarily silence unused variable warning
    // console.log("value", value);
    const payload = normalizePayloadTambahDriverMassal(value);
    handlePostDriverBulkCreate(payload)
      .then((res) => {
        // Show success message
        toast.success(
          t(
            "TambahDriverMassalScreen.messageSuccessAddDriver",
            { count: res.Data.totalSaved },
            `Berhasil menambahkan ${res.Data.totalSaved} Driver.`
          )
        );
        router.push(`/manajemen-driver?tab=process`);
      })
      .catch((_error) => {
        // Show error message
        toast.error(
          t(
            "TambahDriverMassalScreen.messageErrorSaveDriver",
            {},
            "Gagal menyimpan draft driver. Periksa kembali data yang dimasukkan."
          )
        );
      });
    // console.log("payload", payload);
    // console.log("payload", payload);
  };

  // Custom save as draft handler for this page
  const handleSaveAsDraft = (value) => {
    // console.log("value", value);
    const payload = normalizePayloadTambahDriverMassal(value);
    handlePostDriverBulkDrafts(payload)
      .then(() => {
        // Show success message
        toast.success(
          t(
            "TambahDriverMassalScreen.messageSuccessSaveDraft",
            {},
            "Draft driver berhasil disimpan."
          )
        );
      })
      .catch((_error) => {
        // Show error message
        toast.error(
          t(
            "TambahDriverMassalScreen.messageErrorSaveDriver",
            {},
            "Gagal menyimpan draft driver. Periksa kembali data yang dimasukkan."
          )
        );
      });
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
              disabled={isLoadingCreate || isLoadingDraft}
              onClick={handleSaveAsDraft}
              variant="muattrans-primary-secondary"
              type="button"
            >
              {t(
                "TambahDriverMassalScreen.buttonSaveAsDraft",
                {},
                "Simpan Sebagai Draft"
              )}
            </Button>
            <Button
              disabled={isLoadingCreate || isLoadingDraft}
              type="submit"
              onClick={() => {
                handleSubmit();
              }}
            >
              {t("TambahDriverMassalScreen.buttonSave", {}, "Simpan")}
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
            <h2 className="text-base font-bold">
              {t(
                "TambahDriverMassalScreen.titleNotification",
                {},
                "Pemberitahuan"
              )}
            </h2>
            <p className="text-sm font-medium">
              {t(
                "TambahDriverMassalScreen.messageCompleteDraftFirst",
                {},
                "Harap selesaikan data pada menu Draft terlebih dahulu."
              )}
              <br />
              <br />
              {t(
                "TambahDriverMassalScreen.messageUnfinishedDraft",
                {},
                "Kamu memiliki draft tambah driver yang belum selesai. Silakan simpan data tersebut atau hapus draft sebelum menambahkan driver baru"
              )}
            </p>
            <Button
              onClick={() => {
                onValueChange("draft");
              }}
            >
              {t(
                "TambahDriverMassalScreen.buttonCompleteDraft",
                {},
                "Selesaikan Draft"
              )}
            </Button>
          </div>
        </ModalContent>
      </Modal>

      <ConfirmationModal
        isOpen={confirmDeleteModal}
        setIsOpen={setConfirmDeleteModal}
        title={{
          text: t(
            "TambahDriverMassalScreen.titleConfirmDeleteDriver",
            {},
            "Apakah kamu yakin untuk menghapus driver ?"
          ),
          className: "text-sm font-medium text-center",
        }}
        confirm={{
          text: t("TambahDriverMassalScreen.buttonDelete", {}, "Hapus"),
          onClick: handleRemove,
        }}
        cancel={{
          text: t("TambahDriverMassalScreen.buttonCancel", {}, "Batal"),
          onClick: () => {
            setConfirmDeleteModal(false);
          },
        }}
      >
        {t(
          "TambahDriverMassalScreen.messageConfirmDeleteDriver",
          {},
          "Apakah kamu yakin ingin menghapus driver yang telah dipilih? Tindakan ini tidak dapat dibatalkan."
        )}
      </ConfirmationModal>
    </div>
  );
};

export default TambahDriverMassal;
