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
import { useTranslation } from "@/hooks/use-translation";
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

  const driverList = drivers.map((driver) => {
    // Extract KTP document URL from documents array if available
    const ktpDocument =
      driver.documents?.find((doc) => doc.documentType === "KTP")
        ?.documentUrl ||
      driver.ktpDocument ||
      "";

    // Extract SIM document URL from documents array if available
    const simDocument =
      driver.documents?.find((doc) => doc.documentType === "SIM_B2_UMUM")
        ?.documentUrl ||
      driver.simDocument ||
      "";

    // Extract profile photo URL from photos array if available
    const profileImage =
      driver.photos?.find((photo) => photo.photoType === "PROFILE")?.photoUrl ||
      driver.profileImage ||
      null;

    return {
      tempId: driver.tempId || driver.id, // Keep temp ID for reference, fallback to API id
      driverImage: profileImage, // Will be populated by user during editing
      fullName: driver.name || "",
      whatsappNumber: driver.phoneNumber || "",
      ktpPhoto: ktpDocument, // Will be populated by user during editing
      simB2Photo: simDocument, // Will be populated by user during editing
      simB2ExpiryDate: driver.simExpiryDate || "",
      verificationStatus: driver.verificationStatus || "PENDING", // New field from API contract
    };
  });

  return { driverList };
};

const Draft = ({ isDraftAvailable }) => {
  const { t } = useTranslation();
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
    handlePostDriverBulkCreate(payload)
      .then((res) => {
        // Show success message
        toast.success(
          t(
            "Draft.messageSuccessAddDrivers",
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
            "Draft.messageErrorSaveDraft",
            {},
            "Gagal menyimpan draft driver. Periksa kembali data yang dimasukkan."
          )
        );
      });
  };

  // Custom save as draft handler for this page
  const handleSaveAsDraft = (value) => {
    const payload = normalizePayloadTambahDriverMassal(value);
    handlePostDriverBulkDrafts(payload)
      .then(() => {
        // Show success message
        toast.success(
          t(
            "Draft.messageSuccessSaveDraft",
            {},
            "Draft driver berhasil disimpan."
          )
        );
        mutate();
      })
      .catch((_error) => {
        // Show error message
        toast.error(
          t(
            "Draft.messageErrorSaveFleet",
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
        <DataNotFound
          type="data"
          title={t("Draft.titleNoDraftFleet", {}, "Belum ada Draft Armada")}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-[280px] w-full items-center justify-center rounded-xl bg-white p-8 shadow-md">
        <div className="text-neutral-500">
          {t("Draft.messageLoadingDrafts", {}, "Loading drafts...")}
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
            "Draft.titleFailLoadDraftFleet",
            {},
            "Gagal memuat draft armada"
          )}
        />
      </div>
    );
  }

  if (!data?.Data?.drivers || data.Data.drivers.length === 0) {
    return (
      <div className="flex h-[280px] w-full items-center justify-center rounded-xl bg-white p-8 shadow-md">
        <DataNotFound
          type="data"
          title={t(
            "Draft.titleNoDraftFleetEmpty",
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
              {t("Draft.buttonSaveAsDraft", {}, "Simpan Sebagai Draft")}
            </Button>
            <Button
              type="submit"
              onClick={() => {
                handleSubmit();
              }}
            >
              {t("Draft.buttonSave", {}, "Simpan")}
            </Button>
          </div>
        </div>
      </form>

      <ConfirmationModal
        isOpen={confirmDeleteModal}
        setIsOpen={setConfirmDeleteModal}
        title={{
          text: t(
            "Draft.titleConfirmDeleteDriver",
            {},
            "Apakah kamu yakin untuk menghapus driver?"
          ),
          className: "text-sm font-medium text-center",
        }}
        confirm={{
          text: t("Draft.buttonDelete", {}, "Hapus"),
          onClick: handleRemove,
        }}
        cancel={{
          text: t("Draft.buttonCancel", {}, "Batal"),
          onClick: () => {
            setConfirmDeleteModal(false);
          },
        }}
      >
        {t(
          "Draft.messageConfirmDeleteFleet",
          {},
          "Apakah kamu yakin ingin menghapus armada yang telah dipilih? Tindakan ini tidak dapat dibatalkan."
        )}
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
