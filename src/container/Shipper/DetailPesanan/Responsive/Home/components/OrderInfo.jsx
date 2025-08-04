import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { ChevronRight } from "lucide-react";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import IconComponent from "@/components/IconComponent/IconComponent";
import BottomsheetCancellationHistory from "@/container/Shipper/DetailPesanan/Responsive/Home/components/Popup/BottomsheetCancellationHistory";
import { BottomsheetDocumentShipping } from "@/container/Shipper/DetailPesanan/Responsive/Home/components/Popup/BottomsheetDocumentShipping";
import { BottomsheetStatusLainnya } from "@/container/Shipper/DetailPesanan/Responsive/Home/components/Popup/BottomsheetStatusLainnya";
import { useTranslation } from "@/hooks/use-translation";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { getStatusPesananMetadata } from "@/lib/normalizers/detailpesanan/getStatusPesananMetadata";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";

export const OrderCode = ({ dataStatusPesanan }) => {
  const { t } = useTranslation();
  return (
    <div className="box-border flex w-full flex-row items-start justify-between border-b border-[#C4C4C4] pb-4">
      <span className="text-xs font-medium text-[#7B7B7B]">
        {t("labelOrderCode")}
      </span>
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
  const statusMeta = dataStatusPesanan
    ? getStatusPesananMetadata({
        orderStatus: dataStatusPesanan.orderStatus,
        unitFleetStatus: dataStatusPesanan.unitFleetStatus,
        totalUnit: dataStatusPesanan.totalUnit,
        t,
        orderType: dataStatusPesanan.orderType,
      })
    : null;
  return (
    <div className="flex w-full flex-col items-start gap-3">
      <span className="text-xs font-medium text-[#7B7B7B]">
        {t("labelOrderStatus")}
      </span>

      {dataStatusPesanan?.orderStatus && (
        <BadgeStatusPesanan
          variant={statusMeta?.variant}
          className="w-full text-sm font-semibold"
        >
          {statusMeta?.label}
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
  const router = useRouter();
  const params = useParams();
  const navigation = useResponsiveNavigation();
  // const [isOpenOtherStatus, setIsOpenOtherStatus] = useState(false);
  const [isOpenDocumentShipping, setIsOpenDocumentShipping] = useState(false);

  const isShowQRCodeButton = useMemo(() => {
    const LIST_SHOW_QR_CODE_BUTTON = [
      OrderStatusEnum.LOADING,
      OrderStatusEnum.UNLOADING,
    ];
    const driverNeedsQRCode = dataStatusPesanan?.driverStatus?.find(
      (driver) =>
        driver.driverStatus.startsWith("MENUJU_") ||
        driver.driverStatus.startsWith("TIBA_") ||
        driver.driverStatus.startsWith("ANTRI_")
    );
    return (
      LIST_SHOW_QR_CODE_BUTTON.includes(dataStatusPesanan?.orderStatus) &&
      driverNeedsQRCode
    );
  }, [dataStatusPesanan?.driverStatus, dataStatusPesanan?.orderStatus]);

  return (
    <div className="flex w-full flex-col items-start bg-white p-5">
      <div className="flex w-full flex-col items-start gap-4">
        {/* QR Code Toggle Button */}
        {isShowQRCodeButton && (
          <div className="box-border flex w-full flex-row items-center justify-between border-b border-[#C4C4C4] pb-4">
            <button
              className="flex w-full flex-row items-center justify-between"
              onClick={() => navigation.push("/DriverQRCodeMulti")}
            >
              <div className="flex items-center gap-3 text-xs font-semibold text-[#176CF7]">
                {t("buttonShowQRCode")}
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
              onClick={() => setIsOpenDocumentShipping(true)}
            >
              <div className="flex items-center gap-3 text-xs font-semibold text-[#176CF7]">
                {t("buttonViewDocumentShippingReceipt")}
              </div>
              <ChevronRight className="h-4 w-4 text-[#176CF7]" />
            </button>
          </div>
        )}

        {dataStatusPesanan?.orderStatus.startsWith("CANCELED") &&
        dataStatusPesanan?.hasFoundFleet ? (
          <button
            className="flex w-full items-center justify-between border-b border-b-neutral-400 pb-4"
            onClick={() =>
              router.push(
                `/daftarpesanan/detailpesanan/${params.orderId}/detail-refund`
              )
            }
          >
            <span className="text-xs font-semibold leading-[1.1] text-primary-700">
              Lihat Detail Refund
            </span>
            <IconComponent src="/icons/chevron-right.svg" />
          </button>
        ) : null}

        {dataStatusPesanan?.orderStatus.startsWith("CANCELED") &&
        dataStatusPesanan?.cancellationHistory ? (
          <BottomsheetCancellationHistory
            cancellationHistory={dataStatusPesanan.cancellationHistory}
          />
        ) : null}

        {/* Order Code */}
        <OrderCode dataStatusPesanan={dataStatusPesanan} />

        {/* Order Status */}
        <OrderStatus dataStatusPesanan={dataStatusPesanan} />
      </div>

      {/* Document Shipping Bottomsheet */}
      <BottomsheetDocumentShipping
        open={isOpenDocumentShipping}
        onOpenChange={setIsOpenDocumentShipping}
      />
    </div>
  );
};
