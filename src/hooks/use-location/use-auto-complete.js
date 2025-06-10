import { useCallback, useEffect, useMemo } from "react";

import { useResponsiveSearch } from "@/lib/responsive-navigation";
import { useLocationFormStore } from "@/store/forms/locationFormStore";

import { useDebounceCallback } from "../use-debounce-callback";
import useDevice from "../use-device";
import { useSWRMutateHook } from "../use-swr";
import { fetcher } from "./fetcher";

export const useAutoComplete = ({
  autoCompleteSearchPhrase,
  setAutoCompleteSearchPhrase,
  setCoordinates,
  setIsModalPostalCodeOpen,
  setLocationPostalCodeSearchPhrase,
  setTempLocation,
  setDontTriggerPostalCodeModal,
  setIsDropdownSearchOpen,
}) => {
  const { isMobile } = useDevice();
  const { searchValue: responsiveSearchValue } = useResponsiveSearch();
  useEffect(() => {
    if (isMobile) {
      setAutoCompleteSearchPhrase(responsiveSearchValue);
    }
  }, [isMobile, responsiveSearchValue, setAutoCompleteSearchPhrase]);

  const { data, trigger, isMutating } = useSWRMutateHook(
    "v1/autocompleteStreet"
  );
  const debouncedTrigger = useDebounceCallback(trigger, 500);
  const searchResult = useMemo(() => data?.slice(0, 3) || [], [data]);

  useEffect(() => {
    if (autoCompleteSearchPhrase) {
      debouncedTrigger(
        new URLSearchParams({ phrase: autoCompleteSearchPhrase })
      );
    }
  }, [autoCompleteSearchPhrase, debouncedTrigger]);

  const setLocationPartial = useLocationFormStore((s) => s.setLocationPartial);

  const handleSelectSearchResult = useCallback(
    async (location) => {
      const result = await fetcher.getLocationByPlaceId(location);
      setLocationPartial(result);
      setDontTriggerPostalCodeModal(false);
      setCoordinates(result.coordinates);
      setTempLocation(result);
      if (!result?.district?.value) {
        setIsModalPostalCodeOpen(true);
        setLocationPostalCodeSearchPhrase(result.postalCode.value);
      }
      setIsDropdownSearchOpen(false);
      return result;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return {
    autoCompleteSearchResult: searchResult,
    isLoadingAutoComplete: isMutating,
    handleSelectSearchResult,
  };
};
