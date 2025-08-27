import { useCallback, useEffect } from "react";

import { useTranslation } from "@/hooks/use-translation";

import { toast } from "@/lib/toast";

import { useLocationFormStore } from "@/store/Shipper/forms/locationFormStore";
import { useResponsiveSearchStore } from "@/store/Shipper/zustand/responsiveSearchStore";

import { useDebounceCallback } from "../use-debounce-callback";
import useDevice from "../use-device";

export const useAutoComplete = ({
  apiAdapter,
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
  const { t } = useTranslation();

  const responsiveSearchValue = useResponsiveSearchStore(
    (state) => state.searchValue
  );
  const { lastValidLocation, setLastValidLocation } = useLocationFormStore();

  useEffect(() => {
    if (isMobile) {
      setAutoCompleteSearchPhrase(responsiveSearchValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, responsiveSearchValue]);

  const {
    data: searchResult,
    trigger,
    isMutating,
    reset,
  } = apiAdapter.useGetAutoCompleteLocation();

  const debouncedTrigger = useDebounceCallback(trigger, 500);
  const searchResultEmpty = !searchResult || searchResult?.length === 0;

  useEffect(() => {
    if (autoCompleteSearchPhrase && autoCompleteSearchPhrase?.length >= 3) {
      debouncedTrigger(
        new URLSearchParams({ phrase: autoCompleteSearchPhrase })
      );
    } else if (
      (!autoCompleteSearchPhrase ||
        (autoCompleteSearchPhrase && autoCompleteSearchPhrase.length < 3)) &&
      !searchResultEmpty
    ) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoCompleteSearchPhrase, searchResultEmpty]);

  const setLocationPartial = useLocationFormStore((s) => s.setLocationPartial);

  const handleSelectSearchResult = useCallback(
    async (location, needValidateLocationChange) => {
      const result = await apiAdapter.getLocationByPlaceId(location);
      if (
        needValidateLocationChange &&
        result?.city &&
        result?.city?.value !== lastValidLocation?.city?.value
      ) {
        setAutoCompleteSearchPhrase(lastValidLocation?.location?.name);
        return toast.error(
          t(
            "useAutoComplete.errorSameCityOnly",
            {},
            "Perubahan lokasi muat hanya bisa diganti jika masih di kota yang sama."
          )
        );
      }
      setLocationPartial(result);
      setDontTriggerPostalCodeModal(false);
      if (result?.coordinates) setCoordinates(result.coordinates);
      setTempLocation(result);
      if (!result?.district?.value) {
        setIsModalPostalCodeOpen(true);
        if (result.postalCode.value === "00000")
          setLocationPostalCodeSearchPhrase("");
        else setLocationPostalCodeSearchPhrase(result.postalCode.value);
      } else {
        if (!isMobile) setAutoCompleteSearchPhrase(result.location.name);
        setLastValidLocation(result);
        apiAdapter
          .saveRecentSearchedLocation(result)
          .then(() => {
            refetchHistoryResult();
          })
          .catch((err) => {
            console.warn("🚀 ~ Error Save Recent Searched Location:", err);
          });
      }
      setIsDropdownSearchOpen(false);
      return result;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lastValidLocation]
  );

  return {
    autoCompleteSearchResult: searchResult,
    isLoadingAutoComplete: isMutating,
    handleSelectSearchResult,
  };
};
