import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { EllipsisVertical } from "lucide-react";

import { AvatarDriver } from "@/components/Avatar/AvatarDriver";
import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetTrigger,
} from "@/components/BottomSheet/BottomSheetUp";
import Button from "@/components/Button/Button";
import BottomSheetPreviousDriver from "@/container/Shipper/DetailPesanan/Responsive/Home/components/Popup/BottomSheetPreviousDriver";
import { useDrag } from "@/hooks/use-drag";
import { useTranslation } from "@/hooks/use-translation";
import { OrderStatusEnum } from "@/lib/constants/Shipper/detailpesanan/detailpesanan.enum";
import { getDriverStatusMetadata } from "@/lib/normalizers/detailpesanan/getDriverStatusMetadata";
import { getStatusScanMetadata } from "@/lib/normalizers/detailpesanan/getStatusScanMetadata";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import { cn } from "@/lib/utils";

const LIST_HIDE_STATUS_META = [
  OrderStatusEnum.WAITING_REPAYMENT_1,
  OrderStatusEnum.WAITING_REPAYMENT_2,
  OrderStatusEnum.CANCELED_BY_SHIPPER,
  OrderStatusEnum.CANCELED_BY_SHIPPER,
  OrderStatusEnum.CANCELED_BY_TRANSPORTER,
  OrderStatusEnum.PREPARE_DOCUMENT,
  OrderStatusEnum.DOCUMENT_DELIVERY,
];

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

