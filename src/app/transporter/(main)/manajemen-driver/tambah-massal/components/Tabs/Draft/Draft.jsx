"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import Button from "@/components/Button/Button";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import {
  driverDefaultValues,
  driverFormSchema,
  handleDriverCellValueChange,
  validateDriverForm,
} from "@/config/forms/driverFormConfig";
import { useDriverTableForm } from "@/hooks/useDriverTableForm";
import { normalizePayloadTambahDriverMassal } from "@/lib/normalizers/transporter/tambah-driver-massal/normalizePayloadTambahDriverMassal";
import { toast } from "@/lib/toast";
import { useGetDriversDrafts } from "@/services/Transporter/manajemen-driver/getDriversDraft";
import { usePostDriverBulkCreate } from "@/services/Transporter/manajemen-driver/postDriverBulkCreate";
import { usePostDriverBulkDrafts } from "@/services/Transporter/manajemen-driver/postDriverBulkDrafts";

import ModalAddArmadaImage from "../../../preview/components/ModalAddImage/ModalAddImage";
import DriverTable from "../../DriverTable/DriverTable";

// Function to map API draft data to form structure
const mapDriversToFormData = (drivers) => {
  if (!drivers || !Array.isArray(drivers) || drivers.length === 0) {
    return driverDefaultValues;
  }

  const driverList = drivers.map((driver) => ({
    tempId: driver.tempId, // Keep temp ID for reference
    driverImage: driver.profileImage || null, // Will be populated by user during editing
    fullName: driver.name || "",
    whatsappNumber: driver.phoneNumber || "",
    ktpPhoto: driver.ktpDocument || "", // Will be populated by user during editing
    simB2Photo: driver.simDocument || "", // Will be populated by user during editing
    simB2ExpiryDate: driver.simExpiryDate || "",
  }));

  return { driverList };
};

const Draft = ({ isDraftAvailable }) => {
  const router = useRouter();
  const isFirstMount = useRef(true);
  const { data, isLoading, error, mutate } = useGetDriversDrafts(
    isDraftAvailable ? "/v1/drivers/draft" : null
  );
  const [activeIndex, setActiveIndex] = useState();
  const [addArmadaImageModal, setAddArmadaImageModal] = useState(false);

  const { trigger: handlePostDriverBulkCreate, isMutating } =
    usePostDriverBulkCreate();
  const { trigger: handlePostDriverBulkDrafts, isMutating: isLoadingDraft } =
    usePostDriverBulkDrafts();

  // Custom submit handler for this page
  const handleSubmit = (value) => {
    const payload = normalizePayloadTambahDriverMassal(value);
    handlePostDriverBulkDrafts(payload)
      .then((res) => {
        // Show success message
        toast.success(`Berhasil menambahkan ${res.Data.totalSaved} Driver.`);
        router.push(`/manajemen-driver?tab=process`);
      })
      .catch((_error) => {
        // Show error message
        toast.error(
          "Gagal menyimpan draft driver. Periksa kembali data yang dimasukkan."
        );
      });
  };

  // Custom save as draft handler for this page
  const handleSaveAsDraft = (value) => {
    console.log("value", value);
    const payload = normalizePayloadTambahDriverMassal(value);
    handlePostDriverBulkDrafts(payload)
      .then(() => {
        // Show success message
        toast.success("Draft driver berhasil disimpan.");
        mutate();
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
    handleSaveAsDraft: onSaveDraft,
  } = useDriverTableForm({
    defaultValues: driverDefaultValues, // Always start with default values
    schema: driverFormSchema,
    onSubmit: handleSubmit,
    onSaveAsDraft: handleSaveAsDraft,
    validateAndShowErrors: validateDriverForm,
    handleCellValueChange: handleDriverCellValueChange,
    fieldArrayName: "driverList",
  });

  // Custom handleAddRow to ensure we always add empty rows
  const handleAddRow = () => {
    append(driverDefaultValues);
  };

  // Update form data when API data loads
  useEffect(() => {
    if (data?.Data?.drivers && data.Data.drivers.length > 0) {
      const formData = mapDriversToFormData(data.Data.drivers);
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

  if (!data?.Data?.drivers || data.Data.drivers.length === 0) {
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
              onClick={onSaveDraft}
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
          text: "Apakah kamu yakin untuk menghapus driver?",
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
