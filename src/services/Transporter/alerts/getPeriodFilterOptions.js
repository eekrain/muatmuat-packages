import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// --- Configuration ---
// Set to true to use mock data, false for actual API calls.
const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

// --- Mock Data ---
// Mock data for period filter options
export const mockAPIResult = {
  data: {
    Message: { Code: 200, Text: "Period filter options retrieved" },
    Data: {
      periodOptions: [
        { value: "today", label: "Hari Ini", selected: false },
        { value: "week", label: "Minggu Ini", selected: false },
        { value: "month", label: "Bulan Ini", selected: false },
        { value: "custom", label: "Pilih Periode", selected: false },
      ],
      customPeriodModal: {
        title: "Pilih Periode",
        startDatePlaceholder: "Pilih tanggal mulai",
        endDatePlaceholder: "Pilih tanggal akhir",
        applyButtonText: "Terapkan",
        cancelButtonText: "Batal",
      },
    },
    Type: "PERIOD_FILTER_OPTIONS",
  },
};

/**
 * Fetcher function for period filter options.
 * The `_cacheKey` parameter is unused but required by SWR.
 * @param {string} _cacheKey - The SWR cache key (unused).
 * @returns {Promise<Object>} The data portion of the API response.
 */
export const fetcherPeriodFilterOptions = async (_cacheKey) => {
  const url = "/api/v1/transporter/alerts/new-reviews/period-filter";

  if (useMockData) {
    // Simulate network delay for mock data
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
        result?.data?.Message?.Text || "Failed to fetch period filter options";
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
        throw new Error("Period filter options not found");
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
 * SWR hook to fetch period filter options.
 * @returns {Object} An object containing the fetched data, loading state, and error state from useSWR.
 */
export const useGetPeriodFilterOptions = () => {
  const cacheKey = "period-filter-options";

  const { data, error, isLoading, mutate } = useSWR(
    cacheKey,
    fetcherPeriodFilterOptions,
    {
      revalidateOnFocus: false, // Optional: disable re-fetching on window focus
      revalidateOnReconnect: true,
      refreshInterval: 0, // No auto refresh
    }
  );

  return {
    data,
    isLoading,
    isError: error,
    mutate, // For manual revalidation
  };
};
