import { useState } from "react";

import { BottomSheetHeader } from "@/components/Bottomsheet/Bottomsheet";
import { useTranslation } from "@/hooks/use-translation";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import { idrFormat } from "@/lib/utils/formatters";

export const MenuList = ({ documentShippingDetail }) => {
  const { t } = useTranslation();
  const navigation = useResponsiveNavigation();
  const [view, setView] = useState("menu");

  const menus = [
    {
      label: "Ringkasan Status Pesanan",
      onClick: () => navigation.push("/order-summary"),
    },
    {
      label: "Detail Pengiriman Dokumen",
      onClick: () => setView("shipping"),
    },
    {
      label: "Detail Pembayaran",
      onClick: () => alert("Detail Pembayaran clicked"),
    },
    {
      label: "Ubah Pesanan",
      onClick: () => alert("Ubah Pesanan clicked"),
    },
    // {
    //   label: "Batalkan Pesanan",
    //   onClick: () => alert("Batalkan Pesanan clicked"),
    // },
    {
      label: "Unduh Dokumen Delivery Order (DO)",
      onClick: () => alert("Unduh Dokumen Delivery Order (DO) clicked"),
    },
  ];

  // Use the data from props or fallback to example data
  const shippingData = documentShippingDetail || {
    recipientName: "Cakra",
    recipientPhone: "081249088083",
    fullAddress: "Jl. Sudirman No. 123, Jakarta Pusat",
    detailAddress: "Gedung ABC Lantai 5",
    district: "Tanah Abang",
    city: "Jakarta Pusat",
    province: "DKI Jakarta",
    postalCode: "10270",
    courier: "JNE",
    courierPrice: 200000,
    insurancePrice: 10000,
    totalPrice: 210000,
  };

  if (view === "shipping") {
    return (
      <>
        <BottomSheetHeader>{t("Detail Pengiriman Dokumen")}</BottomSheetHeader>

        <div className="my-6 mr-1 h-[68vh] overflow-y-auto px-4 text-xs text-neutral-900">
          <div className="divide-y divide-neutral-200">
            {/* Recipient Info Section */}
            <div className="py-4 first:pt-0">
              <h3 className="mb-2 font-semibold">{t("Nama Penerima")}</h3>
              <p className="font-medium text-neutral-600">
                {shippingData.recipientName}
              </p>
            </div>

            <div className="py-4">
              <h3 className="mb-2 font-semibold">
                {t("Nomor Handphone Penerima")}
              </h3>
              <p className="font-medium text-neutral-600">
                {shippingData.recipientPhone}
              </p>
            </div>

            {/* Address Info Section */}
            <div className="py-4">
              <h3 className="mb-2 font-semibold">{t("Alamat Tujuan")}</h3>
              <p className="font-medium text-neutral-600">
                {shippingData.fullAddress}
              </p>
            </div>

            <div className="py-4">
              <h3 className="mb-2 font-semibold">
                {t("Detail Alamat Tujuan")}
              </h3>
              <p className="font-medium text-neutral-600">
                {shippingData.detailAddress}
              </p>
            </div>

            <div className="py-4">
              <h3 className="mb-2 font-semibold">{t("Kecamatan")}</h3>
              <p className="font-medium text-neutral-600">
                {shippingData.district}
              </p>
            </div>

            <div className="py-4">
              <h3 className="mb-2 font-semibold">{t("Kabupaten/Kota")}</h3>
              <p className="font-medium text-neutral-600">
                {shippingData.city}
              </p>
            </div>

            <div className="py-4">
              <h3 className="mb-2 font-semibold">{t("Provinsi")}</h3>
              <p className="font-medium text-neutral-600">
                {shippingData.province}
              </p>
            </div>

            <div className="py-4">
              <h3 className="mb-2 font-semibold">{t("Kode Pos")}</h3>
              <p className="font-medium text-neutral-600">
                {shippingData.postalCode}
              </p>
            </div>

            {/* Shipping Info Section */}
            <div className="py-4">
              <h3 className="mb-2 font-semibold">{t("Nama Ekspedisi")}</h3>
              <p className="font-medium text-neutral-600">
                {shippingData.courier}
              </p>
            </div>

            {/* Pricing Info Section */}
            {/* <div className="py-4">
              <h3 className="mb-2 font-semibold">{t("Biaya Pengiriman")}</h3>
              <p className="font-medium text-neutral-600">
                {idrFormat(shippingData.courierPrice)}
              </p>
            </div> */}

            <div className="py-4 last:pb-0">
              <h3 className="mb-2 font-semibold">{t("Asuransi Pengiriman")}</h3>
              <p className="font-medium text-neutral-600">
                {idrFormat(shippingData.insurancePrice)}
              </p>
            </div>

            {/* <div className="py-4 last:pb-0">
              <h3 className="mb-2 font-semibold">{t("Total Biaya")}</h3>
              <p className="font-semibold text-neutral-900">
                {idrFormat(shippingData.totalPrice)}
              </p>
            </div> */}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <BottomSheetHeader>{t("Menu")}</BottomSheetHeader>
      <ul className="flex flex-col divide-y divide-neutral-400 p-4 text-sm font-semibold text-neutral-900">
        {menus.map((menu, index) => (
          <li
            key={index}
            onClick={menu.onClick}
            className="cursor-pointer py-4"
          >
            {t(menu.label)}
          </li>
        ))}
      </ul>
    </>
  );
};
