import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

import { AlertMultilineResponsive } from "@/components/Alert/AlertMultilineResponsive";
import {
  Tabs,
  TabsList,
  TabsTriggerWithSeparator,
} from "@/components/Tabs/Tabs";
import { useTranslation } from "@/hooks/use-translation";
import FormResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/FormResponsiveLayout";
import {
  AlertLabelEnum,
  AlertNeedConfirmEnum,
  AlertTypeEnum,
} from "@/lib/constants/detailpesanan/alert.enum";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { getAlertMetadata } from "@/lib/normalizers/detailpesanan/getAlertMetadata";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import useGetFleetSearchStatus from "@/services/Shipper/detailpesanan/getFleetSearchStatus";

import DriverInfoSlider from "./components/DriverInfoSlider";
import { FooterDetailPesanan } from "./components/FooterDetailPesanan";
import { ModalInformasiSlider } from "./components/ModalInformasiSlider";
import { OrderInfo } from "./components/OrderInfo";
import { PendingPaymentAlert } from "./components/Pending/PendingPaymentAlert";
import { PendingPaymentDetail } from "./components/Pending/PendingPaymentDetail";
import { PendingPrepareFleetAlert } from "./components/Pending/PendingPrepareFleetAlert";
import PendingUpdateConfirmation from "./components/Pending/PendingUpdateConfirmation";
import PendingUpdateFeePayment from "./components/Pending/PendingUpdateFeePayment";
import { BottomSheetPeriksaPesananKamu } from "./components/Popup/BottomSheetPeriksaPesananKamu";
import { BottomsheetAlasanPembatalan } from "./components/Popup/BottomsheetAlasanPembatalan";
import { BottomsheetMenuList } from "./components/Popup/BottomsheetMenuList";
import { ModalBatalkanPesananResponsive } from "./components/Popup/ModalBatalkanPesananResponsive";
import { ModalVolumePesananTinggi } from "./components/Popup/ModalVolumePesananTinggi";
import { TabContentDetailPIC } from "./components/Tab/TabContentDetailPIC";
import { TabContentInformasiLainnya } from "./components/Tab/TabContentInformasiLainnya";
import { TabContentRingkasan } from "./components/Tab/TabContentRingkasan";

const WHITELIST_PREPARE_FLEET = [OrderStatusEnum.PREPARE_FLEET];
const WHITELIST_FLEET_FOUND = [OrderStatusEnum.WAITING_PAYMENT_1];

const WHITELIST_PENDING_PAYMENT = [
  OrderStatusEnum.WAITING_PAYMENT_2,
  OrderStatusEnum.WAITING_PAYMENT_4,
  OrderStatusEnum.WAITING_REPAYMENT_2,
];

const LIST_SHOW_TOTAL_PRICE = [
  OrderStatusEnum.WAITING_PAYMENT_1,
  OrderStatusEnum.PREPARE_FLEET,
];

