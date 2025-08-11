"use client";

import { useRouter } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Button from "@/components/Button/Button";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import PageTitle from "@/components/PageTitle/PageTitle";
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
import { useGetDriversPreview } from "@/services/Transporter/manajemen-driver/getDriverPreview";
import { usePostDriverBulkCreate } from "@/services/Transporter/manajemen-driver/postDriverBulkCreate";
import { usePostDriverBulkDrafts } from "@/services/Transporter/manajemen-driver/postDriverBulkDrafts";

import DriverTable from "../../components/DriverTable/DriverTable";

// Function to map API driver data to form structure
const mapDriversToFormData = (drivers) => {
  if (!drivers || !Array.isArray(drivers) || drivers.length === 0) {
    return driverDefaultValues;
  }

  const driverList = drivers.map((driver) => ({
    tempId: driver.tempId, // Keep temp ID for reference
    driverImage: null, // Will be populated by user during editing
    fullName: driver.name || "",
    whatsappNumber: driver.phoneNumber || "",
    ktpPhoto: null, // Will be populated by user during editing
    simB2Photo: null, // Will be populated by user during editing
    simB2ExpiryDate: driver.simExpiryDate || "",
  }));

  return { driverList };
};

export default function PreviewDriver({ params }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = use(params);
  const isFirstMount = useRef(true);
  const [showBackConfirmation, setShowBackConfirmation] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);

  // Define breadcrumb data with translations
  const breadcrumbData = [
    {
      name: t(
        "PreviewDriverScreen.breadcrumbManajemenDriver",
        {},
        "Manajemen Driver"
      ),
      href: "/manajemen-driver",
    },
    {
      name: t(
        "PreviewDriverScreen.breadcrumbTambahDriverMassal",
        {},
        "Tambah Driver Massal"
      ),
      href: "/manajemen-driver/tambah-massal",
    },
    {
      name: t(
        "PreviewDriverScreen.breadcrumbDetailDriver",
        {},
        "Detail Driver"
      ),
    },
  ];

  const { data } = useGetDriversPreview(
    id ? `/v1/drivers/preview/${id}` : null
  );

  // TODO: Replace with actual driver bulk create service
  const { trigger: handlePostDriverBulkCreate, isMutating: isLoadingCreate } =
    usePostDriverBulkCreate();
  const { trigger: handlePostDriverBulkDrafts, isMutating: isLoadingDraft } =
    usePostDriverBulkDrafts();
  // const isMutating = false; // Temporary until service is implemented

  // Custom submit handler for this page
  const handleSubmit = (value) => {
    // TODO: Implement driver bulk create payload normalization
    const payload = normalizePayloadTambahDriverMassal(value);
    handlePostDriverBulkCreate(payload)
      .then((res) => {
        // Show success message
        toast.success(
          t(
            "PreviewDriverScreen.messageSuccessAddDriver",
            { count: res.Data.savedDrivers },
            `Berhasil menambahkan ${res.Data.savedDrivers} driver.`
          )
        );
        router.push(`/manajemen-driver?tab=process`);
      })
      .catch((_error) => {
        // Show error message
        toast.error(
          t(
            "PreviewDriverScreen.messageErrorSaveDraft",
            {},
            "Gagal menyimpan draft driver. Periksa kembali data yang dimasukkan."
          )
        );
      });

    // Temporary implementation
    // toast.success(`Berhasil menambahkan ${value.driverList.length} driver.`);
    // router.push(`/manajemen-driver`);
  };

  // Custom save as draft handler for this page
  const handleSaveAsDraft = (value) => {
    // TODO: Implement driver bulk create payload normalization
    const payload = normalizePayloadTambahDriverMassal(value);
    handlePostDriverBulkCreate(payload)
      .then(() => {
        // Show success message
        toast.success(
          t(
            "PreviewDriverScreen.messageSuccessSaveDraft",
            {},
            "Draft driver berhasil disimpan."
          )
        );
        router.push(`/manajemen-driver/tambah-massal?tab=draft`);
      })
      .catch((_error) => {
        // Show error message
        toast.error(
          t(
            "PreviewDriverScreen.messageErrorSaveDraft",
            {},
            "Gagal menyimpan draft driver. Periksa kembali data yang dimasukkan."
          )
        );
      });

    // Temporary implementation
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
  } = useDriverTableForm({
    defaultValues: driverDefaultValues, // Always start with default values
    schema: driverFormSchema,
    onSubmit: handleSubmit,
    onSaveAsDraft: handleSaveAsDraft,
    validateAndShowErrors: validateDriverForm,
    handleCellValueChange: handleDriverCellValueChange,
    fieldArrayName: "driverList",
  });

  // Update form data when API data loads
  useEffect(() => {
    if (
      data?.Data?.drivers &&
      data.Data.drivers.length > 0 &&
      isFirstMount.current
    ) {
      const formData = mapDriversToFormData(data.Data.drivers);
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
          {t("PreviewDriverScreen.titlePreviewDriver", {}, "Preview Driver")}
        </PageTitle>
      </div>
      <form onSubmit={onSubmit}>
        <div className="rounded-lg bg-white shadow-muat">
          {/* Driver Table */}
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
        </div>
        <div className="mt-4 flex w-full items-end justify-end gap-3">
          <Button
            onClick={onSaveAsDraft}
            disabled={isLoadingCreate || isLoadingDraft}
            variant="muattrans-primary-secondary"
            type="button"
          >
            {t(
              "PreviewDriverScreen.buttonSaveAsDraft",
              {},
              "Simpan Sebagai Draft"
            )}
          </Button>
          <Button disabled={isLoadingCreate || isLoadingDraft} type="submit">
            {t("PreviewDriverScreen.buttonSave", {}, "Simpan")}
          </Button>
        </div>
      </form>
      <ConfirmationModal
        isOpen={confirmDeleteModal}
        setIsOpen={setConfirmDeleteModal}
        title={{
          text: t(
            "PreviewDriverScreen.titleConfirmDeleteDriver",
            {},
            "Apakah kamu yakin untuk menghapus driver ?"
          ),
          className: "text-sm font-medium text-center",
        }}
        confirm={{
          text: t("PreviewDriverScreen.buttonDelete", {}, "Hapus"),
          onClick: handleRemove,
        }}
        cancel={{
          text: t("PreviewDriverScreen.buttonCancel", {}, "Batal"),
          onClick: () => {
            setConfirmDeleteModal(false);
          },
        }}
      >
        {t(
          "PreviewDriverScreen.messageConfirmDeleteDriver",
          {},
          "Apakah kamu yakin ingin menghapus driver yang telah dipilih? Tindakan ini tidak dapat dibatalkan."
        )}
      </ConfirmationModal>

      {/* Back Navigation Confirmation Modal */}
      <ConfirmationModal
        isOpen={showBackConfirmation}
        setIsOpen={setShowBackConfirmation}
        description={{
          text: t(
            "PreviewDriverScreen.descriptionConfirmNavigation",
            {},
            "Apakah kamu yakin ingin berpindah halaman? Data yang telah diisi tidak akan disimpan"
          ),
        }}
        confirm={{
          text: t("PreviewDriverScreen.buttonCancel", {}, "Batal"),
          onClick: cancelNavigation,
        }}
        cancel={{
          text: t("PreviewDriverScreen.buttonYes", {}, "Ya"),
          onClick: confirmNavigation,
        }}
      >
        {t(
          "PreviewDriverScreen.messageConfirmNavigation",
          {},
          "Data yang telah diisi tidak akan disimpan. Apakah kamu yakin ingin meninggalkan halaman ini?"
        )}
      </ConfirmationModal>
    </div>
  );
}
