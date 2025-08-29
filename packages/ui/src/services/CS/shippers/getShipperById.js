import useSWR from "swr";

import { fetcherMock, fetcherMuatrans } from "@/lib/axios";

// Re-export server util for internal server usage

// Frontend fetcher + SWR hook matching project pattern
const isMockCSShipper = false;

export const fetcherCSShipper = async (url, { arg } = {}) => {
  if (isMockCSShipper) {
    const result = await fetcherMock.get(`/api/${url}`, arg ?? null);
    return result.data;
  }
  const result = await fetcherMuatrans.get(url, arg);
  return result.data;
};

export const useGetShipperById = (id) => {
  const url = id ? `v1/cs/shippers/${id}` : null;
  const swrKey = id ? `csShipper-${id}` : null;
  return useSWR(swrKey, () =>
    url ? fetcherCSShipper(url, { arg: null }) : null
  );
};
