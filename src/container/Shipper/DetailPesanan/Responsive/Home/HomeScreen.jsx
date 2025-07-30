import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

import { AlertMultilineResponsive } from "@/components/Alert/AlertMultilineResponsive";
import { useTranslation } from "@/hooks/use-translation";
import FormResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/FormResponsiveLayout";
import {
  AlertInfoEnum,
  AlertLabelEnum,
  AlertTypeEnum,
} from "@/lib/constants/detailpesanan/alert.enum";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import useGetFleetSearchStatus from "@/services/Shipper/detailpesanan/getFleetSearchStatus";

import { BottomsheetMenuList } from "./components/BottomsheetMenuList";
import DriverInfoSlider from "./components/DriverInfoSlider";
import { FleetStatusAlert } from "./components/FleetStatusAlert";
import { FooterDetailPesanan } from "./components/FooterDetailPesanan";
import { MethodInfo } from "./components/MethodInfo";
import { ModalInformasiSlider } from "./components/ModalInformasiSlider";
import { OrderInfo } from "./components/OrderInfo";
import { PendingPaymentAlert } from "./components/PendingPaymentAlert";
import { PendingPaymentDetail } from "./components/PendingPaymentDetail";
import { PendingPrepareFleetAlert } from "./components/PendingPrepareFleetAlert";
import { RouteInfo } from "./components/RouteInfo";
import { TabsInfo } from "./components/TabsInfo";
import { TransactionSummary } from "./components/TransactionSummary";

const DEBUG_MODE = false;

const WHITELIST_PREPARE_FLEET = [OrderStatusEnum.PREPARE_FLEET];
const WHITELIST_FLEET_FOUND = [OrderStatusEnum.WAITING_PAYMENT_1];

const WHITELIST_PENDING_PAYMENT = [
  OrderStatusEnum.WAITING_PAYMENT_2,
  OrderStatusEnum.WAITING_PAYMENT_4,
  OrderStatusEnum.WAITING_REPAYMENT_2,
];

const BLACKLIST_ROUTE_INFO = [
  OrderStatusEnum.PREPARE_FLEET,
  OrderStatusEnum.WAITING_PAYMENT_1,
  OrderStatusEnum.WAITING_PAYMENT_2,
];

const getContentAlert = (type, t) => {
  const info = AlertInfoEnum[type];
  if (type === AlertTypeEnum.CONFIRMATION_WAITING_PREPARE_FLEET) return false;
  if (info) return { label: t(AlertLabelEnum[type]), info };

  if (type === AlertTypeEnum.WAITING_TIME_CHARGE) {
    return {
      label: t(AlertLabelEnum.WAITING_TIME_CHARGE),
      button: {
        onClick: () => alert("Lihat Detail"),
        label: "Lihat Detail",
      },
    };
  }

  if (type === AlertTypeEnum.ORDER_CHANGES_CONFIRMATION) {
    return {
      label: t(AlertLabelEnum.ORDER_CHANGES_CONFIRMATION),
      button: {
        onClick: () => alert("Konfirmasi"),
        label: "Konfirmasi",
      },
    };
  }

  return { label: AlertLabelEnum[type] };
};

const DetailPesananScreen = ({
  dataStatusPesanan,
  dataRingkasanPesanan,
  dataDetailPIC,
  dataRingkasanPembayaran,
  documentShippingDetail,
}) => {
  const { t } = useTranslation();
  const params = useParams();
  const {
    isOpen: isWaitFleetModalOpen,
    isShow: isShowWaitFleetAlert,
    setIsOpen: setIsWaitFleetModalOpen,
    setIsShow: setIsShowWaitFleetAlert,
  } = useGetFleetSearchStatus(
    params.orderId,
    dataStatusPesanan?.orderStatus === OrderStatusEnum.PREPARE_FLEET
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isOpenInfo, setIsOpenInfo] = useState(false);

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
        .map((item) => getContentAlert(item?.type, t))
        .filter((val) => Boolean(val)),
    ];
  }, [dataStatusPesanan?.alerts, isShowWaitFleetAlert, t]);

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
      <div className="mb-16 space-y-2 bg-neutral-200">
        {WHITELIST_PREPARE_FLEET.includes(dataStatusPesanan?.orderStatus) ? (
          <PendingPrepareFleetAlert expiredAt={dataStatusPesanan?.expiredAt} />
        ) : WHITELIST_FLEET_FOUND.includes(dataStatusPesanan?.orderStatus) ? (
          <PendingPaymentAlert expiredAt={dataRingkasanPembayaran?.expiredAt} />
        ) : WHITELIST_PENDING_PAYMENT.includes(
            dataStatusPesanan?.orderStatus
          ) ? (
          <PendingPaymentDetail
            dataRingkasanPembayaran={dataRingkasanPembayaran}
          />
        ) : null}

        <AlertMultilineResponsive items={orderAlerts} />

        {DEBUG_MODE && <FleetStatusAlert />}

        <OrderInfo dataStatusPesanan={dataStatusPesanan} />

        <DriverInfoSlider
          driverStatus={dataStatusPesanan?.driverStatus}
          orderId={dataStatusPesanan?.orderId}
          orderStatus={dataStatusPesanan?.orderStatus}
        />
        <TabsInfo
          dataStatusPesanan={dataStatusPesanan}
          dataDetailPIC={dataDetailPIC}
          dataRingkasanPesanan={dataRingkasanPesanan}
        />

        {!BLACKLIST_ROUTE_INFO.includes(dataStatusPesanan?.orderStatus) && (
          <RouteInfo dataDetailPesanan={dataRingkasanPesanan} />
        )}
        {true && <MethodInfo method={"va_bca"} />}
        {true && (
          <TransactionSummary documentShippingDetail={documentShippingDetail} />
        )}
      </div>

      <FooterDetailPesanan dataStatusPesanan={dataStatusPesanan} />

      <ModalInformasiSlider open={isOpenInfo} onOpenChange={setIsOpenInfo} />
      <BottomsheetMenuList open={isMenuOpen} onOpenChange={setIsMenuOpen} />

      <pre>{JSON.stringify(dataStatusPesanan, null, 2)}</pre>
    </FormResponsiveLayout>
  );
};
export default DetailPesananScreen;
