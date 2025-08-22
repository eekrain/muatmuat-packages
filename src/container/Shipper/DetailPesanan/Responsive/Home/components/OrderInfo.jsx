import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";

import { ChevronRight } from "lucide-react";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useTranslation } from "@/hooks/use-translation";
import { OrderStatusEnum } from "@/lib/constants/Shipper/detailpesanan/detailpesanan.enum";
import { getStatusPesananMetadata } from "@/lib/normalizers/detailpesanan/getStatusPesananMetadata";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";

import { BottomsheetBuktiPengirimanDokumen } from "./Popup/BottomsheetBuktiPengirimanDokumen";
import BottomsheetCancellationHistory from "./Popup/BottomsheetCancellationHistory";
import { BottomsheetStatusLainnya } from "./Popup/BottomsheetStatusLainnya";

export const OrderCode = ({ dataStatusPesanan }) => {
  const { t } = useTranslation();
  return (
    <div className="box-border flex w-full flex-row items-start justify-between border-b border-[#C4C4C4] pb-4">
      <span className="text-xs font-medium text-[#7B7B7B]">
        {t("labelOrderCode", {}, "Kode Pesanan")}
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
        {t("labelOrderStatus", {}, "Status Pesanan")}
      </span>

      {statusMeta?.label && (
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

  const isShowQRCodeButton = useMemo(() => {
    const LIST_SHOW_QR_CODE_BUTTON = [
      OrderStatusEnum.LOADING,
      OrderStatusEnum.UNLOADING,
      OrderStatusEnum.SCHEDULED_FLEET, // Added for fleet replacement scenarios (LD-4.17/4.18)
    ];

    // Check if any driver needs QR Code (active drivers, not replacement waiting)
    const driverNeedsQRCode = dataStatusPesanan?.driverStatus?.find(
      (driver) => {
        // Don't show QR for drivers waiting for replacement
        if (driver.driverStatus === "MENUNGGU_ARMADA_PENGGANTI") {
          return false;
        }

        // Show QR for drivers that are actively working
        return (
          driver.driverStatus.startsWith("MENUJU_") ||
          driver.driverStatus.startsWith("TIBA_") ||
          driver.driverStatus.startsWith("ANTRI_") ||
          driver.driverStatus.startsWith("SEDANG_")
        );
      }
    );

    // Special case for mixed status scenarios (LD-4.17/4.18)
    // When order status is SCHEDULED_FLEET but some drivers are actively working
    const hasActiveDriversInScheduledFleet =
      dataStatusPesanan?.orderStatus === OrderStatusEnum.SCHEDULED_FLEET &&
      dataStatusPesanan?.otherStatus?.some(
        (status) =>
          status.orderStatus === OrderStatusEnum.UNLOADING ||
          status.orderStatus === OrderStatusEnum.LOADING
      );

    return (
      (LIST_SHOW_QR_CODE_BUTTON.includes(dataStatusPesanan?.orderStatus) &&
        driverNeedsQRCode) ||
      hasActiveDriversInScheduledFleet
    );
  }, [
    dataStatusPesanan?.driverStatus,
    dataStatusPesanan?.orderStatus,
    dataStatusPesanan?.otherStatus,
  ]);

  // if dataStatusPesanan.otherStatus is more than 1 (mean there is more than 1 status), then show other status clickable label
  const isShowOtherStatus = dataStatusPesanan?.otherStatus?.length > 1;

  return (
    <div className="flex w-full flex-col items-start bg-white p-5">
      <div className="flex w-full flex-col items-start gap-4">
        {/* QR Code Toggle Button */}
        {isShowQRCodeButton ? (
          <div className="box-border flex w-full flex-row items-center justify-between border-b border-[#C4C4C4] pb-4">
            <button
              className="flex w-full flex-row items-center justify-between"
              onClick={() => navigation.push("/DriverQRCodeMulti")}
            >
              <div className="flex items-center gap-3 text-xs font-semibold text-[#176CF7]">
                {t("buttonShowQRCode", {}, "Tampilkan QR Code")}
              </div>
              <ChevronRight className="h-4 w-4 text-neutral-700" />
            </button>
          </div>
        ) : dataStatusPesanan?.orderStatus ===
          OrderStatusEnum.DOCUMENT_DELIVERY ? (
          <BottomsheetBuktiPengirimanDokumen>
            <div className="box-border flex w-full flex-row items-center justify-between border-b border-[#C4C4C4] pb-4">
              <button className="flex w-full flex-row items-center justify-between">
                <div className="flex items-center gap-3 text-xs font-semibold text-[#176CF7]">
                  {t(
                    "buttonViewDocumentShippingReceipt",
                    {},
                    "Lihat Bukti Pengiriman"
                  )}
                </div>
                <ChevronRight className="h-4 w-4 text-[#176CF7]" />
              </button>
            </div>
          </BottomsheetBuktiPengirimanDokumen>
        ) : null}

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
        <OrderStatus
          dataStatusPesanan={dataStatusPesanan}
          withStatusLainnya={isShowOtherStatus}
        />
      </div>

      {/* Document Shipping Bottomsheet */}
    </div>
  );
};
