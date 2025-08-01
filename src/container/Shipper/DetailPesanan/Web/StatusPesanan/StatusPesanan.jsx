import { useEffect, useMemo, useState } from "react";

import { AlertMultiline } from "@/components/Alert/AlertMultiline";
import Card, { CardContent } from "@/components/Card/Card";
import { ConditionalDiv } from "@/components/Card/ConditionalDiv";
import { StepperContainer, StepperItem } from "@/components/Stepper/Stepper";
import { AlertPendingPayment1 } from "@/container/Shipper/DetailPesanan/Web/StatusPesanan/AlertPendingPayment1";
import { AlertPendingPrepareFleet } from "@/container/Shipper/DetailPesanan/Web/StatusPesanan/AlertPendingPrepareFleet";
import { AlertPendingUpdateConfirmation } from "@/container/Shipper/DetailPesanan/Web/StatusPesanan/AlertPendingUpdateConfirmation";
import { AlertPendingUpdatePayment } from "@/container/Shipper/DetailPesanan/Web/StatusPesanan/AlertPendingUpdatePayment";
import { DriverStatusCard } from "@/container/Shipper/DetailPesanan/Web/StatusPesanan/DriverStatusCard";
import { StatusPesananHeader } from "@/container/Shipper/DetailPesanan/Web/StatusPesanan/StatusPesananHeader";
import { useTranslation } from "@/hooks/use-translation";
import {
  AlertLabelEnum,
  AlertTypeEnum,
} from "@/lib/constants/detailpesanan/alert.enum";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { getAlertMetadata } from "@/lib/normalizers/detailpesanan/getAlertMetadata";
import { toast } from "@/lib/toast";

const StatusPesanan = ({ dataStatusPesanan, isShowWaitFleetAlert }) => {
  const { t } = useTranslation();

  // State simulasi status order dan driverStatus
  const [orderStatusSimulasi, setOrderStatusSimulasi] = useState(null);
  const [isLoadingKonfirmasi, setIsLoadingKonfirmasi] = useState(false);

  // State untuk tracking toast yang sudah ditampilkan
  const [toastShown, setToastShown] = useState(false);

  // Status order yang digunakan (simulasi jika ada, jika tidak pakai data asli)
  const statusOrder = orderStatusSimulasi || dataStatusPesanan.orderStatus;
  // Driver status yang digunakan (simulasi jika ada, jika tidak pakai data asli)

  // useEffect untuk menangani toast ORDER_CHANGES_CONFIRMATION
  useEffect(() => {
    const hasOrderChangesConfirmation = dataStatusPesanan.alerts.some(
      (alert) => alert.type === AlertTypeEnum.ORDER_CHANGES_CONFIRMATION
    );

    if (hasOrderChangesConfirmation && !toastShown) {
      toast.error(t("messageArmadaDisiapkanUlang"));
      setToastShown(true);
    }
  }, [dataStatusPesanan.alerts, toastShown, t]);

  // Handler tombol konfirmasi
  const handleKonfirmasi = () => {
    setIsLoadingKonfirmasi(true);
    setOrderStatusSimulasi("CONFIRMED");
    toast.success(t("messagePesananBerhasilTerkonfirmasi"));

    setTimeout(() => {
      setOrderStatusSimulasi("LOADING");
      setIsLoadingKonfirmasi(false);
      toast.success(t("messagePesananBerhasilTerkonfirmasi"));
    }, 10000);
  };

  const orderAlerts = useMemo(() => {
    return [
      ...(isShowWaitFleetAlert
        ? [
            {
              label: AlertLabelEnum.CONFIRMATION_WAITING_PREPARE_FLEET,
            },
          ]
        : []),
      ...(dataStatusPesanan?.alerts || [])
        .map((item) => getAlertMetadata(item?.type, t))
        .filter((val) => Boolean(val)),
    ];
  }, [dataStatusPesanan?.alerts, isShowWaitFleetAlert, t]);
  console.log("🚀 ~ orderAlerts ~ orderAlerts:", orderAlerts);

  return (
    <>
      <ConditionalDiv className="flex flex-col gap-y-6">
        {dataStatusPesanan.orderStatus === OrderStatusEnum.PREPARE_FLEET && (
          <AlertPendingPrepareFleet
            orderStatus={statusOrder}
            paymentDueDateTime={dataStatusPesanan.paymentDueDateTime}
          />
        )}

        {dataStatusPesanan.orderStatus ===
          OrderStatusEnum.WAITING_PAYMENT_1 && (
          <AlertPendingPayment1
            paymentDueDateTime={
              dataStatusPesanan.paymentDueDateTimeFromOrderDetail
            }
          />
        )}

        {statusOrder === OrderStatusEnum.WAITING_PAYMENT_3 && (
          <AlertPendingUpdatePayment
            paymentDueDateTime={dataStatusPesanan.paymentDueDateTime}
          />
        )}

        {/* Alert Buat Habis Update lokasi bongkar perlu konfirmasi */}
        {statusOrder === OrderStatusEnum.WAITING_CONFIRMATION_CHANGES && (
          <AlertPendingUpdateConfirmation />
        )}

        {orderAlerts.length > 0 && <AlertMultiline items={orderAlerts} />}
      </ConditionalDiv>

      <Card className="rounded-xl border-none">
        <CardContent className="px-8 py-6">
          <div className="flex flex-col gap-2.5">
            {/* Header Section */}
            <div className="flex gap-2.5">
              <StatusPesananHeader
                dataStatusPesanan={{
                  ...dataStatusPesanan,
                  orderStatus: statusOrder,
                }}
              />
              {/* Tombol konfirmasi hanya muncul jika status WAITING_CONFIRMATION_CHANGES */}
              {/* {isDev &&
                statusOrder ===
                  OrderStatusEnum.WAITING_CONFIRMATION_CHANGES && (
                  <button
                    onClick={handleKonfirmasi}
                    disabled={isLoadingKonfirmasi}
                    style={{
                      marginBottom: 12,
                      opacity: isLoadingKonfirmasi ? 0.5 : 1,
                    }}
                  >
                    {isLoadingKonfirmasi
                      ? t("buttonMemproses")
                      : t("buttonKonfirmasiPesanan")}
                  </button>
                )} */}
            </div>

            {/* Timeline Section */}
            {orderStatusSimulasi !== "CONFIRMED" &&
            dataStatusPesanan.driverStatus?.length > 0 ? (
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
