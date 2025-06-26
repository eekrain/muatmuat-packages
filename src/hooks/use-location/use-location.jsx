import { createContext, useContext, useState } from "react";

import useDevice from "../use-device";
import { fetcher } from "./fetcher";
import { useAutoComplete } from "./use-auto-complete";
import { useGetCurrentLocation } from "./use-get-current-location";
import { usePostalCode } from "./use-postal-code";
import { useSavedLocation } from "./use-saved-location";

export const DEFAULT_COORDINATES = {
  latitude: -7.250445,
  longitude: 112.768845,
};

const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
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
  const getCurrentLocation = useGetCurrentLocation({
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

  return (
    <LocationContext.Provider
      value={{
        ...autoComplete,
        ...getCurrentLocation,
        ...postalCode,
        ...savedLocation,
        ...fetcher,

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
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error("Missing LocationProvider in the tree");
  return context;
};
