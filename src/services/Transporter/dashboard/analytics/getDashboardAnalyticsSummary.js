import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// --- Configuration ---
// Set to true to use mock data, false for actual API calls.
const useMockData = true;

// --- Mock Data ---

// Mock data for a successful response WITH analytics data.
export const mockAPIResultWithData = {
  data: {
    Message: {
      Code: 200,
      Text: "Dashboard summary retrieved successfully",
    },
    Data: {
      hasData: true,
      period: "month",
      periodLabel: "Dalam Bulan Ini",
      summary: {
        totalOrders: 220,
        totalOrdersAmount: 64000000000,
        totalRevenue: 176000000,
        totalMissedOrders: 45,
        totalMissedOrdersAmount: 32000000000,
      },
      shipmentSummary: {
        totalTonnage: 480000,
        totalDistance: 100000000,
        totalUtilizedFleets: 120,
      },
      dataAvailability: {
        hasOrders: true,
        hasCompletedOrders: true,
        hasRevenue: true,
        hasDrivers: true,
        hasFleets: true,
      },
    },
    Type: "DASHBOARD_SUMMARY",
  },
};

// Mock data for a successful response where NO data is available for the selected period.
export const mockAPIResultWithoutData = {
  data: {
    Message: {
      Code: 200,
      Text: "No data available for selected period",
    },
    Data: {
      hasData: false,
      period: "month",
      periodLabel: "Dalam Bulan Ini",
      summary: {
        totalOrders: 0,
        totalOrdersAmount: 0,
        totalRevenue: 0,
        totalMissedOrders: 0,
        totalMissedOrdersAmount: 0,
      },
      shipmentSummary: {
        totalTonnage: 0,
        totalDistance: 0,
        totalUtilizedFleets: 0,
      },
      dataAvailability: {
        hasOrders: false,
        hasCompletedOrders: false,
        hasRevenue: false,
        hasDrivers: true,
        hasFleets: true,
      },
    },
    Type: "DASHBOARD_SUMMARY",
  },
};

export const fetcherDashboardAnalyticsSummary = async (cacheKey) => {
  const [url, params] = cacheKey;

  if (useMockData) {
    // To use the mock data without data, comment the first return and uncomment the second.
    // return mockAPIResultWithData.data.Data;
    return mockAPIResultWithoutData.data.Data;
  }

  try {
    const result = await fetcherMuatrans.get(url, { params });
    return result?.data?.Data || {}; // Return data or an empty object on failure
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    return {}; // Ensure the hook receives an object even on error
  }
};

export const useGetDashboardAnalyticsSummary = (params = {}) => {
  // SWR uses the cacheKey to uniquely identify and cache requests.
  // By including the params object, SWR will automatically re-fetch when the params change.
  const cacheKey = ["/v1/dashboard/analytics/summary", params];

  const { data, error, isLoading } = useSWR(
    cacheKey,
    fetcherDashboardAnalyticsSummary,
    {
      revalidateOnFocus: false, // Optional: disable re-fetching on window focus
    }
  );

  return {
    data,
    isLoading,
    isError: error,
  };
};
