"use client";

import { useEffect, useState } from "react";

import Button from "@/components/Button/Button";
import InputWithCharCount from "@/components/Form/InputWithCharCount";
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/Modal/Modal";
import TextArea from "@/components/TextArea/TextArea";
import { useTranslation } from "@/hooks/use-translation";

// ConfirmationModal tidak lagi dibutuhkan di sini

const CancelReasonModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  placeholder,
  orderCode,
}) => {
  const { t } = useTranslation();
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setReason("");
      setError("");
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError(
        t(
          "cancelReasonModal.errorRequired",
          {},
          "Alasan pembatalan wajib diisi"
        )
      );
      return;
    }
    // Langsung panggil onSubmit tanpa konfirmasi
    onSubmit(reason);
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent type="muattrans" className={"w-[486px]"}>
        <ModalHeader />
        <div className="p-6 !pb-0 !pt-9">
          <ModalTitle className="!text-start">{title}*</ModalTitle>
          {orderCode && (
            <p className="mt-4 text-center text-sm">
              {t(
                "cancelReasonModal.confirmationText",
                { orderCode: orderCode },
                `Apakah kamu yakin ingin membatalkan pesanan ${orderCode}?`
              )}
            </p>
          )}
          <div className="mt-4">
            <InputWithCharCount
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError("");
              }}
              placeholder={placeholder}
              maxLength={80}
              errorMessage={error}
            />
          </div>
        </div>
        <ModalFooter>
          <Button
            variant="muattrans-primary-secondary"
            className="w-[112px]"
            onClick={onClose}
          >
            {t("cancelReasonModal.buttonCancel", {}, "Batal")}
          </Button>
          <Button
            variant="muattrans-primary"
            className="w-[112px]"
            onClick={handleSubmit}
          >
            {t("cancelReasonModal.buttonSubmit", {}, "Simpan")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CancelReasonModal;
