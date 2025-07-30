import { useState } from "react";

import { ChevronRight } from "lucide-react";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import { useTranslation } from "@/hooks/use-translation";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";

import { getOrderStatusLabel, getStatusVariant } from "../../../utlis";
import { BottomsheetStatusLainnya } from "./BottomsheetStatusLainnya";

export const OrderCode = ({ dataStatusPesanan }) => {
  return (
    <div className="box-border flex w-full flex-row items-start justify-between border-b border-[#C4C4C4] pb-4">
      <span className="text-xs font-medium text-[#7B7B7B]">Kode Pesanan</span>
      <span className="text-right text-xs font-semibold text-black">
        {dataStatusPesanan?.orderCode || "N/A"}
      </span>
    </div>
  );
};

export const OrderStatus = ({
  dataStatusPesanan,
  withStatusLainnya = true,
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex w-full flex-col items-start gap-3">
      <span className="text-xs font-medium text-[#7B7B7B]">Status Pesanan</span>

      {dataStatusPesanan?.orderStatus && (
        <BadgeStatusPesanan
          variant={getStatusVariant({
            orderStatus: dataStatusPesanan.orderStatus,
          })}
          className="w-full text-sm font-semibold"
        >
          {getOrderStatusLabel({
            orderStatus: dataStatusPesanan.orderStatus,
            unitFleetStatus: dataStatusPesanan.unitFleetStatus,
            totalUnit: dataStatusPesanan.totalUnit,
            t,
          })}
        </BadgeStatusPesanan>
      )}

      {withStatusLainnya && (
        <BottomsheetStatusLainnya dataStatusPesanan={dataStatusPesanan} />
      )}
    </div>
  );
};

export const OrderInfo = ({ dataStatusPesanan }) => {
  const { t } = useTranslation();
  const navigation = useResponsiveNavigation();
  const [isOpenOtherStatus, setIsOpenOtherStatus] = useState(false);

  return (
    <div className="flex w-full flex-col items-start bg-white p-5">
      <div className="flex w-full flex-col items-start gap-4">
        {/* QR Code Toggle Button */}
        {dataStatusPesanan?.orderStatus &&
          !dataStatusPesanan?.orderStatus?.startsWith("CANCELED") && (
            <div className="box-border flex w-full flex-row items-center justify-between border-b border-[#C4C4C4] pb-4">
              <button
                className="flex w-full flex-row items-center justify-between"
                onClick={() => navigation.push("/DriverQRCodeMulti")}
              >
                <div className="flex items-center gap-3 text-xs font-semibold text-[#176CF7]">
                  Tampilkan QR Code
                </div>
                <ChevronRight className="h-4 w-4 text-[#176CF7]" />
              </button>
            </div>
          )}
        {dataStatusPesanan?.orderStatus ===
          OrderStatusEnum.DOCUMENT_DELIVERY && (
          <div className="box-border flex w-full flex-row items-center justify-between border-b border-[#C4C4C4] pb-4">
            <button
              className="flex w-full flex-row items-center justify-between"
              onClick={() => {}}
            >
              <div className="flex items-center gap-3 text-xs font-semibold text-[#176CF7]">
                Lihat Resi Pengiriman Dokumen
              </div>
              <ChevronRight className="h-4 w-4 text-[#176CF7]" />
            </button>
          </div>
        )}

        {/* Order Code */}
        <OrderCode dataStatusPesanan={dataStatusPesanan} />

        {/* Order Status */}
        <OrderStatus dataStatusPesanan={dataStatusPesanan} />
      </div>
    </div>
  );
};
