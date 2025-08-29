import { useState } from "react";

import useDevice from "../use-device";
import LocationApiAdapter from "./location-api-adapter";
import { useAutoComplete } from "./use-auto-complete";
import { useGetCurrentLocation } from "./use-get-current-location";
import { usePostalCode } from "./use-postal-code";

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

  const autoComplete = useAutoComplete({
    apiAdapter: LocationApiAdapter,
    autoCompleteSearchPhrase,
    setAutoCompleteSearchPhrase,
    setCoordinates,
    setIsModalPostalCodeOpen,
    setLocationPostalCodeSearchPhrase,
    setTempLocation,
    setDontTriggerPostalCodeModal,
    setIsDropdownSearchOpen,
  });

  const getCurrentLocation = useGetCurrentLocation({
    apiAdapter: LocationApiAdapter,
    setCoordinates,
    setAutoCompleteSearchPhrase,
    setIsModalPostalCodeOpen,
    setLocationPostalCodeSearchPhrase,
    dontTriggerPostalCodeModal,
    setDontTriggerPostalCodeModal,
    setIsDropdownSearchOpen,
    setTempLocation,
  });

  const postalCode = usePostalCode({
    apiAdapter: LocationApiAdapter,
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
    ...getCurrentLocation,
    ...postalCode,
    ...LocationApiAdapter,
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
