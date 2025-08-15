"use client";

import { useState } from "react";

import Button from "@/components/Button/Button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/Modal/Modal";
import { cn } from "@/lib/utils";

import UbahJumlahUnitModal from "./UbahJumlahUnitModal";

const ArmadaTidakCukupiModal = ({
  isOpen,
  onClose,
  onChangeUnit,
  orderData,
}) => {
  const [showChangeUnitModal, setShowChangeUnitModal] = useState(false);

  const handleOpenChange = (open) => {
    if (!open) {
      onClose?.();
    }
  };

  const handleChangeUnit = () => {
    setShowChangeUnitModal(true);
  };

  const handleConfirmChangeUnit = async (order) => {
    console.log("Confirming unit change for order:", order);
    onChangeUnit?.(order);
    setShowChangeUnitModal(false);
    onClose?.();
  };

  return (
    <>
      <Modal
        open={isOpen && !showChangeUnitModal}
        onOpenChange={handleOpenChange}
      >
        <ModalContent
          type="muattrans"
          className={cn("w-[386px] bg-white p-0")}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <ModalHeader size="small" />
          <ModalTitle className="sr-only">
            Jumlah Armada Tidak Mencukupi Kebutuhan
          </ModalTitle>

          {/* Modal Content */}
          <div
            className={cn(
              "flex flex-col items-center",
              "w-full gap-6 px-6 py-9"
            )}
          >
            {/* Title */}
            <h2
              className={cn(
                "text-center text-base font-bold leading-[120%] text-black",
                "flex-none self-stretch"
              )}
            >
              Jumlah Armada Tidak Mencukupi Kebutuhan
            </h2>

            {/* Description */}
            <p
              className={cn(
                "text-center text-sm font-medium leading-[120%] text-black",
                "flex-none self-stretch"
              )}
            >
              Jumlah unit yang tersedia tidak cukup untuk memenuhi kebutuhan
              armada yang kamu terima.
            </p>

            {/* Additional Info */}
            <p
              className={cn(
                "text-center text-sm font-medium leading-[120%] text-black",
                "flex-none self-stretch"
              )}
            >
              Segera lakukan penyesuaian jumlah unit kamu.
            </p>

            {/* Action Button */}
            <Button
              variant="muattrans-warning"
              onClick={handleChangeUnit}
              className={cn(
                "h-10 px-6 text-sm font-semibold",
                "w-[176px] flex-none",
                "bg-[#F5C451] text-black hover:bg-[#F5C451]/90"
              )}
            >
              Ubah Jumlah Unit
            </Button>
          </div>
        </ModalContent>
      </Modal>

      {/* Ubah Jumlah Unit Modal */}
      <UbahJumlahUnitModal
        isOpen={showChangeUnitModal}
        onClose={() => setShowChangeUnitModal(false)}
        orderData={orderData}
        onConfirm={handleConfirmChangeUnit}
      />
    </>
  );
};

export default ArmadaTidakCukupiModal;
