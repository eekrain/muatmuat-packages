"use client";

import { redirect, useRouter } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Button from "@/components/Button/Button";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import PageTitle from "@/components/PageTitle/PageTitle";
import {
  handleVehicleCellValueChange,
  validateVehicleForm,
  vehicleDefaultValues,
  vehicleFormSchema,
} from "@/config/forms/vehicleFormConfig";
import { useTranslation } from "@/hooks/use-translation";
import { useTableForm } from "@/hooks/useTableForm";
import { normalizePayloadTambahArmadaMassal } from "@/lib/normalizers/transporter/tambah-armada-massal/normalizePayloadTambahArmadaMassal";
import { toast } from "@/lib/toast";
import { useGetFleetsPreviewArmada } from "@/services/Transporter/manajemen-armada/getFleetsPreviewArmada";
import { usePostFleetBulkCreate } from "@/services/Transporter/manajemen-armada/postFleetBulkCreate";

import ArmadaTable from "../../components/ArmadaTable/ArmadaTable";

// Function to map API fleet data to form structure
const mapFleetsToFormData = (fleets) => {
  if (!fleets || !Array.isArray(fleets) || fleets.length === 0) {
    return vehicleDefaultValues;
  }

  const informasiMuatan = fleets.map((fleet) => ({
    id: fleet.id, // Keep fleet ID for reference
    informasi_armada: {
      images: {
        // Initialize with null values since photos aren't provided in preview API
        image_armada_depan: null,
        image_armada_kiri: null,
        image_armada_kanan: null,
        image_armada_belakang: null,
      },
    },
    licensePlate: fleet.licensePlate || "",
    jenis_truk: fleet.truckTypeId || "",
    jenis_carrier: fleet.carrierTypeId || "",
    merek_kendaraan_name: fleet.vehicleBrand || "",
    merek_kendaraan_id: fleet.vehicleBrandId || "",
    tipe_kendaraan_name: fleet.vehicleType || "",
    tipe_kendaraan_id: fleet.vehicleTypeId || "",
    tahun_registrasi_kendaraan: fleet.registrationYear?.toString() || "",
    dimensi_carrier: {
      panjang: "",
      lebar: "",
      tinggi: "",
      unit: "m",
    },
    nomor_rangka: fleet.chassisNumber || "",
    masa_berlaku_stnk: fleet.stnkExpiryDate
      ? new Date(fleet.stnkExpiryDate)
      : "",
    foto_stnk: null,
    foto_pajak_kendaraan: null,
    nomor_kir: "",
    masa_berlaku_kir: fleet.kirExpiryDate ? new Date(fleet.kirExpiryDate) : "",
    foto_buku_kir: null,
    estimasi_tanggal_pemasangan_gps: {
      mulai: fleet.gpsInstallationEstimateStartDate
        ? new Date(fleet.gpsInstallationEstimateStartDate)
        : "",
      selesai: fleet.gpsInstallationEstimateEndDate
        ? new Date(fleet.gpsInstallationEstimateEndDate)
        : "",
    },
  }));

  return { informasiMuatan };
};

// Define units (kept for schema validation)

