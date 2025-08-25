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

const PopUpBatalkanArmada = ({ isOpen, onClose, onConfirm, plateNumber }) => {
  const { t } = useTranslation();
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState("");

  // Debug: log plateNumber
  console.log("PopUpBatalkanArmada - plateNumber:", plateNumber);

  const handleClose = () => {
    // Reset states when closing
    setIsChecked(false);
    setError("");
    onClose();
  };

  const handleConfirm = () => {
    if (!isChecked) {
      setError(
        t(
          "PopUpBatalkanArmada.agreementRequired",
          {},
          "Setujui syarat dan ketentuan untuk membatalkan armada"
        )
      );
      return;
    }
    setError("");
    onConfirm();
  };

  return (
    <Modal open={isOpen} onOpenChange={handleClose}>
      <ModalContent className="w-modal-small" type="muattrans">
        <ModalHeader size="small" onClose={handleClose} />
        <ModalTitle className="sr-only">
          {t("PopUpBatalkanArmada.title", {}, "Batalkan Armada")}
        </ModalTitle>

        <div className="flex flex-col items-center justify-center gap-6 p-8 text-center">
          <h3 className="text-base font-bold text-neutral-900">
            {t("PopUpBatalkanArmada.title", {}, "Batalkan Armada")}
          </h3>

          <p className="text-sm text-neutral-900">
            {`Apakah kamu yakin ingin membatalkan armada ${plateNumber || "Plat Nomor"} dari pesanan ini?`}
          </p>

          {/* Checkbox + Label */}
          <div className="flex flex-col items-start gap-2 text-sm text-neutral-900">
            <div className="flex cursor-pointer items-center gap-2">
              <Checkbox
                type="checkbox"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
                className="h-4 w-4"
                label=" "
              />
              <label
                className="text-xs"
                onClick={() => setIsChecked(!isChecked)}
              >
                {t("PopUpBatalkanArmada.agreementText", {}, "Saya menyetujui")}{" "}
                <span className="cursor-pointer text-primary-700 hover:text-primary-800">
                  {t(
                    "PopUpBatalkanArmada.termsConditions",
                    {},
                    "Syarat dan Ketentuan Muatrans"
                  )}
                </span>
              </label>
            </div>

            {/* Error Message */}
            {error && <p className="text-xs text-error-400">{error}</p>}
          </div>

          {/* Actions */}
          <div className="flex w-full gap-3">
            <Button
              variant="muattrans-primary-secondary"
              onClick={handleClose}
              className="w-full"
            >
              {t("PopUpBatalkanArmada.backButton", {}, "Kembali")}
            </Button>
            <Button onClick={handleConfirm} className="w-full">
              {t("PopUpBatalkanArmada.confirmButton", {}, "Ya, Batalkan")}
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default PopUpBatalkanArmada;
