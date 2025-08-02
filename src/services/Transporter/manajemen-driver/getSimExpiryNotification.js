import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const isMockGetSimExpiryNotification = true; // Enable mock for testing

const mockGetSimExpiryNotificationResponse = {
  Message: {
    Code: 200,
    Text: "Success",
  },
  Data: {
    total: 8,
    expiringSoon: 5, // SIM akan berakhir dalam 3 bulan
    expired: 3, // SIM sudah berakhir
    hasNotification: true,
  },
  Type: "GET_SIM_EXPIRY_NOTIFICATION",
};

export const getSimExpiryNotification = async () => {
  if (isMockGetSimExpiryNotification) {
    return mockGetSimExpiryNotificationResponse;
  }

  const result = await fetcherMuatrans.get(
    "v1/drivers/sim-expiry-notification"
  );
  return result?.data;
};

export const useGetSimExpiryNotification = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "v1/drivers/sim-expiry-notification",
    getSimExpiryNotification
  );

  return {
    data: data?.Data,
    error,
    isLoading,
    mutate,
  };
};
