import { useCallback, useMemo, useState } from "react";

import { fetcherMuatparts, fetcherMuatrans } from "@/lib/axios";
import {
  normalizeLocationDataForSaving,
  normalizeUserSavedLocation,
} from "@/lib/normalizers/location";
import { normalizeRecentHistoryLocation } from "@/lib/normalizers/location/normalizeRecentHistoryLocation";
import { toast } from "@/lib/toast";
import { useLocationFormStore } from "@/store/Shipper/forms/locationFormStore";

import { useSWRHook } from "../use-swr";
import { fetcher } from "./fetcher";

export const useSavedLocation = ({
  setCoordinates,
  setAutoCompleteSearchPhrase,
  setIsDropdownSearchOpen,
  setDontTriggerPostalCodeModal,
}) => {
  const [historyLocationType, setHistoryLocationType] = useState("PICKUP");

  const setLocationPartial = useLocationFormStore(
    (state) => state.setLocationPartial
  );
  const setField = useLocationFormStore((state) => state.setField);

  const { data: savedResult, mutate: refetchSavedResult } = useSWRHook(
    "v1/muatparts/profile/location",
    fetcherMuatparts
  );

  const { data: historyResult, mutate: refetchHistoryResult } = useSWRHook(
    `v1/orders/history-locations?locationType=${historyLocationType}`,
    fetcherMuatrans
  );

  const userSavedLocationResult = useMemo(
    () => savedResult?.Data || [],
    [savedResult]
  );

  const userRecentSearchedLocation = useMemo(
    () => historyResult?.Data?.TerakhirDicari || [],
    [historyResult]
  );

  const userRecentTransactionLocation = useMemo(
    () => historyResult?.Data?.TransaksiTerakhir || [],
    [historyResult]
  );

  const handleSelectRecentLocation = useCallback(
    async (location) => {
      setLocationPartial(normalizeRecentHistoryLocation(location));

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

  const handleSaveLocation = useCallback(async (formValues) => {
    try {
      const response = await fetcherMuatparts.post(
        "v1/muatparts/profile/location",
        {
          param: normalizeLocationDataForSaving(formValues),
        }
      );
      refetchSavedResult();
      setTimeout(() => {
        toast.success("Lokasi berhasil ditambah");
      }, 200);
      return response;
    } catch (error) {
      console.error("Error when adding location:", error);
      toast.error("Gagal menambah lokasi");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateLocation = useCallback(async (formValues, IDtoUpdate) => {
    try {
      const response = await fetcherMuatparts.put(
        "v1/muatparts/profile/location",
        {
          param: {
            ...normalizeLocationDataForSaving(formValues),
            ID: IDtoUpdate,
          },
        }
      );
      refetchSavedResult();
      setTimeout(() => {
        toast.success("Lokasi berhasil diubah");
      }, 200);
      return response;
    } catch (error) {
      console.error("Error when adding location:", error);
      toast.error("Gagal mengubah lokasi");
    }
  }, []);

  return {
    userSavedLocationResult,
    handleSelectUserSavedLocation,

    userRecentSearchedLocation,
    userRecentTransactionLocation,
    handleSelectRecentLocation,
    refetchHistoryResult,

    handleSaveLocation,
    handleUpdateLocation,
  };
};
