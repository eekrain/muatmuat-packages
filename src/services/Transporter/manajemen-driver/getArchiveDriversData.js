import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

export const fetcherArchiveDrivers = async (cacheKey) => {
  const result = await fetcherMuatrans.get("v1/drivers/archive");
  return result?.data?.Data || {};
};

export const useGetArchiveDriversData = (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const cacheKey = `archive-drivers${queryParams ? `?${queryParams}` : ""}`;

  return useSWR(cacheKey, fetcherArchiveDrivers);
};
