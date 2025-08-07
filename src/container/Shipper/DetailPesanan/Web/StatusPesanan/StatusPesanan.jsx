import { useEffect, useMemo, useState } from "react";

import { sub } from "date-fns";

import { AlertMultiline } from "@/components/Alert/AlertMultiline";
import Card, { CardContent } from "@/components/Card/Card";
import { ConditionalDiv } from "@/components/Card/ConditionalDiv";
import { ModalDetailWaktuTunggu } from "@/components/Modal/ModalDetailWaktuTunggu";
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

import { ModalPerubahanData } from "./ModalPerubahanData";

/**
 * StatusPesanan component, displays the status of an order in a card.
 * Contains header section, timeline section and alert section.
 * @param {Object} dataStatusPesanan - data for the order status
 * @param {Boolean} isShowWaitFleetAlert - flag to show the alert for waiting fleet
 */
const StatusPesanan = ({ dataStatusPesanan, isShowWaitFleetAlert }) => {
  const { t } = useTranslation();
  const [isModalPerubahanDataOpen, setIsModalPerubahanDataOpen] =
    useState(false);
  const [isModalDetailWaktuTungguOpen, setIsModalDetailWaktuTungguOpen] =
    useState(false);

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
        .map((item) =>
          getAlertMetadata({
            type: item?.type,
            t,
            onLihatDetailWaktuTunggu: () =>
              setIsModalDetailWaktuTungguOpen(true),
            onLihatPerubahan: () => setIsModalPerubahanDataOpen(true),
          })
        )
        .filter((val) => Boolean(val)),
    ];
  }, [dataStatusPesanan?.alerts, isShowWaitFleetAlert, t]);

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
            paymentDueDateTime={dataStatusPesanan.paymentDueDateTime}
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

      <ModalPerubahanData
        open={isModalPerubahanDataOpen}
        onOpenChange={setIsModalPerubahanDataOpen}
      />
      <ModalDetailWaktuTunggu
        open={isModalDetailWaktuTungguOpen}
        onOpenChange={setIsModalDetailWaktuTungguOpen}
        drivers={[
          {
            name: "Daffa Toldo",
            durasiTotal: "1 Jam 14 Menit",
            data: [
              {
                detail: "Lokasi Muat 1 : 1 Jam 59 Menit",
                startDate: sub(new Date(), { hours: 2 }).toISOString(),
                endDate: sub(new Date(), { hours: 1 }).toISOString(),
                totalPrice: 100000,
              },
              {
                detail: "Lokasi Bongkar 1 : 1 Jam 59 Menit",
                startDate: sub(new Date(), { hours: 2 }).toISOString(),
                endDate: sub(new Date(), { hours: 1 }).toISOString(),
                totalPrice: 200000,
              },
            ],
          },
        ]}
      />
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
