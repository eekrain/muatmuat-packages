import { useEffect, useState } from "react";

import { AlertMultiline } from "@/components/Alert/AlertMultiline";
import Card, { CardContent } from "@/components/Card/Card";
import { StepperContainer, StepperItem } from "@/components/Stepper/Stepper";
import { AlertPendingPayment1 } from "@/container/Shipper/DetailPesanan/Web/StatusPesanan/AlertPendingPayment1";
import { AlertPendingPrepareFleet } from "@/container/Shipper/DetailPesanan/Web/StatusPesanan/AlertPendingPrepareFleet";
import { AlertPendingUpdateConfirmation } from "@/container/Shipper/DetailPesanan/Web/StatusPesanan/AlertPendingUpdateConfirmation";
import { AlertPendingUpdatePayment } from "@/container/Shipper/DetailPesanan/Web/StatusPesanan/AlertPendingUpdatePayment";
import { DriverStatusCard } from "@/container/Shipper/DetailPesanan/Web/StatusPesanan/DriverStatusCard";
import { StatusPesananHeader } from "@/container/Shipper/DetailPesanan/Web/StatusPesanan/StatusPesananHeader";
import { useTranslation } from "@/hooks/use-translation";
import {
  AlertInfoEnum,
  AlertLabelEnum,
  AlertTypeEnum,
} from "@/lib/constants/detailpesanan/alert.enum";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { isDev } from "@/lib/constants/is-dev";
import { toast } from "@/lib/toast";

import { ModalInformasiKenaBiayaWaktuTunggu } from "./ModalInformasiKenaBiayaWaktuTunggu";
import { ModalPerubahanData } from "./ModalPerubahanData";

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

  const getContentAlert = ({ type }) => {
    const info = AlertInfoEnum[type];
    if (type === AlertTypeEnum.CONFIRMATION_WAITING_PREPARE_FLEET) return false;
    if (info) return { label: t(AlertLabelEnum[type]), info: t(info) };

    if (type === AlertTypeEnum.WAITING_TIME_CHARGE) {
      return {
        label: t(AlertLabelEnum.WAITING_TIME_CHARGE),
        button: (
          <ModalInformasiKenaBiayaWaktuTunggu
            data={[
              {
                name: "Noel Gallagher",
                licensePlate: "AE 666 LBA",
              },
              {
                name: "Noel Gallagher",
                licensePlate: "AE 666 LBA",
              },
              {
                name: "Noel Gallagher",
                licensePlate: "AE 666 LBA",
              },
            ]}
          />
        ),
      };
    }

    if (type === AlertTypeEnum.ORDER_CHANGES_CONFIRMATION) {
      return {
        label: t(AlertLabelEnum.ORDER_CHANGES_CONFIRMATION),
        button: <ModalPerubahanData />,
      };
    }

    return { label: t(AlertLabelEnum[type]) };
  };

  return (
    <>
      <div className="flex flex-col gap-y-6">
        {dataStatusPesanan.orderStatus === OrderStatusEnum.PREPARE_FLEET && (
          <AlertPendingPrepareFleet
            orderStatus={statusOrder}
            expiredAt={dataStatusPesanan.expiredAt}
          />
        )}

        {dataStatusPesanan.orderStatus ===
          OrderStatusEnum.WAITING_PAYMENT_1 && (
          <AlertPendingPayment1
            expiredAt={dataStatusPesanan.expiredAtFromOrderDetail}
          />
        )}

        {statusOrder === OrderStatusEnum.WAITING_PAYMENT_3 && (
          <AlertPendingUpdatePayment expiredAt={dataStatusPesanan.expiredAt} />
        )}

        {/* Alert Buat Habis Update lokasi bongkar perlu konfirmasi */}
        {statusOrder === OrderStatusEnum.WAITING_CONFIRMATION_CHANGES && (
          <AlertPendingUpdateConfirmation />
        )}

        <AlertMultiline
          items={[
            ...(isShowWaitFleetAlert
              ? [
                  {
                    label: t(AlertLabelEnum.CONFIRMATION_WAITING_PREPARE_FLEET),
                  },
                ]
              : []),
            ...dataStatusPesanan.alerts
              .map((item) => getContentAlert(item))
              .filter((val) => Boolean(val)),
          ]}
        />
      </div>

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
              {isDev &&
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
                )}
            </div>

            {/* Timeline Section */}
            {orderStatusSimulasi !== "CONFIRMED" &&
            statusOrder !== OrderStatusEnum.WAITING_CONFIRMATION_CHANGES &&
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