const DetailPesananScreen = ({
  dataStatusPesanan,
  dataRingkasanPesanan,
  dataDetailPIC,
  dataRingkasanPembayaran,
  documentShippingDetail,
  waitingTimeRaw,
}) => {
  const { t } = useTranslation();
  const params = useParams();
  const {
    isOpen: isVolumePesananTinggiOpen,
    isShow: isShowWaitFleetAlert,
    setIsOpen: setIsVolumePesananTinggiOpen,
    setIsShow: setIsShowWaitFleetAlert,
  } = useGetFleetSearchStatus(
    params.orderId,
    dataStatusPesanan?.orderStatus === OrderStatusEnum.PREPARE_FLEET
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOpenInfo, setIsOpenInfo] = useState(false);
  const [isPeriksaPesananOpen, setIsPeriksaPesananOpen] = useState(false);
  const [isConfirmWaiting, setIsConfirmWaiting] = useState(false);
  const [isOpenModalBatalkanPesanan, setIsOpenModalBatalkanPesanan] =
    useState(false);
  const [
    isOpenBottomsheetAlasanPembatalan,
    setIsOpenBottomsheetAlasanPembatalan,
  ] = useState(false);

  const hasConfirmationWaitingAlert = useMemo(() => {
    const hasConfirmAlert =
      isShowWaitFleetAlert ||
      (dataStatusPesanan?.alerts || []).some(
        (alert) =>
          alert?.type === AlertTypeEnum.CONFIRMATION_WAITING_PREPARE_FLEET
      );

    const needsConfirm =
      AlertNeedConfirmEnum.CONFIRMATION_WAITING_PREPARE_FLEET;

    return hasConfirmAlert && needsConfirm;
  }, [dataStatusPesanan?.alerts, isShowWaitFleetAlert]);

  const orderAlerts = useMemo(() => {
    return [
      ...(isShowWaitFleetAlert && isConfirmWaiting
        ? [
            {
              label: AlertLabelEnum.CONFIRMATION_WAITING_PREPARE_FLEET,
            },
          ]
        : []),
      ...(dataStatusPesanan?.alerts || [])
        .filter((item) => {
          if (item?.type === AlertTypeEnum.CONFIRMATION_WAITING_PREPARE_FLEET) {
            return isConfirmWaiting;
          }
          return true;
        })
        .map((item) =>
          getAlertMetadata({
            type: item?.type,
            t,
            onLihatDetailWaktuTunggu: () => alert("Not implemented yet"),
            onLihatPerubahan: () => alert("Not implemented yet"),
            isMobile: true,
          })
        )
        .filter((val) => Boolean(val)),
    ];
  }, [dataStatusPesanan?.alerts, isShowWaitFleetAlert, isConfirmWaiting, t]);

  const shouldShowPendingPrepareFleetAlert = useMemo(() => {
    const isInWhitelist = WHITELIST_PREPARE_FLEET.includes(
      dataStatusPesanan?.orderStatus
    );

    if (hasConfirmationWaitingAlert && isConfirmWaiting) {
      console.log(
        "🍌 PendingPrepareFleetAlert hidden due to CONFIRMATION_WAITING_PREPARE_FLEET alert and user confirmed waiting"
      );
      return false;
    }

    return isInWhitelist;
  }, [
    dataStatusPesanan?.orderStatus,
    hasConfirmationWaitingAlert,
    isConfirmWaiting,
  ]);
  const handleModalClose = () => {
    setIsVolumePesananTinggiOpen(false);
    setIsConfirmWaiting(true);
  };

  const handleConfirmWaiting = () => {
    setIsVolumePesananTinggiOpen(false);
  };

  return (
    <FormResponsiveLayout
      title={{
        label: "Detail Pesanan",
      }}
      withMenu={{
        onClickInfo: () => setIsOpenInfo(true),
        onClickMenu: () => setIsMenuOpen(true),
      }}
      onClickBackButton={() => alert("onClickBackButton")}
    >
      {/* 25. 18 - Web - LB - 0294 */}
      <div
        className={cn(
          "space-y-2 bg-neutral-200",
          (LIST_SHOW_TOTAL_PRICE.includes(dataStatusPesanan?.orderStatus) &&
            dataRingkasanPembayaran?.totalPrice) ||
            dataRingkasanPembayaran?.priceCharge ||
            dataStatusPesanan?.orderStatus === OrderStatusEnum.WAITING_PAYMENT_3
            ? "mb-[100px]"
            : "mb-16"
        )}
      >
        <AlertMultilineResponsive items={orderAlerts} />

        {shouldShowPendingPrepareFleetAlert ? (
          <PendingPrepareFleetAlert
            paymentDueDateTime={dataStatusPesanan?.paymentDueDateTime}
          />
        ) : WHITELIST_FLEET_FOUND.includes(dataStatusPesanan?.orderStatus) ? (
          <PendingPaymentAlert
            paymentDueDateTime={dataRingkasanPembayaran?.expiredAt}
          />
        ) : WHITELIST_PENDING_PAYMENT.includes(
            dataStatusPesanan?.orderStatus
          ) ? (
          <PendingPaymentDetail
            dataRingkasanPembayaran={dataRingkasanPembayaran}
          />
        ) : dataStatusPesanan?.orderStatus ===
          OrderStatusEnum.WAITING_CONFIRMATION_CHANGES ? (
          <PendingUpdateConfirmation />
        ) : dataStatusPesanan?.orderStatus ===
          OrderStatusEnum.WAITING_PAYMENT_3 ? (
          <PendingUpdateFeePayment />
        ) : null}

        <OrderInfo dataStatusPesanan={dataStatusPesanan} />

        {!WHITELIST_PENDING_PAYMENT.includes(dataStatusPesanan?.orderStatus) ? (
          <DriverInfoSlider
            driverStatus={dataStatusPesanan?.driverStatus}
            orderId={dataStatusPesanan?.orderId}
            orderStatus={dataStatusPesanan?.orderStatus}
            withMenu={dataStatusPesanan?.totalTruckUnit > 1}
          />
        ) : null}

        <Tabs className="w-full bg-white" defaultValue={"ringkasan"}>
          <TabsList className="w-full">
            <TabsTriggerWithSeparator value="ringkasan">
              Ringkasan
            </TabsTriggerWithSeparator>
            <TabsTriggerWithSeparator value="informasi-lainnya">
              Informasi Lainnya
            </TabsTriggerWithSeparator>
            <TabsTriggerWithSeparator value="detail-pic" showSeparator={false}>
              Detail PIC
            </TabsTriggerWithSeparator>
          </TabsList>
          <TabContentRingkasan
            dataStatusPesanan={dataStatusPesanan}
            dataRingkasanPesanan={dataRingkasanPesanan}
            dataRingkasanPembayaran={dataRingkasanPembayaran}
            documentShippingDetail={documentShippingDetail}
            waitingTimeRaw={waitingTimeRaw}
          />

          <TabContentInformasiLainnya
            dataRingkasanPesanan={dataRingkasanPesanan}
          />
          <TabContentDetailPIC dataDetailPIC={dataDetailPIC} />
        </Tabs>

        <button onClick={() => toast.success("Berhasil membatalkan pesanan")}>
          tes
        </button>
      </div>

      {!WHITELIST_PENDING_PAYMENT.includes(dataStatusPesanan?.orderStatus) ? (
        <FooterDetailPesanan
          dataStatusPesanan={dataStatusPesanan}
          dataRingkasanPembayaran={dataRingkasanPembayaran}
          isConfirmWaiting={isConfirmWaiting}
          onConfirmWaitingChange={setIsConfirmWaiting}
        />
      ) : null}

      <ModalInformasiSlider open={isOpenInfo} onOpenChange={setIsOpenInfo} />
      <BottomsheetMenuList
        open={isMenuOpen}
        onOpenChange={setIsMenuOpen}
        dataStatusPesanan={dataStatusPesanan}
        documentShippingDetail={documentShippingDetail}
        orderId={params.orderId}
      />
      <BottomSheetPeriksaPesananKamu
        open={isPeriksaPesananOpen}
        onOpenChange={setIsPeriksaPesananOpen}
        dataRingkasanPesanan={dataRingkasanPesanan}
        dataStatusPesanan={dataStatusPesanan}
      />

      <ModalVolumePesananTinggi
        open={isVolumePesananTinggiOpen}
        onOpenChange={handleModalClose}
        onConfirm={handleConfirmWaiting}
        onCancel={() => {
          setIsVolumePesananTinggiOpen(false);
          setIsOpenModalBatalkanPesanan(true);
        }}
      />

      <ModalBatalkanPesananResponsive
        open={isOpenModalBatalkanPesanan}
        onOpenChange={setIsOpenModalBatalkanPesanan}
        onConfirm={() => {
          setIsOpenBottomsheetAlasanPembatalan(true);
        }}
        hasPriceCharge={dataRingkasanPembayaran?.hasPriceCharge}
      />

      <BottomsheetAlasanPembatalan
        open={isOpenBottomsheetAlasanPembatalan}
        onOpenChange={setIsOpenBottomsheetAlasanPembatalan}
        orderId={dataStatusPesanan?.orderid}
        onConfirm={() => {
          setIsOpenBottomsheetAlasanPembatalan(false);
        }}
      />
    </FormResponsiveLayout>
  );
};
export default DetailPesananScreen;
