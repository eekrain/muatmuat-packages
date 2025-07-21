"use client";

import { useEffect } from "react";

import {
  ResponsiveProvider,
  ResponsiveRoute,
} from "@/lib/responsive-navigation";
// Import the default screen without dynamic import
import { dynamicScreen } from "@/lib/utils/dynamic-screen";
import { useLoadingAction } from "@/store/Shared/loadingStore";

import DetailPesananScreen from "./Home/HomeScreen";
import UlasanScreen from "./Ulasan/UlasanScreen";

// Dynamic import all the other screens, so that the user doesn't have to wait for the other screens to load
// Screen components needs to be default exported
const QRCodeScreen = dynamicScreen(() => import("./QRCode/QRCodeScreen"));
const OrderSummaryScreen = dynamicScreen(
  () => import("./OrderSummary/OrderSummaryScreen")
);
const FleetTrackScreen = dynamicScreen(
  () => import("./FleetTrack/FleetTrackScreen")
);
const DriverStatusDetailScreen = dynamicScreen(
  () => import("./DriverStatusDetail/DriverStatusDetailScreen")
);
const ProofPhotoScreen = dynamicScreen(
  () => import("./ProofPhoto/ProofPhotoScreen")
);

const DetailPesananResponsive = ({}) => {
  // const navigation = useResponsiveNavigation();
  // useEffect(() => {
  //   navigation.replace("/JenisCarrier");
  // }, []);
  const { setIsGlobalLoading } = useLoadingAction();

  useEffect(() => {
    setIsGlobalLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ResponsiveProvider>
      <ResponsiveRoute path="/" component={<DetailPesananScreen />} />
      <ResponsiveRoute path="/qr" component={<QRCodeScreen />} />
      <ResponsiveRoute path="/ulasan" component={<UlasanScreen />} />
      <ResponsiveRoute
        path="/order-summary"
        component={<OrderSummaryScreen />}
      />
      <ResponsiveRoute path="/fleet-track" component={<FleetTrackScreen />} />
      <ResponsiveRoute
        path="/detail-driver-status"
        component={<DriverStatusDetailScreen />}
      />
      <ResponsiveRoute path="/proof-photo" component={<ProofPhotoScreen />} />
    </ResponsiveProvider>
  );
};

export default DetailPesananResponsive;
