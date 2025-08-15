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
      Text: "Orders data retrieved successfully",
    },
    Data: {
      totalOrders: 220,
      periodLabel: "Dalam Bulan Ini",
      barChartData: [
        {
          date: "2025-01-01",
          dateLabel: "01 Jan",
          totalOrders: 15,
          scheduledOrders: 10,
          instantOrders: 5,
        },
        {
          date: "2025-01-05",
          dateLabel: "05 Jan",
          totalOrders: 22,
          scheduledOrders: 18,
          instantOrders: 4,
        },
        {
          date: "2025-01-10",
          dateLabel: "10 Jan",
          totalOrders: 30,
          scheduledOrders: 25,
          instantOrders: 5,
        },
        {
          date: "2025-01-15",
          dateLabel: "15 Jan",
          totalOrders: 28,
          scheduledOrders: 20,
          instantOrders: 8,
        },
        {
          date: "2025-01-20",
          dateLabel: "20 Jan",
          totalOrders: 40,
          scheduledOrders: 35,
          instantOrders: 5,
        },
        {
          date: "2025-01-25",
          dateLabel: "25 Jan",
          totalOrders: 55,
          scheduledOrders: 45,
          instantOrders: 10,
        },
        {
          date: "2025-01-30",
          dateLabel: "30 Jan",
          totalOrders: 30,
          scheduledOrders: 22,
          instantOrders: 8,
        },
      ],
      donutChartData: {
        totalOrders: 220,
        segments: [
          {
            status: "RUNNING",
            label: "Berjalan",
            count: 45,
            percentage: 20.45,
          },
          {
            status: "COMPLETED",
            label: "Selesai",
            count: 150,
            percentage: 68.18,
          },
          {
            status: "CANCELLED",
            label: "Dibatalkan",
            count: 25,
            percentage: 11.36,
          },
        ],
      },
    },
    Type: "ORDERS_DATA",
  },
};

export const fetcherDashboardAnalyticsOrders = async (cacheKey) => {
  const [url, params] = cacheKey;

  if (useMockData) {
    return mockAPIResult.data.Data;
  }

  try {
    const result = await fetcherMuatrans.get(url, { params });
    return result?.data?.Data || {}; // Return data or an empty object on failure
  } catch (error) {
    console.error("Error fetching dashboard orders analytics:", error);
    return {}; // Ensure the hook receives an object even on error
  }
};

export const useGetDashboardAnalyticsOrders = (params = {}) => {
  // SWR uses the cacheKey to uniquely identify and cache requests.
  // By including the params object, SWR will automatically re-fetch when the params change.
  const cacheKey = ["/v1/transporter/dashboard/analytics/orders", params];

  const { data, error, isLoading } = useSWR(
    cacheKey,
    fetcherDashboardAnalyticsOrders,
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
