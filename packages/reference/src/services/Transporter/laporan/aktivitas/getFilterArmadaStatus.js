import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

export const mockDriverStatusFilters = {
  data: {
    Message: {
      Code: 200,
      Text: "OK",
    },
    Data: [
      {
        status: "ON_DUTY",
      },
      {
        status: "NOT_PAIRED",
      },
      {
        status: "READY_FOR_ORDER",
      },
      {
        status: "NON_ACTIVE",
      },
    ],
    Type: "GET_ACTIVITIES_FILTER_DRIVER_STATUSES",
  },
};

export const getDriverStatusFilters = async () => {
  let result;
  if (useMockData) {
    result = mockDriverStatusFilters;
  } else {
    result = await fetcherMuatrans.get(
      `/v1/transporter/activities/filter/driver-status`
    );
  }
  return {
    data: result?.data?.Data || [],
    raw: result,
  };
};

export const useGetDriverStatusFilters = () => {
  const { data, error, isLoading } = useSWR([`getDriverStatusFilters`], () =>
    getDriverStatusFilters()
  );
  return {
    data: data?.data || [],
    raw: data?.raw,
    isLoading,
    isError: !!error,
  };
};
