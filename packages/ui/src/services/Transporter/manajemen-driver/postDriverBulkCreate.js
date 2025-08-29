import useSWRMutation from "swr/mutation";

import { fetcherMock, fetcherMuatrans } from "@/lib/axios";

const isMockUploadFile = false;

export const fetcherDriversBulkCreate = async (url, { arg }) => {
  try {
    if (isMockUploadFile) {
      const result = await fetcherMock.post(`/api/${url}`, arg ?? null);
      return result.data;
    }
    const result = await fetcherMuatrans.post(url, arg);
    return result.data;
  } catch (error) {
    // Handle API errors according to contract
    if (error.response?.data) {
      throw error.response.data;
    }
    // Handle network or other errors
    throw {
      Message: {
        Code: 500,
        Text: "Internal server error",
      },
      Data: null,
      Type: "SAVE_DRIVER_DATA",
    };
  }
};

export const usePostDriverBulkCreate = () => {
  return useSWRMutation("v1/drivers/bulk-create", (url, { arg }) => {
    return fetcherDriversBulkCreate(url, { arg });
  });
};
