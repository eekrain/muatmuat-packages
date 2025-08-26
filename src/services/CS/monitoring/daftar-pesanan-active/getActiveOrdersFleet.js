import useSWR from "swr";

import { fetcherMock, fetcherMuatrans } from "@/lib/axios";

const isMockActiveOrdersFleet = true;

export const fetcherActiveOrdersFleet = async (url, { arg } = {}) => {
  // url should be the API endpoint path when not mocking, or the relative api path when mocking
  if (isMockActiveOrdersFleet) {
    // When mocking we call the local next api under /api
    const result = await fetcherMock.get(`/api/${url}`, arg ?? null);
    return result.data;
  }

  const result = await fetcherMuatrans.get(url, arg);
  return result.data;
};

export const useGetActiveOrdersFleet = (orderId) => {
  const url = orderId ? `/v1/cs/active-orders/${orderId}/fleet` : null;

  return useSWR(url ? `activeOrdersFleet-${orderId}` : null, () =>
    fetcherActiveOrdersFleet(url, { arg: null })
  );
};

export default useGetActiveOrdersFleet;
