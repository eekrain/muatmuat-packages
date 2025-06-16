"use client";

import { useEffect } from "react";

import { FormSimpanLokasiScreen } from "@/components/LocationManagement/Responsive/FormSimpanLokasi/FormSimpanLokasiScreen";
import { PencarianLokasiScreen } from "@/components/LocationManagement/Responsive/PencarianLokasi/PencarianLokasiScreen";
import { PencarianLokasiTersimpanScreen } from "@/components/LocationManagement/Responsive/PencarianLokasiTersimpan/PencarianLokasiTersimpanScreen";
import { ResponsiveMenu } from "@/container/ResponsiveMenu";
import { LocationProvider } from "@/hooks/use-location";
import { ResponsiveRoute } from "@/lib/responsive-navigation";
import { useSewaArmadaActions } from "@/store/forms/sewaArmadaStore";

import { PinPointMapScreen } from "../../../components/LocationManagement/Responsive/PinPointMap/PinPointMapScreen";
import CariNamaMuatan from "./CariNamaMuatan/CariNamaMuatan";
import { FormLokasiBongkarMuat } from "./FormLokasiBongkarMuat";
import { SewaArmadaHome } from "./Home";
import InformasiMuatanScreen from "./InformasiMuatan/InformasiMuatanScreen";
import InformasiPesanan from "./InformasiPesanan/InformasiPesanan";
import { JenisCarrierScreen } from "./JenisCarrier/JenisCarrierScree";
import LayananTambahan from "./LayananTambahan/LayananTambahan";
import OpsiPembayaran from "./OpsiPembayaran/OpsiPembayaran";
import OpsiPengiriman from "./OpsiPengiriman/OpsiPengiriman";

const SewaArmadaResponsive = () => {
  // const navigation = useResponsiveNavigation();
  // useEffect(() => {
  //   navigation.replace("/JenisCarrier");
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
          component={<PencarianLokasiScreen />}
        />

        <ResponsiveRoute
          path="/PinPointMap"
          component={<PinPointMapScreen />}
        />

        <ResponsiveRoute
          path="/PencarianLokasiTersimpan"
          component={<PencarianLokasiTersimpanScreen />}
        />

        <ResponsiveRoute
          path="/FormSimpanLokasi"
          component={<FormSimpanLokasiScreen />}
        />
      </LocationProvider>

      {/* STEP 2 */}
      <ResponsiveRoute
        path="/InformasiPesanan"
        component={<InformasiPesanan />}
      />
      <ResponsiveRoute path="/OpsiPembayaran" component={<OpsiPembayaran />} />

      <ResponsiveRoute
        path="/JenisCarrier"
        component={<JenisCarrierScreen />}
      />
      <ResponsiveRoute path="/menu" component={<ResponsiveMenu />} />
    </>
  );
};

export default SewaArmadaResponsive;
