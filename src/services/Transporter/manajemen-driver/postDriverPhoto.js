import useSWRMutation from "swr/mutation";

import { fetcherMock, fetcherMuatrans } from "@/lib/axios";

const isMockUploadFile = false;

export const fetcherUploadDriverPhotos = async (url, { arg }) => {
  if (isMockUploadFile) {
    const result = await fetcherMock.post(`/api/${url}`, arg ?? null);
    return result.data;
  }
  const result = await fetcherMuatrans.post(url, arg);
  return result.data;
};

export const useUploadDriverPhotos = () => {
  return useSWRMutation("v1/upload/driver-photos", (url, { arg }) => {
    return fetcherUploadDriverPhotos(url, { arg });
  });
};
