import { useCallback } from "react";

import { normalizeUserSavedLocation } from "@/hooks/use-location/normalizer";
import { normalizeRecentHistoryLocation } from "@/hooks/use-location/normalizer/normalizeRecentHistoryLocation";

import { toast } from "@/lib/toast";

import { useLocationFormStore } from "@/store/Shipper/forms/locationFormStore";

export const useSavedLocation = ({
  apiAdapter,
  setCoordinates,
  setAutoCompleteSearchPhrase,
  setIsDropdownSearchOpen,
  setDontTriggerPostalCodeModal,
  historyLocationType,
}) => {
  const setLocationPartial = useLocationFormStore(
    (state) => state.setLocationPartial
  );
  const setField = useLocationFormStore((state) => state.setField);

  const { data: userSavedLocationResult, mutate: refetchSavedResult } =
    apiAdapter.useGetUserSavedLocation();

  const { data: historyResult, mutate: refetchHistoryResult } =
    apiAdapter.useGetUserLocationHistory(historyLocationType);

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
      const supportiveData = await apiAdapter.getLocationByLatLong({
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
      const response = await apiAdapter.saveUserLocation(formValues);
      refetchSavedResult();
      await new Promise((resolve) => setTimeout(resolve, 200));
      toast.success("Lokasi berhasil ditambah");
      return response;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn("Error when adding location:", error);
      toast.error("Gagal menambah lokasi");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateLocation = useCallback(async (formValues, IDtoUpdate) => {
    try {
      const response = await apiAdapter.updateUserLocation(
        formValues,
        IDtoUpdate
      );
      refetchSavedResult();
      await new Promise((resolve) => setTimeout(resolve, 200));
      toast.success("Lokasi berhasil diubah");
      return response;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn("Error when adding location:", error);
      toast.error("Gagal mengubah lokasi");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    userSavedLocationResult: userSavedLocationResult || [],
    handleSelectUserSavedLocation,
    userRecentSearchedLocation: historyResult?.userRecentSearchedLocation || [],
    userRecentTransactionLocation:
      historyResult?.userRecentTransactionLocation || [],
    handleSelectRecentLocation,
    refetchHistoryResult,

    handleSaveLocation,
    handleUpdateLocation,
  };
};
