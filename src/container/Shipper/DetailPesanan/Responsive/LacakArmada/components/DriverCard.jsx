import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { AvatarDriver } from "@/components/Avatar/AvatarDriver";
import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";

import { OrderStatusEnum } from "@/lib/constants/Shipper/detailpesanan/detailpesanan.enum";
import { useResponsiveRouteParams } from "@/lib/responsive-navigation";

const DriverCard = ({ data = [] }) => {
  const params = useResponsiveRouteParams();
  const searchParams = useSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);

  const isFleetTrack = searchParams.get("screen")?.includes("fleet-track");

  const { driverId } = params;

  // Find the specific driver from data

  // Determine badge variant based on driver status
  const getBadgeVariant = () => {
    if (driver.orderStatus?.startsWith("CANCELED")) return "error";
    if (driver.orderStatus === OrderStatusEnum.COMPLETED) return "success";
    if (driver.driverStatus?.startsWith("WAITING")) return "warning";
    return "primary";
  };

  if (!data || data.length === 0) return null;
  const driver = isFleetTrack
    ? data.find((d) => d.driverId === driverId) || data[0] || {}
    : data[currentIndex] || {};

  return (
    <div className="box-border flex w-full flex-col items-center justify-center border-b-2 border-[#461B02] bg-white p-5">
      <div className="flex w-full flex-col items-start gap-4">
        {/* Status Badge */}
        {driver?.driverStatusTitle && (
          <BadgeStatusPesanan
            variant={getBadgeVariant()}
            className="w-fit text-sm font-semibold"
          >
            {driver?.driverStatusTitle}
          </BadgeStatusPesanan>
        )}

        <AvatarDriver
          name={driver?.name}
          image={driver?.driverImage}
          licensePlate={driver?.licensePlate}
        />
        {/* Show stepper dots only if NOT in fleet-track page and multiple drivers */}
        {!isFleetTrack && data.length > 1 && (
          <div className="mx-auto flex items-center justify-center gap-1">
            {data.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === (currentIndex || 0)
                    ? "w-8 bg-primary-700"
                    : "w-2 bg-neutral-400"
                }`}
              ></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverCard;
