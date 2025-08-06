"use client";

import { useEffect } from "react";

import CropperPreviewScreen from "@/components/Cropper/CropperPreviewScreen";
import CropperScreen from "@/components/Cropper/CropperScreen";
import SearchKecamatanScreen from "@/components/LocationManagement/Responsive/PencarianLokasi/SearchKecamatanScreen";
// Import the default screen without dynamic import
import { LocationProvider } from "@/hooks/use-location/use-location";
import {
  ResponsiveProvider,
  ResponsiveRoute,
  useResponsiveNavigation,
} from "@/lib/responsive-navigation";
import { dynamicScreen } from "@/lib/utils/dynamic-screen";
import { useLoadingAction } from "@/store/Shared/loadingStore";
import { useImageUploaderActions } from "@/store/Shipper/forms/imageUploaderStore";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/Shipper/forms/sewaArmadaStore";

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
const JenisTruckScreen = dynamicScreen(
  () => import("./JenisTruck/JenisTruckScreen")
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
  settlementAlertInfo,
  settingsTime,
  cargoTypes,
  cargoCategories,
  additionalServicesOptions,
  paymentMethods,
  orderStatus,
  carriers,
  trucks,
  calculatedPrice,
  handleFetchTrucks,
  shippingOption,
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
      <ResponsiveRoute
        path="/"
        component={
          <SewaArmadaHomeScreen
            settlementAlertInfo={settlementAlertInfo}
            settingsTime={settingsTime}
            carriers={carriers}
            trucks={trucks}
            additionalServicesOptions={additionalServicesOptions}
            calculatedPrice={calculatedPrice}
            orderStatus={orderStatus}
          />
        }
      />
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
            trucks={trucks}
            onFetchTrucks={handleFetchTrucks}
          />
        }
      />
      <ResponsiveRoute
        path="/CariNamaMuatan"
        component={<CariNamaMuatanScreen />}
      />
      <ResponsiveRoute
        path="/SearchKecamatan"
        component={<SearchKecamatanScreen />}
      />
      <ResponsiveRoute
        path="/LayananTambahan"
        component={
          <LayananTambahanScreen
            additionalServicesOptions={additionalServicesOptions}
            shippingOption={shippingOption}
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
        component={
          <InformasiPesananScreen
            carriers={carriers}
            trucks={trucks}
            paymentMethods={paymentMethods}
            calculatedPrice={calculatedPrice}
          />
        }
      />
      <ResponsiveRoute
        path="/Cropper"
        component={
          <CropperScreen
            isCircle
            onClose={() => {
              reset();
              navigation.pop();
            }}
          />
        }
      />
      <ResponsiveRoute
        path="/CropperPreview"
        component={
          <CropperPreviewScreen
          // onCheck={() => navigation.push("/")}
          // onClose={() => {
          //   reset();
          //   navigation.pop();
          // }}
          />
        }
      />
      <ResponsiveRoute
        path="/OpsiPembayaran"
        component={<OpsiPembayaranScreen paymentMethods={paymentMethods} />}
      />

      <ResponsiveRoute
        path="/JenisCarrier"
        component={<JenisCarrierScreen carriers={carriers} />}
      />
      <ResponsiveRoute
        path="/JenisTruck"
        component={
          <JenisTruckScreen
            trucks={trucks}
            handleFetchTrucks={handleFetchTrucks}
          />
        }
      />
      <ResponsiveRoute path="/menu" component={<ResponsiveMenuScreen />} />
    </ResponsiveProvider>
  );
};

export default SewaArmadaResponsive;
