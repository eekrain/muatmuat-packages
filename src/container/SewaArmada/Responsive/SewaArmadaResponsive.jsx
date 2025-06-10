"use client";

import { useEffect } from "react";

import { FormSimpanLokasiResponsive } from "@/components/LocationManagement/Responsive/FormSimpanLokasiResponsive";
import { ResponsiveMenu } from "@/container/ResponsiveMenu";
import { LocationProvider } from "@/hooks/use-location";
import { ResponsiveRoute } from "@/lib/responsive-navigation";
import { useSewaArmadaActions } from "@/store/forms/sewaArmadaStore";

import CariNamaMuatan from "./CariNamaMuatan/CariNamaMuatan";
import { FormLokasiBongkarMuat } from "./FormLokasiBongkarMuat";
import { SewaArmadaHome } from "./Home";
import InformasiMuatanScreen from "./InformasiMuatan/InformasiMuatanScreen";
import LayananTambahan from "./LayananTambahan/LayananTambahan";
import OpsiPengiriman from "./OpsiPengiriman/OpsiPengiriman";
import { PencarianLokasi } from "./PencarianLokasi";
import { PencarianLokasiTersimpan } from "./PencarianLokasiTersimpan";
import { PinPointMap } from "./PinPointMap";

const SewaArmadaResponsive = () => {
  // const navigation = useResponsiveNavigation();
  // useEffect(() => {
  //   navigation.replace("/PencarianLokasi");
  // }, []);
  const { setOrderType } = useSewaArmadaActions();

  useEffect(() => {
    setOrderType("instan");
  }, []);

  return (
    <>
      <ResponsiveRoute path="/" component={<SewaArmadaHome />} />
      <ResponsiveRoute
        path="/FormLokasiBongkarMuat"
        component={<FormLokasiBongkarMuat />}
      />

      <ResponsiveRoute
        path="/InformasiMuatan"
        component={<InformasiMuatanScreen />}
      />
      <ResponsiveRoute path="/CariNamaMuatan" component={<CariNamaMuatan />} />
      <ResponsiveRoute
        path="/LayananTambahan"
        component={<LayananTambahan />}
      />
      <ResponsiveRoute path="/OpsiPengiriman" component={<OpsiPengiriman />} />
      <LocationProvider>
        <ResponsiveRoute
          path="/PencarianLokasi"
          component={<PencarianLokasi />}
        />
        <ResponsiveRoute
          path="/PencarianLokasiTersimpan"
          component={<PencarianLokasiTersimpan />}
        />
        <ResponsiveRoute path="/PinPointMap" component={<PinPointMap />} />
      </LocationProvider>
      <ResponsiveRoute
        path="/FormSimpanLokasi"
        component={<FormSimpanLokasiResponsive />}
      />
      <ResponsiveRoute path="/menu" component={<ResponsiveMenu />} />
    </>
  );
};

export default SewaArmadaResponsive;
