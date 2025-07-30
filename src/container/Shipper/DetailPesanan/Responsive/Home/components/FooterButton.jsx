import { useState } from "react";

import Button from "@/components/Button/Button";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";

export const FooterButton = ({ orderStatus }) => {
  const navigation = useResponsiveNavigation();

  const [isReceiveDocumentEvidenceOpen, setReceiveDocumentEvidenceOpen] =
    useState(false);

  const isWaitingPayment =
    orderStatus === OrderStatusEnum.WAITING_PAYMENT_1 ||
    orderStatus === OrderStatusEnum.WAITING_PAYMENT_2 ||
    orderStatus === OrderStatusEnum.WAITING_PAYMENT_3 ||
    orderStatus === OrderStatusEnum.WAITING_PAYMENT_4;
  const isKnownStatus =
    orderStatus === OrderStatusEnum.LOADING ||
    isWaitingPayment ||
    orderStatus === OrderStatusEnum.DOCUMENT_DELIVERY ||
    orderStatus === OrderStatusEnum.COMPLETED;

  const renderButtons = () => {
    // Pesan Ulang button for LOADING status
    if (orderStatus === OrderStatusEnum.LOADING) {
      return (
        <Button
          variant="muatparts-primary"
          className="h-10 w-full p-0"
          onClick={() => alert("Simpan")}
          type="button"
        >
          Pesan Ulang
        </Button>
      );
    }

    // Beri Ulasan button for COMPLETED status (single button)
    if (orderStatus === OrderStatusEnum.COMPLETED) {
      return (
        <Button
          variant="muatparts-primary"
          className="w-full p-0"
          onClick={() => navigation.push("/ulasan")}
          type="button"
        >
          Beri Ulasan
        </Button>
      );
    }

    // Lanjut Pembayaran button for waiting payment
    if (isWaitingPayment) {
      return (
        <Button
          variant="muatparts-primary"
          className="h-10 w-full p-0"
          onClick={() => alert("Simpan")}
          type="button"
        >
          Lanjut Pembayaran
        </Button>
      );
    }

    // Multiple buttons for DOCUMENT_DELIVERY status
    if (orderStatus === OrderStatusEnum.DOCUMENT_DELIVERY) {
      return (
        <>
          <Button
            variant="muatparts-primary-secondary"
            className="h-10 w-full p-0"
            onClick={() => alert("Simpan")}
            type="button"
          >
            Pesan Ulang
          </Button>
          <Button
            variant="muatparts-primary"
            className="h-10 w-full p-0"
            onClick={() => setReceiveDocumentEvidenceOpen(true)}
            type="button"
          >
            Dokumen Diterima
          </Button>
        </>
      );
    }

    // Multiple buttons for COMPLETED status (duplicate case)
    if (orderStatus === OrderStatusEnum.COMPLETED) {
      return (
        <>
          <Button
            variant="muatparts-primary-secondary"
            className="h-10 w-full p-0"
            onClick={() => alert("Simpan")}
            type="button"
          >
            Pesan Ulang
          </Button>
          <Button
            variant="muatparts-primary"
            className="h-10 w-full p-0"
            onClick={() => navigation.push("/ulasan")}
            type="button"
          >
            Beri Ulasan
          </Button>
        </>
      );
    }

    // Pesan Ulang button for unknown status
    if (!isKnownStatus) {
      return (
        <Button
          variant="muatparts-primary"
          className="h-10 w-full p-0"
          onClick={() => alert("Simpan")}
          type="button"
        >
          Pesan Ulang
        </Button>
      );
    }

    // Return null if no conditions are met
    return null;
  };

  return (
    <>
      <div className="flex gap-2">{renderButtons()}</div>

      {/* Modal Konfirmasi sudah terima bukti dokumen */}
      <Modal
        open={isReceiveDocumentEvidenceOpen}
        onOpenChange={setReceiveDocumentEvidenceOpen}
        closeOnOutsideClick
      >
        <ModalContent type="muatmuat">
          <div className="flex w-[296px] flex-col items-center px-4 py-6">
            <h3 className="text-base font-bold leading-[1.1] text-neutral-900">
              Informasi
            </h3>

            <div className="mt-4 text-center text-sm font-medium leading-[1.1] text-neutral-900">
              {`Klik "Sudah", jika kamu sudah menerima bukti dokumen untuk
              menyelesaikan pesanan.`}
            </div>

            <div className="mt-5 flex items-center gap-x-2">
              <Button
                variant="muatparts-primary-secondary"
                className="min-w-[112px]"
                onClick={() => setReceiveDocumentEvidenceOpen(false)}
                type="button"
              >
                Belum
              </Button>
              <Button
                variant="muatparts-primary"
                className="min-w-[112px]"
                onClick={() => setReceiveDocumentEvidenceOpen(false)}
                type="button"
              >
                Sudah
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};
