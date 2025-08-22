import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
} from "@/components/BottomSheet/BottomSheetUp";
import { useTranslation } from "@/hooks/use-translation";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import { cn } from "@/lib/utils";

import { BottomsheetAlasanPembatalan } from "./BottomsheetAlasanPembatalan";
import { BottomsheetDetailPengirimanDokumen } from "./BottomsheetDetailPengirimanDokumen";
import { ModalBatalkanPesananResponsive } from "./ModalBatalkanPesananResponsive";

export const BottomsheetMenuList = ({
  open,
  onOpenChange,
  dataStatusPesanan,
  documentShippingDetail,
  orderId,
}) => {
  const [isOpenDetailPengirimanDokumen, setIsOpenDetailPengirimanDokumen] =
    useState(false);
  const [isOpenModalBatalkanPesanan, setIsOpenModalBatalkanPesanan] =
    useState(false);
  const [
    isOpenBottomsheetAlasanPembatalan,
    setIsOpenBottomsheetAlasanPembatalan,
  ] = useState(false);

  const params = useParams();
  const router = useRouter();
  const navigation = useResponsiveNavigation();
  const { t } = useTranslation();

  return (
    <>
      <BottomSheet open={open} onOpenChange={onOpenChange}>
        <BottomSheetContent>
          <BottomSheetHeader>
            <BottomSheetClose />
            <BottomSheetTitle>
              {t("BottomsheetMenuList.titleMenu", {}, "Menu")}
            </BottomSheetTitle>
          </BottomSheetHeader>
          <ul className="flex flex-col gap-4 px-4 pb-6 text-sm font-semibold text-neutral-900">
            <Item
              label={t(
                "BottomsheetMenuList.labelOrderStatusSummary",
                {},
                "Ringkasan Status Pesanan"
              )}
              onClick={() => navigation.push("/order-summary")}
            />
            {dataStatusPesanan?.withDocumentShipping && (
              <Item
                label={t(
                  "BottomsheetMenuList.labelDocumentShippingDetail",
                  {},
                  "Detail Pengiriman Dokumen"
                )}
                onClick={() => setIsOpenDetailPengirimanDokumen(true)}
              />
            )}
            <Item
              label={t(
                "BottomsheetMenuList.labelPaymentDetail",
                {},
                "Detail Pembayaran"
              )}
              onClick={() => alert("Detail Pembayaran clicked")}
            />
            {dataStatusPesanan?.isChangeable && (
              <Item
                label={t(
                  "BottomsheetMenuList.labelEditOrder",
                  {},
                  "Ubah Pesanan"
                )}
                onClick={() =>
                  router.push(`/sewaarmada/ubahpesanan/${params.orderId}`)
                }
              />
            )}
            {dataStatusPesanan?.isCancellable && (
              <Item
                label={t(
                  "BottomsheetMenuList.labelCancelOrder",
                  {},
                  "Batalkan Pesanan"
                )}
                onClick={() => {
                  setIsOpenModalBatalkanPesanan(true);
                  onOpenChange(false);
                }}
              />
            )}
            <Item
              isLast
              label={t(
                "BottomsheetMenuList.labelDownloadDeliveryOrder",
                {},
                "Unduh Dokumen Delivery Order (DO)"
              )}
              onClick={() => alert("Unduh Dokumen Delivery Order (DO) clicked")}
            />
          </ul>
        </BottomSheetContent>
      </BottomSheet>

      <BottomsheetDetailPengirimanDokumen
        open={isOpenDetailPengirimanDokumen}
        onOpenChange={setIsOpenDetailPengirimanDokumen}
        documentShippingDetail={documentShippingDetail}
      />

      <ModalBatalkanPesananResponsive
        open={isOpenModalBatalkanPesanan}
        onOpenChange={setIsOpenModalBatalkanPesanan}
        onConfirm={() => {
          setIsOpenBottomsheetAlasanPembatalan(true);
        }}
      />
      <BottomsheetAlasanPembatalan
        open={isOpenBottomsheetAlasanPembatalan}
        onOpenChange={setIsOpenBottomsheetAlasanPembatalan}
        orderId={orderId}
        onConfirm={() => {
          setIsOpenBottomsheetAlasanPembatalan(false);
        }}
      />
    </>
  );
};

const Item = ({ className, label, onClick, isLast = false }) => {
  return (
    <li
      onClick={onClick}
      className={cn(
        "cursor-pointer border-b border-neutral-400 pb-4 text-sm",
        isLast ? "border-transparent pb-0" : "",
        className
      )}
    >
      {label}
    </li>
  );
};
