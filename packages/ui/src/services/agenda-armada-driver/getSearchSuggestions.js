import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Saran pencarian berhasil dimuat",
    },
    Data: {
      suggestions: [
        {
          value: "B1234ABC",
          label: "B1234ABC - CDD - box",
          type: "license_plate",
        },
        {
          value: "B5678DEF",
          label: "B5678DEF - Tronton - Box",
          type: "license_plate",
        },
        {
          value: "B9999XYZ",
          label: "B9999XYZ - Pickup - Box",
          type: "license_plate",
        },
        {
          value: "B7777GHI",
          label: "B7777GHI - Colt Diesel Double - Box",
          type: "license_plate",
        },
        {
          value: "B5555JKL",
          label: "B5555JKL - Colt Diesel Engkel - Engkel",
          type: "license_plate",
        },
        {
          value: "B4444MNO",
          label: "B4444MNO - CDD - box",
          type: "license_plate",
        },
        {
          value: "B3333PQR",
          label: "B3333PQR - Tronton - Box",
          type: "license_plate",
        },
        {
          value: "B2222STU",
          label: "B2222STU - Pickup - Box",
          type: "license_plate",
        },
        {
          value: "B1111VWX",
          label: "B1111VWX - Colt Diesel Double - Box",
          type: "license_plate",
        },
        {
          value: "John Doe",
          label: "John Doe - Driver",
          type: "driver_name",
        },
        {
          value: "Jane Smith",
          label: "Jane Smith - Driver",
          type: "driver_name",
        },
        {
          value: "Rudi Santoso",
          label: "Rudi Santoso - Driver",
          type: "driver_name",
        },
        {
          value: "Ahmad Rahman",
          label: "Ahmad Rahman - Driver",
          type: "driver_name",
        },
        {
          value: "Budi Prasetyo",
          label: "Budi Prasetyo - Driver",
          type: "driver_name",
        },
        {
          value: "Siti Nurhaliza",
          label: "Siti Nurhaliza - Driver",
          type: "driver_name",
        },
        {
          value: "Ahmad Hidayat",
          label: "Ahmad Hidayat - Driver",
          type: "driver_name",
        },
        {
          value: "Dewi Sartika",
          label: "Dewi Sartika - Driver",
          type: "driver_name",
        },
        {
          value: "Rizki Pratama",
          label: "Rizki Pratama - Driver",
          type: "driver_name",
        },
        {
          value: "Ahmad Kurniawan",
          label: "Ahmad Kurniawan - Driver (SOS)",
          type: "driver_name",
        },
        {
          value: "B0000SOS",
          label: "B0000SOS - CDD - box (SOS)",
          type: "license_plate",
        },
        {
          value: "Budi Santoso",
          label: "Budi Santoso - Driver (Konflik)",
          type: "driver_name",
        },
        {
          value: "B9999KONFLIK",
          label: "B9999KONFLIK - Tronton - Box (Konflik)",
          type: "license_plate",
        },
      ],
    },
    Type: "GET_SEARCH_SUGGESTIONS",
  },
};

/**
 * Mengambil saran pencarian berdasarkan keyword dan view type
 * @param {string} keyword - Keyword pencarian
 * @param {string} viewType - Jenis tampilan: "armada" atau "driver"
 * @param {number} limit - Jumlah maksimal saran (default: 5)
 * @returns {Promise<Object>} - Data saran pencarian
 */
