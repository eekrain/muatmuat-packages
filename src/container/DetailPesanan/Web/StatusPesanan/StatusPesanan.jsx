import { Alert } from "@/components/Badge/Alert";
import Card, { CardContent } from "@/components/Card/Card";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import { StepperContainer, StepperItem } from "@/components/Stepper/Stepper";
// import AlertDriverWaiting from "@/container/DetailPesanan/Web/StatusPesanan/AlertDriverWaiting";
import { AlertPendingPayment1 } from "@/container/DetailPesanan/Web/StatusPesanan/AlertPendingPayment1";
import { AlertPendingPrepareFleet } from "@/container/DetailPesanan/Web/StatusPesanan/AlertPendingPrepareFleet";
import { AlertPendingUpdateConfirmation } from "@/container/DetailPesanan/Web/StatusPesanan/AlertPendingUpdateConfirmation";
import { AlertPendingUpdatePayment } from "@/container/DetailPesanan/Web/StatusPesanan/AlertPendingUpdatePayment";
import AlertWaitFleetSearch from "@/container/DetailPesanan/Web/StatusPesanan/AlertWaitFleetSearch";
import { DriverStatusCard } from "@/container/DetailPesanan/Web/StatusPesanan/DriverStatusCard";
import { StatusPesananHeader } from "@/container/DetailPesanan/Web/StatusPesanan/StatusPesananHeader";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { cn } from "@/lib/utils";

import { ModalPerubahanData } from "./ModalPerubahanData";

const StatusPesanan = ({ dataStatusPesanan, isShowWaitFleetAlert }) => {
  return (
    <>
      {dataStatusPesanan.orderStatus ===
        OrderStatusEnum.PENDING_PREPARE_FLEET && (
        <AlertPendingPrepareFleet
          orderStatus={dataStatusPesanan.orderStatus}
          expiredAt={dataStatusPesanan.expiredAt}
        />
      )}

      {dataStatusPesanan.orderStatus === OrderStatusEnum.WAITING_PAYMENT_1 && (
        <AlertPendingPayment1 expiredAt={dataStatusPesanan.expiredAt} />
      )}

      {dataStatusPesanan.orderStatus === OrderStatusEnum.WAITING_PAYMENT_3 && (
        <AlertPendingUpdatePayment expiredAt={dataStatusPesanan.expiredAt} />
      )}

      {/* Alert Buat Habis Update lokasi bongkar perlu konfirmasi */}
      {dataStatusPesanan.orderStatus ===
        OrderStatusEnum.WAITING_CONFIRMATION_CHANGES && (
        <AlertPendingUpdateConfirmation />
      )}

      {dataStatusPesanan.alerts.map((item) => (
        <Alert key={item.label} variant="secondary" size="big">
          <div className={cn("flex items-center gap-1", item.info && "gap-2")}>
            <span
              className="info-alert-content block"
              style={{ "& b": { fontWeight: 600 } }}
              dangerouslySetInnerHTML={{ __html: item.label }}
            />
            {item.type === "CONFIRMED_CHANGES" ? (
              <ModalPerubahanData />
            ) : item?.info ? (
              <InfoTooltip
                side="right"
                render={item.info}
                className="w-[336px]"
                appearance={{ iconColor: "text-neutral-700" }}
              />
            ) : null}
          </div>
        </Alert>
      ))}

      {/* Alert Driver akan kena biaya tunggu dan tunjukan QR ke driver */}
      {/* {true ? <AlertDriverWaiting /> : null} */}

      {isShowWaitFleetAlert && <AlertWaitFleetSearch />}

      {/* Alert Buat Habis Update lokasi bongkar perlu konfirmasi */}
      {/* {true ? <AlertUpdateConfirmation /> : null} */}

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
            ) : (
              <StepperOnly legendStatus={dataStatusPesanan.legendStatus} />
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default StatusPesanan;

const LIST_SHOW_STEPPER_ONLY = [
  OrderStatusEnum.CONFIRMED,
  OrderStatusEnum.SCHEDULED_FLEET,
  OrderStatusEnum.LOADING,
  OrderStatusEnum.UNLOADING,
  OrderStatusEnum.PREPARE_DOCUMENT,
  OrderStatusEnum.DOCUMENT_DELIVERY,
  OrderStatusEnum.WAITING_REPAYMENT_1,
  OrderStatusEnum.WAITING_REPAYMENT_2,
];

const StepperOnly = ({ legendStatus }) => {
  if (!LIST_SHOW_STEPPER_ONLY.includes(legendStatus.activeIndex)) return null;
  if (legendStatus?.stepperData?.length === 0) return null;

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
