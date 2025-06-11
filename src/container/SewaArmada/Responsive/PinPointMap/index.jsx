import { useEffect, useRef } from "react";

import { equal } from "fast-shallow-equal";

import Button from "@/components/Button/Button";
import { ResponsiveFooter } from "@/components/Footer/ResponsiveFooter";
import { ModalPostalCodeResponsive } from "@/components/LocationManagement/Responsive/ModalPostalCodeResponsive";
import { MapContainer } from "@/components/MapContainer/MapContainer";
import { DEFAULT_COORDINATES, useLocationContext } from "@/hooks/use-location";
import { fetcher } from "@/hooks/use-location/fetcher";
import { useShallowCompareEffect } from "@/hooks/use-shallow-effect";
import FormResponsiveLayout from "@/layout/ResponsiveLayout/FormResponsiveLayout";
import {
  useResponsiveNavigation,
  useResponsiveRouteParams,
} from "@/lib/responsive-navigation";
import { useLocationFormStore } from "@/store/forms/locationFormStore";

export const PinPointMap = () => {
  const navigation = useResponsiveNavigation();
  const params = useResponsiveRouteParams();

  const { formValues, setLocationPartial } = useLocationFormStore();
  const {
    coordinates,
    setCoordinates,
    setIsModalPostalCodeOpen,
    dontTriggerPostalCodeModal,
    setLocationPostalCodeSearchPhrase,
  } = useLocationContext();
  console.log(
    "🚀 ~ PinPointMap ~ dontTriggerPostalCodeModal:",
    dontTriggerPostalCodeModal
  );

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

  // Get newest location if the coordinates is changed
  // e.g: when the user move the marker on the map
  useShallowCompareEffect(() => {
    // Skip if the coordinates is the default coordinates
    // This is to prevent the postal code modal from being opened, when the user is not interacting with the map yet
    if (equal(coordinates, DEFAULT_COORDINATES)) return;
    if (coordinates?.latitude && coordinates?.longitude) {
      fetcher.getLocationByLatLong(coordinates).then((result) => {
        console.log("🚀 ~ fetcher.getLocationByLatLong ~ result:", result);
        setLocationPartial(result);
        setCoordinates(result.coordinates);
        if (!result?.district?.value && !dontTriggerPostalCodeModal) {
          setIsModalPostalCodeOpen(true);
          setLocationPostalCodeSearchPhrase(result.postalCode.value);
        }
      });
    }
  }, [coordinates, dontTriggerPostalCodeModal]);

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
