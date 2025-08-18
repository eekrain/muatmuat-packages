import useSWR from "swr";

import { fetcherMock, fetcherMuatrans } from "@/lib/axios";

const isMockUploadFile = false;
export const fetcherExcelArmadaMassalTemplate = async (url, { arg }) => {
  if (isMockUploadFile) {
    const result = await fetcherMock.get(`/api/${url}`, arg ?? null);
    return result.data;
  }
  const result = await fetcherMuatrans.get(url, arg);
  return result.data;
};

export const useGetFleetsExcelTemplate = (url) => {
  return useSWR(url ? `fleetsExcelTemplate-${url}` : null, () =>
    fetcherExcelArmadaMassalTemplate(url, { arg: null })
  );
};
