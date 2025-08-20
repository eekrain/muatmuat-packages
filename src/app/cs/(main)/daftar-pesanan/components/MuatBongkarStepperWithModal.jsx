"use client";

import { useState } from "react";

import Button from "@/components/Button/Button";
import {
  Modal,
  ModalContent,
  ModalTitle,
  ModalTrigger,
} from "@/components/Modal/Modal";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

const LocationItem = ({ location, isLast, appearance }) => (
  <div className="relative flex items-center gap-3">
    {/* Bullet with custom colors */}
    <div className="relative flex flex-shrink-0 justify-center">
      {/* Dashed line connector */}
      {!isLast && (
        <div className="absolute left-1/2 top-[5px] z-0 h-[30px] w-0 -translate-x-1/2 border-l-[1.5px] border-dashed border-neutral-400" />
      )}
      {/* Bullet */}
      <div
        className={cn(
          "relative z-[1] flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full",
          location.type === "pickup"
            ? "bg-[#FFC217]" // MuatTrans primary yellow
            : "bg-[#461B02]" // MuatTrans secondary brown
        )}
      >
        <div
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            location.type === "pickup"
              ? "bg-[#461B02]" // Brown dot for pickup
              : "bg-neutral-50" // White dot for dropoff
          )}
        />
      </div>
    </div>
    {/* Location text */}
    <span
      className={cn(
        "!line-clamp-2 text-[10px] font-semibold leading-[130%] text-neutral-900",
        appearance?.titleClassName
      )}
    >
      {location.title}
    </span>
  </div>
);

const MuatBongkarStepperWithModal = ({
  pickupLocations = [],
  dropoffLocations = [],
  className,
  appearance = {
    titleClassName: "text-xs font-medium text-gray-900",
  },
  maxVisibleLocations = 2,
}) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const locations = [];
  if (pickupLocations && pickupLocations.length > 0) {
    pickupLocations.forEach((pickup) => {
      locations.push({
        title: pickup.fullAddress || pickup,
        type: "pickup",
        sequence: pickup.sequence,
      });
    });
  }
  if (dropoffLocations && dropoffLocations.length > 0) {
    dropoffLocations.forEach((dropoff) => {
      locations.push({
        title: dropoff.fullAddress || dropoff,
        type: "dropoff",
        sequence: dropoff.sequence,
      });
    });
  }

  if (locations.length === 0) return null;

  const hasMultipleLocations = locations.length > maxVisibleLocations;
  const visibleLocations = hasMultipleLocations
    ? [locations[0], locations[locations.length - 1]]
    : locations;

  return (
    <>
      <div className={cn("flex flex-col gap-3", className)}>
        <div className="flex flex-col gap-3">
          {visibleLocations.map((location, index) => (
            <LocationItem
              key={index}
              location={location}
              isLast={index === visibleLocations.length - 1}
              appearance={appearance}
            />
          ))}
        </div>

        {hasMultipleLocations && (
          <Modal
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            closeOnOutsideClick
          >
            <ModalTrigger asChild>
              <Button
                variant="link"
                className="w-[110px] justify-start p-0 text-xs"
              >
                {t(
                  "muatBongkarStepper.viewOtherLocations",
                  {},
                  "Lihat Lokasi Lainnya"
                )}
              </Button>
            </ModalTrigger>
            <ModalContent type="muatmuat" className="w-[600px] max-w-[90vw]">
              <div className="p-4">
                <ModalTitle className="mb-4 text-center text-base font-bold">
                  {t(
                    "muatBongkarStepper.modalTitle",
                    {},
                    "Lokasi Muat & Bongkar"
                  )}
                </ModalTitle>
                <div className="relative rounded-xl border border-neutral-400 bg-white px-4 pt-4">
                  <div className="mr-[-10px] flex max-h-[368px] flex-col gap-4 overflow-y-auto pb-4 pr-[5px]">
                    {pickupLocations.length > 0 && (
                      <div className="relative flex flex-col gap-3">
                        <div className="ml-7 text-xs font-medium text-neutral-600">
                          {t(
                            "muatBongkarStepper.pickupTitle",
                            {},
                            "Lokasi Muat"
                          )}
                        </div>
                        <div className="relative flex flex-col gap-3">
                          {pickupLocations.map((pickup, index) => (
                            <div
                              key={index}
                              className="relative flex items-center gap-3"
                            >
                              {index < pickupLocations.length - 1 && (
                                <div className="absolute left-[7px] top-4 z-0 h-[calc(100%+12px)] w-0 border-l-2 border-dashed border-neutral-400" />
                              )}
                              {index === pickupLocations.length - 1 &&
                                dropoffLocations.length > 0 && (
                                  <div className="absolute left-[7px] top-4 z-0 h-[calc(100%+32px)] w-0 border-l-2 border-dashed border-neutral-400" />
                                )}
                              <div className="relative z-[1] flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[#FFC217]">
                                <span className="text-[10px] font-bold leading-[12px] text-[#461B02]">
                                  {pickup.sequence || index + 1}
                                </span>
                              </div>
                              <span className="text-xs font-medium leading-[120%] text-neutral-900">
                                {pickup.fullAddress}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {dropoffLocations.length > 0 && (
                      <div className="relative flex flex-col gap-3">
                        <div className="ml-7 text-xs font-medium text-neutral-600">
                          {t(
                            "muatBongkarStepper.dropoffTitle",
                            {},
                            "Lokasi Bongkar"
                          )}
                        </div>
                        <div className="relative flex flex-col gap-3">
                          {dropoffLocations.map((dropoff, index) => (
                            <div
                              key={index}
                              className="relative flex items-center gap-3"
                            >
                              {index < dropoffLocations.length - 1 && (
                                <div className="absolute left-[7px] top-4 z-0 h-[calc(100%+12px)] w-0 border-l-2 border-dashed border-neutral-400" />
                              )}
                              <div className="relative z-[1] flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[#461B02]">
                                <span className="text-[10px] font-bold leading-[12px] text-white">
                                  {dropoff.sequence || index + 1}
                                </span>
                              </div>
                              <span className="text-xs font-medium leading-[120%] text-neutral-900">
                                {dropoff.fullAddress}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ModalContent>
          </Modal>
        )}
      </div>
    </>
  );
};

export default MuatBongkarStepperWithModal;
