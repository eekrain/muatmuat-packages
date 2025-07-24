import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const apiResultDriversCount = {
  data: {
    Message: {
      Code: 200,
      Text: "Success",
    },
    Data: {
      active: 25,
      nonActive: 8,
      registrationProcess: 5,
      archive: 3,
    },
    Type: "GET_DRIVERS_COUNT",
  },
};

export const fetcherDriversCount = async () => {
  // const result = await fetcherMuatrans.get("v1/drivers/count");
  // return result?.data?.Data || {};

  const result = apiResultDriversCount;
  return result.data.Data;
};

export const useGetDriversCount = () => {
  return useSWR("drivers-count", fetcherDriversCount);
};
