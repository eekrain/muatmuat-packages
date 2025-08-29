import { Fragment } from "react";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import {
  StepperContainer,
  StepperItemResponsive,
} from "@/components/Stepper/Stepper";

import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { useTranslation } from "@/hooks/use-translation";

import { getStatusPesananMetadata } from "@/lib/normalizers/detailpesanan/getStatusPesananMetadata";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";

import FormResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/FormResponsiveLayout";

import { DriverStatusCard } from "./components/DriverStatusCard";
import { KeteranganStatusPesanan } from "./components/KeteranganStatusPesanan";

const RingkasanStatusPesananScreen = ({ dataStatusPesanan }) => {
  const navigation = useResponsiveNavigation();

  const { t } = useTranslation();

  const remainingDrivers = useShallowMemo(() => {
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
    orderType: dataStatusPesanan.orderType,
  });

  return (
    <FormResponsiveLayout
      title={{
        label: t(
          "RingkasanStatusPesananScreen.titleRingkasanStatusPesanan",
          {},
          "Ringkasan Status Pesanan"
        ),
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
              {dataStatusPesanan?.totalUnit &&
                dataStatusPesanan?.totalUnit > 1 && (
                  <BadgeStatusPesanan variant="muted" className="w-fit">
                    {t(
                      "RingkasanStatusPesananScreen.badgeDriverBelumBerangkat",
                      { count: remainingDrivers },
                      "{count} Driver Belum Berangkat"
                    )}
                  </BadgeStatusPesanan>
                )}

              <span className="text-sm font-semibold">
                {t(
                  "RingkasanStatusPesananScreen.textPesananAndaBeradaDalamTahap",
                  {},
                  "Pesanan Anda berada dalam tahap :"
                )}
              </span>

              <BadgeStatusPesanan
                variant={statusMeta.variant}
                className="w-full"
              >
                {statusMeta.label}
              </BadgeStatusPesanan>

              <StepperContainer activeIndex={0} totalStep={6}>
                {dataStatusPesanan?.legendStatus?.stepperData.map(
                  (step, index) => (
                    <Fragment key={index}>
                      <StepperItemResponsive step={step} index={index} />
                    </Fragment>
                  )
                )}
              </StepperContainer>
            </div>
          )}

          {dataStatusPesanan?.driverStatus.map((driver) => (
            <DriverStatusCard
              key={driver.driverId}
              driver={driver}
              dataStatusPesanan={dataStatusPesanan}
            />
          ))}
        </div>
      </div>

      {/* <pre>{JSON.stringify(dataStatusPesanan, null, 2)}</pre> */}
    </FormResponsiveLayout>
  );
};
export default RingkasanStatusPesananScreen;
