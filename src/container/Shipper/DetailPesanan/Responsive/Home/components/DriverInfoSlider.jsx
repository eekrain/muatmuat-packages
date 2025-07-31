import { useParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import { EllipsisVertical } from "lucide-react";

import { AvatarDriver } from "@/components/Avatar/AvatarDriver";
import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTrigger,
} from "@/components/Bottomsheet/Bottomsheet";
import Button from "@/components/Button/Button";
import { useSwipe } from "@/hooks/use-swipe";
import { useTranslation } from "@/hooks/use-translation";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { getDriverStatusMetadata } from "@/lib/normalizers/detailpesanan/getDriverStatusMetadata";
import { getStatusScanMetadata } from "@/lib/normalizers/detailpesanan/getStatusScanMetadata";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import { cn } from "@/lib/utils";

/**
 * @typedef {Object} Driver
 * @property {string} name
 * @property {string} driverImage
 * @property {string} licensePlate
 * @property {string} driverStatusTitle
 * @property {string} [orderStatus]
 * @property {string} [driverId]
 */

const Root = ({ children, className }) => (
  <div className={cn("w-full border-b-2 border-[#461B02] bg-white", className)}>
    {children}
  </div>
);

/**
 * @typedef {Object} HeaderProps
 * @property {string} statusCode
 * @property {boolean} withMenu
 * @property {"driver-status" | "status-scan"} mode
 */

/**
 * @param {HeaderProps} props
 */
const Header = ({
  statusScan,
  orderStatus,
  driverStatus,
  withMenu = true,
  mode = "driver-status",
}) => {
  const { t } = useTranslation();
  const params = useParams();
  const navigation = useResponsiveNavigation();

  const statusMeta = useMemo(() => {
    const response = {};
    if (mode === "status-scan" && statusScan) {
      response.scan = getStatusScanMetadata(statusScan);
    } else if (mode === "driver-status" && driverStatus && orderStatus) {
      response.status = getDriverStatusMetadata(driverStatus, orderStatus, t);
    }
    return response;
  }, [driverStatus, mode]);

  return (
    <div className="flex w-full items-center justify-between">
      {statusMeta?.scan && (
        <BadgeStatusPesanan
          variant={statusMeta?.scan?.hasScan ? "success" : "error"}
          className="w-fit"
        >
          {statusMeta?.scan?.statusText}
        </BadgeStatusPesanan>
      )}
      {statusMeta?.status && (
        <BadgeStatusPesanan
          variant={statusMeta?.status?.variant}
          className="w-fit"
        >
          {statusMeta?.status?.label}
        </BadgeStatusPesanan>
      )}
      {withMenu && (
        <BottomSheet>
          <BottomSheetTrigger asChild>
            <button
              aria-label="More options"
              className="absolute right-4 top-5 z-10 bg-white p-1" // Positioned absolutely
            >
              <EllipsisVertical className="h-6 w-6 rounded-full text-black" />
            </button>
          </BottomSheetTrigger>
          <BottomSheetContent>
            <BottomSheetHeader>Menu</BottomSheetHeader>
            <div className="mt-6 flex flex-col gap-4 px-4 pb-6">
              <button
                className="w-full text-left text-sm font-semibold"
                onClick={() =>
                  navigation.push("/CariSemuaDriver", {
                    orderId: params.orderId,
                  })
                }
              >
                Lihat Semua Driver
              </button>
            </div>
          </BottomSheetContent>
        </BottomSheet>
      )}
    </div>
  );
};

const Avatar = ({ driver }) => (
  <div className="w-full">
    <AvatarDriver
      name={driver.name}
      image={driver.driverImage}
      licensePlate={driver.licensePlate}
      classNames={{
        root: "gap-3",
        avatar: "w-10 h-10",
        name: "text-base font-semibold text-neutral-900 leading-[1.1]",
        licensePlate: "text-xs font-medium text-neutral-900 leading-[1.1]",
        licenseIcon: "text-muat-trans-secondary-900 w-3 h-3",
      }}
    />
  </div>
);

