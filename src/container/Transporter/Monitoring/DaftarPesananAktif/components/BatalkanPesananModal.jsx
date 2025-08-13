"use client";

import { useState } from "react";

import Button from "@/components/Button/Button";
import Checkbox from "@/components/Form/Checkbox";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/Modal/Modal";
import { cn } from "@/lib/utils";

const BatalkanPesananModal = ({
  isOpen,
  onClose,
  order,
  onConfirm,
  isLoading = false,
}) => {
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!agreeToTerms) return;

    setIsSubmitting(true);
    try {
      await onConfirm?.(order);
      handleClose();
    } catch (error) {
      console.error("Error canceling order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setAgreeToTerms(false);
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
        className={cn("w-[386px] min-w-[386px] max-w-[558px] bg-white p-0")}
        type="muattrans"
      >
        <ModalHeader size="small" />
        <ModalTitle className="sr-only">Batalkan Pesanan</ModalTitle>

        {/* Modal Content */}
        <div
          className={cn(
            "flex flex-col items-center",
            "w-full gap-6 px-6 pb-6 pt-9"
          )}
        >
          {/* Title */}
          <h2
            className={cn(
              "text-center text-base font-bold leading-[120%] text-black",
              "w-[338px] max-w-[510px] flex-none self-stretch"
            )}
          >
            Batalkan Pesanan
          </h2>

          {/* Description */}
          <p
            className={cn(
              "text-center text-sm font-medium leading-[120%] text-black",
              "w-[338px] max-w-[510px] flex-none self-stretch"
            )}
          >
            Apakah kamu yakin ingin membatalkan pesanan{" "}
            <span className="font-bold">
              {order?.orderCode || order?.orderNumber || "MT25A010A"}
            </span>
            ?
          </p>

          {/* Checkbox Container */}
          <div
            className={cn(
              "flex items-center justify-center",
              "w-[338px] flex-none"
            )}
          >
            <Checkbox
              checked={agreeToTerms}
              onChange={({ checked }) => setAgreeToTerms(checked)}
              disabled={isSubmitting || isLoading}
              appearance={{
                labelClassName: "text-xs font-medium text-black",
              }}
              className="gap-2"
            >
              <span className="text-xs font-medium text-black">
                Saya menyetujui{" "}
                <a
                  href="/syarat-ketentuan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-700 underline hover:text-primary-800"
                >
                  Syarat dan Ketentuan Muatrans
                </a>
              </span>
            </Checkbox>
          </div>

          {/* Action Buttons */}
          <div className={cn("flex gap-2", "h-8 w-[237px] flex-none")}>
            <Button
              variant="muattrans-primary"
              onClick={handleClose}
              disabled={isSubmitting || isLoading}
              className={cn(
                "h-8 px-6 text-sm font-semibold",
                "w-[102px] flex-none"
              )}
            >
              Kembali
            </Button>
            <Button
              variant="muattrans-primary-secondary"
              onClick={handleConfirm}
              disabled={!agreeToTerms || isSubmitting || isLoading}
              {...((isSubmitting || isLoading) && { loading: true })}
              className={cn(
                "h-8 text-sm font-semibold md:px-0",
                "w-[127px] flex-none"
              )}
            >
              Ya, Batalkan
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default BatalkanPesananModal;
