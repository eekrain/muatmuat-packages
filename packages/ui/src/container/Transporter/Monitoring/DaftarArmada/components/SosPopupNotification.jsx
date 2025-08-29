"use client";

import Image from "next/image";

import Button from "@/components/Button/Button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/Modal/Modal";

import { useTranslation } from "@/hooks/use-translation";

const SosPopupNotification = ({ isOpen, onClose, onConfirm, sosCount = 1 }) => {
  const { t } = useTranslation();

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="w-modal-small" type="muattrans">
        <ModalHeader size="small" onClose={onClose} />
        <ModalTitle className="sr-only">
          {t(
            "SosPopupNotification.title",
            {},
            "Notifikasi Bantuan Darurat (SOS)"
          )}
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
            {t(
              "SosPopupNotification.driverNeedsHelp",
              {},
              "Driver Membutuhkan Bantuan!"
            )}
          </h3>
          <p className="mt-2 text-sm text-neutral-600">
            {t(
              "SosPopupNotification.newDriversNeedHelp",
              { count: sosCount },
              `Terdapat ${sosCount} driver baru yang sedang membutuhkan bantuan`
            )}
          </p>
          <div className="mt-8 flex w-full gap-3">
            <Button
              variant="muattrans-primary-secondary"
              onClick={onClose}
              className="w-full"
            >
              {t("SosPopupNotification.closeButton", {}, "Tutup")}
            </Button>
            <Button onClick={onConfirm} className="w-full">
              {t("SosPopupNotification.viewButton", {}, "Lihat")}
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default SosPopupNotification;
