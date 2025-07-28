import { useCallback, useEffect, useMemo } from "react";

import { fetcherMuatparts } from "@/lib/axios";
import { normalizePostalCodeData } from "@/lib/normalizers/location";
import { toast } from "@/lib/toast";
import { useLocationFormStore } from "@/store/Shipper/forms/locationFormStore";

import { useDebounceCallback } from "../use-debounce-callback";
import useDevice from "../use-device";
import { useSWRMutateHook } from "../use-swr";
import { fetcher } from "./fetcher";

export const usePostalCode = ({
  setIsModalPostalCodeOpen,
  locationPostalCodeSearchPhrase,
  tempLocation,
  setAutoCompleteSearchPhrase,
}) => {
  const { isMobile } = useDevice();
  const setLocationPartial = useLocationFormStore(
    (state) => state.setLocationPartial
  );
  const { lastValidLocation, setLastValidLocation } = useLocationFormStore();

  const { data, trigger } = useSWRMutateHook(
    "v1/autocompleteStreetLocal",
    "POST",
    fetcherMuatparts
  );
  const debouncedTrigger = useDebounceCallback(trigger, 500);
  const postalCodeAutoCompleteResult = useMemo(
    () => data?.Data?.data?.Data || [],
    [data]
  );

  useEffect(() => {
    if (locationPostalCodeSearchPhrase) {
      debouncedTrigger(
        new URLSearchParams({ phrase: locationPostalCodeSearchPhrase })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationPostalCodeSearchPhrase]);

  const handleSelectPostalCode = useCallback(
    (option, needValidateLocationChange) => {
      const result = {
        ...tempLocation,
        ...normalizePostalCodeData(option),
      };
      if (
        needValidateLocationChange &&
        result?.city &&
        result?.city?.value !== lastValidLocation?.city?.value
      ) {
        setAutoCompleteSearchPhrase(lastValidLocation?.location?.name);
        setIsModalPostalCodeOpen(false);
        return toast.error(
          "Perubahan lokasi muat hanya bisa diganti jika masih di kota yang sama."
        );
      }
      setLocationPartial(result);
      setLastValidLocation(result);

      if (tempLocation?.location?.name && !isMobile)
        setAutoCompleteSearchPhrase(tempLocation.location.name);
      setIsModalPostalCodeOpen(false);

      fetcher.saveRecentSearchedLocation(result);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tempLocation, lastValidLocation]
  );

  return {
    postalCodeAutoCompleteResult,
    handleSelectPostalCode,
  };
};
