import { AvatarDriver } from "@/components/Avatar/AvatarDriver";
import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import Button from "@/components/Button/Button";
import {
  StepperContainer,
  StepperItemResponsive,
} from "@/components/Stepper/Stepper";
import { useTranslation } from "@/hooks/use-translation";

import { getOrderStatusLabel, getStatusVariant } from "../../../utlis";

export const DriverStatusCard = ({ driver, orderId, orderStatus }) => {
  const { t } = useTranslation();
  return (
    <div className="box-border flex w-full flex-col items-center justify-center bg-white p-5">
      <div className="flex w-full flex-col items-start gap-4">
        <AvatarDriver
          name={driver.name}
          image={driver.driverImage}
          licensePlate={driver.licensePlate}
        />

        {/* Status Badge */}
        {true && (
          <BadgeStatusPesanan
            variant={getStatusVariant({
              orderStatus: orderStatus,
            })}
            className="w-full text-sm font-semibold"
          >
            {getOrderStatusLabel({
              orderStatus: orderStatus,
              t,
            })}
          </BadgeStatusPesanan>
        )}

        <StepperContainer
          activeIndex={driver.activeIndex || 0}
          totalStep={driver.stepperData?.length || 0}
        >
          {driver.stepperData?.map((step, index) => (
            <StepperItemResponsive
              key={step.status}
              step={step}
              index={index}
            />
          ))}
        </StepperContainer>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex w-full flex-row items-center justify-center gap-3">
        <Button
          variant="muatparts-primary-secondary"
          className="h-7 w-full text-xs font-semibold"
        >
          Detail Status Driver
        </Button>
      </div>
    </div>
  );
};
