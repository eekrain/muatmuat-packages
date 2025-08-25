"use client";

import { useState } from "react";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import * as v from "valibot";

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

import PerubahanJumlahUnitModal from "./PerubahanJumlahUnitModal";

// Valibot validation schema will be created inside component
// to access translation function

const UbahJumlahUnitModal = ({
  isOpen,
  onClose,
  orderData,
  onConfirm,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPerubahanModal, setShowPerubahanModal] = useState(false);

  // Create validation schema with translation
  const ChangeUnitSchema = v.object({
    agreeToTerms: v.pipe(
      v.boolean(),
      v.literal(
        true,
        t(
          "UbahJumlahUnitModal.termsError",
          {},
          "Saya menyetujui Syarat dan Ketentuan Muatrans"
        )
      )
    ),
  });

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    trigger,
  } = useForm({
    resolver: valibotResolver(ChangeUnitSchema),
    defaultValues: {
      agreeToTerms: false,
    },
  });

  const agreeToTerms = watch("agreeToTerms");

  const onSubmit = async () => {
    // Open the PerubahanJumlahUnitModal instead of directly confirming
    setShowPerubahanModal(true);
  };

  const handleConfirm = handleSubmit(onSubmit);

  const handlePerubahanConfirm = async (data) => {
    setIsSubmitting(true);
    try {
      await onConfirm?.(data);
      setShowPerubahanModal(false);
      handleClose();
    } catch (error) {
      console.error("Error changing unit count:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setIsSubmitting(false);
    setShowPerubahanModal(false);
    onClose?.();
  };

  const handleOpenChange = (open) => {
    if (!open) {
      handleClose();
    }
  };

  return (
    <>
      <Modal
        open={isOpen && !showPerubahanModal}
        onOpenChange={handleOpenChange}
      >
        <ModalContent
          className={cn("w-[386px] min-w-[386px] max-w-[386px] bg-white p-0")}
          type="muattrans"
        >
          <ModalHeader size="small" />
          <ModalTitle className="sr-only">
            {t("UbahJumlahUnitModal.title", {}, "Ubah Jumlah Unit")}
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
                "w-[338px] max-w-[338px] flex-none self-stretch"
              )}
            >
              {t("UbahJumlahUnitModal.title", {}, "Ubah Jumlah Unit")}
            </h2>

            {/* Warning Message */}
            <p
              className={cn(
                "text-center text-sm font-medium leading-[120%] text-black",
                "w-[338px] max-w-[338px] flex-none self-stretch"
              )}
            >
              {t(
                "UbahJumlahUnitModal.warningMessage",
                {},
                "Perubahan jumlah unit armada hanya dapat dilakukan"
              )}{" "}
              <span className="font-bold">
                {t("UbahJumlahUnitModal.onceOnly", {}, "satu kali")}
              </span>
              .
            </p>

            {/* Question */}
            <p
              className={cn(
                "text-center text-sm font-medium leading-[120%] text-black",
                "w-[338px] max-w-[338px] flex-none self-stretch"
              )}
            >
              {t(
                "UbahJumlahUnitModal.confirmMessage",
                {},
                "Apakah kamu yakin ingin mengubah jumlah unit armada pesanan"
              )}{" "}
              <span className="font-bold">
                {orderData?.orderCode || orderData?.orderNumber || "MT25A002A"}
              </span>
              ?
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
                  setValue("agreeToTerms", checked);
                  if (checked) trigger("agreeToTerms");
                }}
                disabled={isSubmitting || isLoading}
                appearance={{
                  labelClassName: "text-xs font-medium text-black",
                }}
                className="gap-2"
              >
                <span className="text-xs font-medium text-black">
                  {t("UbahJumlahUnitModal.agreeToTerms", {}, "Saya menyetujui")}{" "}
                  <a
                    href="/syarat-ketentuan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary-700 hover:font-semibold hover:text-primary-800"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {t(
                      "UbahJumlahUnitModal.termsAndConditions",
                      {},
                      "Syarat dan Ketentuan Muatrans"
                    )}
                  </a>
                </span>
              </Checkbox>

              {/* Error Alert */}
              {errors.agreeToTerms && (
                <p
                  className="mt-2 text-center text-xs font-medium leading-tight"
                  style={{ color: "#EE4343" }}
                >
                  {errors.agreeToTerms.message}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className={cn("flex gap-3", "h-10 w-[263px] flex-none")}>
              <Button
                variant="muattrans-primary-secondary"
                onClick={handleClose}
                disabled={isSubmitting || isLoading}
                className={cn(
                  "h-10 text-sm font-semibold",
                  "w-[112px] flex-none"
                )}
              >
                {t("UbahJumlahUnitModal.cancel", {}, "Batal")}
              </Button>
              <Button
                variant="muattrans-primary"
                onClick={handleConfirm}
                disabled={isSubmitting || isLoading}
                {...((isSubmitting || isLoading) && { loading: true })}
                className={cn(
                  "h-10 text-sm font-semibold",
                  "w-[112px] flex-none"
                )}
              >
                {t("UbahJumlahUnitModal.yesChange", {}, "Ya, Ubah")}
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>

      {/* Perubahan Jumlah Unit Modal */}
      <PerubahanJumlahUnitModal
        isOpen={showPerubahanModal}
        onClose={() => setShowPerubahanModal(false)}
        orderData={orderData}
        onConfirm={handlePerubahanConfirm}
      />
    </>
  );
};

export default UbahJumlahUnitModal;
