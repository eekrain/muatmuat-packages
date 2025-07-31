import useSWRMutation from "swr/mutation";

import { fetcherMuatrans, fetcherMuatransMock } from "@/lib/axios";

const isMockUploadFile = true;

export const fetcherUploadVehiclePhotos = async (url, { arg }) => {
  if (isMockUploadFile) {
    const result = await fetcherMuatransMock.post(`/api/${url}`, arg ?? null);
    return result.data;
  }
  const result = await fetcherMuatrans.post(url, arg);
  return result.data;
};

export const useUploadVehiclePhotos = () => {
  return useSWRMutation("v1/upload/vehicle-photos", (url, { arg }) => {
    return fetcherUploadVehiclePhotos(url, { arg });
  });
};
