import { useCallback } from "react";

import { useLocationFormStore } from "@/store/forms/locationFormStore";

import useDevice from "../use-device";
import { fetcher } from "./fetcher";

export const useGetCurrentLocation = ({
  coordinates,
  setCoordinates,
  setAutoCompleteSearchPhrase,
  setIsModalPostalCodeOpen,
  setLocationPostalCodeSearchPhrase,
  dontTriggerPostalCodeModal,
}) => {
  const setLocationPartial = useLocationFormStore((s) => s.setLocationPartial);
  const { isMobile } = useDevice();

  const handleGetCurrentLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!window.navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."));
        return;
      }

      window.navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          try {
            setCoordinates({
              latitude: coords.latitude,
              longitude: coords.longitude,
            });
            const result = await fetcher.getLocationByLatLong(coords);

            setLocationPartial(result);
            setCoordinates(result.coordinates);
            if (!result?.district?.value) {
              setIsModalPostalCodeOpen(true);
              setLocationPostalCodeSearchPhrase(result.postalCode.value);
            }
            resolve(result);
          } catch (error) {
            console.error("Error getting location:", error);
            reject(error);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          reject(error);
        }
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // // Get newest location if the coordinates is changed
  // // e.g: when the user move the marker on the map
  // useShallowCompareEffect(() => {
  //   // Skip if the coordinates is the default coordinates
  //   // This is to prevent the postal code modal from being opened, when the user is not interacting with the map yet
  //   if (equal(coordinates, DEFAULT_COORDINATES)) return;
  //   if (coordinates?.latitude && coordinates?.longitude) {
  //     fetcher.getLocationByLatLong(coordinates).then((result) => {
  //       console.log("🚀 ~ fetcher.getLocationByLatLong ~ result:", result);
  //       setLocationPartial(result);
  //       setCoordinates(result.coordinates);
  //       if (!result?.district?.value && !dontTriggerPostalCodeModal) {
  //         setIsModalPostalCodeOpen(true);
  //         setLocationPostalCodeSearchPhrase(result.postalCode.value);
  //       }
  //       if (result?.location?.name && !isMobile) {
  //         setAutoCompleteSearchPhrase(result.location.name);
  //       }
  //     });
  //   }
  // }, [coordinates, dontTriggerPostalCodeModal]);

  return {
    handleGetCurrentLocation,
  };
};
