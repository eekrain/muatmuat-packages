import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// --- Configuration ---
// Set to true to use mock data, false for actual API calls.
const useMockData = true;

// --- Mock Data ---

// Mock data for a successful response for total armada.
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Total armada data retrieved successfully",
    },
    Data: {
      totalArmada: 15000,
      periodLabel: "Dalam Bulan Ini",
      donutChartData: {
        totalArmada: 15000,
        segments: [
          {
            status: "ACTIVE",
            label: "Aktif",
            count: 12000,
            percentage: 80.0,
          },
          {
            status: "INACTIVE",
            label: "Tidak Aktif",
            count: 3000,
            percentage: 20.0,
          },
        ],
      },
    },
    Type: "TOTAL_ARMADA_DATA",
  },
};

export const fetcherDashboardAnalyticsTotalArmada = async (cacheKey) => {
  const [url, params] = cacheKey;

  if (useMockData) {
    return mockAPIResult.data.Data;
  }

  try {
    const result = await fetcherMuatrans.get(url, { params });
    return result?.data?.Data || {}; // Return data or an empty object on failure
  } catch (error) {
    console.error("Error fetching dashboard total armada analytics:", error);
    return {}; // Ensure the hook receives an object even on error
  }
};

export const useGetDashboardAnalyticsTotalArmada = (params = {}) => {
  const cacheKey = ["/v1/cs/dashboard/analytics/total-armada", params];

  const { data, error, isLoading } = useSWR(
    cacheKey,
    fetcherDashboardAnalyticsTotalArmada,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    data,
    isLoading,
    isError: error,
  };
};
