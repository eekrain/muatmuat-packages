import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// Atur ke false saat siap menggunakan API asli
const isMockPopupPreference = true;

const mockPopupPreferenceResult = {
  data: {
    Message: {
      Code: 200,
      Text: "User popup preference retrieved successfully",
    },
    Data: {
      showPopup: true, // true = tampilkan popup, false = jangan tampilkan popup
      lastUpdated: "2025-01-15T10:30:00Z",
    },
    Type: "USER_POPUP_PREFERENCE",
  },
};

export const fetcherUserPopupPreference = async (cacheKey) => {
  const url = "v1/user/popup-preference/import-fleet";

  if (isMockPopupPreference) {
    // Simulasikan penundaan API
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockPopupPreferenceResult.data.Data;
  }

  try {
    const result = await fetcherMuatrans.get(url);

    if (!result?.data?.Data) {
      throw new Error("Struktur respons tidak valid");
    }

    return result.data.Data;
  } catch (error) {
    if (error.response?.status === 400) {
      throw new Error(
        error.response?.data?.Message?.Text || "Permintaan tidak valid"
      );
    } else if (error.response?.status === 401) {
      throw new Error("Akses tidak sah");
    } else if (error.response?.status === 500) {
      throw new Error("Kesalahan server internal");
    } else {
      throw new Error(error.message || "Gagal mengambil preferensi popup");
    }
  }
};

export const useGetUserPopupPreference = () => {
  const cacheKey = "user-popup-preference-import-fleet";

  return useSWR(cacheKey, fetcherUserPopupPreference, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    retryOnError: true,
    errorRetryCount: 3,
    errorRetryInterval: 1000,
  });
};
