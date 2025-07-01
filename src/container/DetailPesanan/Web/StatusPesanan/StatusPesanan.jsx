import { Alert } from "@/components/Badge/Alert";
import Card, { CardContent } from "@/components/Card/Card";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import { StepperContainer, StepperItem } from "@/components/Stepper/Stepper";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";

import { AlertPendingPesanan } from "./AlertPendingPesanan";
import { DriverStatusCard } from "./DriverStatusCard";
import { StatusPesananHeader } from "./StatusPesananHeader";

const StatusPesanan = ({ dataStatusPesanan }) => {
  const showStepperOnly =
    dataStatusPesanan.orderStatus === OrderStatusEnum.CONFIRMED;

  const showDriverStatuses = [
    OrderStatusEnum.LOADING,
    OrderStatusEnum.UNLOADING,
    OrderStatusEnum.WAITING_REPAYMENT_1,
    OrderStatusEnum.WAITING_REPAYMENT_2,
    OrderStatusEnum.PREPARE_DOCUMENT,
    OrderStatusEnum.DOCUMENT_DELIVERY,
    OrderStatusEnum.COMPLETED,
    OrderStatusEnum.CANCELED_BY_SYSTEM,
    OrderStatusEnum.CANCELED_BY_SHIPPER,
    OrderStatusEnum.CANCELED_BY_TRANSPORTER,
  ];
  const showDriver = showDriverStatuses.includes(dataStatusPesanan.orderStatus);

  return (
    <>
      {dataStatusPesanan.alerts.map((alert) => (
        <Alert
          key={alert.label}
          variant="secondary"
          size="big"
          className="w-full"
        >
          <div className="flex items-center gap-2">
            <span className="block">{alert.label}</span>

            {alert?.info && (
              <InfoTooltip
                side="right"
                appearance={{ iconColor: "!text-neutral-700" }}
              >
                {alert.info}
              </InfoTooltip>
            )}
          </div>
        </Alert>
      ))}

      <AlertPendingPesanan
        orderStatus={dataStatusPesanan.orderStatus}
        expiredAt={dataStatusPesanan.expiredAt}
      />
      <Card className="w-full rounded-xl border-none">
        <CardContent className="px-9 py-6">
          <div className="flex flex-col items-end gap-6">
            {/* Header Section */}
            <StatusPesananHeader
              orderCode={dataStatusPesanan.orderCode}
              orderStatus={dataStatusPesanan.orderStatus}
              cancellationHistory={dataStatusPesanan.cancellationHistory}
            />

            {/* Timeline Section */}
            {showStepperOnly ? (
              <div className="flex w-full flex-col gap-y-5 rounded-xl border border-neutral-400 px-4 py-5">
                <StepperContainer
                  activeIndex={dataStatusPesanan.statusHistory.activeIndex}
                  totalStep={dataStatusPesanan.statusHistory.stepper.length}
                >
                  {dataStatusPesanan?.statusHistory?.stepper?.map(
                    (step, index) => (
                      <StepperItem
                        key={step.status}
                        step={step}
                        index={index}
                      />
                    )
                  )}
                </StepperContainer>
              </div>
            ) : showDriver ? (
              <DriverStatusCard
                dataStatusPesanan={dataStatusPesanan}
                dataDriverStatus={dataStatusPesanan.driverStatus}
              />
            ) : null}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default StatusPesanan;
