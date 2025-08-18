import useSWRMutation from "swr/mutation";

import { fetcherMock, fetcherMuatrans } from "@/lib/axios";

const isMockUploadFile = false;

export const fetcherDriversBulkCreate = async (url, { arg }) => {
  if (isMockUploadFile) {
    const result = await fetcherMock.post(`/api/${url}`, arg ?? null);
    return result.data;
  }
  const result = await fetcherMuatrans.post(url, arg);
  return result.data;
};

export const usePostDriverBulkCreate = () => {
  return useSWRMutation("v1/drivers/bulk-create", (url, { arg }) => {
    return fetcherDriversBulkCreate(url, { arg });
  });
};
