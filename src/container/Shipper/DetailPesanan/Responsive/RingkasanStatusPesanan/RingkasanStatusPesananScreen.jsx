import { useMemo } from "react";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import {
  StepperContainer,
  StepperItemResponsive,
} from "@/components/Stepper/Stepper";
import { useTranslation } from "@/hooks/use-translation";
import FormResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/FormResponsiveLayout";
import { getStatusPesananMetadata } from "@/lib/normalizers/detailpesanan/getStatusPesananMetadata";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";

import { DriverStatusCard } from "./components/DriverStatusCard";
import { KeteranganStatusPesanan } from "./components/KeteranganStatusPesanan";

const RingkasanStatusPesananScreen = ({ dataStatusPesanan }) => {
  const navigation = useResponsiveNavigation();

  const { t } = useTranslation();

  const remainingDrivers = useMemo(() => {
    const val = dataStatusPesanan?.totalUnit;
    if (!val) return 0;

    const totalDriver = dataStatusPesanan?.driverStatus.length;
    return val - totalDriver;
  }, [dataStatusPesanan]);

  const statusMeta = getStatusPesananMetadata({
    orderStatus: dataStatusPesanan.orderStatus,
    unitFleetStatus: dataStatusPesanan.unitFleetStatus,
    totalUnit: dataStatusPesanan.totalUnit,
    t,
  });
  return (
    <FormResponsiveLayout
      title={{
        label: "Ringkasan Status Pesanan",
      }}
      onClickBackButton={() => navigation.pop()}
    >
      <div className="mb-16 bg-neutral-200">
        <div className="space-y-2">
          <KeteranganStatusPesanan
            legendStatus={dataStatusPesanan?.legendStatus}
          />

          {remainingDrivers > 0 && (
            <div className="flex flex-col gap-4 bg-neutral-50 px-4 py-6">
              <BadgeStatusPesanan variant="muted" className="w-fit">
                {remainingDrivers} Driver Belum Berangkat
              </BadgeStatusPesanan>

              <span className="text-sm font-semibold">
                Pesanan Anda berada dalam tahap :
              </span>

              <BadgeStatusPesanan
                variant={statusMeta.variant}
                className="w-full"
              >
                {statusMeta.label}
              </BadgeStatusPesanan>

              <StepperContainer activeIndex={0} totalStep={6}>
                {dataStatusPesanan?.legendStatus.map((step, index) => (
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
              orderStatus={dataStatusPesanan.orderStatus}
            />
          ))}
        </div>
      </div>

      {/* <pre>{JSON.stringify(dataStatusPesanan, null, 2)}</pre> */}
    </FormResponsiveLayout>
  );
};
export default RingkasanStatusPesananScreen;
