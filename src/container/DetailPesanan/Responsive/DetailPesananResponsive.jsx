"use client";

import { useEffect } from "react";

import {
  ResponsiveProvider,
  ResponsiveRoute,
} from "@/lib/responsive-navigation";
import { useLoadingAction } from "@/store/loadingStore";

// Import the default screen without dynamic import
import DetailPesananScreen from "./Home/HomeScreen";
import QRCodeScreen from "./QRCode/QRCodeScreen";

// Dynamic import all the other screens, so that the user doesn't have to wait for the other screens to load
// Screen components needs to be default exported
// const CariNamaMuatanScreen = dynamicScreen(
//   () => import("./CariNamaMuatan/CariNamaMuatanScreen")
// );

const DetailPesananResponsive = ({
  cargoTypes,
  cargoCategories,
  paymentMethods,
}) => {
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
      {/* <ResponsiveRoute
        path="/CariNamaMuatan"
        component={<CariNamaMuatanScreen />}
      /> */}
    </ResponsiveProvider>
  );
};

export default DetailPesananResponsive;
