import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const getRefundInfo = async (url) => {
  const result = await fetcherMuatrans.get(url);
  return result?.data?.Data;
};

/**
 * Hook to get refund information for a specific order.
 * Fetches data from GET /v1/orders/{orderId}/refund
 * @param {string} orderId - The ID of the order.
 * @returns {object} The SWR response object containing refund data.
 */
export const useGetRefundInfo = (orderId) => {
  const { data, error, isLoading, mutate } = useSWR(
    orderId ? `/v1/orders/${orderId}/refund` : null,
    getRefundInfo
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
