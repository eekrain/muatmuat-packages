import useSWRMutation from "swr/mutation";

import { fetcherMock, fetcherMuatrans } from "@/lib/axios";

const isMockUploadFile = false;

export const fetcherUploadVehiclePhotos = async (url, { arg }) => {
  if (isMockUploadFile) {
    const result = await fetcherMock.post(`/api/${url}`, arg ?? null);
    return result.data;
  }
  const result = await fetcherMuatrans.post(url, arg);
  return result.data;
};

export const usePostFleetBulkCreate = () => {
  return useSWRMutation("v1/fleet/bulk-create", (url, { arg }) => {
    return fetcherUploadVehiclePhotos(url, { arg });
  });
};
