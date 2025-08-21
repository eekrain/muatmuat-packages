import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// --- Configuration ---
// Set to true in your environment (.env.local) to use mock data.
const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

// --- Mock Data ---
// Mock data for a successful delivery summary response.
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "OK",
    },
    Data: {
      totalDistance: 208.27,
      totalTonnage: 200506,
      utilizedFleets: 6,
    },
    Type: "DASHBOARD_TRANSPORTER_DELIVERY_SUMMARY",
  },
};

/**
 * Fetcher function for dashboard delivery summary analytics.
 * @param {Array} cacheKey - The SWR cache key array containing URL and params.
 * @returns {Promise<Object>} The data for the delivery summary.
 */
export const fetcherDashboardAnalyticsDeliverySummary = async (cacheKey) => {
  const [url, params] = cacheKey;

  if (useMockData) {
    return mockAPIResult.data.Data;
  }

  try {
    const result = await fetcherMuatrans.get(url, { params });
    // Return the "Data" object on success, or an empty object on failure/empty response
    return result?.data?.Data || {};
  } catch (error) {
    console.error(
      "Error fetching dashboard delivery summary analytics:",
      error
    );
    // Ensure the hook receives an object even on a network error
    return {};
  }
};

/**
 * SWR hook to get dashboard delivery summary data.
 * @param {Object} params - Optional query parameters for the API request.
 * @returns {{data: Object, isLoading: boolean, isError: any}}
 */
export const useGetDashboardAnalyticsDeliverySummary = (params = {}) => {
  const cacheKey = ["/v1/cs/dashboard/analytics/delivery-summary", params];

  const { data, error, isLoading } = useSWR(
    cacheKey,
    fetcherDashboardAnalyticsDeliverySummary,
    {
      revalidateOnFocus: false, // Optional: prevents re-fetching on window focus
    }
  );

  return {
    data,
    isLoading,
    isError: error,
  };
};
