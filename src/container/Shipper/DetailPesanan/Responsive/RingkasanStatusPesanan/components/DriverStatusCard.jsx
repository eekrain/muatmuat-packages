import { useParams } from "next/navigation";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import Button from "@/components/Button/Button";
import {
  StepperContainer,
  StepperItemResponsive,
} from "@/components/Stepper/Stepper";
import { useTranslation } from "@/hooks/use-translation";
import { getDriverStatusMetadata } from "@/lib/normalizers/detailpesanan/getDriverStatusMetadata";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";

import { DriverInfo } from "../../Home/components/DriverInfoSlider";

export const DriverStatusCard = ({ driver }) => {
  const navigation = useResponsiveNavigation();
  const { t } = useTranslation();
  const params = useParams();

  const statusMeta = getDriverStatusMetadata({
    driverStatus: driver.driverStatus,
    orderStatus: driver.orderStatus,
    t,
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
          <StepperItemResponsive key={step.status} step={step} index={index} />
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
