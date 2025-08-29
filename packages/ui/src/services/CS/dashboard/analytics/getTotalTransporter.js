import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// --- Configuration ---
// Set to true to use mock data, false for actual API calls.
const useMockData = true;

// --- Mock Data ---

// Mock data for a successful response for total transporters.
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Total transporter data retrieved successfully",
    },
    Data: {
      totalTransporter: 8000,
      periodLabel: "Dalam Bulan Ini",
      donutChartData: {
        totalTransporter: 8000,
        segments: [
          {
            status: "ACTIVE",
            label: "Aktif",
            count: 7500,
            percentage: 93.75,
          },
          {
            status: "INACTIVE",
            label: "Tidak Aktif",
            count: 500,
            percentage: 6.25,
          },
        ],
      },
    },
    Type: "TOTAL_TRANSPORTER_DATA",
  },
};

export const fetcherDashboardAnalyticsTotalTransporter = async (cacheKey) => {
  const [url, params] = cacheKey;

  if (useMockData) {
    return mockAPIResult.data.Data;
  }

  try {
    const result = await fetcherMuatrans.get(url, { params });
    return result?.data?.Data || {}; // Return data or an empty object on failure
  } catch (error) {
    console.error(
      "Error fetching dashboard total transporter analytics:",
      error
    );
    return {}; // Ensure the hook receives an object even on error
  }
};

export const useGetDashboardAnalyticsTotalTransporter = (params = {}) => {
  const cacheKey = ["/v1/cs/dashboard/analytics/total-transporter", params];

  const { data, error, isLoading } = useSWR(
    cacheKey,
    fetcherDashboardAnalyticsTotalTransporter,
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
