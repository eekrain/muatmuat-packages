import useSWRMutation from "swr/mutation";

import { fetcherMock, fetcherMuatrans } from "@/lib/axios";

const isMockUploadFile = true;

export const fetcherUploadVehiclePhotos = async (url, { arg }) => {
  if (isMockUploadFile) {
    const result = await fetcherMock.post(`/api/${url}`, arg ?? null);
    return result.data;
  }
  const result = await fetcherMuatrans.post(url, arg);
  return result.data;
};

export const usePostDriverExcelUpload = () => {
  return useSWRMutation("v1/drivers/excel-upload", (url, { arg }) => {
    return fetcherUploadVehiclePhotos(url, { arg });
  });
};
