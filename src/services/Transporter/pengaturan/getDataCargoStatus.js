import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// Set to true to use mock data, false to call the actual API
const useMockData = true;

const mockApiResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Configuration status retrieved successfully",
    },
    Data: {
      hasConfiguration: true,
      totalCargoTypes: 12,
      lastUpdated: "2024-12-10T14:30:00Z",
      status: true,
    },
    Type: "CARGO_CONFIG_STATUS",
  },
};

export const fetcherTransporterCargoStatus = async (cacheKey) => {
  if (useMockData) {
    return mockApiResult.data.Data;
  }

  try {
    const result = await fetcherMuatrans.get(cacheKey);
    return result?.data?.Data || {};
  } catch (error) {
    console.error("Error fetching transporter cargo status:", error);
    throw error;
  }
};

export const useGetTransporterCargoStatus = (id, options = {}) => {
  const cacheKey = id
    ? `/v1/transporter/settings/transporter-cargo-config-status/${id}`
    : null;

  return useSWR(cacheKey, fetcherTransporterCargoStatus, options);
};
