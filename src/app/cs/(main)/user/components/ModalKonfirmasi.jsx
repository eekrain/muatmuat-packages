"use client";

import Button from "@/components/Button/Button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/Modal/Modal";

const ModalKonfirmasi = ({
  isAktif = false,
  companyName = "PT Kalimantan Timur Jaya Sentosa Makmur Sejahtera Internasional",
  onConfirm = () => {},
  onCancel = () => {},
  isOpen = false,
  setIsOpen = () => {},
}) => {
  const buttonText = isAktif ? "Ya, Non Aktifkan" : "Ya, Aktifkan";
  const cancelText = "Kembali";

  const handleConfirm = () => {
    onConfirm();
    setIsOpen(false);
  };

  const handleCancel = () => {
    onCancel();
    setIsOpen(false);
  };

  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <ModalContent
        type="muattrans"
        className="w-[386px] max-w-md p-0"
        withCloseButton={true}
      >
        <div className="flex flex-col">
          {/* Modal Header with MuatMuat styling */}
          <ModalHeader />

          {/* Modal Content */}
          <div className="px-6 py-9 text-center">
            <ModalTitle className="mb-6 text-base font-bold text-black">
              {isAktif ? "Non Aktifkan Transporter" : "Aktifkan Transporter"}
            </ModalTitle>

            <p className="mb-6 text-sm font-medium">
              Apakah{" "}
              {isAktif
                ? "kamu yakin ingin menonaktifkan"
                : "Anda yakin ingin mengaktifkan"}{" "}
              Transporter{" "}
              <span className="font-bold text-black">{companyName}</span>?
            </p>

            {/* Action Buttons */}
            <div className="flex justify-center gap-3">
              <Button
                variant="muattrans-primary"
                className="flex !w-fit"
                onClick={handleCancel}
              >
                {cancelText}
              </Button>
              <Button
                variant="muattrans-primary-secondary"
                className="!w-fit"
                onClick={handleConfirm}
              >
                {buttonText}
              </Button>
            </div>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default ModalKonfirmasi;
