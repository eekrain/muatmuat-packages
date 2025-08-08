import { useParams } from "next/navigation";
import { Fragment } from "react";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import Button from "@/components/Button/Button";
import {
  StepperContainer,
  StepperItemResponsive,
} from "@/components/Stepper/Stepper";
import { useTranslation } from "@/hooks/use-translation";
import { getStatusPesananMetadata } from "@/lib/normalizers/detailpesanan/getStatusPesananMetadata";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";

import { DriverInfo } from "../../Home/components/DriverInfoSlider";

export const DriverStatusCard = ({ driver, dataStatusPesanan }) => {
  const navigation = useResponsiveNavigation();
  const { t } = useTranslation();
  const params = useParams();

  const statusMeta = getStatusPesananMetadata({
    orderStatus: driver.orderStatus,
    unitFleetStatus: 1,
    totalUnit: 1,
    t,
    orderType: dataStatusPesanan.orderType,
  });

  return (
    <DriverInfo.Root
      key={driver.driverId}
      className="relative flex flex-col gap-4 border-none px-4 py-5"
    >
      <DriverInfo.Avatar driver={driver} />

      <BadgeStatusPesanan variant={statusMeta?.variant} className="w-full">
        {statusMeta?.label}
      </BadgeStatusPesanan>

      <StepperContainer
        activeIndex={driver.activeIndex || 0}
        totalStep={driver.stepperData?.length || 0}
      >
        {driver.stepperData?.map((step, index) => (
          <Fragment key={index}>
            <StepperItemResponsive step={step} index={index} />
          </Fragment>
        ))}
      </StepperContainer>

      <Button
        variant="muatparts-primary-secondary"
        className="h-7 w-full text-xs font-semibold"
        onClick={() =>
          navigation.push("/DetailStatusDriverScreen", {
            driverId: driver.driverId,
            orderId: params.orderId,
          })
        }
      >
        {t("buttonDriverDetails", {}, "Detail Status Driver")}
      </Button>
    </DriverInfo.Root>
  );
};
