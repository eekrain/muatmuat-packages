"use client";

import { useEffect, useState } from "react";

import BadgeStatus from "@/components/Badge/BadgeStatus";
import Button from "@/components/Button/Button";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";
import RadioButton from "@/components/Radio/RadioButton";
import Search from "@/components/Search/Search";
import { toast } from "@/lib/toast";
import { useGetDriversList } from "@/services/Transporter/manajemen-armada/getDriversList";
import { updateVehicleDriver } from "@/services/Transporter/manajemen-armada/updateVehicleDriver";

const DriverSelectionModal = ({
  onClose,
  onSuccess,
  vehicleId,
  vehiclePlate = "L 8312 L",
  currentDriverId,
  title = "Ubah Driver",
  closeButtonClassName, // New prop to accept custom styles for the close button
}) => {
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

  const drivers = driversData?.drivers || [];

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
        await updateVehicleDriver(vehicleId, selectedDriverId);

        // Success handling
        toast.success("Berhasil mengubah driver");
        setShowConfirmation(false);
        resetState();
        onClose();

        // Call success callback
        onSuccess?.(vehicleId, selectedDriverId);

        // Refresh drivers list
        refetchDrivers();
      } catch (error) {
        console.error("Failed to update driver:", error);
        toast.error("Gagal mengubah driver. Silakan coba lagi.");
      } finally {
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
        <ModalContent
          size="small"
          type="muattrans"
          className="h-[508px] w-[472px]"
          appearance={{ closeButtonClassname: closeButtonClassName }}
        >
          <div className="px-6 py-8">
            <h2 className="mb-4 text-center text-base font-bold">
              {viewingPhoto ? "Foto Driver" : title}
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
                <Search
                  placeholder="Cari Driver"
                  onSearch={setSearchValue}
                  autoSearch={true}
                  containerClassName="w-full"
                  inputClassName="text-sm font-medium"
                />

                {/* Driver List */}
                <div className="-mr-3 mt-4 h-[321px] divide-y overflow-y-auto pr-2">
                  {driversLoading ? (
                    <div className="flex h-[200px] items-center justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-700 border-t-transparent"></div>
                    </div>
                  ) : driversError ? (
                    <div className="flex h-[200px] items-center justify-center">
                      <p className="text-sm text-error-400">
                        Gagal memuat data driver
                      </p>
                    </div>
                  ) : drivers.length === 0 ? (
                    <DataNotFound
                      className="h-[321px] gap-y-5"
                      textClass="text-lg"
                      title={
                        <>
                          Keyword Tidak Ditemukan <br /> Di Sistem
                        </>
                      }
                    />
                  ) : (
                    drivers.map((driver) => (
                      <div
                        key={driver.id}
                        className="flex h-[92px] cursor-pointer items-center gap-3 py-3 first:h-20 first:pt-0 last:pb-0"
                        onClick={() => setSelectedDriverId(driver.id)}
                      >
                        {/* Driver Photo */}
                        <img
                          src={
                            driver.driverPhotoUrl || "/img/default-driver.png"
                          }
                          alt={driver.fullName}
                          className="h-[68px] w-[68px] cursor-pointer rounded-md object-cover hover:opacity-80"
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewingPhoto(driver);
                          }}
                        />

                        {/* Driver Info */}
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-2 text-sm font-bold">
                            <div className="line-clamp-1 break-all">
                              {driver.fullName}
                            </div>
                            {driver.isSimExpiryDate && (
                              <BadgeStatus
                                variant="error"
                                className="h-6 w-[165px] shrink-0 p-0 text-xs"
                              >
                                Masa Berlaku SIM Berakhir
                              </BadgeStatus>
                            )}
                          </div>
                          <div className="mb-1 flex h-3 items-center gap-2 text-xxs">
                            <IconComponent
                              src={"/icons/driver-whatsapp.svg"}
                              className={
                                "h-3 w-3 text-muat-trans-secondary-900"
                              }
                            />
                            {driver.whatsappNumber}
                          </div>
                          <div className="flex h-3 items-center gap-2 text-xxs">
                            <IconComponent
                              src={"/icons/driver-plat.svg"}
                              className={
                                "h-3 w-3 text-muat-trans-secondary-900"
                              }
                            />
                            {driver.currentVehicle || "-"}
                          </div>
                        </div>

                        {/* Radio Button on the right */}
                        <RadioButton
                          name="driver"
                          value={driver.id}
                          checked={selectedDriverId === driver.id}
                          onChange={() => setSelectedDriverId(driver.id)}
                          className={"gap-0"}
                        />
                      </div>
                    ))
                  )}
                </div>

                <Button
                  variant="muattrans-primary"
                  onClick={handleSave}
                  disabled={
                    !selectedDriverId ||
                    selectedDriverId === currentDriverId ||
                    driversLoading
                  }
                  className="mx-auto mt-4"
                >
                  Simpan
                </Button>
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
          <ModalHeader
            type="muattrans"
            size="small"
            closeButtonClassName={closeButtonClassName} // Pass prop to ModalHeader
          />
          <div className="flex flex-col items-center px-6 py-8 font-medium">
            <div className="mb-1 h-[14px] text-center text-sm">
              Apakah Anda yakin ingin memasangkan
            </div>
            <div className="h-[14px] text-center text-sm">
              <span className="font-bold">{selectedDriver?.fullName}</span> ke{" "}
              <span className="font-bold">No. Polisi : {vehiclePlate}</span> ?
            </div>
            <div className="mt-6 flex items-center gap-2">
              <Button
                variant="muattrans-primary-secondary"
                className="h-8 w-28"
                onClick={handleCancelConfirm}
                type="button"
                disabled={isUpdating}
              >
                Batal
              </Button>
              <Button
                variant="muattrans-primary"
                className="h-8 w-28"
                onClick={handleConfirm}
                type="button"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  "Ya"
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
          <ModalHeader
            type="muattrans"
            size="small"
            closeButtonClassName={closeButtonClassName} // Pass prop to ModalHeader
          />
          <div className="px-6 py-8">
            <div className="text-center">
              <div className="mb-6 text-sm font-medium">
                <span className="font-bold">{driverWithVehicle?.fullName}</span>{" "}
                saat ini sedang terpasang dengan{" "}
                <span className="font-bold">
                  {" "}
                  No. Polisi : {driverWithVehicle?.currentVehicle}
                </span>
              </div>

              <div className="mb-8 text-sm font-medium">
                Jika kamu melanjutkan perubahan,{" "}
                <span className="font-bold">
                  No. Polisi : {driverWithVehicle?.currentVehicle}
                </span>{" "}
                akan terlepas dari driver tersebut.
                <br />
                Apakah Anda yakin ingin memasangkan{" "}
                <span className="font-bold">
                  {driverWithVehicle?.fullName}
                </span>{" "}
                ke{" "}
                <span className="font-bold">No. Polisi : {vehiclePlate}</span> ?
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <Button
                variant="muattrans-primary-secondary"
                className="h-8 w-[104px]"
                onClick={handleVehicleWarningCancel}
                type="button"
                disabled={isUpdating}
              >
                Batal
              </Button>
              <Button
                variant="muattrans-primary"
                className="h-8 w-[104px]"
                onClick={handleVehicleWarningConfirm}
                type="button"
                disabled={isUpdating}
              >
                Ya
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};

const ExpiredDocumentWarningModal = ({ onClose, closeButtonClassName }) => {
  return (
    <Modal
      open={true}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          onClose();
        }
      }}
      closeOnOutsideClick={false}
    >
      <ModalContent className="w-[386px]" type="muattrans">
        <ModalHeader
          type="muattrans"
          size="small"
          closeButtonClassName={closeButtonClassName} // Pass prop to ModalHeader
        />
        <div className="px-6 py-8">
          <div className="text-center">
            <div className="mb-6 text-sm font-medium">
              Armada tidak dapat dipasangkan dengan driver
              <br />
              karena{" "}
              <span className="font-bold">
                masa berlaku STNK / KIR telah berakhir
              </span>
              .
              <br />
              Mohon perbarui dokumen STNK / KIR armada
              <br />
              sebelum memasangkan dengan seorang driver.
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Button
              variant="muattrans-primary"
              className="h-8 w-[136px]"
              onClick={onClose}
              type="button"
            >
              Mengerti
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export { DriverSelectionModal, ExpiredDocumentWarningModal };
