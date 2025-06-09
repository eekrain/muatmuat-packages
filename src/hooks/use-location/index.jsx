import { createContext, useContext, useState } from "react";

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
    coordinates,
    setCoordinates,
    setAutoCompleteSearchPhrase,
    setIsModalPostalCodeOpen,
    setLocationPostalCodeSearchPhrase,
    dontTriggerPostalCodeModal,
  });
  const postalCode = usePostalCode({
    setIsModalPostalCodeOpen,
    locationPostalCodeSearchPhrase,
    tempLocation,
    setAutoCompleteSearchPhrase,
  });
  const savedLocation = useSavedLocation({
    setCoordinates,
    setAutoCompleteSearchPhrase,
    setIsDropdownSearchOpen,
    setIsModalPostalCodeOpen,
    setLocationPostalCodeSearchPhrase,
    setDontTriggerPostalCodeModal,
  });

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
