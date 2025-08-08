"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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
import { useTableForm } from "@/hooks/useTableForm";
import { normalizePayloadTambahArmadaMassal } from "@/lib/normalizers/transporter/tambah-armada-massal/normalizePayloadTambahArmadaMassal";
import { toast } from "@/lib/toast";
import { useGetFleetsDrafts } from "@/services/Transporter/manajemen-armada/getFleetsDrafts";
import { usePostFleetBulkCreate } from "@/services/Transporter/manajemen-armada/postFleetBulkCreate";

import ModalAddArmadaImage from "../../../preview/components/ModalAddImage/ModalAddImage";
import ArmadaTable from "../../DriverTable/DriverTable";

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
  const router = useRouter();
  const isFirstMount = useRef(true);
  const { data, isLoading, error } = useGetFleetsDrafts(
    isDraftAvailable ? "/v1/fleet/drafts" : null
  );
  const [activeIndex, setActiveIndex] = useState();
  const [addArmadaImageModal, setAddArmadaImageModal] = useState(false);

  const { trigger: handlePostFleetBulkCreate, isMutating } =
    usePostFleetBulkCreate();

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
    handlePostFleetBulkCreate(payload)
      .then(() => {
        // Show success message
        toast.success("Draft armada berhasil disimpan.");
      })
      .catch((_error) => {
        // Show error message
        toast.error(
          "Gagal menyimpan draft armada. Periksa kembali data yang dimasukkan."
        );
      });
    router.push(`/manajemen-armada?tab=process`);
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

  if (isLoading) {
    return (
      <div className="flex h-[280px] w-full items-center justify-center rounded-xl bg-white p-8 shadow-md">
        <div className="text-neutral-500">Loading drafts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[280px] w-full items-center justify-center rounded-xl bg-white p-8 shadow-md">
        <DataNotFound type="error" title="Gagal memuat draft armada" />
      </div>
    );
  }

  if (!data?.Data?.drafts || data.Data.drafts.length === 0) {
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
