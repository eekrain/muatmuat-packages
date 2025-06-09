"use client";

import { useEffect } from "react";

import { ResponsiveMenu } from "@/container/ResponsiveMenu";
import {
  ResponsiveRoute,
  useNavigationStore,
  useResponsiveNavigation,
} from "@/lib/responsive-navigation";

import CariNamaMuatan from "./CariNamaMuatan/CariNamaMuatan";
import { SewaArmadaHome } from "./Home";
import InformasiMuatanScreen from "./InformasiMuatan/InformasiMuatanScreen";
import LayananTambahan from "./LayananTambahan/LayananTambahan";
import { PencarianLokasi } from "./PencarianLokasi";
import { PencarianLokasiTersimpan } from "./PencarianLokasiTersimpan";
import { PinPointMap } from "./PinPointMap";

const SewaArmadaResponsive = () => {
  const tes = useNavigationStore((state) => state.stack);
  console.log("🚀 ~ SewaArmadaResponsive ~ tes:", tes);
  const navigation = useResponsiveNavigation();

  useEffect(() => {
    navigation.replace("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ResponsiveRoute path="/" component={<SewaArmadaHome />} />
      <ResponsiveRoute
        path="/PencarianLokasi"
        component={<PencarianLokasi />}
      />
      <ResponsiveRoute
        path="/PencarianLokasiTersimpan"
        component={<PencarianLokasiTersimpan />}
      />
      <ResponsiveRoute
        path="/InformasiMuatan"
        component={<InformasiMuatanScreen />}
      />
      <ResponsiveRoute path="/CariNamaMuatan" component={<CariNamaMuatan />} />
      <ResponsiveRoute path="/PinPointMap" component={<PinPointMap />} />
      <ResponsiveRoute
        path="/LayananTambahan"
        component={<LayananTambahan />}
      />
      <ResponsiveRoute path="/menu" component={<ResponsiveMenu />} />
    </>
  );
};

export default SewaArmadaResponsive;
