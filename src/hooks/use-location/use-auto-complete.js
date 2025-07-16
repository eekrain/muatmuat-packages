import { useCallback, useEffect, useMemo } from "react";

import { fetcherMuatparts } from "@/lib/axios";
import { useLocationFormStore } from "@/store/Shipper/forms/locationFormStore";
import { useResponsiveSearchStore } from "@/store/Shipper/zustand/responsiveSearchStore";

import { useDebounceCallback } from "../use-debounce-callback";
import useDevice from "../use-device";
import { useShallowCompareEffect } from "../use-shallow-effect";
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
  refetchHistoryResult,
}) => {
  const { isMobile } = useDevice();
  const responsiveSearchValue = useResponsiveSearchStore(
    (state) => state.searchValue
  );
  useEffect(() => {
    if (isMobile) {
      setAutoCompleteSearchPhrase(responsiveSearchValue);
    }
  }, [isMobile, responsiveSearchValue, setAutoCompleteSearchPhrase]);

  const { data, trigger, isMutating, reset } = useSWRMutateHook(
    "v1/autocompleteStreet",
    "POST",
    fetcherMuatparts
  );

  const debouncedTrigger = useDebounceCallback(trigger, 500);
  const searchResult = useMemo(() => data?.slice(0, 3) || [], [data]);

  useShallowCompareEffect(() => {
    if (autoCompleteSearchPhrase && autoCompleteSearchPhrase?.length >= 3) {
      debouncedTrigger(
        new URLSearchParams({ phrase: autoCompleteSearchPhrase })
      );
    } else if (
      (!autoCompleteSearchPhrase ||
        (autoCompleteSearchPhrase && autoCompleteSearchPhrase.length < 3)) &&
      searchResult.length > 0
    ) {
      reset();
    }
  }, [autoCompleteSearchPhrase, debouncedTrigger, searchResult]);

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
        if (result.postalCode.value === "00000")
          setLocationPostalCodeSearchPhrase("");
        else setLocationPostalCodeSearchPhrase(result.postalCode.value);
      } else {
        if (!isMobile) setAutoCompleteSearchPhrase(result.location.name);
        fetcher.saveRecentSearchedLocation(result).then(() => {
          refetchHistoryResult();
        });
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
