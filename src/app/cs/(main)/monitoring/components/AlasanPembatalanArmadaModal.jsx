"use client";

import { useState } from "react";

import Button from "@/components/Button/Button";
import Input from "@/components/Form/Input";
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/Modal/Modal";

import { cn } from "@/lib/utils";

const AlasanPembatalanArmadaModal = ({
  isOpen,
  onClose,
  order,
  selectedFleets = [],
  onConfirm,
  isLoading = false,
}) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const maxLength = 80;

  const handleSubmit = async () => {
    // Validate input
    if (!reason.trim()) {
      setError("Alasan pembatalan wajib diisi");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await onConfirm?.({
        order,
        selectedFleets,
        reason: reason.trim(),
      });
      handleClose();
    } catch {
      // Handle error silently or show toast notification if needed
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setReason("");
    setError("");
    setIsSubmitting(false);
    onClose?.();
  };

  const handleOpenChange = (open) => {
    if (!open) {
      handleClose();
    }
  };

  const handleReasonChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setReason(value);
      if (error) {
        setError("");
      }
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={handleOpenChange}>
      <ModalContent
        className={cn("w-[486px] min-w-[486px] max-w-[486px] bg-white")}
        type="muattrans"
      >
        <ModalHeader />
        <div className="p-6 !pb-0 !pt-9">
          <ModalTitle className="!text-start">
            Masukkan Alasan Pembatalan*
          </ModalTitle>

          <div className="mt-4">
            <Input
              value={reason}
              onChange={handleReasonChange}
              placeholder="Masukkan alasan pembatalan"
              disabled={isSubmitting || isLoading}
              maxLength={maxLength}
              errorMessage={error}
              supportiveText={`${reason.length}/${maxLength}`}
              appearance={{
                containerClassName: "h-auto min-h-[32px]",
                inputClassName: "py-2",
                supportiveTextClassName: "text-neutral-600",
              }}
            />
          </div>
        </div>

        <ModalFooter>
          <Button
            variant="muattrans-primary-secondary"
            className="w-[112px]"
            onClick={handleClose}
            disabled={isSubmitting || isLoading}
          >
            Batal
          </Button>
          <Button
            variant="muattrans-primary"
            className="w-[112px]"
            onClick={handleSubmit}
            disabled={isSubmitting || isLoading}
          >
            Simpan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AlasanPembatalanArmadaModal;
