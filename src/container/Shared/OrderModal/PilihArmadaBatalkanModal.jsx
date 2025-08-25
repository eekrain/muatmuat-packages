"use client";

import { useState } from "react";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import * as v from "valibot";

import BadgeStatus from "@/components/Badge/BadgeStatus";
import Button from "@/components/Button/Button";
import Checkbox from "@/components/Form/Checkbox";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent, ModalTitle } from "@/components/Modal/Modal";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

import ImageArmada from "./components/ImageArmada";

// Valibot validation schema will be created inside component
// to access translation function

const PilihArmadaBatalkan = ({
  isOpen,
  onClose,
  order,
  fleetList = [],
  onConfirm,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const [selectAll, setSelectAll] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create validation schema with translation
  const FleetSelectionSchema = v.object({
    selectedFleets: v.pipe(
      v.array(v.any()),
      v.minLength(
        1,
        t("PilihArmadaBatalkan.fleetRequired", {}, "Armada wajib diisi")
      )
    ),
  });

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    trigger,
  } = useForm({
    resolver: valibotResolver(FleetSelectionSchema),
    defaultValues: {
      selectedFleets: [],
    },
  });

  const selectedFleets = watch("selectedFleets") || [];

  // Dummy images to cycle through (same as LihatArmadaModal)
  const dummyImages = [
    "/img/mock-armada/one.png",
    "/img/mock-armada/two.png",
    "/img/mock-armada/three.png",
  ];

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      const allFleetIds = fleetList.map((fleet) => fleet.id);
      setValue("selectedFleets", allFleetIds);
    } else {
      setValue("selectedFleets", []);
    }
    trigger("selectedFleets");
  };

  const handleFleetSelect = (fleetId, checked) => {
    const currentFleets = selectedFleets;
    if (checked) {
      setValue("selectedFleets", [...currentFleets, fleetId]);
    } else {
      setValue(
        "selectedFleets",
        currentFleets.filter((id) => id !== fleetId)
      );
      setSelectAll(false);
    }
    trigger("selectedFleets");
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await onConfirm?.({
        order,
        selectedFleets: data.selectedFleets,
      });
      handleClose();
    } catch {
      // Error canceling fleets
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirm = handleSubmit(onSubmit);

  const handleClose = () => {
    reset();
    setSelectAll(false);
    setIsSubmitting(false);
    onClose?.();
  };

  const handleOpenChange = (open) => {
    if (!open) {
      handleClose();
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={handleOpenChange}>
      <ModalContent
        className={cn("w-[472px] min-w-[472px] max-w-[472px] bg-white p-0")}
        type="muatmuat"
      >
        <ModalTitle className="sr-only">
          {t(
            "PilihArmadaBatalkan.title",
            {},
            "Pilih Armada Yang Ingin Dibatalkan"
          )}
        </ModalTitle>

        {/* Modal Content */}
        <div className="flex w-full flex-col px-6 pb-8 pt-9">
          {/* Title */}
          <h2
            className={cn(
              "text-center text-base font-bold leading-[120%] text-black",
              "mb-8 w-[420px] max-w-[420px] flex-none self-stretch"
            )}
          >
            {t(
              "PilihArmadaBatalkan.title",
              {},
              "Pilih Armada Yang Ingin Dibatalkan"
            )}
          </h2>

          {/* Fleet List Container */}
          <div className="mb-3 flex h-[308px] w-[424px] flex-none flex-col items-start overflow-y-auto rounded-xl border border-[#C4C4C4] p-3">
            {/* Select All */}
            <div className="mb-3 flex items-center gap-4">
              <Checkbox
                checked={selectAll}
                onChange={({ checked }) => handleSelectAll(checked)}
                disabled={isSubmitting || isLoading}
                className="gap-4"
              >
                <span className="flex-none text-xs font-medium leading-tight text-black">
                  {t("PilihArmadaBatalkan.selectAll", {}, "Pilih Semua Armada")}
                </span>
              </Checkbox>
            </div>

            {/* Fleet List */}
            <div className="w-full space-y-0">
              {fleetList.map((fleet, index) => (
                <div key={fleet.id || index} className="w-full">
                  <div className="flex w-full items-center gap-4 py-4">
                    <Checkbox
                      checked={selectedFleets.includes(fleet.id)}
                      onChange={({ checked }) =>
                        handleFleetSelect(fleet.id, checked)
                      }
                      disabled={isSubmitting || isLoading}
                      label={null}
                      className={"gap-0"}
                    />

                    {/* Fleet Info */}
                    <div className="flex flex-1 items-center gap-4">
                      {/* Fleet Image */}
                      <ImageArmada
                        src={dummyImages[index % dummyImages.length]}
                        plateNumber={fleet.plateNumber}
                        size="sm"
                      />

                      {/* Fleet Details */}
                      <div className="flex h-[44px] flex-1 flex-col items-start justify-center gap-3 py-1">
                        {/* License Plate */}
                        <div className="h-2 w-full">
                          <p className="text-xs font-bold leading-[120%] text-black">
                            {fleet.plateNumber || "AE 1111 LBA"}
                          </p>
                        </div>

                        {/* Driver Name */}
                        <div className="flex h-4 w-full items-center gap-1 p-0">
                          <IconComponent
                            src="/icons/user16.svg"
                            className="h-4 w-4 text-[#461B02]"
                          />
                          <div className="w-full">
                            <p className="text-xs font-medium text-black">
                              {fleet.driverName || "Noel Gallagher"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <BadgeStatus variant="primary" className="w-auto">
                        {fleet.status ||
                          t(
                            "PilihArmadaBatalkan.fleetScheduled",
                            {},
                            "Armada Dijadwalkan"
                          )}
                      </BadgeStatus>
                    </div>
                  </div>

                  {/* Divider */}
                  {index < fleetList.length - 1 && (
                    <hr className="border-gray-200" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Error Alert */}
          {errors.selectedFleets && (
            <p
              className="mb-3 text-left text-xs font-medium leading-tight"
              style={{ color: "#EE4343" }}
            >
              {errors.selectedFleets.message}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between">
            <p className="flex-none text-xs font-bold leading-tight text-black">
              {t(
                "PilihArmadaBatalkan.totalCancelled",
                { current: selectedFleets.length, total: fleetList.length },
                `Total Unit Dibatalkan : ${selectedFleets.length}/${fleetList.length} Unit`
              )}
            </p>

            <Button
              variant="muattrans-primary"
              onClick={handleConfirm}
              disabled={isSubmitting || isLoading}
              {...((isSubmitting || isLoading) && { loading: true })}
              className=""
            >
              {t("PilihArmadaBatalkan.cancelFleet", {}, "Batalkan Armada")}
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default PilihArmadaBatalkan;
