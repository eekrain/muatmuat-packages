import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// --- Configuration ---
// Set to true to use mock data, false for actual API calls.
const useMockData = true;

// --- Mock Data ---

// Mock data for a successful response for total drivers.
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Total driver data retrieved successfully",
    },
    Data: {
      totalDriver: 35000,
      periodLabel: "Dalam Bulan Ini",
      donutChartData: {
        totalDriver: 35000,
        segments: [
          {
            status: "ACTIVE",
            label: "Aktif",
            count: 30000,
            percentage: 85.7,
          },
          {
            status: "INACTIVE",
            label: "Tidak Aktif",
            count: 5000,
            percentage: 14.3,
          },
        ],
      },
    },
    Type: "TOTAL_DRIVER_DATA",
  },
};

export const fetcherDashboardAnalyticsTotalDriver = async (cacheKey) => {
  const [url, params] = cacheKey;

  if (useMockData) {
    return mockAPIResult.data.Data;
  }

  try {
    const result = await fetcherMuatrans.get(url, { params });
    return result?.data?.Data || {}; // Return data or an empty object on failure
  } catch (error) {
    console.error("Error fetching dashboard total driver analytics:", error);
    return {}; // Ensure the hook receives an object even on error
  }
};

export const useGetDashboardAnalyticsTotalDriver = (params = {}) => {
  const cacheKey = ["/v1/cs/dashboard/analytics/total-driver", params];

  const { data, error, isLoading } = useSWR(
    cacheKey,
    fetcherDashboardAnalyticsTotalDriver,
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
