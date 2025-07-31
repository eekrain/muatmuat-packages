"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";

import {
  ResponsiveProvider,
  ResponsiveRoute,
} from "@/lib/responsive-navigation";
// Import the default screen without dynamic import
import { dynamicScreen } from "@/lib/utils/dynamic-screen";
import { useGetDetailPesananData } from "@/services/Shipper/detailpesanan/getDetailPesananData";
import { useLoadingAction } from "@/store/Shared/loadingStore";

import CaraPembayaranScreen from "./CaraPembayaran/CaraPembayaranScreen";
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

const DetailPesananResponsive = () => {
  // const navigation = useResponsiveNavigation();
  // useEffect(() => {
  //   navigation.replace("/CariSemuaDriver");
  // }, []);
  const params = useParams();
  const { setIsGlobalLoading } = useLoadingAction();

  const { data } = useGetDetailPesananData(params.orderId);

  const dataStatusPesanan = data?.dataStatusPesanan;
  const dataRingkasanPesanan = data?.dataRingkasanPesanan;
  const dataDetailPIC = data?.dataDetailPIC;
  const dataRingkasanPembayaran = data?.dataRingkasanPembayaran;
  const documentShippingDetail =
    data?.dataRingkasanPembayaran.documentShippingDetail;

  useEffect(() => {
    setIsGlobalLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    </ResponsiveProvider>
  );
};

export default DetailPesananResponsive;
