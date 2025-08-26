import useSWR from "swr";

import { fetcherMock, fetcherMuatrans } from "@/lib/axios";

// DONE, implementasi API
const isMockActiveOrdersByOrders = false;

export const fetcherActiveOrdersByOrders = async (url, { arg } = {}) => {
  // url should be the API endpoint path when not mocking, or the relative api path when mocking
  if (isMockActiveOrdersByOrders) {
    // When mocking we call the local next api under /api
    const result = await fetcherMock.get(`/api/${url}`, arg ?? null);
    return result.data;
  }

  const result = await fetcherMuatrans.get(url, arg);
  return result.data;
};

export const useGetActiveOrdersByOrders = (url) => {
  return useSWR(url ? `activeOrdersByOrders-${url}` : null, () =>
    fetcherActiveOrdersByOrders(url, { arg: null })
  );
};

export const useGetActiveOrdersByOrdersWithParams = (params = {}) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    status = "",
    sort = "",
    order = "",
  } = params;

  const queryParams = new URLSearchParams();
  if (page) queryParams.append("page", page.toString());
  if (limit) queryParams.append("limit", limit.toString());
  if (search) queryParams.append("search", search);
  if (status) queryParams.append("status", status);
  if (sort) queryParams.append("sort", sort);
  if (order) queryParams.append("order", order);

  const queryString = queryParams.toString();
  const apiEndpoint = "/v1/cs/active-orders/by-orders";
  const url = `${apiEndpoint}${queryString ? `?${queryString}` : ""}`;

  const swrKey = `activeOrdersByOrders-${JSON.stringify(params)}`;

  return useSWR(swrKey, () => fetcherActiveOrdersByOrders(url, { arg: null }));
};
