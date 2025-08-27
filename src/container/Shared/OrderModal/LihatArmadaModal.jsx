"use client";

import { useState } from "react";

import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent, ModalTitle } from "@/components/Modal/Modal";
import Search from "@/components/Search/Search";

import { useTranslation } from "@/hooks/use-translation";

import { cn } from "@/lib/utils";

import ImageArmada from "./components/ImageArmada";

const LihatArmadaModal = ({ isOpen, onClose, orderData }) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState("");

  // Get assigned vehicles from order data
  const assignedVehicles = orderData?.assignedVehicles || [];

  // Dummy images to cycle through
  const dummyImages = [
    "/img/mock-armada/one.png",
    "/img/mock-armada/two.png",
    "/img/mock-armada/three.png",
  ];

  // Filter vehicles based on search
  const filteredVehicles = assignedVehicles.filter((vehicle) => {
    if (!searchValue) return true;
    const searchLower = searchValue.toLowerCase();
    return (
      vehicle.licensePlate?.toLowerCase().includes(searchLower) ||
      vehicle.driverName?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className={cn("w-[600px] bg-white p-0")} type="muatmuat">
        <ModalTitle className="sr-only">
          {t("LihatArmadaModal.title", {}, "Lihat Armada")}
        </ModalTitle>

        {/* Modal Content */}
        <div
          className={cn(
            "flex flex-col items-center",
            "max-h-[80vh] w-full gap-4 overflow-hidden px-6 pb-6 pt-6"
          )}
        >
          {/* Title */}
          <h2
            className={cn(
              "text-center text-base font-bold leading-[120%] text-black",
              "w-[540px] max-w-[540px] flex-none self-stretch"
            )}
          >
            {t("LihatArmadaModal.fleetList", {}, "Daftar Armada")}
          </h2>

          {/* Search Component - only show if more than one vehicle */}
          {assignedVehicles.length > 1 && (
            <div className="w-full">
              <Search
                placeholder={t(
                  "LihatArmadaModal.searchPlaceholder",
                  {},
                  "Cari No. Polisi / Nama Driver"
                )}
                onSearch={setSearchValue}
                containerClassName="h-8 w-full"
                inputClassName="text-sm"
                autoSearch={true}
              />
            </div>
          )}

          {/* Vehicle List */}
          <div
            className={cn(
              "flex w-full flex-col items-center gap-3 overflow-y-auto"
            )}
            style={{
              maxHeight: assignedVehicles.length > 1 ? "340px" : "none",
            }}
          >
            {filteredVehicles.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-neutral-500">
                  {assignedVehicles.length === 0
                    ? t(
                        "LihatArmadaModal.noFleetAssigned",
                        {},
                        "Belum ada armada yang ditugaskan"
                      )
                    : t(
                        "LihatArmadaModal.noMatchingFleet",
                        {},
                        "Tidak ada armada yang sesuai pencarian"
                      )}
                </p>
              </div>
            ) : (
              filteredVehicles.map((vehicle, index) => (
                /* Item Driver */
                <div
                  key={vehicle.id || index}
                  className={cn(
                    "flex flex-col items-center gap-4 p-3",
                    "h-[76px] w-[540px] bg-white",
                    "rounded-xl border border-[#C4C4C4]"
                  )}
                >
                  {/* Frame 1171276088 */}
                  <div className="flex h-[52px] w-full items-center gap-2 p-0">
                    {/* Image Uploader */}
                    <ImageArmada
                      src={dummyImages[index % dummyImages.length]}
                      plateNumber={vehicle.licensePlate}
                      size="sm"
                    />

                    {/* Frame 1171275764 */}
                    <div className="flex h-[44px] flex-1 flex-col items-start justify-center gap-3 py-1">
                      {/* AE 1111 LBA */}
                      <div className="h-2 w-[76px]">
                        <p className="text-xs font-bold leading-[120%] text-black">
                          {vehicle.licensePlate ||
                            t(
                              "LihatArmadaModal.noLicensePlate",
                              {},
                              "No License Plate"
                            )}
                        </p>
                      </div>

                      {/* Frame 1171276853 */}
                      <div className="flex h-4 w-full items-center gap-1 p-0">
                        {/* Icon */}
                        <IconComponent
                          src="/icons/user16.svg"
                          className="h-4 w-4 text-[#461B02]"
                        />

                        {/* Noel Galagher */}
                        <div className="h-2 w-full">
                          <p className="text-xs font-medium leading-[120%] text-black">
                            {vehicle.driverName ||
                              t("LihatArmadaModal.noDriver", {}, "No Driver")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default LihatArmadaModal;
