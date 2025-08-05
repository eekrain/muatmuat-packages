"use client";

import { redirect } from "next/navigation";
import { use, useEffect, useRef } from "react";

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
import { useGetFleetsPreviewArmada } from "@/services/Transporter/manajemen-armada/getFleetsPreviewArmada";

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
const breadcrumbData = [
  { name: "Manajemen Armada", href: "/manajemen-armada" },
  { name: "Tambah Armada Massal", href: "/manajemen-armada/tambah-massal" },
  { name: "Detail Armada" },
];

export default function PreviewArmada({ params }) {
  const { id } = use(params);
  const isFirstMount = useRef(true);
  const { data } = useGetFleetsPreviewArmada(
    id ? `/v1/fleet/preview/${id}` : null
  );

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
