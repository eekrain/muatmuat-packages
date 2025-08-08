import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const isUseMock = false; // Set to true to use mock data

const apiResultDriversCount = {
  data: {
    Message: {
      Code: 200,
      Text: "Success",
    },
    Data: {
      active: 3,
      nonActive: 1,
      registrationProcess: 1,
      archive: 1,
    },
    Type: "GET_DRIVERS_COUNT",
  },
};

export const fetcherDriversCount = async () => {
  if (isUseMock) {
    return apiResultDriversCount.data.Data;
  }

  const result = await fetcherMuatrans.get("v1/drivers/count");
  return result?.data?.Data || {};
};

export const useGetDriversCount = () => {
  return useSWR("drivers-count", fetcherDriversCount);
};
