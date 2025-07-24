import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

export const fetcherProcessDrivers = async (cacheKey) => {
  const result = await fetcherMuatrans.get("v1/drivers/process");
  return result?.data?.Data || {};
};

export const useGetProcessDriversData = (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const cacheKey = `process-drivers${queryParams ? `?${queryParams}` : ""}`;

  return useSWR(cacheKey, fetcherProcessDrivers);
};
