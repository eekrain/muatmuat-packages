"use client";

import Image from "next/image";

import Button from "@/components/Button/Button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/Modal/Modal";

const SosPopupNotification = ({ isOpen, onClose, onConfirm, sosCount = 1 }) => {
  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="w-modal-small" type="muattrans">
        <ModalHeader size="small" onClose={onClose} />
        <ModalTitle className="sr-only">
          Notifikasi Bantuan Darurat (SOS)
        </ModalTitle>
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-error-50">
            <Image
              src="/icons/monitoring/alertsos.svg"
              alt="SOS Alert"
              width={110}
              height={110}
            />
          </div>
          <h3 className="text-base font-bold text-neutral-900">
            Driver Membutuhkan Bantuan!
          </h3>
          <p className="mt-2 text-sm text-neutral-600">
            Terdapat {sosCount} driver baru yang sedang membutuhkan bantuan
          </p>
          <div className="mt-8 flex w-full gap-3">
            <Button
              variant="muattrans-primary-secondary"
              onClick={onClose}
              className="w-full"
            >
              Tutup
            </Button>
            <Button onClick={onConfirm} className="w-full">
              Lihat
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default SosPopupNotification;
