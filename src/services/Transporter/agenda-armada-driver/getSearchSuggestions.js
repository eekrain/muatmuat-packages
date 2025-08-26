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
          type: "LICENSE_PLATE",
          value: "B1234ABC",
          label: "B 1234 ABC - Box Truck",
          fleetID: "uuid-1",
          matchCount: 3,
        },
        {
          type: "LICENSE_PLATE",
          value: "B5678DEF",
          label: "B 5678 DEF - Tronton - Box",
          fleetID: "uuid-2",
          matchCount: 2,
        },
        {
          type: "LICENSE_PLATE",
          value: "B9999XYZ",
          label: "B 9999 XYZ - Pickup - Box",
          fleetID: "uuid-3",
          matchCount: 1,
        },
        {
          type: "DRIVER_NAME",
          value: "John Doe",
          label: "John Doe - Driver",
          driverID: "driver-1",
          matchCount: 2,
        },
        {
          type: "DRIVER_NAME",
          value: "Jane Smith",
          label: "Jane Smith - Driver",
          driverID: "driver-2",
          matchCount: 1,
        },
        {
          type: "DRIVER_NAME",
          value: "Rudi Santoso",
          label: "Rudi Santoso - Driver",
          driverID: "driver-3",
          matchCount: 1,
        },
        {
          type: "LICENSE_PLATE",
          value: "B0000SOS",
          label: "B 0000 SOS - CDD - box (SOS)",
          fleetID: "uuid-sos",
          matchCount: 1,
        },
        {
          type: "LICENSE_PLATE",
          value: "B9999KONFLIK",
          label: "B 9999 KONFLIK - Tronton - Box (Konflik)",
          fleetID: "uuid-konflik",
          matchCount: 1,
        },
      ],
      cacheHit: true,
    },
    Type: "GET_SEARCH_SUGGESTIONS",
  },
};

/**
 * Mengambil saran pencarian berdasarkan keyword dan view type
 * @param {string} query - Keyword pencarian (min 2 karakter)
 * @param {string} viewType - Jenis tampilan: "armada" atau "driver"
 * @param {number} limit - Jumlah maksimal saran (default: 5)
 * @returns {Promise<Object>} - Data saran pencarian
 */
export const getSearchSuggestions = async (
  query,
  viewType = "armada",
  limit = 5
) => {
  const useMockData = false; // Set to false to hit real API

  if (useMockData) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Filter mock data based on query
    const filteredSuggestions = mockAPIResult.data.Data.suggestions.filter(
      (suggestion) =>
        suggestion.value.toLowerCase().includes(query.toLowerCase()) ||
        suggestion.label.toLowerCase().includes(query.toLowerCase())
    );

    return {
      ...mockAPIResult.data.Data,
      suggestions: filteredSuggestions.slice(0, limit),
    };
  }

  // Build query parameters according to API contract
  const queryParams = new URLSearchParams();
  queryParams.append("query", query); // Use "query" as per API contract
  queryParams.append("view_type", viewType); // Use "view_type" as per API contract
  queryParams.append("limit", limit.toString()); // Use "limit" as per API contract

  const url = `/v1/transporter/agenda-schedules/search-suggestions?${queryParams.toString()}`;
  console.log("🌐 Making REAL API call to:", url);
  console.log("📡 Search Suggestions Parameters:", {
    query,
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
 * @param {string} query - Keyword pencarian (min 2 karakter)
 * @param {string} viewType - Jenis tampilan: "armada" atau "driver"
 * @param {number} limit - Jumlah maksimal saran
 * @returns {Object} - SWR result dengan data saran pencarian
 */
export const useGetSearchSuggestions = (
  query,
  viewType = "armada",
  limit = 5
) => {
  const { data, error, isLoading, mutate } = useSWR(
    query && query.trim().length >= 2
      ? `search-suggestions/${query}/${viewType}/${limit}`
      : null,
    () => getSearchSuggestions(query, viewType, limit),
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
