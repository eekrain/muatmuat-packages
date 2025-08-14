"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/Modal/Modal";
import { cn } from "@/lib/utils";

const ArmadaTidakTersediaModal = ({ isOpen, onClose, orderData }) => {
  const handleOpenChange = (open) => {
    if (!open) {
      onClose?.();
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={handleOpenChange}>
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
          className={cn("flex flex-col items-center", "w-full gap-6 px-6 py-9")}
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
              "w-[338px] max-w-[338px] flex-none self-stretch"
            )}
          >
            Jumlah unit yang tersedia tidak cukup untuk memenuhi kebutuhan
            armada yang kamu terima.
          </p>

          {/* Additional Info */}
          <p
            className={cn(
              "text-center text-sm font-medium leading-[120%] text-black",
              "w-[338px] max-w-[338px] flex-none self-stretch"
            )}
          >
            Segera hubungi dukungan pelanggan untuk tindakan lebih lanjut.
          </p>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default ArmadaTidakTersediaModal;
