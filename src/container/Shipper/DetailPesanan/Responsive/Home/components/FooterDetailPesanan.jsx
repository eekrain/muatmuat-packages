import { Fragment, useState } from "react";

import Button from "@/components/Button/Button";
import { ResponsiveFooter } from "@/components/Footer/ResponsiveFooter";
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import { idrFormat } from "@/lib/utils/formatters";

import { BottomsheetAlasanPembatalan } from "./Popup/BottomsheetAlasanPembatalan";
import { ModalBatalkanPesananResponsive } from "./Popup/ModalBatalkanPesananResponsive";
import { ModalKonfimasiBuktiDokumenDiterima } from "./Popup/ModalKonfimasiBuktiDokumenDiterima";

const LIST_SHOW_TOTAL_PRICE = [
  OrderStatusEnum.WAITING_PAYMENT_1,
  OrderStatusEnum.PREPARE_FLEET,
];

export const FooterDetailPesanan = ({
  dataStatusPesanan,
  dataRingkasanPembayaran,
}) => {
  const navigation = useResponsiveNavigation();
  const [isOpenModalBatalkanPesanan, setIsOpenModalBatalkanPesanan] =
    useState(false);
  const [
    isOpenBottomsheetAlasanPembatalan,
    setIsOpenBottomsheetAlasanPembatalan,
  ] = useState(false);

  const [isReceiveDocumentEvidenceOpen, setReceiveDocumentEvidenceOpen] =
    useState(false);

  const renderButtons = useShallowMemo(() => {
    let components = [
      {
        id: "pesan-ulang",
        variant: "muatparts-primary-secondary",
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
              onClick={() => setIsOpenModalBatalkanPesanan(true)}
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
        variant: "muatparts-error-secondary",
        el: (variant) => (
          <Button
            variant={variant}
            className="h-10 w-full p-0"
            onClick={() => setIsOpenModalBatalkanPesanan(true)}
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
    // Ga gitu yakin sih kalo kondisinya ini doang
    else if (dataStatusPesanan?.orderStatus === OrderStatusEnum.PREPARE_FLEET) {
      components = [
        {
          id: "batalkan-pesanan",
          variant: "muatparts-error-secondary",
          el: (variant) => (
            <Button
              variant={variant}
              className="h-10 w-full p-0"
              onClick={() => setIsOpenModalBatalkanPesanan(true)}
              type="button"
            >
              Batalkan Pesanan
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
          {LIST_SHOW_TOTAL_PRICE.includes(dataStatusPesanan?.orderStatus) &&
            dataRingkasanPembayaran?.totalPrice && (
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Total Biaya</div>
                <div className="text-sm font-bold">
                  {idrFormat(dataRingkasanPembayaran?.totalPrice)}
                </div>
              </div>
            )}

          {dataRingkasanPembayaran?.priceCharge && (
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Total Tambahan Biaya</div>
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

      <ModalKonfimasiBuktiDokumenDiterima
        open={isReceiveDocumentEvidenceOpen}
        onOpenChange={setReceiveDocumentEvidenceOpen}
        onConfirm={() => setReceiveDocumentEvidenceOpen(false)}
      />

      <ModalBatalkanPesananResponsive
        open={isOpenModalBatalkanPesanan}
        onOpenChange={setIsOpenModalBatalkanPesanan}
        onConfirm={() => {
          setIsOpenBottomsheetAlasanPembatalan(true);
          setIsOpenModalBatalkanPesanan(false);
        }}
        orderStatus={dataStatusPesanan?.orderStatus}
      />
      <BottomsheetAlasanPembatalan
        open={isOpenBottomsheetAlasanPembatalan}
        onOpenChange={setIsOpenBottomsheetAlasanPembatalan}
        onConfirm={() => {
          setIsOpenBottomsheetAlasanPembatalan(false);
        }}
      />
    </>
  );
};
