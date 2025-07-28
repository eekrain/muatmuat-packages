"use client";

import { useEffect } from "react";

import {
  ResponsiveProvider,
  ResponsiveRoute,
  useResponsiveNavigation,
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
const QRCodeScreen = dynamicScreen(() => import("./QRCode/QRCodeScreen"));
const RingkasanStatusPesananScreen = dynamicScreen(
  () => import("./RingkasanStatusPesanan/RingkasanStatusPesananScreen")
);
const LacakArmadaScreen = dynamicScreen(
  () => import("./LacakArmada/LacakArmadaScreen")
);
const DriverStatusDetailScreen = dynamicScreen(
  () => import("./DriverStatusDetail/DriverStatusDetailScreen")
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

const DetailPesananResponsive = ({}) => {
  const navigation = useResponsiveNavigation();
  useEffect(() => {
    navigation.replace("/CariSemuaDriver");
  }, []);
  const { setIsGlobalLoading } = useLoadingAction();

  const { data } = useGetDetailPesananData("12345");

  const dataStatusPesanan = data?.dataStatusPesanan;
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
      <ResponsiveRoute path="/qr" component={<QRCodeScreen />} />
      <ResponsiveRoute path="/ulasan" component={<UlasanScreen />} />
      <ResponsiveRoute
        path="/order-summary"
        component={
          <RingkasanStatusPesananScreen dataStatusPesanan={dataStatusPesanan} />
        }
      />
      <ResponsiveRoute
        path="/fleet-track"
        component={<LacakArmadaScreen dataStatusPesanan={dataStatusPesanan} />}
      />
      <ResponsiveRoute
        path="/detail-driver-status"
        component={
          <DriverStatusDetailScreen dataStatusPesanan={dataStatusPesanan} />
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
