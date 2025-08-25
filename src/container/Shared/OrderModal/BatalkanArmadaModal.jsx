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
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

const BatalkanArmadaModal = ({
  isOpen,
  onClose,
  order,
  onOpenFleetModal,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleConfirm = async () => {
    if (!agreeToTerms) {
      setShowError(true);
      return;
    }

    // Close this modal and open the fleet selection modal
    handleClose();
    onOpenFleetModal?.(order);
  };

  const handleClose = () => {
    setAgreeToTerms(false);
    setIsSubmitting(false);
    setShowError(false);
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
        <ModalTitle className="sr-only">
          {t("BatalkanArmadaModal.title", {}, "Batalkan Armada")}
        </ModalTitle>

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
            {t("BatalkanArmadaModal.title", {}, "Batalkan Armada")}
          </h2>

          {/* Description */}
          <p
            className={cn(
              "text-center text-sm font-medium leading-[120%] text-black",
              "w-[338px] max-w-[510px] flex-none self-stretch"
            )}
          >
            {t(
              "BatalkanArmadaModal.confirmationMessage",
              {
                orderCode:
                  order?.orderCode || order?.orderNumber || "MT25A010A",
              },
              `Apakah kamu yakin ingin membatalkan armada dari pesanan ${order?.orderCode || order?.orderNumber || "MT25A010A"}?`
            )}
          </p>

          {/* Checkbox Container */}
          <div
            className={cn(
              "flex flex-col items-center justify-center",
              "w-[338px] flex-none"
            )}
          >
            <Checkbox
              checked={agreeToTerms}
              onChange={({ checked }) => {
                setAgreeToTerms(checked);
                if (checked) setShowError(false);
              }}
              disabled={isSubmitting || isLoading}
              appearance={{
                labelClassName: "text-xs font-medium text-black",
              }}
              className="gap-2"
            >
              <span className="text-xs font-medium text-black">
                {t("BatalkanArmadaModal.agreeToTerms", {}, "Saya menyetujui")}{" "}
                <a
                  href="/syarat-ketentuan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary-700 hover:font-semibold hover:text-primary-800"
                >
                  {t(
                    "BatalkanArmadaModal.termsAndConditions",
                    {},
                    "Syarat dan Ketentuan Muatrans"
                  )}
                </a>
              </span>
            </Checkbox>

            {/* Error Alert */}
            {showError && (
              <p
                className="mt-2 text-center text-xs font-medium leading-tight"
                style={{ color: "#EE4343" }}
              >
                {t(
                  "BatalkanArmadaModal.termsError",
                  {},
                  "Setujui syarat dan ketentuan untuk membatalkan armada"
                )}
              </p>
            )}
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
              {t("BatalkanArmadaModal.back", {}, "Kembali")}
            </Button>
            <Button
              variant="muattrans-primary-secondary"
              onClick={handleConfirm}
              disabled={isSubmitting || isLoading}
              className={cn(
                "h-8 text-sm font-semibold md:px-0",
                "w-[127px] flex-none"
              )}
            >
              {t("BatalkanArmadaModal.confirm", {}, "Ya, Batalkan")}
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default BatalkanArmadaModal;
