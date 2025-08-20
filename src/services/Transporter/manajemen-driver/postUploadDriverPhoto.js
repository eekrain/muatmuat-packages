import useSWRMutation from "swr/mutation";

import { fetcherMock, fetcherMuatrans } from "@/lib/axios";

const isMockUploadFile = true;

export const fetcherUploadDriverPhoto = async (url, { arg }) => {
  if (isMockUploadFile) {
    const result = await fetcherMock.post(`/api/${url}`, arg ?? null);
    return result.data;
  }
  const result = await fetcherMuatrans.post(url, arg);
  return result.data;
};

export const useUploadDriverPhoto = () => {
  return useSWRMutation("v1/upload/files", (url, { arg }) => {
    return fetcherUploadDriverPhoto(url, { arg });
  });
};
