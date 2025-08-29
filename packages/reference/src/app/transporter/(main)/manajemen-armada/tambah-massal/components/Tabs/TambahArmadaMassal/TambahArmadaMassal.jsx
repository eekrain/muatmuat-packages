"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { usePostFleetBulkCreate } from "@/services/Transporter/manajemen-armada/postFleetBulkCreate";
import { usePostFleetBulkDrafts } from "@/services/Transporter/manajemen-armada/postFleetsBulkDrafts";

import Button from "@/components/Button/Button";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";
import { useTabs } from "@/components/Tabs/Tabs";

import { useTranslation } from "@/hooks/use-translation";
import { useTableForm } from "@/hooks/useTableForm";

import { normalizePayloadTambahArmadaMassal } from "@/lib/normalizers/transporter/tambah-armada-massal/normalizePayloadTambahArmadaMassal";
import { toast } from "@/lib/toast";

import {
  handleVehicleCellValueChange,
  validateVehicleForm,
  vehicleDefaultValues,
  vehicleFormSchema,
} from "@/config/forms/vehicleFormConfig";

import ArmadaTable from "../../ArmadaTable/ArmadaTable";

const TambahArmadaMassal = ({ isDraftAvailable }) => {
  const { t } = useTranslation();
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
        toast.success(
          t(
            "TambahArmadaMassal.toastBerhasilMenambahkanArmada",
            { count: res.Data.savedFleets },
            `Berhasil menambahkan ${res.Data.savedFleets} armada.`
          )
        );
        router.push(`/manajemen-armada?tab=process`);
      })
      .catch((_error) => {
        // Show error message
        toast.error(
          t(
            "TambahArmadaMassal.toastGagalMenyimpanDraftArmada",
            {},
            "Gagal menyimpan draft armada. Periksa kembali data yang dimasukkan."
          )
        );
      });
  };

  // Custom save as draft handler for this page
  const handleSaveAsDraft = (value) => {
    const payload = normalizePayloadTambahArmadaMassal(value);
    handlePostFleetBulkDraft(payload)
      .then(() => {
        // Show success message
        toast.success(
          t(
            "TambahArmadaMassal.toastDraftArmadaBerhasilDisimpan",
            {},
            "Draft armada berhasil disimpan."
          )
        );
        onValueChange("draft");
      })
      .catch((_error) => {
        // Show error message
        toast.error(
          t(
            "TambahArmadaMassal.toastGagalMenyimpanDraftArmadaSecond",
            {},
            "Gagal menyimpan draft armada. Periksa kembali data yang dimasukkan."
          )
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
              {t(
                "TambahArmadaMassal.buttonSimpanSebagaiDraft",
                {},
                "Simpan Sebagai Draft"
              )}
            </Button>
            <Button disabled={isMutating || isDraftMutating} type="submit">
              {t("TambahArmadaMassal.buttonSimpan", {}, "Simpan")}
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
              {t("TambahArmadaMassal.titlePemberitahuan", {}, "Pemberitahuan")}
            </h2>
            <p className="text-sm font-medium">
              {t(
                "TambahArmadaMassal.descriptionHarapSelesaikanData",
                {},
                "Harap selesaikan data pada menu Draft terlebih dahulu."
              )}
              <br />
              <br />
              {t(
                "TambahArmadaMassal.descriptionKamuMemilikiDraft",
                {},
                "Kamu memiliki draft tambah armada yang belum selesai. Silakan simpan data tersebut atau hapus draft sebelum menambahkan armada baru"
              )}
            </p>
            <Link href="#">
              <Button
                onClick={() => {
                  onValueChange("draft");
                }}
              >
                {t(
                  "TambahArmadaMassal.buttonSelesaikanDraft",
                  {},
                  "Selesaikan Draft"
                )}
              </Button>
            </Link>
          </div>
        </ModalContent>
      </Modal>

      <ConfirmationModal
        isOpen={confirmDeleteModal}
        setIsOpen={setConfirmDeleteModal}
        title={{
          text: t(
            "TambahArmadaMassal.titleConfirmDeleteArmada",
            {},
            "Apakah kamu yakin untuk menghapus armada ?"
          ),
          className: "text-sm font-medium text-center",
        }}
        confirm={{
          text: t("TambahArmadaMassal.buttonHapus", {}, "Hapus"),
          onClick: handleRemove,
        }}
        cancel={{
          text: t("TambahArmadaMassal.buttonBatal", {}, "Batal"),
          onClick: () => {
            setConfirmDeleteModal(false);
          },
        }}
      >
        {t(
          "TambahArmadaMassal.messageConfirmDeleteArmada",
          {},
          "Apakah kamu yakin ingin menghapus armada yang telah dipilih? Tindakan ini tidak dapat dibatalkan."
        )}
      </ConfirmationModal>
    </div>
  );
};

export default TambahArmadaMassal;
