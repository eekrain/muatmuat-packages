"use client";

import { FormSimpanLokasiResponsive } from "@/components/LocationManagement/Responsive/FormSimpanLokasiResponsive";
import { ResponsiveMenu } from "@/container/ResponsiveMenu";
import { ResponsiveRoute } from "@/lib/responsive-navigation";

<<<<<<< HEAD
import CariNamaMuatan from "./CariNamaMuatan/CariNamaMuatan";
=======
import { FormLokasiBongkarMuat } from "./FormLokasiBongkarMuat";
>>>>>>> b723684 (fix: zIndex max to 50, toast will dynamically shown on top of the ResponsiveFooter, implement init auth, user data, and credential-check)
import { SewaArmadaHome } from "./Home";
import InformasiMuatanScreen from "./InformasiMuatan/InformasiMuatanScreen";
import LayananTambahan from "./LayananTambahan/LayananTambahan";
import { PencarianLokasi } from "./PencarianLokasi";
import { PencarianLokasiTersimpan } from "./PencarianLokasiTersimpan";
import { PinPointMap } from "./PinPointMap";

const SewaArmadaResponsive = () => {
  // const navigation = useResponsiveNavigation();
  // useEffect(() => {
  //   navigation.replace("/PencarianLokasi");
  // }, []);

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
<<<<<<< HEAD
        path="/LayananTambahan"
        component={<LayananTambahan />}
=======
        path="/FormLokasiBongkarMuat"
        component={<FormLokasiBongkarMuat />}
>>>>>>> b723684 (fix: zIndex max to 50, toast will dynamically shown on top of the ResponsiveFooter, implement init auth, user data, and credential-check)
      />
      <ResponsiveRoute path="/menu" component={<ResponsiveMenu />} />
      <ResponsiveRoute
        path="/FormSimpanLokasi"
        component={<FormSimpanLokasiResponsive />}
      />
    </>
  );
};

export default SewaArmadaResponsive;
