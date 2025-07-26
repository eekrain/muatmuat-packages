import { useState } from "react";

import { ChevronRight } from "lucide-react";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
} from "@/components/Bottomsheet/Bottomsheet";
import { useTranslation } from "@/hooks/use-translation";
import {
  OrderStatusEnum,
  OrderStatusTitle,
} from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";

export const OrderInfo = ({ dataStatusPesanan }) => {
  const navigation = useResponsiveNavigation();

  const [isOpenOtherStatus, setIsOpenOtherStatus] = useState();

  const { t } = useTranslation();

  const orderStatusLabel =
    dataStatusPesanan.orderStatus !== OrderStatusEnum.COMPLETED &&
    !dataStatusPesanan.orderStatus.startsWith("CANCELED") &&
    !dataStatusPesanan.orderStatus.startsWith("WAITING_PAYMENT") &&
    dataStatusPesanan.unitFleetStatus &&
    dataStatusPesanan.unitFleetStatus > 1
      ? `${t(OrderStatusTitle[dataStatusPesanan.orderStatus])}: ${dataStatusPesanan.unitFleetStatus} Unit`
      : t(OrderStatusTitle[dataStatusPesanan.orderStatus]);

  const statusVariant = dataStatusPesanan.orderStatus.startsWith("WAITING")
    ? "warning"
    : dataStatusPesanan.orderStatus.startsWith("CANCELED")
      ? "error"
      : dataStatusPesanan.orderStatus === OrderStatusEnum.COMPLETED
        ? "success"
        : "primary";

  return (
    <div className="flex w-full flex-col items-start bg-white p-5">
      <div className="flex w-full flex-col items-start gap-4">
        {/* QR Code Toggle Button */}
        {dataStatusPesanan?.orderStatus &&
          !dataStatusPesanan?.orderStatus?.startsWith("CANCELED") && (
            <div className="box-border flex w-full flex-row items-center justify-between border-b border-[#C4C4C4] pb-4">
              <button
                className="flex w-full flex-row items-center justify-between"
                onClick={() => navigation.push("/qr")}
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
        <div className="box-border flex w-full flex-row items-start justify-between border-b border-[#C4C4C4] pb-4">
          <span className="text-xs font-medium text-[#7B7B7B]">
            Kode Pesanan
          </span>
          <span className="text-right text-xs font-semibold text-black">
            {dataStatusPesanan?.orderCode || "N/A"}
          </span>
        </div>

        {/* Order Status */}
        <div className="flex w-full flex-col items-start gap-3">
          <span className="text-xs font-medium text-[#7B7B7B]">
            Status Pesanan
          </span>

          {dataStatusPesanan?.orderStatus && (
            <BadgeStatusPesanan
              variant={statusVariant}
              className="w-full text-sm font-semibold"
            >
              {orderStatusLabel}
            </BadgeStatusPesanan>
          )}

          {dataStatusPesanan?.otherStatus &&
            dataStatusPesanan?.otherStatus.length > 1 && (
              <div className="flex w-full flex-row items-center justify-between">
                <button
                  className="flex w-full flex-row items-center justify-between"
                  onClick={() => setIsOpenOtherStatus(true)}
                >
                  <div className="flex items-center gap-3 text-xs font-semibold text-[#176CF7]">
                    Lihat Status Lainnya
                  </div>
                  <ChevronRight className="h-4 w-4 text-[#176CF7]" />
                </button>
              </div>
            )}

          <BottomSheet
            open={isOpenOtherStatus}
            onOpenChange={setIsOpenOtherStatus}
          >
            <BottomSheetContent>
              <BottomSheetHeader>Status Lainnya</BottomSheetHeader>

              <div className="flex flex-col gap-4 px-4 py-6">
                {dataStatusPesanan?.otherStatus?.map((status, index) => (
                  <BadgeStatusPesanan
                    key={index}
                    variant={
                      status.orderStatus?.startsWith("WAITING")
                        ? "warning"
                        : status.orderStatus?.startsWith("CANCELED")
                          ? "error"
                          : status.orderStatus === OrderStatusEnum.COMPLETED
                            ? "success"
                            : "primary"
                    }
                    className="w-full text-sm font-semibold"
                  >
                    {status.orderTitle}: {status.unitFleetStatus} Unit
                  </BadgeStatusPesanan>
                ))}
              </div>
            </BottomSheetContent>
          </BottomSheet>
        </div>
      </div>
    </div>
  );
};
