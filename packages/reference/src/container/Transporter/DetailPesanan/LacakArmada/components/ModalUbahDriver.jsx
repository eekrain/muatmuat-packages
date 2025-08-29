"use client";

import { useEffect, useState } from "react";

import { Info, Phone, Truck } from "lucide-react";

import { useAssignDriver } from "@/services/Transporter/daftar-pesanan/detail-pesanan/assignDriver";
import { useGetDriversList } from "@/services/Transporter/manajemen-armada/getDriversList";

import Button from "@/components/Button/Button";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";
import RadioButton from "@/components/Radio/RadioButton";
import Search from "@/components/Search/Search";

import { useTranslation } from "@/hooks/use-translation";

import { toast } from "@/lib/toast";

const ModalUbahDriver = ({
  onClose,
  onSuccess,
  vehicleId,
  vehiclePlate = "L 8312 L",
  currentDriverId,
  title = "Ubah Driver",
  orderId, // Add orderId prop
}) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState("");
  const [selectedDriverId, setSelectedDriverId] = useState(
    currentDriverId || null
  );
  const [viewingPhoto, setViewingPhoto] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showVehicleWarning, setShowVehicleWarning] = useState(false);
  const [driverWithVehicle, setDriverWithVehicle] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [assignRequest, setAssignRequest] = useState(null);
  //toggle radio button dan badge jadwal driver tidak ada
  const isDriverAvaliable = false;

  // Fetch drivers list with integrated API
  const {
    data: driversData,
    error: driversError,
    isLoading: driversLoading,
    mutate: refetchDrivers,
  } = useGetDriversList({
    page: 1,
    limit: 50, // Increased limit for better UX
    search: searchValue,
  });

  // Assign driver mutation
  const {
    data: assignResult,
    error: assignError,
    isLoading: isAssigning,
  } = useAssignDriver(orderId, vehicleId, assignRequest);

  const drivers = driversData?.drivers || [];

  // Handle assign driver result
  useEffect(() => {
    if (assignResult) {
      console.log("Assign driver result:", assignResult);

      // Show success toast
      toast.success(
        t("ModalUbahDriver.assignSuccess", {}, "Berhasil mengubah driver")
      );

      setShowConfirmation(false);
      resetState();
      onClose();
      onSuccess?.(vehicleId, selectedDriverId);
      setAssignRequest(null); // Reset request
    }
  }, [assignResult, onClose, onSuccess, vehicleId, selectedDriverId, t]);

  // Handle assign driver error
  useEffect(() => {
    if (assignError) {
      console.error("Assign driver error:", assignError);

      // Show error toast
      toast.error(
        t("ModalUbahDriver.assignError", {}, "Gagal mengubah driver")
      );

      setIsUpdating(false);
      setAssignRequest(null); // Reset request
    }
  }, [assignError, t]);

  // Update selected driver when current driver changes
  useEffect(() => {
    setSelectedDriverId(currentDriverId || null);
  }, [currentDriverId]);

  // Cleanup function to reset state
  const resetState = () => {
    setSearchValue("");
    setViewingPhoto(null);
    setSelectedDriverId(currentDriverId || null);
    setShowConfirmation(false);
    setShowVehicleWarning(false);
  };

  const handleSave = () => {
    if (selectedDriverId && selectedDriverId !== currentDriverId) {
      const driver = drivers.find((d) => d.id === selectedDriverId);
      setSelectedDriver(driver);

      // Check if selected driver has a current vehicle
      if (driver && driver.currentVehicle) {
        setDriverWithVehicle(driver);
        setShowVehicleWarning(true);
      } else {
        setShowConfirmation(true);
      }
    }
  };

  const handleConfirm = async () => {
    if (selectedDriverId && vehicleId) {
      setIsUpdating(true);
      try {
        // Prepare request body - only newDriverId
        const requestBody = {
          newDriverId: selectedDriverId,
        };

        console.log("Assign driver request body:", requestBody);

        // Set assign request to trigger the mutation
        setAssignRequest(requestBody);
      } catch (error) {
        console.error("Failed to update driver:", error);
        toast.error(
          t(
            "ModalUbahDriver.errorMessage",
            {},
            "Gagal mengubah driver. Silakan coba lagi."
          )
        );
        setIsUpdating(false);
      }
    }
  };

  const handleCancelConfirm = () => {
    setShowConfirmation(false);
  };

  const handleVehicleWarningConfirm = () => {
    setShowVehicleWarning(false);
    // After confirming the warning, show the confirmation modal
    setShowConfirmation(true);
  };

  const handleVehicleWarningCancel = () => {
    setShowVehicleWarning(false);
    setDriverWithVehicle(null);
  };

  return (
    <>
      <Modal
        open={true}
        onOpenChange={(newOpen) => {
          if (!newOpen) {
            if (viewingPhoto) {
              setViewingPhoto(null);
            } else {
              resetState();
              onClose();
            }
          }
        }}
        closeOnOutsideClick
      >
        <ModalContent size="small" type="muattrans" className="w-[600px]">
          <div className="p-6">
            <h2 className="mb-4 text-center text-base font-bold">
              {viewingPhoto
                ? t("ModalUbahDriver.photoTitle", {}, "Foto Driver")
                : title}
            </h2>

            {viewingPhoto ? (
              <div className="flex h-full w-full flex-col items-center">
                <img
                  src={viewingPhoto.driverPhotoUrl || "/img/default-driver.png"}
                  alt={viewingPhoto.fullName}
                  className="aspect-square h-full w-full rounded-xl border border-neutral-400 object-cover"
                />
              </div>
            ) : (
              <>
                {/* Search Input */}
                <Search
                  placeholder={t(
                    "ModalUbahDriver.searchPlaceholder",
                    {},
                    "Cari No. Polisi / Nama Driver"
                  )}
                  onSearch={setSearchValue}
                  autoSearch={true}
                  debounceTime={300}
                  defaultValue={searchValue}
                />

                {/* Driver List */}
                <div className="mt-3 h-[291px] divide-y overflow-y-auto rounded-lg border border-neutral-400 p-3 pr-2">
                  {driversLoading ? (
                    <div className="flex h-[200px] items-center justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-700 border-t-transparent"></div>
                    </div>
                  ) : driversError ? (
                    <div className="flex h-[200px] items-center justify-center">
                      <p className="text-sm text-error-400">
                        {t(
                          "ModalUbahDriver.loadError",
                          {},
                          "Gagal memuat data driver"
                        )}
                      </p>
                    </div>
                  ) : drivers.length === 0 ? (
                    <DataNotFound
                      className="h-[291px] gap-y-5"
                      title="Keyword Tidak Ditemukan"
                    />
                  ) : (
                    drivers.map((driver) => (
                      <div
                        key={driver.id}
                        className="flex h-[92px] items-center gap-3 py-3 first:h-20 first:pt-0 last:pb-0"
                      >
                        {/* Driver Photo */}
                        <img
                          src={
                            driver.driverPhotoUrl || "/img/default-driver.png"
                          }
                          alt={driver.fullName}
                          className="h-[56px] w-[56px] cursor-pointer rounded-md border border-neutral-400 object-cover hover:opacity-80"
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewingPhoto(driver);
                          }}
                        />

                        {/* Driver Info */}
                        <div className="flex flex-1 flex-col gap-2">
                          <div className="flex items-center gap-2 text-sm font-bold">
                            <div>{driver.fullName}</div>
                          </div>
                          <div className="flex items-center gap-2 text-xxs">
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-muat-trans-secondary-900" />
                              <p>0822-31001-2312</p>
                            </div>
                            <span className="font-bold leading-none text-neutral-600">
                              •
                            </span>
                            <div className="flex items-center gap-1">
                              <Truck className="h-3 w-3 text-muat-trans-secondary-900" />
                              <p>0822-31001-2312</p>
                            </div>
                          </div>
                          <div className="flex h-3 cursor-pointer items-center text-xxs">
                            <a className="text-blue-500 hover:text-blue-800">
                              {t(
                                "ModalUbahDriver.checkSchedule",
                                {},
                                "Cek Jadwal Driver"
                              )}
                            </a>
                          </div>
                        </div>

                        {/* right list content */}
                        {isDriverAvaliable ? (
                          /* Badge for unavailable schedule */
                          <div className="flex h-6 w-[157px] items-center gap-1 rounded-md bg-neutral-200 px-1.5 py-2 text-neutral-600">
                            <InfoTooltip
                              side="top"
                              className="w-[278px]"
                              render={t(
                                "ModalUbahDriver.scheduleTooltip",
                                {},
                                "Jadwal driver tidak tersedia untuk bertugas pada pesanan ini, kamu bisa memilih driver lain yang tersedia"
                              )}
                            >
                              <Info className="h-3 w-3 text-neutral-700" />
                            </InfoTooltip>
                            <span className="text-xs font-semibold text-neutral-600">
                              {t(
                                "ModalUbahDriver.scheduleUnavailable",
                                {},
                                "Jadwal Tidak Tersedia"
                              )}
                            </span>
                          </div>
                        ) : (
                          /* Radio Button  */
                          <RadioButton
                            name="driver"
                            value={driver.id}
                            checked={selectedDriverId === driver.id}
                            onClick={() => setSelectedDriverId(driver.id)}
                            className={"gap-0"}
                          />
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* buttons - EDITED SECTION */}
                <div className="mt-4 flex justify-center gap-2">
                  <Button
                    variant="muattrans-primary-secondary"
                    onClick={onClose} // Make the cancel button work
                  >
                    {t("ModalUbahDriver.cancelButton", {}, "Batal")}
                  </Button>
                  <Button variant="muattrans-primary" onClick={handleSave}>
                    {t("ModalUbahDriver.saveButton", {}, "Simpan")}
                  </Button>
                </div>
              </>
            )}
          </div>
        </ModalContent>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        closeOnOutsideClick={false}
      >
        <ModalContent className="w-[386px]" type="muattrans">
          <ModalHeader type="muattrans" size="small" />
          <div className="flex flex-col items-center px-6 py-8 font-medium">
            <div className="mb-1 h-[14px] text-center text-sm">
              {t(
                "ModalUbahDriver.confirmationText1",
                {},
                "Apakah Anda yakin ingin memasangkan"
              )}
            </div>
            <div className="h-[14px] text-center text-sm">
              <span className="font-bold">{selectedDriver?.fullName}</span>{" "}
              {t("ModalUbahDriver.confirmationText2", {}, "ke")}{" "}
              <span className="font-bold">
                {t("ModalUbahDriver.licenseNumber", {}, "No. Polisi")} :{" "}
                {vehiclePlate}
              </span>{" "}
              ?
            </div>
            <div className="mt-6 flex items-center gap-2">
              <Button
                variant="muattrans-primary-secondary"
                className="h-8 w-28"
                onClick={handleCancelConfirm}
                type="button"
                disabled={isUpdating}
              >
                {t("ModalUbahDriver.cancelButton", {}, "Batal")}
              </Button>
              <Button
                variant="muattrans-primary"
                className="h-8 w-28"
                onClick={handleConfirm}
                type="button"
                disabled={isUpdating || isAssigning}
              >
                {isUpdating || isAssigning ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  t("ModalUbahDriver.confirmYes", {}, "Ya")
                )}
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>

      {/* Vehicle Warning Modal */}
      <Modal
        open={showVehicleWarning}
        onOpenChange={setShowVehicleWarning}
        closeOnOutsideClick={false}
      >
        <ModalContent className="w-[386px]" type="muattrans">
          <ModalHeader type="muattrans" size="small" />
          <div className="px-6 py-8">
            <div className="text-center">
              <div className="mb-6 text-sm font-medium">
                <span className="font-bold">{driverWithVehicle?.fullName}</span>{" "}
                {t(
                  "ModalUbahDriver.vehicleWarningText1",
                  {},
                  "saat ini sedang terpasang dengan"
                )}{" "}
                <span className="font-bold">
                  {" "}
                  {t("ModalUbahDriver.licenseNumber", {}, "No. Polisi")} :{" "}
                  {driverWithVehicle?.currentVehicle}
                </span>
              </div>

              <div className="mb-8 text-sm font-medium">
                {t(
                  "ModalUbahDriver.vehicleWarningText2",
                  {},
                  "Jika kamu melanjutkan perubahan,"
                )}{" "}
                <span className="font-bold">
                  {t("ModalUbahDriver.licenseNumber", {}, "No. Polisi")} :{" "}
                  {driverWithVehicle?.currentVehicle}
                </span>{" "}
                {t(
                  "ModalUbahDriver.vehicleWarningText3",
                  {},
                  "akan terlepas dari driver tersebut."
                )}
                <br />
                {t(
                  "ModalUbahDriver.vehicleWarningText4",
                  {},
                  "Apakah Anda yakin ingin memasangkan"
                )}{" "}
                <span className="font-bold">{driverWithVehicle?.fullName}</span>{" "}
                {t("ModalUbahDriver.confirmationText2", {}, "ke")}{" "}
                <span className="font-bold">
                  {t("ModalUbahDriver.licenseNumber", {}, "No. Polisi")} :{" "}
                  {vehiclePlate}
                </span>{" "}
                ?
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <Button
                variant="muattrans-primary-secondary"
                className="h-8 w-[104px]"
                onClick={handleVehicleWarningCancel}
                type="button"
                disabled={isUpdating || isAssigning}
              >
                {t("ModalUbahDriver.cancelButton", {}, "Batal")}
              </Button>
              <Button
                variant="muattrans-primary"
                className="h-8 w-[104px]"
                onClick={handleVehicleWarningConfirm}
                type="button"
                disabled={isUpdating || isAssigning}
              >
                {t("ModalUbahDriver.confirmYes", {}, "Ya")}
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalUbahDriver;
