import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// --- Configuration ---
// Set to true to use mock data, false for actual API calls.
const useMockData = false;

// --- Mock Data ---

// Mock data for a successful response based on the real API contract.
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "OK",
    },
    Data: {
      totalIncome: 175966288,
      periode: "2025-08-01 - 2025-08-31",
      lineChartData: [
        {
          date: "2025-08-01",
          dateLabel: "1 Aug - 8 Aug",
          tooltipDateLabel: "01 Aug - 08 Aug 2025",
          income: 0,
        },
        {
          date: "2025-08-09",
          dateLabel: "9 Aug - 16 Aug",
          tooltipDateLabel: "09 Aug - 16 Aug 2025",
          income: 38988111,
        },
        {
          date: "2025-08-17",
          dateLabel: "17 Aug - 24 Aug",
          tooltipDateLabel: "17 Aug - 24 Aug 2025",
          income: 135678984,
        },
        {
          date: "2025-08-25",
          dateLabel: "25 Aug - 31 Aug",
          tooltipDateLabel: "25 Aug - 31 Aug 2025",
          income: 1299193,
        },
      ],
    },
    Type: "DASHBOARD_TRANSPORTER_INCOME",
  },
};

export const fetcherDashboardAnalyticsIncome = async (cacheKey) => {
  const [url, params] = cacheKey;

  if (useMockData) {
    return mockAPIResult.data.Data;
  }

  try {
    const result = await fetcherMuatrans.get(url, { params });
    return result?.data?.Data || {}; // Return data or an empty object on failure
  } catch (error) {
    console.error("Error fetching dashboard income analytics:", error);
    return {}; // Ensure the hook receives an object even on error
  }
};

export const useGetDashboardAnalyticsIncome = (params = {}) => {
  // SWR uses the cacheKey to uniquely identify and cache requests.
  const cacheKey = ["/v1/transporter/dashboard/analytics/income", params];

  const { data, error, isLoading } = useSWR(
    cacheKey,
    fetcherDashboardAnalyticsIncome,
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
