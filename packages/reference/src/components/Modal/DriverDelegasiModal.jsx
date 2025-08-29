"use client";

import { useState } from "react";

import { useSaveDriverDelegationPopupPreference } from "@/services/Transporter/driver-delegation/savePopupPreference";

import Checkbox from "@/components/Form/Checkbox";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";

const DriverDelegasiModal = ({ open, onOpenChange, onClose }) => {
  const [doNotShowAgain, setDoNotShowAgain] = useState(false);
  const { trigger: savePreference } = useSaveDriverDelegationPopupPreference();

  // Save preference when modal is closed with doNotShowAgain checked
  const handleModalClose = async () => {
    if (doNotShowAgain) {
      try {
        await savePreference({ dontShowAgain: doNotShowAgain });
        console.log("Driver delegation popup preference saved successfully");
        // Call onClose with true to indicate user opted out
        onClose?.(true);
      } catch (error) {
        console.error("Failed to save popup preference:", error);
      }
    }
    onOpenChange(false);
  };

  return (
    <Modal open={open} onOpenChange={handleModalClose} withCloseButton={true}>
      <ModalContent
        size="small"
        type="muattrans"
        className="w-[385px] max-w-[90vw]"
      >
        <ModalHeader />

        <div className="flex flex-col items-center justify-center gap-6 p-6 pb-9 pt-9">
          {/* Illustration */}
          <div className="relative h-[120px] w-[120px]">
            <img
              src="/img/driver-delegasi.png"
              alt="Driver Delegasi"
              className="h-full w-full object-contain"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col items-center gap-3">
            <h2 className="pb-4 text-center text-lg font-bold leading-tight text-neutral-900">
              Driver Delegasi
            </h2>

            <p className="text-sm font-medium leading-tight text-neutral-900">
              Fitur yang memberikan kebebasan kepada driver untuk mengambil
              pesanan instan secara langsung tanpa perlu persetujuan dari pihak
              transporter.
              <br />
              Khusus untuk pesanan terjadwal, pengambilan order dan penugasan
              driver tetap akan dikelola oleh pihak transporter.
            </p>
          </div>

          {/* Checkbox */}
          <Checkbox
            checked={doNotShowAgain}
            onChange={({ checked }) => setDoNotShowAgain(checked)}
            label="Jangan Tampilkan Lagi"
          />
        </div>
      </ModalContent>
    </Modal>
  );
};

export default DriverDelegasiModal;
