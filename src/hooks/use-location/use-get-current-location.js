import { useCallback } from "react";

import { useLocationFormStore } from "@/store/Shipper/forms/locationFormStore";

import useDevice from "../use-device";

export const useGetCurrentLocation = ({
  apiAdapter,
  setCoordinates,
  setAutoCompleteSearchPhrase,
  setIsModalPostalCodeOpen,
  setLocationPostalCodeSearchPhrase,
  dontTriggerPostalCodeModal,
  setDontTriggerPostalCodeModal,
  setIsDropdownSearchOpen,
  setTempLocation,
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
            const result = await apiAdapter.getLocationByLatLong(coords);

            setLocationPartial(result);
            setCoordinates(result.coordinates);
            setTempLocation(result);
            if (!result?.district?.value) {
              setIsModalPostalCodeOpen(true);
              setLocationPostalCodeSearchPhrase(result.postalCode.value);
              setDontTriggerPostalCodeModal(true);
              if (!isMobile) setAutoCompleteSearchPhrase(result.location.name);
            }
            setIsDropdownSearchOpen(false);
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
  }, [isMobile]);

  const handleChangeMarkerCoordinates = async (
    coordinates,
    needValidateLocationChange
  ) => {
    // return toast.error(
    //   "Perubahan lokasi muat hanya bisa diganti jika masih di kota yang sama."
    // );
    const result = await apiAdapter.getLocationByLatLong(coordinates);
    setLocationPartial(result);
    setCoordinates(result.coordinates);
    setTempLocation(result);
    if (!result?.district?.value && !dontTriggerPostalCodeModal) {
      setIsModalPostalCodeOpen(true);

      if (result.postalCode.value === "00000")
        setLocationPostalCodeSearchPhrase("");
      else setLocationPostalCodeSearchPhrase(result.postalCode.value);
    }
    if (result?.location?.name && !isMobile) {
      setAutoCompleteSearchPhrase(result.location.name);
    }
  };

  return {
    handleGetCurrentLocation,
    handleChangeMarkerCoordinates,
  };
};
