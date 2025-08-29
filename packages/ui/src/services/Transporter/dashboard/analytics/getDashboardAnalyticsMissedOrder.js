import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// --- Configuration ---
// Set to true to use mock data, false for actual API calls.
const useMockData = false; // Changed to false to enable real API calls

// --- Mock Data ---
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Missed orders data retrieved successfully",
    },
    Data: {
      totalMissedOrders: 45,
      totalMissedAmount: 64000000000,
      periodLabel: "Dalam Bulan Ini",
      donutChartData: {
        totalMissedOrders: 45,
        segments: [
          {
            status: "REJECTED",
            label: "Ditolak",
            count: 20,
            price: 18000000000,
            percentage: 44.44,
          },
          {
            status: "LATE_RESPONSE",
            label: "Terlambat Respon",
            count: 15,
            price: 12000000000,
            percentage: 33.33,
          },
          {
            status: "NO_RESPONSE",
            label: "Tanpa Respon",
            count: 10,
            price: 13000000000,
            percentage: 22.22,
          },
        ],
      },
    },
    Type: "MISSED_ORDERS_DATA",
  },
};

export const fetcherDashboardAnalyticsMissedOrders = async ([url, params]) => {
  if (useMockData) {
    return mockAPIResult.data.Data;
  }

  try {
    const result = await fetcherMuatrans.get(url, { params });
    return result?.data?.Data || {}; // Return data or an empty object on failure
  } catch (error) {
    console.error("Error fetching dashboard missed orders analytics:", error);
    throw error; // Re-throw the error to be caught by SWR
  }
};

export const useGetDashboardAnalyticsMissedOrders = (params) => {
  // The cache key now correctly includes the passed-in params.
  const cacheKey = [
    "/v1/transporter/dashboard/analytics/missed-orders",
    params,
  ];

  const { data, error, isLoading } = useSWR(
    // Only fetch if params are provided
    params ? cacheKey : null,
    fetcherDashboardAnalyticsMissedOrders,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    data,
    isLoading,
    isError: !!error, // Coerce error to a boolean
  };
};
