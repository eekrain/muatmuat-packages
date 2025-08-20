import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false;

const mockCustomPeriodsResponse = {
  data: {
    Message: {
      Code: 200,
      Text: "Custom periods retrieved successfully",
    },
    Data: [
      {
        id: "550e8400-e29b-41d4-a716-446655440000",
        startDate: "2024-01-01",
        endDate: "2024-01-31",
        module: "fleet-activities",
        transporterId: "550e8400-e29b-41d4-a716-446655440001",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440002",
        startDate: "2024-02-01",
        endDate: "2024-02-28",
        module: "fleet-activities",
        transporterId: "550e8400-e29b-41d4-a716-446655440001",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440003",
        startDate: "2024-03-01",
        endDate: "2024-03-31",
        module: "driver-activities",
        transporterId: "550e8400-e29b-41d4-a716-446655440001",
      },
    ],
    Type: "GET_CUSTOM_PERIODS",
  },
};

const mockEmptyResponse = {
  data: {
    Message: {
      Code: 200,
      Text: "Custom periods retrieved successfully",
    },
    Data: {
      Data: [],
    },
    Type: "GET_CUSTOM_PERIODS",
  },
};

export const getCustomPeriods = async (params = {}) => {
  if (useMockData) {
    // Simulate different scenarios based on module parameter
    if (params.module === "driver-activities") {
      return mockCustomPeriodsResponse.data.Data.Data.filter(
        (period) => period.module === "driver-activities"
      );
    }

    if (params.module === "fleet-activities") {
      return mockCustomPeriodsResponse.data.Data.Data.filter(
        (period) => period.module === "fleet-activities"
      );
    }

    // Return all periods if no module filter
    return mockCustomPeriodsResponse.data.Data.Data;
  }

  const queryParams = new URLSearchParams();

  if (params.module) {
    queryParams.append("module", params.module);
  }

  const url = `v1/transporter/custom-periods/list${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

  const result = await fetcherMuatrans.get(url);
  return result?.data?.Data || [];
};

export const useGetCustomPeriods = (params = {}) => {
  const queryParams = new URLSearchParams();

  if (params.module) {
    queryParams.append("module", params.module);
  }

  const key = `v1/transporter/custom-periods/list${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

  return useSWR(
    key,
    async () => {
      if (useMockData) {
        // Simulate different scenarios based on module parameter
        if (params.module === "driver-activities") {
          return mockCustomPeriodsResponse.data.Data.Data.filter(
            (period) => period.module === "driver-activities"
          );
        }

        if (params.module === "fleet-activities") {
          return mockCustomPeriodsResponse.data.Data.Data.filter(
            (period) => period.module === "fleet-activities"
          );
        }

        // Return all periods if no module filter
        return mockCustomPeriodsResponse.data.Data.Data;
      }

      const result = await fetcherMuatrans.get(key);
      return result?.data?.Data || [];
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 300000, // 5 minutes cache
    }
  );
};
