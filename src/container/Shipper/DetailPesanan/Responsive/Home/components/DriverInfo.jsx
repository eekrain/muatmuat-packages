import { useState } from "react";

import { EllipsisVertical } from "lucide-react";

import { AvatarDriver } from "@/components/Avatar/AvatarDriver";
import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import Button from "@/components/Button/Button";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";

export const DriverInfo = ({ driverStatus = [], orderId, orderStatus }) => {
  const navigation = useResponsiveNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const DETAIL_STATUS_DRIVER = [
    OrderStatusEnum.PREPARE_DOCUMENT,
    OrderStatusEnum.DOCUMENT_DELIVERY,
    OrderStatusEnum.WAITING_REPAYMENT_1,
    OrderStatusEnum.WAITING_REPAYMENT_2,
    OrderStatusEnum.COMPLETED,
  ];

  if (!driverStatus || driverStatus.length === 0) return null;
  const driver = driverStatus[currentIndex] || {};

  return (
    <div className="box-border flex w-full flex-col items-center justify-center border-b-2 border-[#461B02] bg-white p-5">
      <div className="flex w-full flex-col items-start gap-4">
        {/* Status Badge */}
        <div className="flex w-full items-center justify-between">
          {driver.orderStatus && (
            <BadgeStatusPesanan
              variant={
                driver.orderStatus?.startsWith("CANCELED")
                  ? "error"
                  : driver.orderStatus === OrderStatusEnum.COMPLETED
                    ? "success"
                    : driver.driverStatus?.startsWith("WAITING")
                      ? "warning"
                      : "primary"
              }
              className="w-fit text-sm font-semibold"
            >
              {driver.driverStatusTitle}
            </BadgeStatusPesanan>
          )}
          <EllipsisVertical />
        </div>

        <AvatarDriver
          name={driver.name}
          image={driver.driverImage}
          licensePlate={driver.licensePlate}
        />
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex w-full flex-row items-center justify-center gap-3">
        {driver.orderStatus?.startsWith("CANCELED") ||
        DETAIL_STATUS_DRIVER.includes(orderStatus) ? (
          <Button
            variant="muatparts-primary-secondary"
            className="h-7 w-full text-xs font-semibold"
            onClick={() => navigation.push("/detail-driver-status")}
          >
            Detail Status Driver
          </Button>
        ) : (
          <>
            <Button
              variant="muatparts-primary-secondary"
              className="h-7 w-full text-xs font-semibold"
              onClick={() => {}}
            >
              Hubungi Driver
            </Button>
            <Button
              variant="muatparts-primary"
              className="h-7 w-full text-xs font-semibold"
              onClick={() =>
                navigation.push("/fleet-track", {
                  driverId: driver.driverId,
                })
              }
            >
              Lacak Armada
            </Button>
          </>
        )}
      </div>

      {/* Slider Navigation & Indicator (if multiple drivers) */}
      {driverStatus.length > 1 && (
        <div className="mt-4 flex w-full flex-col items-center gap-2">
          {/* Dots Indicator */}
          <div className="mt-1 flex flex-row items-center gap-1">
            {driverStatus.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? "w-8 bg-primary-700"
                    : "w-2 bg-neutral-400"
                }`}
              ></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
