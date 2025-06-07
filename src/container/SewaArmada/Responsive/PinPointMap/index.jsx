import { useEffect, useRef } from "react";

import Button from "@/components/Button/Button";
import { ResponsiveFooter } from "@/components/Footer/ResponsiveFooter";
import { ModalPostalCodeResponsive } from "@/components/LocationManagement/Responsive/ModalPostalCodeResponsive";
import { MapContainer } from "@/components/LocationManagement/common/MapContainer";
import { useLocation } from "@/hooks/use-location";
import FormResponsiveLayout from "@/layout/ResponsiveLayout/FormResponsiveLayout";
import {
  useResponsiveNavigation,
  useResponsiveRouteParams,
} from "@/lib/responsive-navigation";
import { useLocationFormStore } from "@/store/forms/locationFormStore";

export const PinPointMap = () => {
  const navigation = useResponsiveNavigation();
  const params = useResponsiveRouteParams();
  console.log("🚀 ~ PinPointMap ~ params:", params);

  const { formValues, setField, setLocationPartial } = useLocationFormStore();
  const hasInit = useRef(false);
  const {
    isModalPostalCodeOpen,
    setIsModalPostalCodeOpen,
    searchLocationByPostalCode,
    setSearchLocationByPostalCode,
    postalCodeAutoCompleteResult,
    onSelectPostalCode,
    coordinates,
    setCoordinates,
    handleGetLocationByLatLong,
  } = useLocation({
    setPICName: (name) => {
      setField("namaPIC", name);
    },
    setNoHPPIC: (noHPPIC) => {
      setField("noHPPIC", noHPPIC);
    },
    setLocationPartial,
  });

  // Initialize the coordinates and postal code from the params
  useEffect(() => {
    if (!params?.dataLokasi?.district && !hasInit.current) {
      if (params?.dataLokasi?.coordinates) {
        setCoordinates(params?.dataLokasi?.coordinates);
      }
      if (params?.dataLokasi?.postalCode) {
        setSearchLocationByPostalCode(params?.dataLokasi.postalCode);
        setIsModalPostalCodeOpen(true);
      }
      hasInit.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.dataLokasi]);

  const handleSave = () => {
    navigation.push("/FormLokasiBongkarMuat", { ...params });
  };

  return (
    <FormResponsiveLayout
      title={{
        label:
          formValues?.dataLokasi?.location?.name ||
          params?.dataLokasi?.location?.name,
        className: "text-sm font-semibold line-clamp-1 break-all",
      }}
    >
      <MapContainer
        viewOnly={false}
        coordinates={coordinates}
        onPositionChange={setCoordinates}
        className="h-[calc(100vh-62px)] w-full"
      />

      <ModalPostalCodeResponsive
        open={isModalPostalCodeOpen}
        searchValue={searchLocationByPostalCode}
        setSearchValue={setSearchLocationByPostalCode}
        options={postalCodeAutoCompleteResult}
        onSelectPostalCode={onSelectPostalCode}
        onOpenChange={setIsModalPostalCodeOpen}
      />

      <ResponsiveFooter>
        <Button
          variant="muatparts-primary"
          className="w-full"
          onClick={handleSave}
        >
          Simpan
        </Button>
      </ResponsiveFooter>
    </FormResponsiveLayout>
  );
};
