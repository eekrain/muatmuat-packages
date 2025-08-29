import useSWRMutation from "swr/mutation";

import { fetcherMock, fetcherMuatrans } from "@/lib/axios";

const isMockUploadFile = false;

export const fetcherDriversBulkDraft = async (url, { arg }) => {
  if (isMockUploadFile) {
    const result = await fetcherMock.post(`/api/${url}`, arg ?? null);
    return result.data;
  }
  const result = await fetcherMuatrans.post(url, arg);
  return result.data;
};

export const usePostDriverBulkDrafts = () => {
  return useSWRMutation("v1/drivers/bulk-draft", (url, { arg }) => {
    return fetcherDriversBulkDraft(url, { arg });
  });
};
