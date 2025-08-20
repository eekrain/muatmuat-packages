import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// --- Configuration ---
// Set to true to use mock data, false for actual API calls.
const useMockData = true;

// --- Mock Data ---

// Mock data for a successful response including price per segment.
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Missed orders data retrieved successfully",
    },
    Data: {
      totalShipper: 25000,
      periodLabel: "Dalam Bulan Ini",
      donutChartData: {
        totalShipper: 25000,
        segments: [
          {
            status: "ACTIVE",
            label: "Aktif",
            count: 20000,
            percentage: 35.0,
          },
          {
            status: "INACTIVE",
            label: "Tidak Aktif",
            count: 5000,
            percentage: 65.0,
          },
        ],
      },
    },
    Type: "TOTAL_SHIPPER_DATA",
  },
};

export const fetcherDashboardAnalyticsTotalShipper = async (cacheKey) => {
  const [url, params] = cacheKey;

  if (useMockData) {
    return mockAPIResult.data.Data;
  }

  try {
    const result = await fetcherMuatrans.get(url, { params });
    return result?.data?.Data || {}; // Return data or an empty object on failure
  } catch (error) {
    console.error("Error fetching dashboard total shipper analytics:", error);
    return {}; // Ensure the hook receives an object even on error
  }
};

export const useGetDashboardAnalyticsTotalShipper = (params = {}) => {
  const cacheKey = ["/v1/cs/dashboard/analytics/total-shipper", params];

  const { data, error, isLoading } = useSWR(
    cacheKey,
    fetcherDashboardAnalyticsTotalShipper,
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
