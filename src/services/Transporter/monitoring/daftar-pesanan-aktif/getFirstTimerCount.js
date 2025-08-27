import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const isMockFirstTimerCount = false;

const apiResultFirstTimerCount = {
  Message: {
    Code: 200,
    Text: "OK",
  },
  Data: {
    active_orders_count: 83,
    is_first_timer: false,
  },
  Type: "/v1/transporter/orders/first-timer/count",
};

/**
 * Fetcher function for first timer count
 * @param {string} cacheKey - The cache key for the request
 * @returns {Promise<Object>} The first timer count data
 */
export const fetcherFirstTimerCount = async (cacheKey) => {
  const url = "/v1/transporter/orders/first-timer/count";

  if (isMockFirstTimerCount) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return apiResultFirstTimerCount.Data;
  }

  const result = await fetcherMuatrans.get(url);
  return result?.data?.Data || {};
};

/**
 * Hook to get first timer count data
 * @param {Object} options - SWR options
 * @returns {Object} SWR response with first timer count data
 */
export const useGetFirstTimerCount = (options = {}) => {
  const cacheKey = "first-timer-count";

  return useSWR(cacheKey, fetcherFirstTimerCount, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    ...options,
  });
};
