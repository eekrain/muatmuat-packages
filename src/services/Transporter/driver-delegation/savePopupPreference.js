import useSWRMutation from "swr/mutation";

import { fetcherMuatrans } from "@/lib/axios";

const isMockSavePopupPreference = true;

const mockSavePopupPreferenceResponse = (dontShowAgain) => ({
  data: {
    Message: {
      Code: 200,
      Text: "Preference saved successfully",
    },
    Data: {
      popupType: "DRIVER_DELEGATION",
      dontShowAgain: dontShowAgain,
      updatedAt: new Date().toISOString(),
    },
    Type: "SAVE_POPUP_PREFERENCE",
  },
});

export const saveDriverDelegationPopupPreference = async (dontShowAgain) => {
  if (isMockSavePopupPreference) {
    return mockSavePopupPreferenceResponse(dontShowAgain).data;
  }

  const result = await fetcherMuatrans.post(
    "v1/users/popup-preferences/driver-delegation",
    {
      dontShowAgain: dontShowAgain,
    }
  );
  return result?.data;
};

export const useSaveDriverDelegationPopupPreference = () => {
  return useSWRMutation(
    "v1/users/popup-preferences/driver-delegation",
    async (url, { arg }) => {
      if (isMockSavePopupPreference) {
        return mockSavePopupPreferenceResponse(arg.dontShowAgain).data.Data;
      }
      const result = await fetcherMuatrans.post(url, arg);
      return result?.data?.Data || {};
    }
  );
};
