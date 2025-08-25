import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// --- Configuration ---
// Set to true to use mock data, false for actual API calls.
const useMockData = true;

// --- Mock Data ---

// Mock data for a successful response including additional cost details.
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Additional cost data retrieved successfully",
    },
    Data: {
      totalAdditionalCost: 32000000,
      periodLabel: "Dalam Bulan Ini",
      donutChartData: {
        totalAdditionalCost: 32000000,
        segments: [
          {
            status: "UNPAID",
            label: "Belum Dibayarkan",
            price: 15000000,
            percentage: 46.88,
          },
          {
            status: "PAID",
            label: "Sudah Dibayarkan",
            price: 10000000,
            percentage: 31.25,
          },
        ],
      },
    },
    Type: "ADDITIONAL_COST_DATA",
  },
};

export const fetcherDashboardAnalyticsAdditionalCost = async (cacheKey) => {
  const [url, params] = cacheKey;

  if (useMockData) {
    return mockAPIResult.data.Data;
  }

  try {
    const result = await fetcherMuatrans.get(url, { params });
    return result?.data?.Data || {}; // Return data or an empty object on failure
  } catch (error) {
    console.error("Error fetching dashboard additional cost analytics:", error);
    return {}; // Ensure the hook receives an object even on error
  }
};

export const useGetDashboardAnalyticsAdditionalCost = (params = {}) => {
  const cacheKey = ["/v1/cs/dashboard/analytics/additional-cost", params];

  const { data, error, isLoading } = useSWR(
    cacheKey,
    fetcherDashboardAnalyticsAdditionalCost,
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
