import useSWR from "swr";

import { fetcherMock, fetcherMuatrans } from "@/lib/axios";

const isMockCSShippers = false;

export const fetcherCSShippers = async (url, { arg } = {}) => {
  if (isMockCSShippers) {
    const result = await fetcherMock.get(`/api/${url}`, arg ?? null);
    return result.data;
  }
  const result = await fetcherMuatrans.get(url, arg);
  return result.data;
};

export const useGetCSShippers = (url) => {
  return useSWR(url ? `csShippers-${url}` : null, () =>
    fetcherCSShippers(url, { arg: null })
  );
};

export const useGetCSShippersWithParams = (params = {}) => {
  const { page = 1, limit = 10 } = params;

  const queryParams = new URLSearchParams();

  // Always include page & limit defaults unless explicitly falsy
  if (page) queryParams.append("page", page.toString());
  if (limit) queryParams.append("limit", limit.toString());

  // Serialize all other params (including arrays) into the query string.
  Object.entries(params).forEach(([key, value]) => {
    if (key === "page" || key === "limit") return;
    if (value === null || typeof value === "undefined" || value === "") return;
    if (Array.isArray(value)) {
      value.forEach((v) => queryParams.append(key, String(v)));
    } else {
      queryParams.append(key, String(value));
    }
  });

  const queryString = queryParams.toString();
  // Build url without leading slash so fetcherMock.get(`/api/${url}`) -> /api/v1/...
  const url = `v1/cs/shippers${queryString ? `?${queryString}` : ""}`;

  const swrKey = `csShippers-${JSON.stringify(params)}`;

  return useSWR(swrKey, () => fetcherCSShippers(url, { arg: null }));
};
