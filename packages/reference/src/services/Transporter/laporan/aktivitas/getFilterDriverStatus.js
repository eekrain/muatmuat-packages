import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

export const mockFleetStatusFilters = {
  data: {
    Message: {
      Code: 200,
      Text: "OK",
    },
    Data: [
      {
        status: "READY_FOR_ORDER",
      },
      {
        status: "NOT_PAIRED",
      },
      {
        status: "ON_DUTY",
      },
    ],
    Type: "GET_ACTIVITIES_FILTER_FLEET_STATUSES",
  },
};

export const getFleetStatusFilters = async () => {
  let result;
  if (useMockData) {
    result = mockFleetStatusFilters;
  } else {
    result = await fetcherMuatrans.get(
      `/v1/transporter/activities/filter/fleet-status`
    );
  }
  return {
    data: result?.data?.Data || [],
    raw: result,
  };
};

export const useGetFleetStatusFilters = () => {
  const { data, error, isLoading } = useSWR([`getFleetStatusFilters`], () =>
    getFleetStatusFilters()
  );
  return {
    data: data?.data || [],
    raw: data?.raw,
    isLoading,
    isError: !!error,
  };
};
