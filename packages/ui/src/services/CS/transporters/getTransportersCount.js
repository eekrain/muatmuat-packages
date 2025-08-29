import useSWR from "swr";

import { fetcherMock, fetcherMuatrans } from "@/lib/axios";

const isMockCSTransporters = false;

export const fetcherCSTransportersCount = async (url, { arg }) => {
  if (isMockCSTransporters) {
    const result = await fetcherMock.get(`/api/${url}`, arg ?? null);
    return result.data;
  }
  const result = await fetcherMuatrans.get(url, arg);
  return result.data;
};

export const useGetCSTransportersCount = (url) => {
  return useSWR(url ? `csTransporters-${url}` : null, () =>
    fetcherCSTransportersCount(url, { arg: null })
  );
};
