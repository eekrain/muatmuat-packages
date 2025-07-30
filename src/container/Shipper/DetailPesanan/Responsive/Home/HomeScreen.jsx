import { useParams } from "next/navigation";
import { useState } from "react";

import { AlertMultilineResponsive } from "@/components/Alert/AlertMultilineResponsive";
import { ResponsiveFooter } from "@/components/Footer/ResponsiveFooter";
import FormResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/FormResponsiveLayout";
import {
  AlertInfoEnum,
  AlertLabelEnum,
  AlertTypeEnum,
} from "@/lib/constants/detailpesanan/alert.enum";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import useGetFleetSearchStatus from "@/services/Shipper/detailpesanan/getFleetSearchStatus";

import { AlertPendingPayment } from "./components/AlertPendingPayment";
import { BottomsheetMenuList } from "./components/BottomsheetMenuList";
import DriverInfoSlider from "./components/DriverInfoSlider";
import { FleetStatusAlert } from "./components/FleetStatusAlert";
import { FooterButton } from "./components/FooterButton";
import { MethodInfo } from "./components/MethodInfo";
import { ModalInformasiSlider } from "./components/ModalInformasiSlider";
import { OrderInfo } from "./components/OrderInfo";
import { PaymentDetail } from "./components/PaymentDetail";
import { RouteInfo } from "./components/RouteInfo";
import { TabsInfo } from "./components/TabsInfo";
import { TransactionSummary } from "./components/TransactionSummary";

const DEBUG_MODE = false;

const DetailPesananScreen = ({
  dataStatusPesanan,
  dataRingkasanPesanan,
  dataDetailPIC,
  dataRingkasanPembayaran,
  documentShippingDetail,
}) => {
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

  const getContentAlert = ({ type }) => {
    const info = AlertInfoEnum[type];
    if (type === AlertTypeEnum.CONFIRMATION_WAITING_PREPARE_FLEET) return false;
    if (info) return { label: AlertLabelEnum[type], info };

    if (type === AlertTypeEnum.WAITING_TIME_CHARGE) {
      return {
        label: AlertLabelEnum.WAITING_TIME_CHARGE,
        button: {
          onClick: () => alert("Lihat Detail"),
          label: "Lihat Detail",
        },
      };
    }

    if (type === AlertTypeEnum.ORDER_CHANGES_CONFIRMATION) {
      return {
        label: AlertLabelEnum.ORDER_CHANGES_CONFIRMATION,
        button: {
          onClick: () => alert("Konfirmasi"),
          label: "Konfirmasi",
        },
      };
    }

    return { label: AlertLabelEnum[type] };
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
      <div className="mb-16 space-y-2 bg-neutral-200">
        <AlertPendingPayment />
        {true && (
          <PaymentDetail dataRingkasanPembayaran={dataRingkasanPembayaran} />
        )}

        <AlertMultilineResponsive
          items={[
            ...(isShowWaitFleetAlert
              ? [
                  {
                    label: AlertLabelEnum.CONFIRMATION_WAITING_PREPARE_FLEET,
                  },
                ]
              : []),
            ...(dataStatusPesanan?.alerts || [])
              .map((item) => getContentAlert(item))
              .filter((val) => Boolean(val)),
          ]}
        />

        {false && <FleetStatusAlert />}

        <OrderInfo dataStatusPesanan={dataStatusPesanan} />

        <DriverInfoSlider
          driverStatus={dataStatusPesanan?.driverStatus}
          orderId={dataStatusPesanan?.orderId}
          orderStatus={dataStatusPesanan?.orderStatus}
        />
        <TabsInfo dataDetailPIC={dataDetailPIC} />

        {false && <RouteInfo dataDetailPesanan={dataRingkasanPesanan} />}
        {true && <MethodInfo method={"va_bca"} />}
        {true && (
          <TransactionSummary documentShippingDetail={documentShippingDetail} />
        )}
      </div>

      <ResponsiveFooter className="flex flex-col gap-3">
        {false && (
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Total Biaya</div>
            <div className="text-sm font-bold">Rp1.021.583</div>
          </div>
        )}
        {false && (
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Total Tambahan Biaya</div>
            <div className="text-sm font-bold">Rp1.021.583</div>
          </div>
        )}
        <FooterButton orderStatus={dataStatusPesanan?.orderStatus} />
      </ResponsiveFooter>

      <ModalInformasiSlider open={isOpenInfo} onOpenChange={setIsOpenInfo} />
      <BottomsheetMenuList open={isMenuOpen} onOpenChange={setIsMenuOpen} />
    </FormResponsiveLayout>
  );
};
export default DetailPesananScreen;
