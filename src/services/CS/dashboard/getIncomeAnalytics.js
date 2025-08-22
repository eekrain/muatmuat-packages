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
        { date: "2025-01-01", dateLabel: "01 Jan", income: 5500000 },
        { date: "2025-01-02", dateLabel: "02 Jan", income: 6200000 },
        { date: "2025-01-03", dateLabel: "03 Jan", income: 5800000 },
        { date: "2025-01-04", dateLabel: "04 Jan", income: 6500000 },
        { date: "2025-01-05", dateLabel: "05 Jan", income: 7200000 },
        { date: "2025-01-06", dateLabel: "06 Jan", income: 7500000 },
        { date: "2025-01-07", dateLabel: "07 Jan", income: 8100000 },
        { date: "2025-01-08", dateLabel: "08 Jan", income: 7800000 },
        { date: "2025-01-09", dateLabel: "09 Jan", income: 8500000 },
        { date: "2025-01-10", dateLabel: "10 Jan", income: 8900000 },
        { date: "2025-01-11", dateLabel: "11 Jan", income: 9200000 },
        { date: "2025-01-12", dateLabel: "12 Jan", income: 8800000 },
        { date: "2025-01-13", dateLabel: "13 Jan", income: 9500000 },
        { date: "2025-01-14", dateLabel: "14 Jan", income: 7000000 },
        { date: "2025-01-15", dateLabel: "15 Jan", income: 6500000 },
        { date: "2025-01-16", dateLabel: "16 Jan", income: 8200000 },
        { date: "2025-01-17", dateLabel: "17 Jan", income: 10500000 },
        { date: "2025-01-18", dateLabel: "18 Jan", income: 11000000 },
        { date: "2025-01-19", dateLabel: "19 Jan", income: 10800000 },
        { date: "2025-01-20", dateLabel: "20 Jan", income: 11200000 },
        { date: "2025-01-21", dateLabel: "21 Jan", income: 12000000 },
        { date: "2025-01-22", dateLabel: "22 Jan", income: 11500000 },
        { date: "2025-01-23", dateLabel: "23 Jan", income: 13000000 },
        { date: "2025-01-24", dateLabel: "24 Jan", income: 12500000 },
        { date: "2025-01-25", dateLabel: "25 Jan", income: 9800000 },
        { date: "2025-01-26", dateLabel: "26 Jan", income: 10200000 },
        { date: "2025-01-27", dateLabel: "27 Jan", income: 14000000 },
        { date: "2025-01-28", dateLabel: "28 Jan", income: 14500000 },
        { date: "2025-01-29", dateLabel: "29 Jan", income: 15000000 },
        { date: "2025-01-30", dateLabel: "30 Jan", income: 15400000 },
        { date: "2025-01-31", dateLabel: "31 Jan", income: 16000000 },
      ],
    },
    Type: "INCOME_DATA",
  },
};

export const fetcherCsDashboardAnalyticsIncome = async (cacheKey) => {
  const [url, params] = cacheKey;

  if (useMockData) {
    return mockAPIResult.data.Data;
  }

  try {
    const result = await fetcherMuatrans.get(url, { params });
    return result?.data?.Data || {}; // Return data or an empty object on failure
  } catch (error) {
    console.error("Error fetching CS dashboard income analytics:", error);
    return {}; // Ensure the hook receives an object even on error
  }
};

export const useGetCsDashboardAnalyticsIncome = (params = {}) => {
  // SWR uses the cacheKey to uniquely identify and cache requests.
  // The route is now updated to /cs/
  const cacheKey = ["/v1/cs/dashboard/analytics/income", params];

  const { data, error, isLoading } = useSWR(
    cacheKey,
    fetcherCsDashboardAnalyticsIncome,
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
