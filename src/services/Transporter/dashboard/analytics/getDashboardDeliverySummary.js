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
      Text: "OK",
    },
    Data: {
      totalDistance: 1118.52,
      totalTonnage: 230613,
      utilizedFleets: 10,
    },
    Type: "DASHBOARD_TRANSPORTER_DELIVERY_SUMMARY",
  },
};

// Mock data for a successful response where NO data is available.
export const mockAPIResultWithoutData = {
  data: {
    Message: {
      Code: 200,
      Text: "OK",
    },
    Data: {
      totalDistance: 0,
      totalTonnage: 0,
      utilizedFleets: 0,
    },
    Type: "DASHBOARD_TRANSPORTER_DELIVERY_SUMMARY",
  },
};

export const fetcherDashboardDeliverySummary = async (cacheKey) => {
  const [url, params] = cacheKey;

  if (useMockData) {
    // To use the mock data without data, comment the first return and uncomment the second.
    return mockAPIResultWithData.data.Data;
    // return mockAPIResultWithoutData.data.Data;
  }

  try {
    const result = await fetcherMuatrans.get(url, { params });
    return result?.data?.Data || {}; // Return data or an empty object on failure
  } catch (error) {
    console.error("Error fetching dashboard delivery summary:", error);
    return {}; // Ensure the hook receives an object even on error
  }
};

export const useGetDashboardDeliverySummary = (params = {}) => {
  // SWR uses the cacheKey to uniquely identify and cache requests.
  const cacheKey = [
    "/v1/transporter/dashboard/analytics/delivery-summary",
    params,
  ];

  const { data, error, isLoading } = useSWR(
    cacheKey,
    fetcherDashboardDeliverySummary,
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
