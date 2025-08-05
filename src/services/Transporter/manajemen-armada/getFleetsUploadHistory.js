import useSWR from "swr";

import { fetcherMock, fetcherMuatrans } from "@/lib/axios";

const isMockUploadFile = true;

export const fetcherDropdownVehicle = async (url, { arg }) => {
  if (isMockUploadFile) {
    const result = await fetcherMock.get(`/api/${url}`, arg ?? null);
    return result.data;
  }
  const result = await fetcherMuatrans.get(url, arg);
  return result.data;
};

export const useGetFleetsUploadHistory = (url) => {
  return useSWR(url ? `fleetsUploadHistory-${url}` : null, () =>
    fetcherDropdownVehicle(url, { arg: null })
  );
};

// New hook for upload history with query parameters
export const useGetFleetsUploadHistoryWithParams = (params = {}) => {
  const { page = 1, limit = 10, search = "", sort = "", order = "" } = params;

  // Build query string
  const queryParams = new URLSearchParams();
  if (page) queryParams.append("page", page.toString());
  if (limit) queryParams.append("limit", limit.toString());
  if (search) queryParams.append("filename", search);
  if (sort) queryParams.append("sort", sort);
  if (order) queryParams.append("order", order);

  const queryString = queryParams.toString();
  const url = `/v1/fleet/upload-history${queryString ? `?${queryString}` : ""}`;

  // Create a unique key for SWR that includes all parameters
  const swrKey = `fleetsUploadHistory-${JSON.stringify(params)}`;

  return useSWR(swrKey, () => fetcherDropdownVehicle(url, { arg: null }));
};
