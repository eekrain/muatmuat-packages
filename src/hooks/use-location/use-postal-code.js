import { useCallback, useEffect } from "react";

import { normalizePostalCodeData } from "@/hooks/use-location/normalizer";
import { useTranslation } from "@/hooks/use-translation";

import { toast } from "@/lib/toast";

import { useLocationFormStore } from "@/store/Shipper/forms/locationFormStore";

import { useDebounceCallback } from "../use-debounce-callback";
import useDevice from "../use-device";

export const usePostalCode = ({
  apiAdapter,
  setIsModalPostalCodeOpen,
  locationPostalCodeSearchPhrase,
  tempLocation,
  setAutoCompleteSearchPhrase,
}) => {
  const { t } = useTranslation();
  const { isMobile } = useDevice();

  const setLocationPartial = useLocationFormStore(
    (state) => state.setLocationPartial
  );
  const { lastValidLocation, setLastValidLocation } = useLocationFormStore();

  const { data: postalCodeAutoCompleteResult, trigger } =
    apiAdapter.useGetAutoCompleteByPostalCode();
  const debouncedTrigger = useDebounceCallback(trigger, 500);

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
          t(
            "useAutoComplete.errorSameCityOnly",
            {},
            "Perubahan lokasi muat hanya bisa diganti jika masih di kota yang sama."
          )
        );
      }
      setLocationPartial(result);
      setLastValidLocation(result);

      if (tempLocation?.location?.name && !isMobile)
        setAutoCompleteSearchPhrase(tempLocation.location.name);
      setIsModalPostalCodeOpen(false);

      apiAdapter.saveRecentSearchedLocation(result);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tempLocation, lastValidLocation]
  );

  return {
    postalCodeAutoCompleteResult: postalCodeAutoCompleteResult || [],
    handleSelectPostalCode,
  };
};
