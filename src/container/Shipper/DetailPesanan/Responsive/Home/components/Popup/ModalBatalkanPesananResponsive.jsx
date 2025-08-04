import Link from "next/link";
import { useEffect, useState } from "react";

import Button from "@/components/Button/Button";
import Checkbox from "@/components/Form/Checkbox";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/Modal";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";

/**
 * @typedef {object} BatalkanPesananModalProps
 * @property {boolean} open - Controls the visibility of the modal.
 * @property {(isOpen: boolean) => void} onOpenChange - Function to call when the modal's open state changes.
 * @property {() => void} onConfirm - Function to call when the confirmation button is clicked.
 * @property {string} orderStatus - The order status to determine modal content.
 */

/**
 * A confirmation modal for cancelling an order, responsive version.
 *
 * @param {ModalBatalkanPesananResponsive} props
 */
export const ModalBatalkanPesananResponsive = ({
  open,
  onOpenChange,
  children,
  onConfirm = () => alert("Not implemented"),
  orderStatus,
}) => {
  const [isAgreed, setIsAgreed] = useState(false);

  const handleOpenChange = (isOpen) => {
    if (onOpenChange) {
      onOpenChange(isOpen);
    }
    if (!isOpen) {
      setIsAgreed(false); // Reset checkbox state when modal closes
    }
  };

  useEffect(() => {
    if (!open) {
      setIsAgreed(false);
    }
  }, [open]);

  // Content based on orderStatus
  let ContentComponent;
  if (orderStatus === OrderStatusEnum.PREPARE_FLEET) {
    ContentComponent = CancelContentWhenPrepareFleet;
  } else {
    ContentComponent = CancelContentWhenNotPrepareFleet;
  }

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalContent className="w-[296px] rounded-[10px] bg-white px-4 py-6 shadow-[0px_2px_20px_rgba(0,0,0,0.25)]">
        <ContentComponent
          isAgreed={isAgreed}
          setIsAgreed={setIsAgreed}
          onConfirm={onConfirm}
          onOpenChange={onOpenChange}
        />
      </ModalContent>
    </Modal>
  );
};

const CancelContentWhenPrepareFleet = ({
  isAgreed,
  setIsAgreed,
  onConfirm,
  onOpenChange,
}) => (
  <div className="relative flex flex-col items-center gap-5">
    <div className="flex flex-col items-center gap-4 text-center">
      <h2 className="text-base font-bold text-neutral-900">Batalkan Pesanan</h2>
      <p className="text-sm font-medium text-neutral-900">
        Apakah kamu yakin ingin membatalkan pesanan?
        <br />
        <br />
        Pastikan kamu sudah membaca
        <br />
        <Link
          href="https://faq.muatmuat.com/pusat-bantuan"
          className="text-primary-700 underline"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          Syarat dan Ketentuan kami.
        </Link>
      </p>
    </div>
    <Checkbox
      checked={isAgreed}
      onChange={({ checked }) => setIsAgreed(checked)}
      className="w-full"
    >
      <span className="text-sm font-semibold text-neutral-900">
        Ya, Saya setuju dengan syarat dan ketentuan tersebut
      </span>
    </Checkbox>
    <Button
      variant="muatparts-primary-secondary"
      className="w-[146px]"
      disabled={!isAgreed}
      keepDisabledStyle
      onClick={() => {
        onConfirm();
        onOpenChange(false);
      }}
    >
      Batalkan Pesanan
    </Button>
  </div>
);

const CancelContentWhenNotPrepareFleet = ({
  isAgreed,
  setIsAgreed,
  onConfirm,
  onOpenChange,
}) => (
  <div className="relative flex flex-col items-center gap-5">
    <div className="flex flex-col items-center gap-4 text-center">
      <h2 className="text-base font-bold text-neutral-900">Batalkan Pesanan</h2>
      <p className="text-sm font-medium text-neutral-900">
        Pembatalan pesanan akan dikenakan biaya admin sebesar Rp100.000/unit.
        <br />
        <br />
        Apakah kamu yakin ingin membatalkan pesanan?
      </p>
    </div>
    <Checkbox
      checked={isAgreed}
      onChange={({ checked }) => setIsAgreed(checked)}
      className="w-full"
    >
      <span className="text-sm font-semibold text-neutral-900">
        Saya menyetujui{" "}
        <Link
          href="https://faq.muatmuat.com/pusat-bantuan"
          className="text-primary-700 underline"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          Syarat dan Ketentuan Muatrans
        </Link>
      </span>
    </Checkbox>
    <Button
      variant="muatparts-primary-secondary"
      className="h-7 w-[146px] text-xs font-semibold leading-[1.1]"
      disabled={!isAgreed}
      onClick={() => {
        onConfirm();
        onOpenChange(false);
      }}
    >
      Batalkan Pesanan
    </Button>
  </div>
);
