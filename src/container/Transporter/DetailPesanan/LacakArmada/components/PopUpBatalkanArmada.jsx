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
import AlasanPembatalanModal from "@/container/Shared/OrderModal/AlasanPembatalanModal";

const PopUpBatalkanArmada = ({ isOpen, onClose, onConfirm }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (!isChecked) {
      setError("Setujui syarat dan ketentuan untuk membatalkan armada");
      return;
    }
    setError("");
    onConfirm();
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="w-modal-small" type="muattrans">
        <ModalHeader size="small" onClose={onClose} />
        <ModalTitle className="sr-only">Batalkan Armada</ModalTitle>

        <div className="flex flex-col items-center justify-center gap-6 p-8 text-center">
          <h3 className="text-base font-bold text-neutral-900">
            Batalkan Armada
          </h3>

          <p className="text-sm text-neutral-900">
            Apakah kamu yakin ingin membatalkan armada dari pesanan MT25A010A?
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
                Saya menyetujui{" "}
                <span className="cursor-pointer text-primary-800">
                  Syarat dan Ketentuan Muatrans
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
              onClick={onClose}
              className="w-full"
            >
              Kembali
            </Button>
            <Button onClick={handleConfirm} className="w-full">
              Ya, Batalkan
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default PopUpBatalkanArmada;
