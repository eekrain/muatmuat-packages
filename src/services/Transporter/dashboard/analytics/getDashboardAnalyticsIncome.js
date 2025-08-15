import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// --- Configuration ---
// Set to true to use mock data, false for actual API calls.
const useMockData = true;

// --- Mock Data ---

// Mock data for a successful response.
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Income data retrieved successfully",
    },
    Data: {
      totalIncome: 176000000,
      periodLabel: "Dalam Bulan Ini",
      lineChartData: [
        {
          date: "2025-01-01",
          dateLabel: "01 Jan",
          income: 5500000,
        },
        {
          date: "2025-01-05",
          dateLabel: "05 Jan",
          income: 7200000,
        },
        {
          date: "2025-01-10",
          dateLabel: "10 Jan",
          income: 8900000,
        },
        {
          date: "2025-01-15",
          dateLabel: "15 Jan",
          income: 6500000,
        },
        {
          date: "2025-01-20",
          dateLabel: "20 Jan",
          income: 11200000,
        },
        {
          date: "2025-01-25",
          dateLabel: "25 Jan",
          income: 9800000,
        },
        {
          date: "2025-01-30",
          dateLabel: "30 Jan",
          income: 15400000,
        },
      ],
    },
    Type: "INCOME_DATA",
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
