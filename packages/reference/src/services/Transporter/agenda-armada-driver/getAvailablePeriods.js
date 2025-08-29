import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Data periode berhasil dimuat",
    },
    Data: {
      availableYears: [2023, 2024, 2025],
      availableMonths: {
        2025: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        2024: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        2023: [10, 11, 12],
      },
      dataRanges: {
        earliest: "2023-10-01",
        latest: "2025-12-31",
      },
    },
    Type: "GET_AVAILABLE_PERIODS",
  },
};

/**
 * Mengambil daftar tahun dan bulan yang memiliki data agenda
 * @param {number} year - Tahun untuk filter bulan (optional)
 * @returns {Promise<Object>} - Data periode yang tersedia
 */
export const getAvailablePeriods = async (year = null) => {
  const useMockData = true; // Set to true to use mock data for development

  if (useMockData) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockAPIResult.data.Data;
  }

  // Build query parameters
  const queryParams = new URLSearchParams();
  if (year) {
    queryParams.append("year", year.toString());
  }

  const url = `/v1/transporter/agenda-schedules/available-periods?${queryParams.toString()}`;
  console.log("🌐 Making REAL API call to:", url);
  console.log("📡 Available Periods Parameters:", { year });

  try {
    const result = await fetcherMuatrans.get(url);

    console.log("✅ Available Periods API call successful:", {
      status: result?.status,
      dataLength: Object.keys(result?.data?.Data?.availableMonths || {}).length,
      timestamp: new Date().toLocaleTimeString(),
    });

    // Log the actual response structure for debugging
    console.log("🔍 Available Periods Response Structure:", {
      hasData: !!result?.data,
      hasDataData: !!result?.data?.Data,
      hasAvailableMonths: !!result?.data?.Data?.availableMonths,
      responseKeys: result?.data ? Object.keys(result.data) : [],
      dataKeys: result?.data?.Data ? Object.keys(result.data.Data) : [],
      responseSize: JSON.stringify(result?.data || {}).length,
    });

    // Check if response is empty or has no data
    if (!result?.data || Object.keys(result.data).length === 0) {
      console.log(
        "⚠️ Available Periods API returned empty response, using mock data"
      );
      return mockAPIResult.data.Data;
    }

    // Check if response has the expected structure
    if (
      result?.data?.Data?.availableMonths &&
      Object.keys(result.data.Data.availableMonths).length > 0
    ) {
      return result.data.Data;
    } else if (
      result?.data?.availableMonths &&
      Object.keys(result.data.availableMonths).length > 0
    ) {
      console.log(
        "🔄 Using alternative response structure: data.availableMonths"
      );
      return result.data;
    } else if (result?.data) {
      // Check if data exists but availableMonths is empty
      if (
        result.data.Data &&
        (!result.data.Data.availableMonths ||
          Object.keys(result.data.Data.availableMonths).length === 0)
      ) {
        console.log(
          "⚠️ Available Periods API returned empty availableMonths, using mock data"
        );
        return mockAPIResult.data.Data;
      }
      console.log("🔄 Using fallback response structure: data directly");
      return result.data;
    } else {
      console.error(
        "❌ Unexpected available periods response structure:",
        result
      );
      throw new Error(
        "Unexpected response structure from available periods API"
      );
    }
  } catch (error) {
    console.error("❌ Available Periods API call failed:", {
      url,
      error: error.message,
      status: error.response?.status,
      timestamp: new Date().toLocaleTimeString(),
    });

    // Fallback to mock data if API fails
    console.log("🔄 Falling back to mock data due to API failure");
    return mockAPIResult.data.Data;
  }
};

/**
 * SWR hook untuk mengambil daftar periode yang tersedia
 * @param {number} year - Tahun untuk filter bulan (optional)
 * @returns {Object} - SWR result dengan data periode yang tersedia
 */
export const useGetAvailablePeriods = (year = null) => {
  const { data, error, isLoading, mutate } = useSWR(
    `available-periods/${year || "all"}`,
    () => getAvailablePeriods(year),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
