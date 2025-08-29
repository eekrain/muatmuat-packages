import useSWR from "swr";

import { fetcherMock, fetcherMuatrans } from "@/lib/axios";

const isMockUploadFile = true;
export const fetcherUserPreferencesImportDriver = async (url, { arg }) => {
  if (isMockUploadFile) {
    const result = await fetcherMock.get(`/api/${url}`, arg ?? null);
    return result.data;
  }
  const result = await fetcherMuatrans.get(url, arg);
  return result.data;
};

export const useGetUserPreferencesImportDriver = (url) => {
  return useSWR(
    url ? `userPreferencesImportDriver-${url}` : null,
    () => fetcherUserPreferencesImportDriver(url, { arg: null }),
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );
};
