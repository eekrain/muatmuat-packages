import { useMemo } from "react";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import {
  StepperContainer,
  StepperItemResponsive,
} from "@/components/Stepper/Stepper";
import { useTranslation } from "@/hooks/use-translation";

import { getOrderStatusLabel, getStatusVariant } from "../../../utils";
import { DriverStatusCard } from "./DriverStatusCard";
import { KeteranganStatusPesanan } from "./KeteranganStatusPesanan";

export const OrderStatusSummary = ({ dataStatusPesanan }) => {
  const { t } = useTranslation();

  const remainingDrivers = useMemo(() => {
    const val = dataStatusPesanan?.totalUnit;
    if (!val) return 0;

    const totalDriver = dataStatusPesanan?.driverStatus.length;
    return val - totalDriver;
  }, [dataStatusPesanan]);

  return (
    <div className="space-y-2">
      <KeteranganStatusPesanan legendStatus={dataStatusPesanan?.legendStatus} />

      {remainingDrivers > 0 && (
        <div className="flex flex-col gap-4 bg-neutral-50 px-4 py-6">
          <BadgeStatusPesanan variant="muted" className="w-fit">
            {remainingDrivers} Driver Belum Berangkat
          </BadgeStatusPesanan>

          <span className="text-sm font-semibold">
            Pesanan Anda berada dalam tahap :
          </span>

          <BadgeStatusPesanan
            variant={getStatusVariant({
              orderStatus: dataStatusPesanan.orderStatus,
            })}
            className="w-full"
          >
            {getOrderStatusLabel({
              orderStatus: dataStatusPesanan.orderStatus,
              unitFleetStatus: dataStatusPesanan.unitFleetStatus,
              totalUnit: dataStatusPesanan.totalUnit,
              t,
              isShowUnitFleetStatus: false,
            })}
          </BadgeStatusPesanan>

          <StepperContainer activeIndex={0} totalStep={6}>
            {[
              {
                label: "Pesanan Terkonfirmasi",
                status: "CONFIRMED",
                icon: "/icons/stepper/stepper-scheduled.svg",
              },
              {
                label: "Proses Muat",
                status: "LOADING",
                icon: "/icons/stepper/stepper-box.svg",
              },
              {
                label: "Proses Bongkar",
                status: "UNLOADING",
                icon: "/icons/stepper/stepper-box-opened.svg",
              },
              {
                label: "Selesai",
                status: "COMPLETED",
                icon: "/icons/stepper/stepper-completed.svg",
              },
            ].map((step, index) => (
              <StepperItemResponsive
                key={step.label}
                step={step}
                index={index}
              />
            ))}
          </StepperContainer>
        </div>
      )}

      {dataStatusPesanan?.driverStatus.map((driver) => (
        <DriverStatusCard
          key={driver.driverId}
          driver={driver}
          orderId={dataStatusPesanan?.orderId}
          orderStatus={dataStatusPesanan?.orderStatus}
        />
      ))}

      {/* {isDev && <pre>{JSON.stringify(dataStatusPesanan, null, 2)}</pre>} */}
    </div>
  );
};
