import useSWR from "swr";

import { fetcherMock, fetcherMuatrans } from "@/lib/axios";

const isMockCSTransporters = true;

export const fetcherCSTransporters = async (url, { arg }) => {
  if (isMockCSTransporters) {
    const result = await fetcherMock.get(`/api/${url}`, arg ?? null);
    return result.data;
  }
  const result = await fetcherMuatrans.get(url, arg);
  return result.data;
};

export const useGetCSTransporters = (url) => {
  return useSWR(url ? `csTransporters-${url}` : null, () =>
    fetcherCSTransporters(url, { arg: null })
  );
};

// Enhanced hook with query parameters (for list endpoints)
export const useGetCSTransportersWithParams = (params = {}) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    status = "",
    sort = "",
    order = "",
  } = params;

  // Build query string
  const queryParams = new URLSearchParams();
  if (page) queryParams.append("page", page.toString());
  if (limit) queryParams.append("limit", limit.toString());
  if (search) queryParams.append("search", search);
  if (status) queryParams.append("status", status);
  if (sort) queryParams.append("sort", sort);
  if (order) queryParams.append("order", order);

  const queryString = queryParams.toString();
  const url = `/v1/cs/transporters${queryString ? `?${queryString}` : ""}`;

  // Create a unique key for SWR that includes all parameters
  const swrKey = `csTransporters-${JSON.stringify(params)}`;

  return useSWR(swrKey, () => fetcherCSTransporters(url, { arg: null }));
};
