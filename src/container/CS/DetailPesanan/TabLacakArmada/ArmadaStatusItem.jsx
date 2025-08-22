import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import IconComponent from "@/components/IconComponent/IconComponent";
import { StepperContainer, StepperItem } from "@/components/Stepper/Stepper";
import { useTranslation } from "@/hooks/use-translation";
import { getStatusDriverMetadataCS } from "@/lib/normalizers/CS/getStatusDriverMetadata";

export const ArmadaStatusItem = ({ item }) => {
  const { t } = useTranslation();
  const status = getStatusDriverMetadataCS({
    orderStatus: item?.orderStatus,
    driverStatus: item?.driverInfo?.driverStatus,
    t,
  });

  return (
    <div className="flex flex-col gap-4 bg-white p-4">
      {status && (
        <div className="flex items-center gap-2">
          <BadgeStatusPesanan variant={status?.variant}>
            {status?.label}
          </BadgeStatusPesanan>
          {item?.sosStatus?.hasSOS && (
            <span className="flex h-6 items-center rounded-md bg-error-400 px-2 text-xs font-semibold text-error-50">
              SOS
            </span>
          )}
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={item.truckImage}
            alt={`Truk ${item.licensePlate}`}
            className="h-14 w-14 rounded-lg border border-neutral-500 object-cover"
          />
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold text-neutral-900">
              {item.licensePlate}
            </p>
            <div className="flex items-center gap-1 text-xs font-medium text-neutral-900">
              <IconComponent
                src="/icons/profile16.svg"
                className="size-4 text-muat-trans-secondary-900"
              />
              <span>{item?.driverInfo?.driverName}</span>
            </div>
          </div>
        </div>
        <div className="w-[742px] pr-4 text-center text-neutral-500">
          <StepperContainer
            activeIndex={item?.stepStatus?.activeIndex || 0}
            totalStep={item?.stepStatus?.stepperData?.length || 0}
          >
            {item?.stepStatus?.stepperData?.map((step, index) => (
              <StepperItem key={step.label} step={step} index={index} />
            ))}
          </StepperContainer>
        </div>
      </div>
    </div>
  );
};
