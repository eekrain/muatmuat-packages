import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";

import {
  normalizeAutoCompleteLocation,
  normalizeDistrictData,
  normalizeLocationByLatLong,
  normalizePostalCodeData,
  normalizeUserSavedLocation,
} from "@/lib/normalizers";
import axios from "@/services/axios";

import { useDebounceCallback } from "./use-debounce-callback";
import { useSWRHook, useSWRMutateHook } from "./use-swr";

const DEFAULT_LAT = -7.250445;
const DEFAULT_LNG = 112.768845;

export const useLocation = ({
  onAddressSelected,
  setPICName,
  setNoHPPIC,
  setLocationCoordinatesOnly,
}) => {
  const [coordinates, setCoordinates] = useState({
    latitude: DEFAULT_LAT,
    longitude: DEFAULT_LNG,
  });

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
        onAddressSelected({
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
    [onAddressSelected]
  );

  const onSelectPostalCode = useCallback(
    (option) => {
      onAddressSelected({
        ...tempLocation,
        ...normalizePostalCodeData(option),
      });
      setCoordinates(tempLocation.coordinates);
      setIsModalPostalCodeOpen(false);
    },
    [onAddressSelected, tempLocation]
  );

  const handleGetCurrentLocation = useCallback(async () => {
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          try {
            setCoordinates({
              latitude: coords.latitude,
              longitude: coords.longitude,
            });
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

            if (getDistrict.Districts?.[0]) {
              const normalizedData = normalizeDistrictData(getDistrict);
              onAddressSelected({
                ...normalizedData,
                ...normalizeLocationByLatLong(getLocation, coords),
              });
            } else {
              setTempLocation(normalizeLocationByLatLong(getLocation, coords));
              setIsModalPostalCodeOpen(true);
              // Kadang dari /v1/location_by_lat_long udah ada data kode pos nya, jadi set aja biar auto ke-isi dari result ini
              if (getLocation?.postal)
                setSearchLocationByPostalCode(getLocation.postal);
            }
            setSearchLocationAutoComplete(getLocation.formatted_address);
            setIsDropdownOpen(false);
          } catch (error) {
            console.error("Error getting location:", error);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [onAddressSelected]);

  const handleSelectUserSavedLocation = useCallback(
    (location) => {
      onAddressSelected(normalizeUserSavedLocation(location));
      if (location.PicName) setPICName(location.PicName);
      if (location.PicNoTelp) setNoHPPIC(location.PicNoTelp);
      setCoordinates({
        latitude: location.Latitude,
        longitude: location.Longitude,
      });
      setSearchLocationAutoComplete(location.Address);
      setIsDropdownOpen(false);
    },
    [onAddressSelected, setPICName, setNoHPPIC]
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

  useEffect(() => {
    // Untuk menghapus data lokasi jika user menghapus text di inputan
    if (!searchLocationAutoComplete) onAddressSelected(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchLocationAutoComplete]);

  useEffect(() => {
    if (coordinates) setLocationCoordinatesOnly(coordinates);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    searchLocationByPostalCode,
    setSearchLocationByPostalCode: (value) =>
      startTransition(() => setSearchLocationByPostalCode(value)),
    postalCodeAutoCompleteResult: memoizedPostalCodeAutoCompleteResult,
    onSelectPostalCode,
    coordinates,
    setCoordinates,
    handleGetCurrentLocation,
    isDropdownOpen,
    setIsDropdownOpen,
    handleSelectUserSavedLocation,
    isModalSavedLocationManagementOpen,
    setIsModalSavedLocationManagementOpen,
  };
};
