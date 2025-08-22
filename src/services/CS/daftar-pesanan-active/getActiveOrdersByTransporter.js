import useSWR from "swr";

import { fetcherMock, fetcherMuatrans } from "@/lib/axios";

const isMockActiveOrdersByTransporter = true;

export const fetcherActiveOrdersByTransporter = async (url, { arg } = {}) => {
  if (isMockActiveOrdersByTransporter) {
    const result = await fetcherMock.get(`/api/${url}`, arg ?? null);
    return result.data;
  }

  const result = await fetcherMuatrans.get(url, arg);
  return result.data;
};

export const useGetActiveOrdersByTransporter = (url) => {
  return useSWR(url ? `activeOrdersByTransporter-${url}` : null, () =>
    fetcherActiveOrdersByTransporter(url, { arg: null })
  );
};

export const useGetActiveOrdersByTransporterWithParams = (params = {}) => {
  const { page = 1, limit = 10, search = "", sort = "", order = "" } = params;

  const queryParams = new URLSearchParams();
  if (page) queryParams.append("page", page.toString());
  if (limit) queryParams.append("limit", limit.toString());
  if (search) queryParams.append("search", search);
  if (sort) queryParams.append("sort", sort);
  if (order) queryParams.append("order", order);

  const queryString = queryParams.toString();
  const apiEndpoint = "/v1/cs/active-orders/by-transporter";
  const url = `${apiEndpoint}${queryString ? `?${queryString}` : ""}`;

  const swrKey = `activeOrdersByTransporter-${JSON.stringify(params)}`;

  return useSWR(swrKey, () =>
    fetcherActiveOrdersByTransporter(url, { arg: null })
  );
};
