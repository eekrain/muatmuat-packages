"use client";

import { useEffect, useState } from "react";

import { Search } from "lucide-react";

import Input from "@/components/Form/Input";
import RadioButton from "@/components/Radio/RadioButton";

import Button from "../Button/Button";
import DataNotFound from "../DataNotFound/DataNotFound";
import IconComponent from "../IconComponent/IconComponent";
import { Modal, ModalContent } from "./Modal";

const DriverSelectionModal = ({
  open,
  onOpenChange,
  onSave,
  vehicleId,
  currentDriverId,
  title = "Ubah Driver", // Allow custom title
  drivers = [],
  isLoading = false,
  error = null,
  onSearch,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedDriverId, setSelectedDriverId] = useState(currentDriverId);

  // Update selected driver when modal opens with current driver
  useEffect(() => {
    setSelectedDriverId(currentDriverId);
  }, [currentDriverId, open]);

  // Clear search when modal closes
  useEffect(() => {
    if (!open) {
      setSearchValue("");
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
    if (selectedDriverId && onSave) {
      onSave(vehicleId, selectedDriverId);
      onOpenChange(false);
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} closeOnOutsideClick>
      <ModalContent
        size="small"
        type="muattrans"
        className="h-[521px] w-[472px]"
      >
        <div className="px-6 py-8">
          <h2 className="mb-4 text-center text-base font-bold">{title}</h2>

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
                    src={driver.driverPhotoUrl || "/img/default-driver.png"}
                    alt={driver.fullName}
                    className="h-[68px] w-[68px] rounded-md object-cover"
                  />

                  {/* Driver Info */}
                  <div className="flex-1">
                    <div className="mb-2 text-sm font-bold">
                      {driver.fullName}
                    </div>
                    <div className="mb-1 flex h-3 items-center gap-2 text-xxs">
                      <IconComponent
                        src={"/icons/driver-whatsapp.svg"}
                        className={"h-3 w-3 text-muat-trans-secondary-900"}
                      />
                      {driver.whatsappNumber}
                    </div>
                    <div className="flex h-3 items-center gap-2 text-xxs">
                      <IconComponent
                        src={"/icons/driver-plat.svg"}
                        className={"h-3 w-3 text-muat-trans-secondary-900"}
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
            disabled={!selectedDriverId}
            className="mx-auto mt-4"
          >
            Simpan
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default DriverSelectionModal;