const Actions = ({
  driver,
  orderStatus,
  onDriverContactClicked,
  onLacakArmadaClicked,
}) => {
  const navigation = useResponsiveNavigation();
  const LIST_SHOW_MODAL_DETAIL_STATUS_DRIVER = [
    OrderStatusEnum.PREPARE_DOCUMENT,
    OrderStatusEnum.DOCUMENT_DELIVERY,
    OrderStatusEnum.WAITING_REPAYMENT_1,
    OrderStatusEnum.WAITING_REPAYMENT_2,
    OrderStatusEnum.CANCELED_BY_SHIPPER,
    OrderStatusEnum.COMPLETED,
  ];
  return (
    <div className="flex w-full gap-3">
      {driver.orderStatus?.startsWith("CANCELED") ||
      LIST_SHOW_MODAL_DETAIL_STATUS_DRIVER.includes(orderStatus) ? (
        <Button
          variant="muatparts-primary-secondary"
          onClick={() =>
            navigation.push("/DetailStatusDriverScreen", {
              driverId: driver.driverId,
              orderId: driver.orderId,
            })
          }
          className="h-7 w-full !rounded-[20px] !border-primary-700 !text-xs !font-semibold !text-primary-700"
        >
          Detail Status Driver
        </Button>
      ) : (
        <>
          <Button
            variant="muatparts-primary-secondary"
            onClick={onDriverContactClicked}
            className="h-7 w-full !rounded-[20px] !border-primary-700 !text-xs !font-semibold !text-primary-700"
          >
            Hubungi Driver
          </Button>
          <Button
            variant="muatparts-primary"
            onClick={onLacakArmadaClicked}
            className="h-7 w-full !rounded-[20px] bg-primary-700 !text-xs !font-semibold text-white"
          >
            Lacak Armada
          </Button>
        </>
      )}
    </div>
  );
};

const Indicator = ({ count, activeIndex, className }) => {
  if (count <= 1) return null;
  return (
    <div
      className={cn("flex items-center justify-center gap-1 pt-4", className)}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-2 rounded-full transition-all duration-300",
            i === activeIndex ? "w-8 bg-primary-700" : "w-2 bg-neutral-400"
          )}
        />
      ))}
    </div>
  );
};

export const DriverInfo = {
  Root,
  Header,
  Avatar,
  Actions,
  Indicator,
};

/**
 * The main slider component that orchestrates everything.
 * @param {{ drivers: Driver[] }} props
 */
export default function DriverInfoSlider({
  driverStatus = [],
  orderId,
  orderStatus,
  defaultIndex = 0,
}) {
  const navigation = useResponsiveNavigation();
  const [currentIndex, setCurrentIndex] = useState(defaultIndex);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, driverStatus.length - 1));
  }, [driverStatus.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const { dragOffset, swipeHandlers } = useSwipe({
    onSwipeLeft: nextSlide,
    onSwipeRight: prevSlide,
  });

  if (!driverStatus || driverStatus.length === 0) {
    return null;
  }

  return (
    <Root>
      <div className="overflow-hidden" {...swipeHandlers}>
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            // Apply both the slide position and the real-time drag offset
            transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`,
          }}
        >
          {driverStatus.map((driver, index) => (
            <div
              key={driver?.driverId || index}
              // className="w-full bg-white p-5"
              className="w-full flex-shrink-0 p-5"
            >
              <div className="flex w-full flex-col items-start gap-4">
                <DriverInfo.Header
                  orderStatus={driver.orderStatus}
                  driverStatus={driver.driverStatus}
                  mode="driver-status"
                  onMenuClick={() => alert(`Menu for ${driver.name}`)}
                />
                <DriverInfo.Avatar driver={driver} />
                <DriverInfo.Actions
                  driver={driver}
                  orderStatus={orderStatus}
                  onDriverContactClicked={() =>
                    alert(`Contacting ${driver.name}`)
                  }
                  onLacakArmadaClicked={() =>
                    navigation.push("/LacakArmada", {
                      orderId,
                      driverId: driver.driverId,
                    })
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <DriverInfo.Indicator
        count={driverStatus.length}
        activeIndex={currentIndex}
        className="pb-5"
      />
    </Root>
  );
}
