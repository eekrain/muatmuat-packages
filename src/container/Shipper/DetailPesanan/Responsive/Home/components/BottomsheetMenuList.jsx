import { useState } from "react";

import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
} from "@/components/Bottomsheet/Bottomsheet";
import { useTranslation } from "@/hooks/use-translation";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";

import { BottomsheetAlasanPembatalan } from "./BottomsheetAlasanPembatalan";
import { BottomsheetDocumentShipping } from "./BottomsheetDocumentShipping";
import { ModalBatalkanPesananResponsive } from "./ModalBatalkanPesananResponsive";

export const BottomsheetMenuList = ({ open, onOpenChange }) => {
  const [isOpenDocumentShipping, setIsOpenDocumentShipping] = useState(false);
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
          <BottomSheetHeader>{t("Menu")}</BottomSheetHeader>
          <ul className="flex flex-col divide-y divide-neutral-400 p-4 text-sm font-semibold text-neutral-900">
            <Item
              label="Ringkasan Status Pesanan"
              onClick={() => navigation.push("/order-summary")}
              t={t}
            />
            <Item
              label="Detail Pengiriman Dokumen"
              t={t}
              onClick={() => setIsOpenDocumentShipping(true)}
            />
            <Item
              label="Detail Pembayaran"
              onClick={() => alert("Detail Pembayaran clicked")}
              t={t}
            />
            <Item
              label="Ubah Pesanan"
              onClick={() => alert("Ubah Pesanan clicked")}
              t={t}
            />
            <Item
              label="Batalkan Pesanan"
              onClick={() => {
                setIsOpenModalBatalkanPesanan(true);
                onOpenChange(false);
              }}
              t={t}
            />
            <Item
              label="Unduh Dokumen Delivery Order (DO)"
              onClick={() => alert("Unduh Dokumen Delivery Order (DO) clicked")}
              t={t}
            />
          </ul>
        </BottomSheetContent>
      </BottomSheet>

      <BottomsheetDocumentShipping
        open={isOpenDocumentShipping}
        onOpenChange={setIsOpenDocumentShipping}
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

const Item = ({ label, onClick, t }) => {
  return (
    <li onClick={onClick} className="cursor-pointer py-4">
      {t(label)}
    </li>
  );
};
