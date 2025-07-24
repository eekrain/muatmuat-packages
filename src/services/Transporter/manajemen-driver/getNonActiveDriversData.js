import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

export const fetcherNonActiveDrivers = async (cacheKey) => {
  const result = await fetcherMuatrans.get("v1/drivers/non-active");
  return result?.data?.Data || {};
};

export const useGetNonActiveDriversData = (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const cacheKey = `non-active-drivers${queryParams ? `?${queryParams}` : ""}`;

  return useSWR(cacheKey, fetcherNonActiveDrivers);
};
