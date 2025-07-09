import { Alert } from "@/components/Badge/Alert";
import Card, { CardContent } from "@/components/Card/Card";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import { StepperContainer, StepperItem } from "@/components/Stepper/Stepper";

import { AlertPendingPrepareFleet } from "./AlertPendingPrepareFleet";
import AlertUpdateConfirmation from "./AlertUpdateConfirmation";
import { DriverStatusCard } from "./DriverStatusCard";
import { StatusPesananHeader } from "./StatusPesananHeader";

const StatusPesanan = ({ dataStatusPesanan }) => {
  return (
    <>
      {dataStatusPesanan.alerts.map((alert) => (
        <Alert key={alert.label} variant="secondary" size="big">
          <div className="flex items-center gap-2">
            <span
              className="info-alert-content block"
              style={{ "& b": { fontWeight: 600 } }}
              dangerouslySetInnerHTML={{ __html: alert.label }}
            />

            {alert?.info && (
              <InfoTooltip
                side="right"
                render={alert.info}
                className="w-[336px]"
                appearance={{ iconColor: "text-neutral-700" }}
              />
            )}
          </div>
        </Alert>
      ))}

      <AlertPendingPrepareFleet
        orderStatus={dataStatusPesanan.orderStatus}
        expiredAt={dataStatusPesanan.expiredAt}
      />

      {/* Alert Buat Habis Update lokasi bongkar perlu konfirmasi */}
      {true ? <AlertUpdateConfirmation /> : null}

      <Card className="rounded-xl border-none">
        <CardContent className="px-8 py-6">
          <div className="flex flex-col gap-2.5">
            {/* Header Section */}
            <StatusPesananHeader dataStatusPesanan={dataStatusPesanan} />

            {/* Timeline Section */}
            {dataStatusPesanan.driverStatus?.length > 0 ? (
              <DriverStatusCard
                driverStatus={dataStatusPesanan.driverStatus}
                orderId={dataStatusPesanan.orderId}
                orderStatus={dataStatusPesanan.orderStatus}
              />
            ) : dataStatusPesanan.legendStatus?.stepperData?.length > 0 ? (
              <StepperOnly legendStatus={dataStatusPesanan.legendStatus} />
            ) : null}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default StatusPesanan;

const StepperOnly = ({ legendStatus }) => {
  return (
    <div className="flex w-full flex-col gap-y-5 rounded-xl border border-neutral-400 px-4 py-5">
      <StepperContainer
        activeIndex={legendStatus.activeIndex}
        totalStep={legendStatus.stepperData.length}
      >
        {legendStatus?.stepperData?.map((legend, index) => (
          <StepperItem key={legend.status} step={legend} index={index} />
        ))}
      </StepperContainer>
    </div>
  );
};
