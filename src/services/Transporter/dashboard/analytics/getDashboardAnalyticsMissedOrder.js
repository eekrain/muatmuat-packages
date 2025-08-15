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

export const fetcherDashboardAnalyticsMissedOrders = async (cacheKey) => {
  const [url, params] = cacheKey;

  if (useMockData) {
    return mockAPIResult.data.Data;
  }

  try {
    const result = await fetcherMuatrans.get(url, { params });
    return result?.data?.Data || {}; // Return data or an empty object on failure
  } catch (error) {
    console.error("Error fetching dashboard missed orders analytics:", error);
    return {}; // Ensure the hook receives an object even on error
  }
};

export const useGetDashboardAnalyticsMissedOrders = (params = {}) => {
  const cacheKey = [
    "/v1/transporter/dashboard/analytics/missed-orders",
    params,
  ];

  const { data, error, isLoading } = useSWR(
    cacheKey,
    fetcherDashboardAnalyticsMissedOrders,
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
