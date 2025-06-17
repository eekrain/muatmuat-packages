import { useCallback, useMemo } from "react";

import { fetcherMuatparts } from "@/lib/axios";
import { normalizeUserSavedLocation } from "@/lib/normalizers/location";
import { useLocationFormStore } from "@/store/forms/locationFormStore";

import { useSWRHook } from "../use-swr";
import { fetcher } from "./fetcher";

export const useSavedLocation = ({
  setCoordinates,
  setAutoCompleteSearchPhrase,
  setIsDropdownSearchOpen,
  setDontTriggerPostalCodeModal,
}) => {
  const setLocationPartial = useLocationFormStore(
    (state) => state.setLocationPartial
  );
  const setField = useLocationFormStore((state) => state.setField);

  const { data } = useSWRHook(
    "v1/muatparts/profile/location",
    fetcherMuatparts
  );
  const userSavedLocationResult = useMemo(() => data?.Data || [], [data]);

  const handleSelectUserSavedLocation = useCallback(
    async (location) => {
      const supportiveData = await fetcher.getLocationByLatLong({
        latitude: location.Latitude,
        longitude: location.Longitude,
      });

      setLocationPartial(
        normalizeUserSavedLocation(
          location,
          supportiveData?.kecamatanList,
          supportiveData?.postalCodeList
        )
      );

      if (location.PicName) setField("namaPIC", location.PicName);
      if (location.PicNoTelp) setField("noHPPIC", location.PicNoTelp);
      if (location.AddressDetail)
        setField("detailLokasi", location.AddressDetail);
      setDontTriggerPostalCodeModal(true);
      setCoordinates({
        latitude: location.Latitude,
        longitude: location.Longitude,
      });
      setAutoCompleteSearchPhrase(location.Address);
      setIsDropdownSearchOpen(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return {
    userSavedLocationResult,
    handleSelectUserSavedLocation,
  };
};
