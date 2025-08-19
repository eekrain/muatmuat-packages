import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false;

export const mockCountData = {
  data: {
    Message: {
      Code: 200,
      Text: "OK",
    },
    Data: {
      fleet: 15,
      driver: 36,
    },
    Type: "GET_COUNT_ACTIVITIES_FLEET_AND_DRIVER",
  },
};

export const getCountArmadaDriver = async () => {
  let result;
  if (useMockData) {
    result = mockCountData;
  } else {
    result = await fetcherMuatrans.get(`/v1/transporter/activities/count`);
  }
  return {
    data: result?.data?.Data || {},
    raw: result,
  };
};

export const useGetCountArmadaDriver = () => {
  const { data, error, isLoading } = useSWR([`getCountArmadaDriver`], () =>
    getCountArmadaDriver()
  );
  return {
    data: data?.data || {},
    raw: data?.raw,
    isLoading,
    isError: !!error,
  };
};
