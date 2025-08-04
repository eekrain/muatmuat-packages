import { useState } from "react";

import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
} from "@/components/Bottomsheet/BottomSheet";
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
}) => {
  const [isOpenDetailPengirimanDokumen, setIsOpenDetailPengirimanDokumen] =
    useState(false);
  const [isOpenModalBatalkanPesanan, setIsOpenModalBatalkanPesanan] =
    useState(false);
  const [
    isOpenBottomsheetAlasanPembatalan,
    setIsOpenBottomsheetAlasanPembatalan,
  ] = useState(false);

  const navigation = useResponsiveNavigation();
  const { t } = useTranslation();

  return (
    <>
      <BottomSheet open={open} onOpenChange={onOpenChange}>
        <BottomSheetContent>
          <BottomSheetHeader>
            <BottomSheetClose />
            <BottomSheetTitle>{t("titleMenu")}</BottomSheetTitle>
          </BottomSheetHeader>
          <ul className="flex flex-col gap-4 px-4 pb-6 text-sm font-semibold text-neutral-900">
            <Item
              label={t("labelOrderStatusSummary")}
              onClick={() => navigation.push("/order-summary")}
              t={t}
            />
            {dataStatusPesanan?.withDocumentShipping && (
              <Item
                label={t("labelDocumentShippingDetail")}
                t={t}
                onClick={() => setIsOpenDetailPengirimanDokumen(true)}
              />
            )}
            <Item
              label={t("labelPaymentDetail")}
              onClick={() => alert("Detail Pembayaran clicked")}
              t={t}
            />
            {dataStatusPesanan?.isChangeable && (
              <Item
                label={t("labelEditOrder")}
                onClick={() => alert("Ubah Pesanan clicked")}
                t={t}
              />
            )}
            {dataStatusPesanan?.isCancellable && (
              <Item
                label={t("labelCancelOrder")}
                onClick={() => {
                  setIsOpenModalBatalkanPesanan(true);
                  onOpenChange(false);
                }}
                t={t}
              />
            )}
            <Item
              className="border-transparent pb-0"
              label={t("labelDownloadDeliveryOrder")}
              onClick={() => alert("Unduh Dokumen Delivery Order (DO) clicked")}
              t={t}
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
        onConfirm={() => {
          setIsOpenBottomsheetAlasanPembatalan(false);
        }}
      />
    </>
  );
};

const Item = ({ className, label, onClick, t }) => {
  return (
    <li
      onClick={onClick}
      className={cn(
        "cursor-pointer border-b border-neutral-400 pb-4 text-sm",
        className
      )}
    >
      {label}
    </li>
  );
};
