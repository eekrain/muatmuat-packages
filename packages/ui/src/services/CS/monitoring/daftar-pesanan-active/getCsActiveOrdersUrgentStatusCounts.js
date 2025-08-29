import useSWR from "swr";

import { fetcherMock, fetcherMuatrans } from "@/lib/axios";

const isMockCsActiveOrdersUrgentStatusCounts = true;

export const fetcherCsActiveOrdersUrgentStatusCounts = async (
  url,
  { arg } = {}
) => {
  if (isMockCsActiveOrdersUrgentStatusCounts) {
    const result = await fetcherMock.get(`/api/${url}`, arg ?? null);
    return result.data;
  }
  const result = await fetcherMuatrans.get(url, arg);
  return result.data;
};

export const useGetCsActiveOrdersUrgentStatusCounts = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const apiUrl = `/v1/cs/active-orders/urgent-status-counts${query ? `?${query}` : ""}`;
  const key = `csActiveOrdersUrgentStatusCounts-${query}`;

  return useSWR(key, () =>
    fetcherCsActiveOrdersUrgentStatusCounts(apiUrl, { arg: null })
  );
};