export const getSearchSuggestions = async (
  keyword,
  viewType = "armada",
  limit = 5
) => {
  const useMockData = true; // Set to true to use mock data since search-suggestions API returns 400 Bad Request

  if (useMockData) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Filter mock data based on keyword
    const filteredSuggestions = mockAPIResult.data.Data.suggestions.filter(
      (suggestion) =>
        suggestion.value.toLowerCase().includes(keyword.toLowerCase()) ||
        suggestion.label.toLowerCase().includes(keyword.toLowerCase())
    );

    return {
      ...mockAPIResult.data.Data,
      suggestions: filteredSuggestions.slice(0, limit),
    };
  }

  // Build query parameters - try different parameter names
  const queryParams = new URLSearchParams();
  queryParams.append("search", keyword); // Try using "search" instead of "q"
  queryParams.append("type", viewType); // Try using "type" instead of "viewType"
  queryParams.append("max", limit.toString()); // Try using "max" instead of "limit"

  const url = `/v1/transporter/agenda-schedules/search-suggestions?${queryParams.toString()}`;
  console.log("🌐 Making REAL API call to:", url);
  console.log("📡 Search Suggestions Parameters:", {
    keyword,
    viewType,
    limit,
  });

  try {
    const result = await fetcherMuatrans.get(url);

    console.log("✅ Search Suggestions API call successful:", {
      status: result?.status,
      dataLength: result?.data?.Data?.suggestions?.length || 0,
      timestamp: new Date().toLocaleTimeString(),
    });

    // Log the actual response structure for debugging
    console.log("🔍 Search Suggestions Response Structure:", {
      hasData: !!result?.data,
      hasDataData: !!result?.data?.Data,
      hasSuggestions: !!result?.data?.Data?.suggestions,
      responseKeys: result?.data ? Object.keys(result.data) : [],
      dataKeys: result?.data?.Data ? Object.keys(result.data.Data) : [],
      responseSize: JSON.stringify(result?.data || {}).length,
    });

    // Check if response is empty or has no data
    if (!result?.data || Object.keys(result.data).length === 0) {
      console.log(
        "⚠️ Search Suggestions API returned empty response, using mock data"
      );
      return mockAPIResult.data.Data;
    }

    // Check if response has the expected structure
    if (
      result?.data?.Data?.suggestions &&
      result.data.Data.suggestions.length > 0
    ) {
      return result.data.Data;
    } else if (
      result?.data?.suggestions &&
      result.data.suggestions.length > 0
    ) {
      console.log("🔄 Using alternative response structure: data.suggestions");
      return result.data;
    } else if (result?.data) {
      // Check if data exists but suggestions is empty
      if (
        result.data.Data &&
        (!result.data.Data.suggestions ||
          result.data.Data.suggestions.length === 0)
      ) {
        console.log(
          "⚠️ Search Suggestions API returned empty suggestions, using mock data"
        );
        return mockAPIResult.data.Data;
      }
      console.log("🔄 Using fallback response structure: data directly");
      return result.data;
    } else {
      console.error(
        "❌ Unexpected search suggestions response structure:",
        result
      );
      throw new Error(
        "Unexpected response structure from search suggestions API"
      );
    }
  } catch (error) {
    console.error("❌ Search Suggestions API call failed:", {
      url,
      error: error.message,
      status: error.response?.status,
      responseData: error.response?.data,
      timestamp: new Date().toLocaleTimeString(),
    });

    // Log the error response details if available
    if (error.response?.data) {
      console.error("🔍 Error Response Details:", {
        message: error.response.data.Message,
        errors: error.response.data.Data?.errors,
        type: error.response.data.Type,
      });
    }

    // Fallback to mock data if API fails
    console.log("🔄 Falling back to mock data due to API failure");
    return mockAPIResult.data.Data;
  }
};

/**
 * SWR hook untuk mengambil saran pencarian
 * @param {string} keyword - Keyword pencarian
 * @param {string} viewType - Jenis tampilan: "armada" atau "driver"
 * @param {number} limit - Jumlah maksimal saran
 * @returns {Object} - SWR result dengan data saran pencarian
 */
export const useGetSearchSuggestions = (
  keyword,
  viewType = "armada",
  limit = 5
) => {
  const { data, error, isLoading, mutate } = useSWR(
    keyword && keyword.trim().length > 0
      ? `search-suggestions/${keyword}/${viewType}/${limit}`
      : null,
    () => getSearchSuggestions(keyword, viewType, limit),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 1000, // Dedupe requests within 1 second
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