const Header = ({
  statusScan,
  orderStatus,
  driverStatus,
  withMenu = true,
  mode = "driver-status",
  oldDriverData,
}) => {
  const { t } = useTranslation();
  const params = useParams();
  const navigation = useResponsiveNavigation();

  const statusMeta = useMemo(() => {
    const response = {};
    if (mode === "status-scan" && statusScan) {
      response.scan = getStatusScanMetadata(statusScan);
    } else if (mode === "driver-status" && driverStatus && orderStatus) {
      response.status = getDriverStatusMetadata({
        driverStatus,
        orderStatus,
        t,
      });
    }
    return response;
  }, [driverStatus, mode, orderStatus, statusScan, t]);

  const showStatusMetaStatus = !LIST_HIDE_STATUS_META.includes(orderStatus);
  if (!showStatusMetaStatus) return null;

  return (
    <div className="flex w-full items-center justify-between">
      {statusMeta?.scan && (
        <BadgeStatusPesanan
          variant={statusMeta.scan.hasScan ? "success" : "error"}
          className="w-fit"
        >
          {statusMeta.scan.statusText}
        </BadgeStatusPesanan>
      )}
      {statusMeta?.status && (
        <BadgeStatusPesanan
          variant={statusMeta.status.variant}
          className="w-fit"
        >
          {statusMeta.status.label}
        </BadgeStatusPesanan>
      )}
      {withMenu && (
        <BottomSheet>
          <BottomSheetTrigger asChild>
            <button aria-label="More options">
              <EllipsisVertical className="h-6 w-6 rounded-full text-black" />
            </button>
          </BottomSheetTrigger>
          <BottomSheetContent>
            <BottomSheetHeader>
              <BottomSheetClose />
              <BottomSheetTitle>
                {t("DriverInfoSlider.menuTitle", {}, "Menu")}
              </BottomSheetTitle>
            </BottomSheetHeader>
            <div className="flex flex-col gap-4 px-4 pb-6">
              <button
                type="button"
                className={cn(
                  "w-full text-left text-sm font-semibold",
                  oldDriverData ? "border-b border-b-neutral-400 pb-4" : ""
                )}
                onClick={() =>
                  navigation.push("/CariSemuaDriver", {
                    orderId: params.orderId,
                  })
                }
              >
                {t("DriverInfoSlider.viewAllDrivers", {}, "Lihat Semua Driver")}
              </button>
              {oldDriverData ? (
                <BottomSheetPreviousDriver oldDriverData={oldDriverData} />
              ) : null}
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

const LIST_SHOW_MODAL_DETAIL_STATUS_DRIVER = [
  OrderStatusEnum.PREPARE_DOCUMENT,
  OrderStatusEnum.DOCUMENT_DELIVERY,
  OrderStatusEnum.WAITING_REPAYMENT_1,
  OrderStatusEnum.WAITING_REPAYMENT_2,
  OrderStatusEnum.COMPLETED,
];

const Actions = ({
  driver,
  orderId,
  onDriverContactClicked,
  onLacakArmadaClicked,
}) => {
  const { t } = useTranslation();
  console.log("🚀 ~ orderId 2:", orderId);
  const navigation = useResponsiveNavigation();

  const showDetailStatusButton =
    driver?.orderStatus?.startsWith("CANCELED") ||
    LIST_SHOW_MODAL_DETAIL_STATUS_DRIVER.includes(driver?.orderStatus);

  return (
    <div className="flex w-full gap-3">
      {showDetailStatusButton ? (
        <Button
          variant="muatparts-primary-secondary"
          onClick={() =>
            navigation.push("/DetailStatusDriverScreen", {
              orderId,
              driverId: driver.driverId,
            })
          }
          className="h-7 w-full !rounded-[20px] !border-primary-700 !text-xs !font-semibold !text-primary-700"
        >
          {t("DriverInfoSlider.detailStatusDriver", {}, "Detail Status Driver")}
        </Button>
      ) : (
        <>
          <Button
            variant="muatparts-primary-secondary"
            onClick={onDriverContactClicked}
            className="h-7 w-full !rounded-[20px] !border-primary-700 !text-xs !font-semibold !text-primary-700"
          >
            {t("DriverInfoSlider.contactDriver", {}, "Hubungi Driver")}
          </Button>
          <Button
            variant="muatparts-primary"
            onClick={onLacakArmadaClicked}
            className="h-7 w-full !rounded-[20px] bg-primary-700 !text-xs !font-semibold text-white"
          >
            {t("DriverInfoSlider.trackFleet", {}, "Lacak Armada")}
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

/**
 * The main slider component that orchestrates everything.
 * @param {{ driverStatus: Driver[], orderId: string, defaultIndex?: number }} props
 */
export default function DriverInfoSlider({
  driverStatus = [],
  orderId,
  defaultIndex = 0,
  withActions = true,
  withMenu,
  oldDriverData,
}) {
  console.log("🚀 ~ orderId 1:", orderId);
  const { t } = useTranslation();
  const items = driverStatus;
  const TRANSITION_DURATION_MS = 300;

  // --- ALL HOOKS ARE CALLED AT THE TOP LEVEL ---
  const navigation = useResponsiveNavigation();
  const [currentIndex, setCurrentIndex] = useState(
    items.length > 1 ? defaultIndex + 1 : defaultIndex
  );
  const [isTransitioning, setIsTransitioning] = useState(true);
  const prevItemsLength = useRef(items.length);

  const clonedItems = useMemo(() => {
    if (items.length <= 1) return items;
    return [items[items.length - 1], ...items, items[0]];
  }, [items]);

  const slideTo = useCallback((index, transition = true) => {
    setIsTransitioning(transition);
    setCurrentIndex(index);
  }, []);

  const nextSlide = useCallback(
    () => slideTo(currentIndex + 1),
    [currentIndex, slideTo]
  );

  const prevSlide = useCallback(
    () => slideTo(currentIndex - 1),
    [currentIndex, slideTo]
  );

  const { dragOffset, dragHandlers } = useDrag({
    onSwipeLeft: nextSlide,
    onSwipeRight: prevSlide,
  });

  useEffect(() => {
    if (prevItemsLength.current === 0 && items.length > 1) {
      slideTo(defaultIndex + 1, false);
    }
    prevItemsLength.current = items.length;
  }, [items.length, defaultIndex, slideTo]);

  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(true), 50);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  const handleTransitionEnd = () => {
    if (currentIndex === 0) slideTo(items.length, false);
    else if (currentIndex === clonedItems.length - 1) slideTo(1, false);
  };

  // --- CONDITIONAL RETURNS HAPPEN AFTER HOOKS ---
  if (!items || items.length === 0) {
    return null;
  }

  if (items.length === 1) {
    const driver = items[0];
    return (
      <Root>
        <div className="p-5">
          <div className="flex w-full flex-col items-start gap-4">
            <Header
              orderStatus={driver.orderStatus}
              driverStatus={driver.driverStatus}
              mode="driver-status"
              withMenu={withMenu}
            />
            <Avatar driver={driver} />
            {withActions && (
              <Actions
                driver={driver}
                orderId={orderId}
                onDriverContactClicked={() =>
                  alert(
                    t(
                      "DriverInfoSlider.contacting",
                      { name: driver.name },
                      "Contacting {name}"
                    )
                  )
                }
                onLacakArmadaClicked={() =>
                  navigation.push("/LacakArmada", {
                    orderId,
                    driverId: driver.driverId,
                  })
                }
              />
            )}
          </div>
        </div>
      </Root>
    );
  }

  // --- RENDER LOGIC FOR MULTIPLE ITEMS ---
  const activeIndicatorIndex = (currentIndex - 1 + items.length) % items.length;

  return (
    <Root>
      <div className="overflow-hidden" {...dragHandlers}>
        <div
          className="flex"
          style={{
            transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`,
            transition:
              isTransitioning && dragOffset === 0
                ? `transform ${TRANSITION_DURATION_MS}ms ease-in-out`
                : "none",
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {clonedItems.map((driver, index) => (
            <div
              key={`${driver?.driverId}-${index}`}
              className={cn("w-full flex-shrink-0 p-5", !withActions && "pb-0")}
            >
              <div className="flex w-full flex-col items-start gap-4">
                <Header
                  orderStatus={driver.orderStatus}
                  driverStatus={driver.driverStatus}
                  mode="driver-status"
                  withMenu={withMenu}
                  oldDriverData={oldDriverData}
                />
                <Avatar driver={driver} />
                {withActions && (
                  <Actions
                    driver={driver}
                    orderId={orderId}
                    onDriverContactClicked={() =>
                      alert(
                        t(
                          "DriverInfoSlider.contacting",
                          { name: driver.name },
                          "Contacting {name}"
                        )
                      )
                    }
                    onLacakArmadaClicked={() =>
                      navigation.push("/LacakArmada", {
                        orderId,
                        driverId: driver.driverId,
                      })
                    }
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Indicator
        count={items.length}
        activeIndex={activeIndicatorIndex}
        className="pb-5 pt-0"
      />
    </Root>
  );
}

// Export the sub-components for reuse in other parts of the app
export const DriverInfo = {
  Root,
  Header,
  Avatar,
  Actions,
  Indicator,
};
