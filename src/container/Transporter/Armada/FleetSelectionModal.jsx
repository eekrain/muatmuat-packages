"use client";

import { useEffect, useState } from "react";

import BadgeStatus from "@/components/Badge/BadgeStatus";
import Button from "@/components/Button/Button";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";
import RadioButton from "@/components/Radio/RadioButton";
import { toast } from "@/lib/toast";
import { useGetFleetsList } from "@/services/Transporter/manajemen-driver/getFleetsList";
import { updateDriverFleet } from "@/services/Transporter/manajemen-driver/updateDriverFleet";

const FleetSelectionModal = ({
  onClose,
  onSuccess,
  driverId,
  driverName = "Driver",
  currentFleetId,
  title = "Ubah Armada",
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedFleetId, setSelectedFleetId] = useState(
    currentFleetId || null
  );
  const [viewingPhoto, setViewingPhoto] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedFleet, setSelectedFleet] = useState(null);
  const [showDriverWarning, setShowDriverWarning] = useState(false);
  const [fleetWithDriver, setFleetWithDriver] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch fleets list with integrated API
  const {
    data: fleetsData,
    error: fleetsError,
    isLoading: fleetsLoading,
    mutate: refetchFleets,
  } = useGetFleetsList({
    page: 1,
    limit: 50, // Increased limit for better UX
    search: searchValue,
  });

  const fleets = fleetsData?.fleets || [];

  // Update selected fleet when current fleet changes
  useEffect(() => {
    setSelectedFleetId(currentFleetId || null);
  }, [currentFleetId]);

  // Cleanup function to reset state
  const resetState = () => {
    setSearchValue("");
    setViewingPhoto(null);
    setSelectedFleetId(currentFleetId || null);
    setShowConfirmation(false);
    setShowDriverWarning(false);
  };

  const handleSave = () => {
    if (selectedFleetId && selectedFleetId !== currentFleetId) {
      const fleet = fleets.find((f) => f.id === selectedFleetId);
      setSelectedFleet(fleet);

      // Check if selected fleet has a current driver
      if (fleet && fleet.assignDriver) {
        setFleetWithDriver(fleet);
        setShowDriverWarning(true);
      } else {
        setShowConfirmation(true);
      }
    }
  };

  const handleConfirm = async () => {
    if (selectedFleetId && driverId) {
      setIsUpdating(true);
      try {
        await updateDriverFleet(driverId, selectedFleetId);

        // Success handling
        toast.success("Berhasil memilih armada");
        setShowConfirmation(false);
        resetState();
        onClose();

        // Call success callback
        onSuccess?.(driverId, selectedFleetId);

        // Refresh fleets list
        refetchFleets();
      } catch (error) {
        console.error("Failed to update fleet:", error);
        toast.error("Gagal mengubah armada. Silakan coba lagi.");
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleCancelConfirm = () => {
    setShowConfirmation(false);
  };

  const handleDriverWarningConfirm = () => {
    setShowDriverWarning(false);
    // After confirming the warning, show the confirmation modal
    setShowConfirmation(true);
  };

  const handleDriverWarningCancel = () => {
    setShowDriverWarning(false);
    setFleetWithDriver(null);
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
          type="muatmuat"
          className="h-[508px] w-[472px]"
        >
          <div className="px-6 py-8">
            <h2 className="mb-4 text-center text-base font-bold">
              {viewingPhoto ? "Foto Armada" : title}
            </h2>

            {viewingPhoto ? (
              <div className="flex h-full w-full flex-col items-center">
                <img
                  src={viewingPhoto.photoUrl || "/img/truck.png"}
                  alt={viewingPhoto.licensePlate}
                  className="aspect-square h-full w-full rounded-xl border border-neutral-400 object-cover"
                />
              </div>
            ) : (
              <>
                {/* Search Input */}
                <Input
                  type="text"
                  placeholder="Cari No.Polisi/Armada"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  icon={{
                    left: (
                      <IconComponent
                        src="/icons/datatable-search.svg"
                        width={12}
                      />
                    ),
                    right:
                      searchValue.length > 0 ? (
                        <button
                          onClick={() => {
                            setSearchValue("");
                          }}
                          className="flex items-center justify-center rounded-full p-0.5 hover:bg-neutral-200"
                        >
                          <IconComponent
                            className="size-5 text-neutral-700"
                            src="/icons/close20.svg"
                          />
                        </button>
                      ) : null,
                  }}
                  appearance={{
                    containerClassName: "h-8 w-full",
                    inputClassName: "text-sm font-medium",
                  }}
                />

                {/* Fleet List */}
                <div className="-mr-3 mt-4 h-[321px] divide-y overflow-y-auto pr-2">
                  {fleetsLoading ? (
                    <div className="flex h-[200px] items-center justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-700 border-t-transparent"></div>
                    </div>
                  ) : fleetsError ? (
                    <div className="flex h-[200px] items-center justify-center">
                      <p className="text-sm text-error-400">
                        Gagal memuat data armada
                      </p>
                    </div>
                  ) : fleets.length === 0 ? (
                    <DataNotFound
                      className="h-[321px] gap-y-5"
                      title={
                        <>
                          Keyword Tidak Ditemukan <br /> Di Sistem
                        </>
                      }
                    />
                  ) : (
                    fleets.map((fleet) => (
                      <div
                        key={fleet.id}
                        className="flex h-[104px] cursor-pointer items-center gap-2 py-3 first:h-20 first:pt-0 last:pb-0"
                        onClick={() => setSelectedFleetId(fleet.id)}
                      >
                        {/* Fleet Photo */}
                        <LightboxProvider
                          image={fleet.photoUrl || "/img/truck.png"}
                          title={`Armada ${fleet.licensePlate}`}
                        >
                          <LightboxPreview
                            image={fleet.photoUrl || "/img/truck.png"}
                            alt={fleet.licensePlate}
                            className="h-[68px] w-[68px] cursor-pointer rounded-md object-cover hover:opacity-80"
                          />
                        </LightboxProvider>

                        {/* Fleet Info */}
                        <div className="flex-1">
                          <div className="mb-1 text-xs font-semibold">
                            ID : {fleet.idx}
                          </div>
                          <div className="mb-2 flex items-center gap-2">
                            <div className="line-clamp-1 break-all text-xs font-bold">
                              {fleet.licensePlate}
                            </div>
                            {fleet.warningDocumentExpired && (
                              <BadgeStatus
                                variant="error"
                                className="h-6 w-[199px] shrink-0 p-0"
                              >
                                Masa Berlaku STNK/KIR Berakhir
                              </BadgeStatus>
                            )}
                          </div>
                          <div className="mb-1 flex h-3 items-center gap-2 text-xxs">
                            <IconComponent
                              src={"/icons/user16.svg"}
                              className={
                                "h-3 w-3 text-muat-trans-secondary-900"
                              }
                            />
                            {fleet.assignDriver || "-"}
                          </div>
                          <div className="flex h-3 items-center gap-2 text-xxs">
                            <IconComponent
                              src={"/icons/truck-jenis.svg"}
                              className={
                                "h-3 w-3 text-muat-trans-secondary-900"
                              }
                            />
                            {fleet.carrierTruck?.name} Dan{" "}
                            {fleet.truckType?.name}
                          </div>
                        </div>

                        {/* Radio Button on the right */}
                        <RadioButton
                          name="fleet"
                          value={fleet.id}
                          checked={selectedFleetId === fleet.id}
                          onChange={() => setSelectedFleetId(fleet.id)}
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
                    !selectedFleetId ||
                    selectedFleetId === currentFleetId ||
                    fleetsLoading
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
          <ModalHeader type="muattrans" size="small" />
          <div className="flex flex-col items-center px-6 py-8 font-medium">
            <div className="mb-1 h-[14px] text-center text-sm">
              Apakah Anda yakin ingin memasangkan
            </div>
            <div className="h-[14px] text-center text-sm">
              <span className="font-bold">
                No. Polisi : {selectedFleet?.licensePlate}
              </span>{" "}
              ke <span className="font-bold">{driverName}</span>?
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

      {/* Driver Warning Modal */}
      <Modal
        open={showDriverWarning}
        onOpenChange={setShowDriverWarning}
        closeOnOutsideClick={false}
      >
        <ModalContent className="w-[386px]" type="muattrans">
          <ModalHeader type="muattrans" size="small" />
          <div className="px-6 py-8">
            <div className="text-center">
              <div className="mb-6 text-sm font-medium">
                <span className="font-bold">
                  No. Polisi : {fleetWithDriver?.licensePlate}
                </span>{" "}
                saat ini sedang terpasang dengan{" "}
                <span className="font-bold">
                  {" "}
                  {fleetWithDriver?.assignDriver}
                </span>
              </div>

              <div className="mb-8 text-sm font-medium">
                Jika kamu melanjutkan perubahan,{" "}
                <span className="font-bold">
                  {fleetWithDriver?.assignDriver}
                </span>{" "}
                akan terlepas dari armada tersebut.
                <br />
                Apakah Anda yakin ingin memasangkan
                <br />
                <span className="font-bold">
                  No. Polisi : {fleetWithDriver?.licensePlate}
                </span>{" "}
                ke <span className="font-bold">{driverName}</span>?
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <Button
                variant="muattrans-primary-secondary"
                className="h-8 w-[104px]"
                onClick={handleDriverWarningCancel}
                type="button"
                disabled={isUpdating}
              >
                Batal
              </Button>
              <Button
                variant="muattrans-primary"
                className="h-8 w-[104px]"
                onClick={handleDriverWarningConfirm}
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

const ExpiredDocumentWarningModal = ({ onClose }) => {
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
        <ModalHeader type="muattrans" size="small" />
        <div className="px-6 py-8">
          <div className="text-center">
            <div className="mb-6 text-sm font-medium">
              Driver tidak dapat dipasangkan dengan armada
              <br />
              karena{" "}
              <span className="font-bold">masa berlaku SIM telah berakhir</span>
              .
              <br />
              Mohon perbarui dokumen SIM driver
              <br />
              sebelum memasangkan dengan sebuah armada.
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

export { ExpiredDocumentWarningModal, FleetSelectionModal };
