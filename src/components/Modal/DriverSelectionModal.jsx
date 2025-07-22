"use client";

import { useEffect, useState } from "react";

import { Search } from "lucide-react";

import Input from "@/components/Form/Input";
import RadioButton from "@/components/Radio/RadioButton";

import Button from "../Button/Button";
import DataNotFound from "../DataNotFound/DataNotFound";
import IconComponent from "../IconComponent/IconComponent";
import { Modal, ModalContent, ModalHeader } from "./Modal";

const DriverSelectionModal = ({
  open,
  onOpenChange,
  onSave,
  vehicleId,
  vehiclePlate = "L 8312 L", // Add vehicle plate prop
  currentDriverId,
  title = "Ubah Driver", // Allow custom title
  drivers = [],
  isLoading = false,
  error = null,
  onSearch,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedDriverId, setSelectedDriverId] = useState(
    currentDriverId || null
  );
  const [viewingPhoto, setViewingPhoto] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  // Update selected driver when modal opens with current driver
  useEffect(() => {
    setSelectedDriverId(currentDriverId || null);
  }, [currentDriverId, open]);

  // Clear search and photo view when modal closes
  useEffect(() => {
    if (!open) {
      setSearchValue("");
      setViewingPhoto(null);
    }
  }, [open]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch?.(searchValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue, onSearch]);

  const handleSave = () => {
    if (selectedDriverId && selectedDriverId !== currentDriverId) {
      const driver = drivers.find((d) => d.id === selectedDriverId);
      setSelectedDriver(driver);
      setShowConfirmation(true);
    }
  };

  const handleConfirm = () => {
    if (selectedDriverId && onSave) {
      onSave(vehicleId, selectedDriverId);
      setShowConfirmation(false);
      onOpenChange(false);
    }
  };

  const handleCancelConfirm = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <Modal
        open={open}
        onOpenChange={(newOpen) => {
          if (!newOpen && viewingPhoto) {
            setViewingPhoto(null);
          } else {
            onOpenChange(newOpen);
          }
        }}
        closeOnOutsideClick
      >
        <ModalContent
          size="small"
          type="muattrans"
          className="h-[508px] w-[472px]"
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
                {/* <p className="mt-4 text-sm font-semibold">
                {viewingPhoto.fullName}
              </p> */}
              </div>
            ) : (
              <>
                {/* Search Input */}
                <Input
                  type="text"
                  placeholder="Cari Driver"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  icon={{
                    left: <Search className="h-4 w-4 text-neutral-500" />,
                  }}
                  appearance={{
                    containerClassName: "h-8 w-full",
                    inputClassName: "text-sm font-medium",
                  }}
                />

                {/* Driver List */}
                <div className="-mr-3 mt-4 h-[321px] divide-y overflow-y-auto pr-2">
                  {isLoading ? (
                    <div className="flex h-[200px] items-center justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-700 border-t-transparent"></div>
                    </div>
                  ) : error ? (
                    <div className="flex h-[200px] items-center justify-center">
                      <p className="text-sm text-error-400">
                        Gagal memuat data driver
                      </p>
                    </div>
                  ) : drivers.length === 0 ? (
                    <DataNotFound
                      className="h-[321px] gap-y-5"
                      title="Keyword Tidak Ditemukan Di Sistem"
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
                          <div className="mb-2 text-sm font-bold">
                            {driver.fullName}
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
                            {driver.currentVehicle}
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
                    !selectedDriverId || selectedDriverId === currentDriverId
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
              <span className="font-bold">{selectedDriver?.fullName}</span> ke{" "}
              <span className="font-bold">No. Polisi : {vehiclePlate}</span> ?
            </div>
            <div className="mt-6 flex items-center gap-2">
              <Button
                variant="muattrans-primary-secondary"
                className="h-8 w-28"
                onClick={handleCancelConfirm}
                type="button"
              >
                Batal
              </Button>
              <Button
                variant="muattrans-primary"
                className="h-8 w-28"
                onClick={handleConfirm}
                type="button"
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

export default DriverSelectionModal;
