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
import { AlertLabelEnum } from "@/lib/constants/detailpesanan/alert.enum";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { getAlertMetadata } from "@/lib/normalizers/detailpesanan/getAlertMetadata";
import useGetFleetSearchStatus from "@/services/Shipper/detailpesanan/getFleetSearchStatus";

import DriverInfoSlider from "./components/DriverInfoSlider";
import { FooterDetailPesanan } from "./components/FooterDetailPesanan";
import { ModalInformasiSlider } from "./components/ModalInformasiSlider";
import { OrderInfo } from "./components/OrderInfo";
import { PendingPaymentAlert } from "./components/Pending/PendingPaymentAlert";
import { PendingPaymentDetail } from "./components/Pending/PendingPaymentDetail";
import { PendingPrepareFleetAlert } from "./components/Pending/PendingPrepareFleetAlert";
import { BottomSheetPeriksaPesananKamu } from "./components/Popup/BottomSheetPeriksaPesananKamu";
import { BottomsheetMenuList } from "./components/Popup/BottomsheetMenuList";
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
            onLihatDetailWaktuTunggu: () => alert("Not implemented yet"),
            onLihatPerubahan: () => alert("Not implemented yet"),
          })
        )
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
        ) : null}

        <AlertMultilineResponsive items={orderAlerts} />

        <OrderInfo dataStatusPesanan={dataStatusPesanan} />

        <DriverInfoSlider
          driverStatus={dataStatusPesanan?.driverStatus}
          orderId={dataStatusPesanan?.orderId}
          orderStatus={dataStatusPesanan?.orderStatus}
        />

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
          />

          <TabContentInformasiLainnya dataRingkasanPesanan={dataRingkasanPesanan} />
          <TabContentDetailPIC dataDetailPIC={dataDetailPIC} />
        </Tabs>
      </div>

      <FooterDetailPesanan
        dataStatusPesanan={dataStatusPesanan}
        dataRingkasanPembayaran={dataRingkasanPembayaran}
      />

      <ModalInformasiSlider open={isOpenInfo} onOpenChange={setIsOpenInfo} />
      <BottomsheetMenuList
        open={isMenuOpen}
        onOpenChange={setIsMenuOpen}
        dataStatusPesanan={dataStatusPesanan}
      />
      <BottomSheetPeriksaPesananKamu
        open={isPeriksaPesananOpen}
        onOpenChange={setIsPeriksaPesananOpen}
        dataRingkasanPesanan={dataRingkasanPesanan}
        dataStatusPesanan={dataStatusPesanan}
      />

      <ModalVolumePesananTinggi
        open={isVolumePesananTinggiOpen}
        onOpenChange={setIsVolumePesananTinggiOpen}
        onConfirm={() => setIsVolumePesananTinggiOpen(false)}
        onCancel={() => setIsVolumePesananTinggiOpen(false)}
      />
    </FormResponsiveLayout>
  );
};
export default DetailPesananScreen;
