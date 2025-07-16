"use client";

import { useEffect } from "react";

import CropperScreen from "@/components/Cropper/CropperScreen";
// Import the default screen without dynamic import
import { LocationProvider } from "@/hooks/use-location/use-location";
import {
  ResponsiveProvider,
  ResponsiveRoute,
  useResponsiveNavigation,
} from "@/lib/responsive-navigation";
import { dynamicScreen } from "@/lib/utils/dynamic-screen";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/Shipper/forms/sewaArmadaStore";
import { useLoadingAction } from "@/store/Shipper/loadingStore";
import { useImageUploaderActions } from "@/store/forms/imageUploaderStore";

import SewaArmadaHomeScreen from "./Home/HomeScreen";

// Dynamic import all the other screens, so that the user doesn't have to wait for the other screens to load
// Screen components needs to be default exported
const CariNamaMuatanScreen = dynamicScreen(
  () => import("./CariNamaMuatan/CariNamaMuatanScreen")
);
const FormLokasiBongkarMuatScreen = dynamicScreen(
  () => import("./FormLokasiBongkarMuat/FormLokasiBongkarMuatScreen")
);
const InformasiMuatanScreen = dynamicScreen(
  () => import("./InformasiMuatan/InformasiMuatanScreen")
);
const JenisCarrierScreen = dynamicScreen(
  () => import("./JenisCarrier/JenisCarrierScreen")
);
const LayananTambahanScreen = dynamicScreen(
  () => import("./LayananTambahan/LayananTambahanScreen")
);
const OpsiPembayaranScreen = dynamicScreen(
  () => import("./OpsiPembayaran/OpsiPembayaranScreen")
);
const OpsiPengirimanScreen = dynamicScreen(
  () => import("./OpsiPengiriman/OpsiPengirimanScreen")
);
const InformasiPesananScreen = dynamicScreen(
  () => import("./InformasiPesanan/InformasiPesananScreen")
);
const ResponsiveMenuScreen = dynamicScreen(
  () => import("@/container/Shipper/ResponsiveMenu/ResponsiveMenuScreen")
);
const PencarianLokasiScreen = dynamicScreen(
  () =>
    import(
      "@/components/LocationManagement/Responsive/PencarianLokasi/PencarianLokasiScreen"
    )
);
const PinPointMapScreen = dynamicScreen(
  () =>
    import(
      "@/components/LocationManagement/Responsive/PinPointMap/PinPointMapScreen"
    )
);
const PencarianLokasiTersimpanScreen = dynamicScreen(
  () =>
    import(
      "@/components/LocationManagement/Responsive/PencarianLokasiTersimpan/PencarianLokasiTersimpanScreen"
    )
);
const FormSimpanLokasiScreen = dynamicScreen(
  () =>
    import(
      "@/components/LocationManagement/Responsive/FormSimpanLokasi/FormSimpanLokasiScreen"
    )
);

const SewaArmadaResponsive = ({
  cargoTypes,
  cargoCategories,
  additionalServicesOptions,
  paymentMethods,
}) => {
  const navigation = useResponsiveNavigation();
  const { reset } = useImageUploaderActions();
  // useEffect(() => {
  //   navigation.replace("/JenisCarrier");
  // }, []);
  const orderType = useSewaArmadaStore((state) => state.orderType);
  const { setOrderType } = useSewaArmadaActions();
  const { setIsGlobalLoading } = useLoadingAction();

  useEffect(() => {
    setIsGlobalLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!orderType) {
      setOrderType("INSTANT");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderType]);

  return (
    <ResponsiveProvider>
      <ResponsiveRoute path="/" component={<SewaArmadaHomeScreen />} />
      <ResponsiveRoute
        path="/FormLokasiBongkarMuat"
        component={<FormLokasiBongkarMuatScreen />}
      />

      <ResponsiveRoute
        path="/InformasiMuatan"
        component={
          <InformasiMuatanScreen
            cargoTypes={cargoTypes}
            cargoCategories={cargoCategories}
          />
        }
      />
      <ResponsiveRoute
        path="/CariNamaMuatan"
        component={<CariNamaMuatanScreen />}
      />
      <ResponsiveRoute
        path="/LayananTambahan"
        component={
          <LayananTambahanScreen
            additionalServicesOptions={additionalServicesOptions}
          />
        }
      />
      <ResponsiveRoute
        path="/OpsiPengiriman"
        component={<OpsiPengirimanScreen />}
      />

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
        component={<InformasiPesananScreen paymentMethods={paymentMethods} />}
      />
      <ResponsiveRoute
        path="/Cropper"
        component={
          <CropperScreen
            onCheck={() => navigation.push("/")}
            onClose={() => {
              reset();
              navigation.pop();
            }}
          />
        }
      />
      <ResponsiveRoute
        path="/OpsiPembayaran"
        component={<OpsiPembayaranScreen paymentMethods={paymentMethods} />}
      />

      <ResponsiveRoute
        path="/JenisCarrier"
        component={<JenisCarrierScreen />}
      />
      <ResponsiveRoute path="/menu" component={<ResponsiveMenuScreen />} />
    </ResponsiveProvider>
  );
};

export default SewaArmadaResponsive;
