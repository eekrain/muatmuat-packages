"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import Button from "@/components/Button/Button";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import {
  defaultInformasiArmada,
  handleVehicleCellValueChange,
  validateVehicleForm,
  vehicleDefaultValues,
  vehicleFormSchema,
} from "@/config/forms/vehicleFormConfig";
import { useTranslation } from "@/hooks/use-translation";
import { useTableForm } from "@/hooks/useTableForm";
import { normalizePayloadTambahArmadaMassal } from "@/lib/normalizers/transporter/tambah-armada-massal/normalizePayloadTambahArmadaMassal";
import { toast } from "@/lib/toast";
import { useGetFleetsDrafts } from "@/services/Transporter/manajemen-armada/getFleetsDrafts";
import { usePostFleetBulkCreate } from "@/services/Transporter/manajemen-armada/postFleetBulkCreate";
import { usePostFleetBulkDrafts } from "@/services/Transporter/manajemen-armada/postFleetsBulkDrafts";

import ArmadaTable from "../../ArmadaTable/ArmadaTable";

// Function to map API draft data to form structure
const mapDraftsToFormData = (drafts) => {
  if (!drafts || !Array.isArray(drafts) || drafts.length === 0) {
    return vehicleDefaultValues;
  }

  const informasiMuatan = drafts.map((draft) => ({
    id: draft.id, // Keep draft ID for reference
    informasi_armada: {
      images: {
        // Map photos to form image structure
        image_armada_depan:
          draft.photos?.find((p) => p.photoType === "FRONT")?.photoUrl || null,
        image_armada_kiri:
          draft.photos?.find((p) => p.photoType === "LEFT")?.photoUrl || null,
        image_armada_kanan:
          draft.photos?.find((p) => p.photoType === "RIGHT")?.photoUrl || null,
        image_armada_belakang:
          draft.photos?.find((p) => p.photoType === "BACK")?.photoUrl || null,
      },
    },
    licensePlate: draft.licensePlate || "",
    jenis_truk: draft.truckTypeId || "",
    jenis_carrier: draft.carrierTypeId || "",
    merek_kendaraan_name: draft.vehicleBrand || "",
    merek_kendaraan_id: draft.vehicleBrandId || "",
    tipe_kendaraan_name: draft.vehicleType || "",
    tipe_kendaraan_id: draft.vehicleTypeId || "",
    tahun_registrasi_kendaraan: draft.registrationYear?.toString() || "",
    dimensi_carrier: {
      panjang: draft.carrierLength?.toString() || "",
      lebar: draft.carrierWidth?.toString() || "",
      tinggi: draft.carrierHeight?.toString() || "",
      unit: draft.carrierDimensionUnit || "m",
    },
    nomor_rangka: draft.chassisNumber || "",
    masa_berlaku_stnk: draft.stnkExpiryDate
      ? new Date(draft.stnkExpiryDate)
      : "",
    foto_stnk: {
      documentUrl:
        draft.documents?.find((d) => d.documentType === "STNK")?.documentUrl ||
        null,
      name:
        draft.documents?.find((d) => d.documentType === "STNK")?.documentName ||
        null,
    },
    foto_pajak_kendaraan: {
      documentUrl:
        draft.documents?.find((d) => d.documentType === "PAJAK")?.documentUrl ||
        null,
      name: draft.documents?.find((d) => d.documentType === "PAJAK")
        ?.documentName,
    },
    nomor_kir: draft.kirNumber || "",
    masa_berlaku_kir: draft.kirExpiryDate ? new Date(draft.kirExpiryDate) : "",
    foto_buku_kir: {
      documentUrl:
        draft.documents?.find((d) => d.documentType === "KIR")?.documentUrl ||
        null,
      name: draft.documents?.find((d) => d.documentType === "KIR")
        ?.documentName,
    },
    estimasi_tanggal_pemasangan_gps: {
      mulai: draft.gpsInstallationEstimateStartDate
        ? new Date(draft.gpsInstallationEstimateStartDate)
        : "",
      selesai: draft.gpsInstallationEstimateEndDate
        ? new Date(draft.gpsInstallationEstimateEndDate)
        : "",
    },
  }));

  return { informasiMuatan };
};

