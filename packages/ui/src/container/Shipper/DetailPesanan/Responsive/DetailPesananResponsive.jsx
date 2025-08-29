"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";

import { useGetDetailPesananData } from "@/services/Shipper/detailpesanan/getDetailPesananData";
import { useGetOldDriver } from "@/services/Shipper/detailpesanan/getOldDriver";
import { useGetOverloadData } from "@/services/Shipper/detailpesanan/getOverloadData";
import { useGetRefundInfo } from "@/services/Shipper/detailpesanan/getRefundInfo";
import { useGetWaitingTime } from "@/services/Shipper/detailpesanan/getWaitingTime";

import { useShallowMemo } from "@/hooks/use-shallow-memo";

import { OrderStatusEnum } from "@/lib/constants/Shipper/detailpesanan/detailpesanan.enum";
import {
  ResponsiveProvider,
  ResponsiveRoute,
} from "@/lib/responsive-navigation";
// Import the default screen without dynamic import
import { dynamicScreen } from "@/lib/utils/dynamic-screen";

import { useLoadingAction } from "@/store/Shared/loadingStore";

import CaraPembayaranScreen from "./CaraPembayaran/CaraPembayaranScreen";
import DetailSebelumPerubahanScreen from "./DetailSebelumPerubahan/DetailSebelumPerubahanScreen";
import DetailPesananScreen from "./Home/HomeScreen";
import UlasanScreen from "./Ulasan/UlasanScreen";

// Dynamic import all the other screens, so that the user doesn't have to wait for the other screens to load
// Screen components needs to be default exported
const RingkasanStatusPesananScreen = dynamicScreen(
  () => import("./RingkasanStatusPesanan/RingkasanStatusPesananScreen")
);
const LacakArmadaScreen = dynamicScreen(
  () => import("./LacakArmada/LacakArmadaScreen")
);
const DetailStatusDriverScreen = dynamicScreen(
  () => import("./DetailStatusDriver/DetailStatusDriverScreen")
);
const ProofPhotoScreen = dynamicScreen(
  () => import("./ProofPhoto/ProofPhotoScreen")
);
const FormRekeningBankScreen = dynamicScreen(
  () => import("./FormRekeningBank/FormRekeningBankScreen")
);
const CariSemuaDriverScreen = dynamicScreen(
  () => import("./CariSemuaDriver/CariSemuaDriverScreen")
);
const DriverQRCodeSingleScreen = dynamicScreen(
  () => import("./DriverQRCodeSingle/DriverQRCodeSingleScreen")
);
const DriverQRCodeMultiScreen = dynamicScreen(
  () => import("./DriverQRCodeMulti/DriverQRCodeMultiScreen")
);
const OpsiPembayaranScreen = dynamicScreen(
  () => import("./OpsiPembayaran/OpsiPembayaranScreen")
);

const DetailPesananResponsive = ({ paymentMethods }) => {
  // const navigation = useResponsiveNavigation();
  // useEffect(() => {
  //   navigation.replace("/CariSemuaDriver");
  // }, []);
  const params = useParams();
  const { setIsGlobalLoading } = useLoadingAction();

  const { data, mutate } = useGetDetailPesananData(params.orderId);
  const { data: waitingTimeRawData } = useGetWaitingTime(params.orderId);
  const { data: overloadDataRaw } = useGetOverloadData(params.orderId);

  const waitingTimeRaw = useShallowMemo(
    () => waitingTimeRawData || [],
    [waitingTimeRawData]
  );

  const overloadData = useShallowMemo(
    () => overloadDataRaw || {},
    [overloadDataRaw]
  );

  const dataStatusPesanan = data?.dataStatusPesanan;

  const isCancelled =
    dataStatusPesanan?.orderStatus === OrderStatusEnum.CANCELED_BY_SYSTEM ||
    dataStatusPesanan?.orderStatus === OrderStatusEnum.CANCELED_BY_SHIPPER ||
    dataStatusPesanan?.orderStatus === OrderStatusEnum.CANCELED_BY_TRANSPORTER;

  const { data: refundInfo } = useGetRefundInfo(
    isCancelled ? params.orderId : null
  );

  const dataRingkasanPesanan = data?.dataRingkasanPesanan;
  const dataDetailPIC = data?.dataDetailPIC;
  const dataRingkasanPembayaran = data?.dataRingkasanPembayaran;
  const documentShippingDetail =
    data?.dataRingkasanPembayaran?.documentShippingDetail;
  useEffect(() => {
    setIsGlobalLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const shouldFetchOldDriver =
    dataStatusPesanan?.orderStatus &&
    (dataStatusPesanan.orderStatus === OrderStatusEnum.LOADING ||
      dataStatusPesanan.orderStatus === OrderStatusEnum.UNLOADING);

  const { data: oldDriverData } = useGetOldDriver(
    shouldFetchOldDriver ? params.orderId : null,
    shouldFetchOldDriver ? dataStatusPesanan.driverStatus[0].driverId : null
  );

  return (
    <ResponsiveProvider>
      <ResponsiveRoute
        path="/"
        component={
          <DetailPesananScreen
            dataStatusPesanan={dataStatusPesanan}
            dataRingkasanPesanan={dataRingkasanPesanan}
            dataDetailPIC={dataDetailPIC}
            dataRingkasanPembayaran={dataRingkasanPembayaran}
            documentShippingDetail={documentShippingDetail}
            waitingTimeRaw={waitingTimeRaw}
            overloadData={overloadData}
            oldDriverData={oldDriverData}
            paymentMethods={paymentMethods}
            mutate={mutate}
            refundInfo={refundInfo}
          />
        }
      />

      <ResponsiveRoute
        path="/cara-pembayaran"
        component={
          <CaraPembayaranScreen
            dataRingkasanPembayaran={dataRingkasanPembayaran}
          />
        }
      />
      <ResponsiveRoute
        path="/DriverQRCodeMulti"
        component={
          <DriverQRCodeMultiScreen dataStatusPesanan={dataStatusPesanan} />
        }
      />
      <ResponsiveRoute
        path="/DriverQRCodeSingle"
        component={<DriverQRCodeSingleScreen />}
      />
      <ResponsiveRoute path="/ulasan" component={<UlasanScreen />} />
      <ResponsiveRoute
        path="/order-summary"
        component={
          <RingkasanStatusPesananScreen dataStatusPesanan={dataStatusPesanan} />
        }
      />
      <ResponsiveRoute
        path="/LacakArmada"
        component={<LacakArmadaScreen dataStatusPesanan={dataStatusPesanan} />}
      />
      <ResponsiveRoute
        path="/DetailStatusDriverScreen"
        component={
          <DetailStatusDriverScreen dataStatusPesanan={dataStatusPesanan} />
        }
      />
      <ResponsiveRoute path="/proof-photo" component={<ProofPhotoScreen />} />
      <ResponsiveRoute
        path="/FormRekeningBank"
        component={<FormRekeningBankScreen />}
      />
      <ResponsiveRoute
        path="/CariSemuaDriver"
        component={
          <CariSemuaDriverScreen dataStatusPesanan={dataStatusPesanan} />
        }
      />
      <ResponsiveRoute
        path="/DetailSebelumPerubahan"
        component={<DetailSebelumPerubahanScreen />}
      />

      <ResponsiveRoute
        path="/OpsiPembayaran"
        component={<OpsiPembayaranScreen paymentMethods={paymentMethods} />}
      />
    </ResponsiveProvider>
  );
};

export default DetailPesananResponsive;
