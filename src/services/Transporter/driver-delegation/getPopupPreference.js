import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const isMockGetPopupPreference = true;

const mockGetPopupPreferenceResponse = {
  data: {
    Message: {
      Code: 200,
      Text: "Success",
    },
    Data: {
      shouldShowPopup: true,
    },
    Type: "CHECK_POPUP_PREFERENCE",
  },
};

export const fetcherDriverDelegationPopupPreference = async () => {
  if (isMockGetPopupPreference) {
    return mockGetPopupPreferenceResponse.data.Data;
  }

  const result = await fetcherMuatrans.get(
    "v1/users/popup-preferences/driver-delegation"
  );
  return result?.data?.Data || {};
};

export const useGetDriverDelegationPopupPreference = () => {
  return useSWR(
    "driver-delegation-popup-preference",
    fetcherDriverDelegationPopupPreference
  );
};