const Draft = ({ isDraftAvailable }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const isFirstMount = useRef(true);
  const { data, isLoading, error, mutate } = useGetFleetsDrafts(
    isDraftAvailable ? "/v1/fleet/drafts" : null
  );

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
            "Draft.toastBerhasilMenambahkanArmada",
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
            "Draft.toastGagalMenyimpanDraftArmada",
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
            "Draft.toastDraftArmadaBerhasilDisimpan",
            {},
            "Draft armada berhasil disimpan."
          )
        );
        mutate();
      })
      .catch((_error) => {
        // Show error message
        toast.error(
          t(
            "Draft.toastGagalMenyimpanDraftArmadaSecond",
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
    handleDeleteRows,
    handleSelectAll,
    handleSelectRow,
    handleCellValueChange,
    handleSearchChange,
    handleRemove,
    handleSubmit: onSubmit,
    setValue,
    reset,
    append,
    handleSaveAsDraft: saveAsDraft,
  } = useTableForm({
    defaultValues: vehicleDefaultValues, // Always start with default values
    schema: vehicleFormSchema,
    onSubmit: handleSubmit,
    onSaveAsDraft: handleSaveAsDraft,
    validateAndShowErrors: validateVehicleForm,
    handleCellValueChange: handleVehicleCellValueChange,
    fieldArrayName: "informasiMuatan",
  });

  // Custom handleAddRow to ensure we always add empty rows
  const handleAddRow = () => {
    append(defaultInformasiArmada);
  };

  // Update form data when API data loads
  useEffect(() => {
    if (
      data?.Data?.drafts &&
      data.Data.drafts.length > 0 &&
      isFirstMount.current
    ) {
      const formData = mapDraftsToFormData(data.Data.drafts);
      reset(formData);
      isFirstMount.current = false;
    }
  }, [data, reset]);

  // Prevent Enter from submitting the parent form when pressed inside inputs
  // (e.g. ArmadaTable search field). Allow Enter for TEXTAREA and actual
  // submit/button elements.
  const handleFormKeyDown = (e) => {
    if (e.key !== "Enter") return;

    const target = e.target;
    if (!target) return;

    // allow Enter in textareas
    if (target.tagName === "TEXTAREA") return;

    // allow Enter when focused element is a button or a real submit control
    const type = target.type;
    if (type === "submit" || type === "button") return;

    // Prevent the default form submit triggered by Enter
    e.preventDefault();
  };

  if (!isDraftAvailable) {
    return (
      <div className="flex h-[280px] w-full items-center justify-center rounded-xl bg-white p-8 shadow-md">
        <DataNotFound
          type="data"
          title={t(
            "Draft.titleBelumAdaDraftArmada",
            {},
            "Belum ada Draft Armada"
          )}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-[280px] w-full items-center justify-center rounded-xl bg-white p-8 shadow-md">
        <div className="text-neutral-500">
          {t("Draft.statusLoadingDrafts", {}, "Loading drafts...")}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[280px] w-full items-center justify-center rounded-xl bg-white p-8 shadow-md">
        <DataNotFound
          type="error"
          title={t(
            "Draft.titleGagalMemuatDraftArmada",
            {},
            "Gagal memuat draft armada"
          )}
        />
      </div>
    );
  }

  if (!data?.Data?.drafts || data.Data.drafts.length === 0) {
    return (
      <div className="flex h-[280px] w-full items-center justify-center rounded-xl bg-white p-8 shadow-md">
        <DataNotFound
          type="data"
          title={t(
            "Draft.titleBelumAdaDraftArmadaEmpty",
            {},
            "Belum ada Draft Armada"
          )}
        />
      </div>
    );
  }

  return (
    <div className="">
      {/* Header Table */}
      <form onSubmit={onSubmit} onKeyDown={handleFormKeyDown}>
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
              onClick={saveAsDraft}
              variant="muattrans-primary-secondary"
              type="button"
            >
              {t("Draft.buttonSimpanSebagaiDraft", {}, "Simpan Sebagai Draft")}
            </Button>
            <Button
              type="submit"
              onClick={() => {
                handleSubmit();
              }}
            >
              {t("Draft.buttonSimpan", {}, "Simpan")}
            </Button>
          </div>
        </div>
      </form>

      <ConfirmationModal
        isOpen={confirmDeleteModal}
        setIsOpen={setConfirmDeleteModal}
        title={{
          text: t("Draft.confirmDeleteTitle"),
          className: "text-sm font-medium text-center",
        }}
        confirm={{
          text: t("Draft.confirmDeleteButton"),
          onClick: handleRemove,
        }}
        cancel={{
          text: t("Draft.cancelButton"),
          onClick: () => {
            setConfirmDeleteModal(false);
          },
        }}
      >
        {t("Draft.confirmDeleteMessage")}
      </ConfirmationModal>
    </div>
  );
};

export default Draft;
