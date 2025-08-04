import { useCallback, useState } from "react";

import useDevice from "../use-device";
import { fetcher } from "./fetcher";
import { useAutoComplete } from "./use-auto-complete";
import { usePostalCode } from "./use-postal-code";
import { useSavedLocation } from "./use-saved-location";

export const DEFAULT_COORDINATES = {
  latitude: -7.250445,
  longitude: 112.768845,
};

export const useLocationSearch = () => {
  const { isMobile } = useDevice();
  const [coordinates, setCoordinates] = useState(DEFAULT_COORDINATES);
  const [autoCompleteSearchPhrase, setAutoCompleteSearchPhrase] = useState("");
  const [isDropdownSearchOpen, setIsDropdownSearchOpen] = useState(false);
  const [locationPostalCodeSearchPhrase, setLocationPostalCodeSearchPhrase] =
    useState();
  const [isModalPostalCodeOpen, setIsModalPostalCodeOpen] = useState(false);
  const [tempLocation, setTempLocation] = useState(null);
  const [dontTriggerPostalCodeModal, setDontTriggerPostalCodeModal] =
    useState(false);

  const savedLocation = useSavedLocation({
    setCoordinates,
    setAutoCompleteSearchPhrase,
    setIsDropdownSearchOpen,
    setDontTriggerPostalCodeModal,
  });

  const autoComplete = useAutoComplete({
    autoCompleteSearchPhrase,
    setAutoCompleteSearchPhrase,
    setCoordinates,
    setIsModalPostalCodeOpen,
    setLocationPostalCodeSearchPhrase,
    setTempLocation,
    setDontTriggerPostalCodeModal,
    setIsDropdownSearchOpen,
    refetchHistoryResult: savedLocation.refetchHistoryResult,
  });

  const handleGetCurrentLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!window.navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."));
        return;
      }

      window.navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          try {
            console.log("Step 1: Got coordinates from browser:", coords);

            // Step 2: Mengubah koordinat mentah menjadi objek lokasi LENGKAP.
            // Ini adalah langkah kunci yang hilang sebelumnya.
            console.log(
              "Step 2: Calling getLocationByLatLong with coordinates..."
            );
            const result = await fetcher.getLocationByLatLong(coords);
            console.log("Step 3: Received full location object:", result);

            // Step 3: Kembalikan objek lengkap tersebut.
            resolve(result);
          } catch (error) {
            console.error(
              "Error in handleGetCurrentLocation's promise:",
              error
            );
            reject(error);
          }
        },
        (error) => {
          console.error("Error getting current position from browser:", error);
          reject(error);
        }
      );
    });
  }, []); // Dependensi kosong, fungsi ini stabil.

  const postalCode = usePostalCode({
    setIsModalPostalCodeOpen,
    locationPostalCodeSearchPhrase,
    tempLocation,
    setAutoCompleteSearchPhrase,
  });

  const resetLocationContext = () => {
    setCoordinates(DEFAULT_COORDINATES);
    setAutoCompleteSearchPhrase("");
    setIsDropdownSearchOpen(false);
    setIsModalPostalCodeOpen(false);
    setLocationPostalCodeSearchPhrase("");
    setTempLocation(null);
    setDontTriggerPostalCodeModal(false);
  };

  return {
    ...autoComplete,
    ...postalCode,
    ...savedLocation,
    ...fetcher,
    handleGetCurrentLocation,
    isMobile,
    coordinates,
    setCoordinates,
    autoCompleteSearchPhrase,
    setAutoCompleteSearchPhrase,
    isDropdownSearchOpen,
    setIsDropdownSearchOpen,
    locationPostalCodeSearchPhrase,
    setLocationPostalCodeSearchPhrase,
    isModalPostalCodeOpen,
    setIsModalPostalCodeOpen,
    tempLocation,
    setTempLocation,
    dontTriggerPostalCodeModal,
    resetLocationContext,
  };
};
