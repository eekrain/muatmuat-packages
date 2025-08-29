import useSWR from "swr";

import { fetcherMock, fetcherMuatrans } from "@/lib/axios";

const isMockFleetCount = true;

export const fetcherFleetCount = async (url, { arg } = {}) => {
  if (isMockFleetCount) {
    const result = await fetcherMock.get(`/api/${url}`, arg ?? null);
    return result.data;
  }
  const result = await fetcherMuatrans.get(url, arg);
  return result.data;
};

export const useGetFleetCount = () => {
  const url = "v1/cs/monitoring/maps/fleet-count";
  return useSWR(url, () => fetcherFleetCount(url));
};

export default useGetFleetCount;
