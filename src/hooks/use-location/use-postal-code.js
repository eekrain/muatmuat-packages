import { useCallback, useEffect, useMemo } from "react";

import { normalizePostalCodeData } from "@/lib/normalizers/location";
import { useLocationFormStore } from "@/store/forms/locationFormStore";

import { useDebounceCallback } from "../use-debounce-callback";
import useDevice from "../use-device";
import { useSWRMutateHook } from "../use-swr";

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

  const { data, trigger } = useSWRMutateHook("v1/autocompleteStreetLocal");
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
    (option) => {
      const result = {
        ...tempLocation,
        ...normalizePostalCodeData(option),
      };
      setLocationPartial(result);

      if (tempLocation?.location?.name && !isMobile)
        setAutoCompleteSearchPhrase(tempLocation.location.name);
      setIsModalPostalCodeOpen(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tempLocation]
  );

  return {
    postalCodeAutoCompleteResult,
    handleSelectPostalCode,
  };
};
