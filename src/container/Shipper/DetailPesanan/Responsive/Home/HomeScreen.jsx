import { useParams } from "next/navigation";
import { useState } from "react";

import { ResponsiveFooter } from "@/components/Footer/ResponsiveFooter";
import FormResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/FormResponsiveLayout";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import { useGetDetailPesananData } from "@/services/Shipper/detailpesanan/getDetailPesananData";
import useGetFleetSearchStatus from "@/services/Shipper/detailpesanan/getFleetSearchStatus";

import { BottomsheetMenuList } from "./components/BottomsheetMenuList";
import { DriverInfo } from "./components/DriverInfo";
import { DriverQRCodeAlert } from "./components/DriverQRCodeAlert";
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
  dataDetailPIC,
  dataRingkasanPembayaran,
  documentShippingDetail,
}) => {
  const params = useParams();

  const { data: dataDetailPesanan, isLoading: isLoadingDetailPesanan } =
    useGetDetailPesananData(params.orderId);
  const {
    isOpen: isWaitFleetModalOpen,
    isShow: isShowWaitFleetAlert,
    setIsOpen: setIsWaitFleetModalOpen,
    setIsShow: setIsShowWaitFleetAlert,
  } = useGetFleetSearchStatus(
    params.orderId,
    dataDetailPesanan?.dataStatusPesanan?.orderStatus ===
      OrderStatusEnum.PREPARE_FLEET
  );
  const navigation = useResponsiveNavigation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isOpenInfo, setIsOpenInfo] = useState(false);

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
        {false && (
          <PaymentDetail dataRingkasanPembayaran={dataRingkasanPembayaran} />
        )}

        {false && <FleetStatusAlert />}
        {false && <DriverQRCodeAlert />}

        <OrderInfo dataStatusPesanan={dataDetailPesanan?.dataStatusPesanan} />

        {dataDetailPesanan?.dataStatusPesanan && (
          <DriverInfo
            driverStatus={dataDetailPesanan?.dataStatusPesanan?.driverStatus}
            orderId={dataDetailPesanan?.dataStatusPesanan?.orderId}
            orderStatus={dataDetailPesanan?.dataStatusPesanan?.orderStatus}
          />
        )}
        <TabsInfo dataDetailPIC={dataDetailPIC} />

        {true && <RouteInfo />}
        {false && <MethodInfo method={"va_bca"} />}
        {false && (
          <TransactionSummary documentShippingDetail={documentShippingDetail} />
        )}
      </div>

      <ModalInformasiSlider open={isOpenInfo} onOpenChange={setIsOpenInfo} />

      <BottomsheetMenuList open={isMenuOpen} onOpenChange={setIsMenuOpen} />

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
        <FooterButton
          orderStatus={dataDetailPesanan?.dataStatusPesanan?.orderStatus}
        />
      </ResponsiveFooter>
    </FormResponsiveLayout>
  );
};
export default DetailPesananScreen;
