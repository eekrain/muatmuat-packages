import { useEffect, useRef } from "react";

import Button from "@/components/Button/Button";
import { ResponsiveFooter } from "@/components/Footer/ResponsiveFooter";
import { ModalPostalCodeResponsive } from "@/components/LocationManagement/Responsive/ModalPostalCodeResponsive";
import { MapContainer } from "@/components/LocationManagement/common/MapContainer";
import { LocationProvider, useLocationContext } from "@/hooks/use-location";
import FormResponsiveLayout from "@/layout/ResponsiveLayout/FormResponsiveLayout";
import {
  useResponsiveNavigation,
  useResponsiveRouteParams,
} from "@/lib/responsive-navigation";
import { useLocationFormStore } from "@/store/forms/locationFormStore";

const InnerPinPointMap = () => {
  const navigation = useResponsiveNavigation();
  const params = useResponsiveRouteParams();

  const { formValues } = useLocationFormStore();
  const {
    coordinates,
    setCoordinates,
    isModalPostalCodeOpen,
    setIsModalPostalCodeOpen,
    searchLocationByPostalCode,
    setSearchLocationByPostalCode,
    postalCodeAutoCompleteResult,
    onSelectPostalCode,
  } = useLocationContext();

  const handleSave = () => {
    navigation.push("/FormLokasiBongkarMuat", { ...params });
  };

  const hasInit = useRef(false);
  // Initialize the coordinates and postal code from the params
  useEffect(() => {
    if (
      formValues?.dataLokasi?.coordinates?.latitude &&
      formValues?.dataLokasi?.coordinates?.longitude &&
      !hasInit.current
    ) {
      console.log(
        "🚀 ~ useEffect ~ formValues?.dataLokasi?.coordinates:",
        formValues?.dataLokasi?.coordinates
      );
      setCoordinates(formValues?.dataLokasi?.coordinates);
      hasInit.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues?.dataLokasi?.coordinates]);

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

      <ModalPostalCodeResponsive />

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

export const PinPointMap = () => {
  return (
    <LocationProvider>
      <InnerPinPointMap />
    </LocationProvider>
  );
};
