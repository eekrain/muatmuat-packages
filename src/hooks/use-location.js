import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";

import { equal } from "fast-shallow-equal";

import {
  normalizeAutoCompleteLocation,
  normalizeDistrictData,
  normalizeLocationByLatLong,
  normalizePostalCodeData,
  normalizeUserSavedLocation,
} from "@/lib/normalizers";
import axios from "@/services/axios";

import { useDebounceCallback } from "./use-debounce-callback";
import { useShallowCompareEffect } from "./use-shallow-effect";
import { useSWRHook, useSWRMutateHook } from "./use-swr";

const DEFAULT_COORDINATES = {
  latitude: -7.250445,
  longitude: 112.768845,
};

export const useLocation = ({
  setLocationPartial = () => {},
  setPICName,
  setNoHPPIC,
}) => {
  const [coordinates, setCoordinates] = useState(DEFAULT_COORDINATES);

  const [isModalPostalCodeOpen, setIsModalPostalCodeOpen] = useState(false);
  const [
    isModalSavedLocationManagementOpen,
    setIsModalSavedLocationManagementOpen,
  ] = useState(false);
  const [searchLocationAutoComplete, setSearchLocationAutoComplete] =
    useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchLocationByPostalCode, setSearchLocationByPostalCode] =
    useState("");
  const [_, startTransition] = useTransition();
  const [tempLocation, setTempLocation] = useState(null);

  // SWR hooks
  const { data: userSavedLocation } = useSWRHook(
    "v1/muatparts/profile/location"
  );
  const { data: locationAutoCompleteResult, trigger: getAutoComplete } =
    useSWRMutateHook("v1/autocompleteStreet");
  const debouncedGetAutoComplete = useDebounceCallback(getAutoComplete, 500);
  const {
    data: postalCodeAutoCompleteResult,
    trigger: getPostalCodeAutoComplete,
  } = useSWRMutateHook("v1/autocompleteStreetLocal");
  const debouncedGetPostalCodeAutoComplete = useDebounceCallback(
    getPostalCodeAutoComplete,
    500
  );

  // Memoized callbacks
  const onSelectAutoComplete = useCallback(
    async (location) => {
      const res = await axios.post(
        "v1/district_by_token",
        new URLSearchParams({ placeId: location.ID })
      );

      if (res.data?.Data?.Districts?.[0]) {
        const normalizedData = normalizeDistrictData(res.data.Data);
        setLocationPartial({
          ...normalizedData,
          location: { name: location.Title, value: location.ID },
        });
        setCoordinates(normalizedData.coordinates);
        setSearchLocationAutoComplete(location.Title);
      } else {
        // Use the autocomplete normalizer for fallback
        const messageData = res.data?.Data?.Message?.Data;
        const tempLoc = normalizeAutoCompleteLocation(location, messageData);

        setCoordinates(tempLoc.coordinates);
        setTempLocation(tempLoc);
        setIsModalPostalCodeOpen(true);
        setSearchLocationAutoComplete(location.Title);
      }
    },
    [setLocationPartial]
  );

  const onSelectPostalCode = useCallback(
    (option) => {
      const result = {
        ...tempLocation,
        ...normalizePostalCodeData(option),
      };
      console.log("🚀 ~ tempLocation:", tempLocation);
      console.log("🚀 ~ result:", result);
      setLocationPartial(result);

      if (tempLocation?.coordinates) setCoordinates(tempLocation.coordinates);
      console.log("🚀 ~ tempLocation:", tempLocation);
      setIsModalPostalCodeOpen(false);
    },
    [setLocationPartial, tempLocation]
  );

  const handleGetLocationByLatLong = async (coords) => {
    const res1 = await axios.post("/v1/location_by_lat_long", {
      Lat: coords.latitude,
      Long: coords.longitude,
    });
    const getLocation = res1.data.Data;

    const res2 = await axios.post(
      "v1/district_by_token",
      new URLSearchParams({ placeId: getLocation.place_id })
    );
    const getDistrict = res2.data.Data;

    let result;
    if (getDistrict.Districts?.[0]) {
      result = {
        ...normalizeDistrictData(getDistrict),
        ...normalizeLocationByLatLong(getLocation, coords),
      };
      // console.log("🚀 ~ result eka 1:", result);
      setLocationPartial(result);
    } else {
      result = normalizeLocationByLatLong(getLocation, coords);
      // console.log("🚀 ~ result eka 2:", result);
      setTempLocation(result);
      setIsModalPostalCodeOpen(true);
      if (getLocation?.postal) {
        setSearchLocationByPostalCode(getLocation.postal);
        result = { ...result, postalCode: getLocation.postal };
      }
    }
    setSearchLocationAutoComplete(getLocation.formatted_address);
    setIsDropdownOpen(false);

    return result;
  };

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
            const result = await handleGetLocationByLatLong(coords);
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

  const handleSelectUserSavedLocation = useCallback(
    (location) => {
      const result = normalizeUserSavedLocation(location);
      setLocationPartial(result);
      if (location.PicName) setPICName(location.PicName);
      if (location.PicNoTelp) setNoHPPIC(location.PicNoTelp);
      setCoordinates({
        latitude: location.Latitude,
        longitude: location.Longitude,
      });
      setSearchLocationAutoComplete(location.Address);
      setIsDropdownOpen(false);
    },
    [setLocationPartial, setPICName, setNoHPPIC]
  );

  useEffect(() => {
    if (searchLocationAutoComplete) {
      debouncedGetAutoComplete(
        new URLSearchParams({ phrase: searchLocationAutoComplete })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchLocationAutoComplete]);

  useEffect(() => {
    if (searchLocationByPostalCode) {
      debouncedGetPostalCodeAutoComplete(
        new URLSearchParams({ phrase: searchLocationByPostalCode })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchLocationByPostalCode]);

  useShallowCompareEffect(() => {
    if (coordinates) setLocationPartial({ coordinates });
  }, [coordinates]);

  // Get newest location if the coordinates is changed
  // e.g: when the user move the marker on the map
  useShallowCompareEffect(() => {
    // Skip if the coordinates is the default coordinates
    // This is to prevent the postal code modal from being opened, when the user is not interacting with the map yet
    if (equal(coordinates, DEFAULT_COORDINATES)) return;
    if (coordinates?.latitude && coordinates?.longitude) {
      handleGetLocationByLatLong(coordinates);
    }
  }, [coordinates]);

  const memoizedlocationAutoCompleteResult = useMemo(
    () => locationAutoCompleteResult?.slice(0, 3) || [],
    [locationAutoCompleteResult]
  );

  const memoizedPostalCodeAutoCompleteResult = useMemo(
    () => postalCodeAutoCompleteResult?.Data?.data?.Data || [],
    [postalCodeAutoCompleteResult]
  );

  const memoizedUserSavedLocations = useMemo(
    () => userSavedLocation?.Data || [],
    [userSavedLocation]
  );

  return {
    locationAutoCompleteResult: memoizedlocationAutoCompleteResult,
    userSavedLocations: memoizedUserSavedLocations,
    onSelectAutoComplete,
    searchLocationAutoComplete,
    setSearchLocationAutoComplete: setSearchLocationAutoComplete,
    isModalPostalCodeOpen,
    setIsModalPostalCodeOpen,
    searchLocationByPostalCode,
    setSearchLocationByPostalCode: (value) =>
      startTransition(() => setSearchLocationByPostalCode(value)),
    postalCodeAutoCompleteResult: memoizedPostalCodeAutoCompleteResult,
    onSelectPostalCode,
    coordinates,
    setCoordinates,
    handleGetLocationByLatLong,
    handleGetCurrentLocation,
    isDropdownOpen,
    setIsDropdownOpen,
    handleSelectUserSavedLocation,
    isModalSavedLocationManagementOpen,
    setIsModalSavedLocationManagementOpen,
  };
};
