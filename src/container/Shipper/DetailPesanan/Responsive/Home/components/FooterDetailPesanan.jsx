import { useState } from "react";

import Button from "@/components/Button/Button";
import { ResponsiveFooter } from "@/components/Footer/ResponsiveFooter";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";

const WHITELIST_PESAN_ULANG = [
  OrderStatusEnum.CONFIRM_FLEET,
  OrderStatusEnum.LOADING,
  OrderStatusEnum.UNLOADING,
  OrderStatusEnum.COMPLETED,
];

const WHITELIST_PAYMENT_FOOTER = [
  OrderStatusEnum.WAITING_PAYMENT_1,
  OrderStatusEnum.WAITING_PAYMENT_2,
  OrderStatusEnum.WAITING_PAYMENT_3,
  OrderStatusEnum.WAITING_PAYMENT_4,
];

export const FooterDetailPesanan = ({ dataStatusPesanan }) => {
  const navigation = useResponsiveNavigation();

  const [isReceiveDocumentEvidenceOpen, setReceiveDocumentEvidenceOpen] =
    useState(false);

  const renderButtons = () => {
    // Pesan Ulang button for LOADING status
    if (dataStatusPesanan?.orderStatus === OrderStatusEnum.LOADING) {
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
    if (dataStatusPesanan?.orderStatus === OrderStatusEnum.COMPLETED) {
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
    if (WHITELIST_PAYMENT_FOOTER.includes(dataStatusPesanan?.orderStatus)) {
      return (
        <>
          <Button
            variant="muatparts-primary"
            className="h-10 w-full p-0"
            onClick={() => alert("Simpan")}
            type="button"
          >
            Lanjut Pembayaran
          </Button>

          <Button
            variant="muatparts-error-secondary"
            className="h-10 w-full p-0"
            onClick={() => alert("Simpan")}
            type="button"
          >
            Batalkan Pesanan
          </Button>
        </>
      );
    }

    // Multiple buttons for DOCUMENT_DELIVERY status
    if (dataStatusPesanan?.orderStatus === OrderStatusEnum.DOCUMENT_DELIVERY) {
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
    if (dataStatusPesanan?.orderStatus === OrderStatusEnum.COMPLETED) {
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
    if (WHITELIST_PESAN_ULANG.includes(dataStatusPesanan?.orderStatus)) {
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
      <ResponsiveFooter className="flex flex-col gap-4">
        {dataStatusPesanan?.orderStatus ===
          OrderStatusEnum.WAITING_PAYMENT_1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Total Biaya</div>
            <div className="text-sm font-bold">Rp1.021.583</div>
          </div>
        )}
        <div className="flex gap-2">{renderButtons()}</div>
      </ResponsiveFooter>

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
