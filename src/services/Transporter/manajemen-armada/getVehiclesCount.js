import useSWR from "swr";

// import { fetcherMuatrans } from "@/lib/axios";

const apiResultVehiclesCount = {
  data: {
    Message: {
      Code: 200,
      Text: "",
    },
    Data: {
      active: 10,
      nonActive: 10,
      registrationProcess: 10,
      archive: 10,
    },
    Type: "VEHICLE/COUNT-SUMMARY",
  },
};

export const fetcherVehiclesCount = async (cacheKey) => {
  // const result = await fetcherMuatrans.get(`v1/transporter/vehicles/count`);
  // return result?.data?.Data || {};

  const result = apiResultVehiclesCount;
  return result.data.Data;
};

export const useGetVehiclesCount = () => {
  const cacheKey = "vehicles-count";

  return useSWR(cacheKey, fetcherVehiclesCount);
};
