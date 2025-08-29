import useSWRMutateHook from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// --- Configuration ---
// Set to true to use mock data, false for actual API calls.
const useMockData = false;

// --- Mock Data ---
// Mock data for SOS reports based on api-kontrak.md
export const mockAPIResult = {
  data: {
    Message: { Code: 200, Text: "SOS reports retrieved successfully" },
    Data: {
      reports: [
        {
          reportId: "SOS-2025-001",
          orderId: "ORD-2025-001234",
          orderNumber: "MTO240122001",
          driverId: "DRV-001",
          driverName: "Ahmad Suryanto",
          customerName: "PT Maju Jaya",
          reportType: "emergency",
          reportDescription: "Kecelakaan ringan di Tol Jakarta-Cikampek KM 25",
          currentLocation: {
            latitude: -6.2088,
            longitude: 106.8456,
            address: "Tol Jakarta-Cikampek KM 25, Bekasi",
          },
          reportedAt: "2025-01-22T14:30:00Z",
          status: "active",
          priority: "high",
        },
        {
          reportId: "SOS-2025-002",
          orderId: "ORD-2025-001235",
          orderNumber: "MTO240122002",
          driverId: "DRV-002",
          driverName: "Budi Santoso",
          customerName: "CV Sejahtera",
          reportType: "emergency",
          reportDescription: "Ban bocor di Jalan Raya Bogor",
          currentLocation: {
            latitude: -6.3588,
            longitude: 106.809,
            address: "Jalan Raya Bogor, Depok",
          },
          reportedAt: "2025-01-22T15:45:00Z",
          status: "resolved",
          priority: "medium",
        },
      ],
      summary: {
        activeReports: 1,
        resolvedReports: 15,
        averageResponseTime: "7 menit",
      },
    },
    Type: "SOS_REPORTS_LIST",
  },
};

/**
 * Fetcher function for SOS reports.
 * The `_cacheKey` parameter is unused but required by SWR.
 * @param {string} _cacheKey - The SWR cache key (unused).
 * @returns {Promise<Object>} The data portion of the API response.
 */
export const fetcherSosReports = async (_cacheKey) => {
  const url = "/api/v1/transporter/alerts/sos-reports";

  if (useMockData) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockAPIResult.data.Data;
  }

  try {
    // Perform the actual API call
    const result = await fetcherMuatrans.get(url);

    // Validate response structure
    if (result?.data?.Message?.Code === 200) {
      return result.data.Data || {};
    } else {
      const errorMsg =
        result?.data?.Message?.Text || "Failed to fetch SOS reports";
      throw new Error(errorMsg);
    }
  } catch (error) {
    // Handle different error types
    if (error.response) {
      const statusCode = error.response.status;
      const errorMessage = error.response.data?.Message?.Text || "Server error";

      if (statusCode === 401) {
        throw new Error("Unauthorized - Please login again");
      } else if (statusCode === 403) {
        throw new Error("Forbidden - Access denied");
      } else if (statusCode === 404) {
        throw new Error("SOS reports not found");
      } else if (statusCode >= 500) {
        throw new Error("Server error - Please try again later");
      } else {
        throw new Error(errorMessage);
      }
    } else if (error.request) {
      throw new Error("Network error - Please check your connection");
    } else {
      throw new Error(error.message || "An unexpected error occurred");
    }
  }
};

/**
 * SWR hook to fetch SOS reports.
 * @returns {Object} An object containing the fetched data, loading state, and error state from useSWRMutateHook.
 */
export const useGetSosReports = () => {
  const cacheKey = "sos-reports";

  const { data, error, isLoading, mutate } = useSWRMutateHook(
    cacheKey,
    fetcherSosReports,
    {
      revalidateOnFocus: false, // Optional: disable re-fetching on window focus
      revalidateOnReconnect: true,
      refreshInterval: 300000, // Refresh every 5 minutes for real-time updates
    }
  );

  return {
    data,
    isLoading,
    isError: !!error,
    error,
    mutate, // Allow manual revalidation
  };
};