export default function PreviewArmada({ params }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = use(params);
  const isFirstMount = useRef(true);
  const [showBackConfirmation, setShowBackConfirmation] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);

  const breadcrumbData = [
    {
      name: t(
        "PreviewArmada.breadcrumbManajemenArmada",
        {},
        "Manajemen Armada"
      ),
      href: "/manajemen-armada",
    },
    {
      name: t(
        "PreviewArmada.breadcrumbTambahArmadaMassal",
        {},
        "Tambah Armada Massal"
      ),
      href: "/manajemen-armada/tambah-massal",
    },
    { name: t("PreviewArmada.breadcrumbDetailArmada", {}, "Detail Armada") },
  ];

  const { data } = useGetFleetsPreviewArmada(
    id ? `/v1/fleet/preview/${id}` : null
  );
  const { trigger: handlePostFleetBulkCreate, isMutating } =
    usePostFleetBulkCreate();

  // Custom submit handler for this page
  const handleSubmit = (value) => {
    const payload = normalizePayloadTambahArmadaMassal(value);
    handlePostFleetBulkCreate(payload)
      .then((res) => {
        // Show success message
        toast.success(
          t(
            "PreviewArmada.messageSuccessAddFleets",
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
            "PreviewArmada.messageErrorSaveDraft",
            {},
            "Gagal menyimpan draft armada. Periksa kembali data yang dimasukkan."
          )
        );
      });
  };

  // Custom save as draft handler for this page
  const handleSaveAsDraft = (value) => {
    const payload = normalizePayloadTambahArmadaMassal(value);
    handlePostFleetBulkCreate(payload)
      .then(() => {
        // Show success message
        toast.success(
          t(
            "PreviewArmada.messageSuccessSaveDraft",
            {},
            "Draft armada berhasil disimpan."
          )
        );
      })
      .catch((_error) => {
        // Show error message
        toast.error(
          t(
            "PreviewArmada.messageErrorSaveDraftSecond",
            {},
            "Gagal menyimpan draft armada. Periksa kembali data yang dimasukkan."
          )
        );
      });
    redirect("/manajemen-armada/tambah-massal?tab=draft");
  };

  // Handle back navigation with confirmation
  const handleBackNavigation = () => {
    setShowBackConfirmation(true);
    setPendingNavigation(() => () => router.back());
  };

  // Handle breadcrumb navigation with confirmation
  const handleBreadcrumbNavigation = (href) => {
    setShowBackConfirmation(true);
    setPendingNavigation(() => () => router.push(href));
  };

  // Confirm navigation
  const confirmNavigation = () => {
    if (pendingNavigation) {
      pendingNavigation();
    }
    setShowBackConfirmation(false);
    setPendingNavigation(null);
  };

  // Cancel navigation
  const cancelNavigation = () => {
    setShowBackConfirmation(false);
    setPendingNavigation(null);
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
    reset,
  } = useTableForm({
    defaultValues: vehicleDefaultValues, // Always start with default values
    schema: vehicleFormSchema,
    onSubmit: handleSubmit,
    onSaveAsDraft: handleSaveAsDraft,
    validateAndShowErrors: validateVehicleForm,
    handleCellValueChange: handleVehicleCellValueChange,
    fieldArrayName: "informasiMuatan",
  });

  // Update form data when API data loads
  useEffect(() => {
    if (
      data?.Data?.fleets &&
      data.Data.fleets.length > 0 &&
      isFirstMount.current
    ) {
      const formData = mapFleetsToFormData(data.Data.fleets);
      reset(formData);
      isFirstMount.current = false;
    }
  }, [data, reset]);

  // Handle browser back/refresh confirmation
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Enhanced breadcrumb data with navigation handling
  const enhancedBreadcrumbData = breadcrumbData.map((item, index) => {
    if (item.href && index < breadcrumbData.length - 1) {
      return {
        ...item,
        onClick: (e) => {
          e.preventDefault();
          handleBreadcrumbNavigation(item.href);
        },
      };
    }
    return item;
  });
  return (
    <div className="my-6 px-6">
      <div className="flex flex-col gap-4 p-3">
        <BreadCrumb data={enhancedBreadcrumbData} />
        <PageTitle onClick={handleBackNavigation}>
          {t("PreviewArmada.titlePreviewArmada", {}, "Preview Armada")}
        </PageTitle>
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
            disabled={isMutating}
            variant="muattrans-primary-secondary"
            type="button"
          >
            {t("PreviewArmada.buttonSaveAsDraft", {}, "Simpan Sebagai Draft")}
          </Button>
          <Button disabled={isMutating} type="submit">
            {t("PreviewArmada.buttonSave", {}, "Simpan")}
          </Button>
        </div>
      </form>
      <ConfirmationModal
        isOpen={confirmDeleteModal}
        setIsOpen={setConfirmDeleteModal}
        title={{
          text: t(
            "PreviewArmada.titleConfirmDeleteFleet",
            {},
            "Apakah kamu yakin untuk menghapus armada ?"
          ),
          className: "text-sm font-medium text-center",
        }}
        confirm={{
          text: t("PreviewArmada.buttonDelete", {}, "Hapus"),
          onClick: handleRemove,
        }}
        cancel={{
          text: t("PreviewArmada.buttonCancel", {}, "Batal"),
          onClick: () => {
            setConfirmDeleteModal(false);
          },
        }}
      >
        {t(
          "PreviewArmada.messageConfirmDeleteFleet",
          {},
          "Apakah kamu yakin ingin menghapus armada yang telah dipilih? Tindakan ini tidak dapat dibatalkan."
        )}
      </ConfirmationModal>

      {/* Back Navigation Confirmation Modal */}
      <ConfirmationModal
        isOpen={showBackConfirmation}
        setIsOpen={setShowBackConfirmation}
        description={{
          text: t(
            "PreviewArmada.descriptionConfirmNavigation",
            {},
            "Apakah kamu yakin ingin berpindah halaman? Data yang telah diisi tidak akan disimpan"
          ),
        }}
        confirm={{
          text: t("PreviewArmada.buttonCancelNavigation", {}, "Batal"),
          onClick: cancelNavigation,
        }}
        cancel={{
          text: t("PreviewArmada.buttonYes", {}, "Ya"),
          onClick: confirmNavigation,
        }}
      >
        {t(
          "PreviewArmada.messageConfirmNavigation",
          {},
          "Data yang telah diisi tidak akan disimpan. Apakah kamu yakin ingin meninggalkan halaman ini?"
        )}
      </ConfirmationModal>
    </div>
  );
}
