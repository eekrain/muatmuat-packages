import useSWR from "swr";

import { fetcherMock, fetcherMuatrans } from "@/lib/axios";

const isMockCSImportantNotifications = true;

export const fetcherCSImportantNotifications = async (url, { arg } = {}) => {
  if (isMockCSImportantNotifications) {
    const result = await fetcherMock.get(`/api/${url}`, arg ?? null);
    return result.data;
  }
  const result = await fetcherMuatrans.get(url, arg);
  return result.data;
};

export const useGetCSImportantNotifications = (url) => {
  return useSWR(url ? `csImportantNotifications-${url}` : null, () =>
    fetcherCSImportantNotifications(url, { arg: null })
  );
};
