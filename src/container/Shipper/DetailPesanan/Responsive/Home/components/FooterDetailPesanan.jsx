import { Fragment, useState } from "react";

import Button from "@/components/Button/Button";
import { ResponsiveFooter } from "@/components/Footer/ResponsiveFooter";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import { idrFormat } from "@/lib/utils/formatters";

export const FooterDetailPesanan = ({
  dataStatusPesanan,
  dataRingkasanPembayaran,
}) => {
  const navigation = useResponsiveNavigation();

  const [isReceiveDocumentEvidenceOpen, setReceiveDocumentEvidenceOpen] =
    useState(false);

  const renderButtons = useShallowMemo(() => {
    let components = [
      {
        id: "pesan-ulang",
        variant: "muatparts-primary",
        el: (variant) => (
          <Button
            variant={variant}
            className="h-10 w-full p-0"
            onClick={() => alert("Simpan")}
            type="button"
          >
            Pesan Ulang
          </Button>
        ),
      },
    ];

    if (
      dataStatusPesanan?.orderStatus === OrderStatusEnum.COMPLETED &&
      dataStatusPesanan?.reviewData?.canReview
    ) {
      components.push({
        id: "beri-ulasan",
        variant: "muatparts-primary",
        el: (variant) => (
          <Button
            variant={variant}
            className="h-10 w-full p-0"
            onClick={() => navigation.push("/ulasan")}
            type="button"
          >
            Beri Ulasan
          </Button>
        ),
      });
    } else if (
      dataStatusPesanan?.orderStatus === OrderStatusEnum.DOCUMENT_DELIVERY
    ) {
      components.push({
        id: "dokumen-diterima",
        variant: "muatparts-primary",
        el: (variant) => (
          <Button
            variant={variant}
            className="h-10 w-full p-0"
            onClick={() => setReceiveDocumentEvidenceOpen(true)}
            type="button"
          >
            Dokumen Diterima
          </Button>
        ),
      });
    } else if (
      dataStatusPesanan?.orderStatus === OrderStatusEnum.WAITING_PAYMENT_1 ||
      dataStatusPesanan?.orderStatus === OrderStatusEnum.WAITING_PAYMENT_3
    ) {
      components = [
        {
          id: "batalkan-pesanan",
          variant: "muatparts-error-secondary",
          el: (variant) => (
            <Button
              variant={variant}
              className="h-10 w-full p-0"
              onClick={() => alert("Simpan")}
              type="button"
            >
              Batalkan Pesanan
            </Button>
          ),
        },
        {
          id: "lanjut-pembayaran",
          variant: "muatparts-primary",
          el: (variant) => (
            <Button
              variant={variant}
              className="h-10 w-full p-0"
              onClick={() => alert("Simpan")}
              type="button"
            >
              Lanjut Pembayaran
            </Button>
          ),
        },
      ];
    } else if (
      dataStatusPesanan?.orderStatus === OrderStatusEnum.WAITING_PAYMENT_2
    ) {
      components = [];
    } else if (
      dataStatusPesanan?.orderStatus === OrderStatusEnum.WAITING_PAYMENT_4
    ) {
      components.unshift({
        id: "batalkan-pesanan",
        variant: "muatparts-error",
        el: (variant) => (
          <Button
            variant={variant}
            className="h-10 w-full p-0"
            onClick={() => alert("Simpan")}
            type="button"
          >
            Batalkan Pesanan
          </Button>
        ),
      });
    } else if (
      dataStatusPesanan?.orderStatus === OrderStatusEnum.WAITING_REPAYMENT_1
    ) {
      components = [
        {
          id: "lanjut-pembayaran",
          variant: "muatparts-primary",
          el: (variant) => (
            <Button
              variant={variant}
              className="h-10 w-full p-0"
              onClick={() => alert("Simpan")}
              type="button"
            >
              Lanjut Pembayaran
            </Button>
          ),
        },
      ];
    }

    if (components.length > 1 && components[0].id === "pesan-ulang") {
      components[0].variant = "muatparts-primary-secondary";
    }

    return components;
  }, [dataStatusPesanan]);

  return (
    <>
      {renderButtons.length > 0 ? (
        <ResponsiveFooter className="flex flex-col gap-4">
          {dataStatusPesanan?.orderStatus ===
            OrderStatusEnum.WAITING_PAYMENT_1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Total Biaya</div>
              <div className="text-sm font-bold">
                {idrFormat(dataRingkasanPembayaran?.totalPrice)}
              </div>
            </div>
          )}

          {dataStatusPesanan?.orderStatus ===
            OrderStatusEnum.WAITING_REPAYMENT_1 &&
            dataRingkasanPembayaran?.priceCharge && (
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Total Biaya</div>
                <div className="text-sm font-bold">
                  {idrFormat(dataRingkasanPembayaran?.priceCharge?.totalCharge)}
                </div>
              </div>
            )}

          <div className="flex gap-2">
            {renderButtons.map((button) => (
              <Fragment key={button.id}>{button.el(button.variant)}</Fragment>
            ))}
          </div>
        </ResponsiveFooter>
      ) : null}

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
