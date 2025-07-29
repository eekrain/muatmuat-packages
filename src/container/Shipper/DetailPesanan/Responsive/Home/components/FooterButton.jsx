import { useState } from "react";

import Button from "@/components/Button/Button";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";

export const FooterButton = ({ orderStatus }) => {
  const navigation = useResponsiveNavigation();

  const [isReceiveDocumentEvidenceOpen, setReceiveDocumentEvidenceOpen] =
    useState(false);

  const ALLOW_LIST = {
    DetailRefund: [
      OrderStatusEnum.CANCELED_BY_SHIPPER,
      OrderStatusEnum.CANCELED_BY_SYSTEM,
      OrderStatusEnum.CANCELED_BY_TRANSPORTER,
    ],
    Unduh: "ALL",
    PesanUlang: "ALL",
    DokumenDiterima: [OrderStatusEnum.DOCUMENT_DELIVERY],
    BeriUlasan: [OrderStatusEnum.COMPLETED],
  };

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

  return (
    <>
      <div className="flex gap-2">
        <Button
          variant="muatparts-primary"
          className="h-10 w-full p-0"
          onClick={() => alert("Simpan")}
          type="button"
        >
          Pesan Ulang
        </Button>
      </div>

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
