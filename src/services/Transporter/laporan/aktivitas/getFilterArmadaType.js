import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

export const mockFleetTypeFilters = {
  data: {
    Message: {
      Code: 200,
      Text: "OK",
    },
    Data: [
      {
        id: "26ff8b9e-b8cc-40a9-9b9e-a3404752c5fd",
        name: "Colt Diesel Double",
        description: "Bak Terbuka",
      },
    ],
    Type: "GET_ACTIVITIES_FILTER_FLEET_TYPES",
  },
};

export const getFleetTypeFilters = async () => {
  let result;
  if (useMockData) {
    result = mockFleetTypeFilters;
  } else {
    result = await fetcherMuatrans.get(
      `/v1/transporter/activities/filter/fleet-types`
    );
  }
  return {
    data: result?.data?.Data || [],
    raw: result,
  };
};

export const useGetFleetTypeFilters = () => {
  const { data, error, isLoading } = useSWR([`getFleetTypeFilters`], () =>
    getFleetTypeFilters()
  );
  return {
    data: data?.data || [],
    raw: data?.raw,
    isLoading,
    isError: !!error,
  };
};
