import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Armada alternatif berhasil dimuat",
    },
    Data: {
      alternatives: [
        {
          fleetID: "fleet-alt-001",
          licensePlate: "B5678DEF",
          truckTypeName: "Tronton - Box",
          availableDriver: {
            id: "driver-alt-001",
            name: "Jane Smith",
            driverStatus: "AVAILABLE",
          },
          isCompatible: true,
          availabilityScore: 95,
          estimatedReadyTime: "2025-08-26T07:30:00Z",
        },
        {
          fleetID: "fleet-alt-002",
          licensePlate: "B7777GHI",
          truckTypeName: "Colt Diesel Double - Box",
          availableDriver: {
            id: "driver-alt-002",
            name: "Ahmad Rahman",
            driverStatus: "AVAILABLE",
          },
          isCompatible: true,
          availabilityScore: 88,
          estimatedReadyTime: "2025-08-26T08:00:00Z",
        },
        {
          fleetID: "fleet-alt-003",
          licensePlate: "B4444MNO",
          truckTypeName: "CDD - box",
          availableDriver: {
            id: "driver-alt-003",
            name: "Siti Nurhaliza",
            driverStatus: "AVAILABLE",
          },
          isCompatible: false,
          availabilityScore: 45,
          estimatedReadyTime: "2025-08-26T09:30:00Z",
        },
        {
          fleetID: "fleet-alt-004",
          licensePlate: "B3333PQR",
          truckTypeName: "Tronton - Box",
          availableDriver: {
            id: "driver-alt-004",
            name: "Ahmad Hidayat",
            driverStatus: "AVAILABLE",
          },
          isCompatible: true,
          availabilityScore: 92,
          estimatedReadyTime: "2025-08-26T07:45:00Z",
        },
        {
          fleetID: "fleet-alt-005",
          licensePlate: "B2222STU",
          truckTypeName: "Pickup - Box",
          availableDriver: {
            id: "driver-alt-005",
            name: "Dewi Sartika",
            driverStatus: "AVAILABLE",
          },
          isCompatible: true,
          availabilityScore: 78,
          estimatedReadyTime: "2025-08-26T08:15:00Z",
        },
      ],
    },
    Type: "GET_ALTERNATIVE_FLEETS",
  },
};

/**
 * Mengambil pilihan armada alternatif untuk resolusi konflik
 * @param {string} conflictId - ID konflik jadwal
 * @param {string} search - Pencarian armada (optional)
 * @returns {Promise<Object>} - Data armada alternatif
 */
export const getAlternativeFleetOptions = async (conflictId, search = "") => {
  const useMockData = true; // Set to false to use real API calls

  if (useMockData) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Filter mock data based on search parameter
    let filteredAlternatives = mockAPIResult.data.Data.alternatives;

    if (search && search.trim().length > 0) {
      const searchTerm = search.toLowerCase().trim();
      filteredAlternatives = mockAPIResult.data.Data.alternatives.filter(
        (alternative) =>
          alternative.licensePlate.toLowerCase().includes(searchTerm) ||
          alternative.truckTypeName.toLowerCase().includes(searchTerm) ||
          alternative.availableDriver.name.toLowerCase().includes(searchTerm)
      );
    }

    return {
      ...mockAPIResult.data.Data,
      alternatives: filteredAlternatives,
    };
  }

  // Build query parameters
  const queryParams = new URLSearchParams();
  if (search) {
    queryParams.append("search", search);
  }

  const url = `/v1/transporter/agenda-schedules/conflicts/${conflictId}/alternatives?${queryParams.toString()}`;
  console.log("🌐 Making REAL API call to:", url);
  console.log("📡 Alternative Fleet Options Parameters:", {
    conflictId,
    search,
  });

  try {
    const result = await fetcherMuatrans.get(url);

    console.log("✅ Alternative Fleet Options API call successful:", {
      status: result?.status,
      dataLength: result?.data?.Data?.alternatives?.length || 0,
      timestamp: new Date().toLocaleTimeString(),
    });

    // Log the actual response structure for debugging
    console.log("🔍 Alternative Fleet Options Response Structure:", {
      hasData: !!result?.data,
      hasDataData: !!result?.data?.Data,
      hasAlternatives: !!result?.data?.Data?.alternatives,
      responseKeys: result?.data ? Object.keys(result.data) : [],
      dataKeys: result?.data?.Data ? Object.keys(result.data.Data) : [],
      responseSize: JSON.stringify(result?.data || {}).length,
    });

    // Check if response is empty or has no data
    if (!result?.data || Object.keys(result.data).length === 0) {
      console.log(
        "⚠️ Alternative Fleet Options API returned empty response, using mock data"
      );
      return mockAPIResult.data.Data;
    }

    // Check if response has the expected structure
    if (
      result?.data?.Data?.alternatives &&
      result.data.Data.alternatives.length > 0
    ) {
      return result.data.Data;
    } else if (
      result?.data?.alternatives &&
      result.data.alternatives.length > 0
    ) {
      console.log("🔄 Using alternative response structure: data.alternatives");
      return result.data;
    } else if (result?.data) {
      // Check if data exists but alternatives is empty
      if (
        result.data.Data &&
        (!result.data.Data.alternatives ||
          result.data.Data.alternatives.length === 0)
      ) {
        console.log(
          "⚠️ Alternative Fleet Options API returned empty alternatives, using mock data"
        );
        return mockAPIResult.data.Data;
      }
      console.log("🔄 Using fallback response structure: data directly");
      return result.data;
    } else {
      console.error(
        "❌ Unexpected alternative fleet options response structure:",
        result
      );
      throw new Error(
        "Unexpected response structure from alternative fleet options API"
      );
    }
  } catch (error) {
    console.error("❌ Alternative Fleet Options API call failed:", {
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
 * SWR hook untuk mengambil pilihan armada alternatif
 * @param {string} conflictId - ID konflik jadwal
 * @param {string} search - Pencarian armada
 * @returns {Object} - SWR result dengan data armada alternatif
 */
export const useGetAlternativeFleetOptions = (conflictId, search = "") => {
  const { data, error, isLoading, mutate } = useSWR(
    conflictId ? `alternative-fleet-options/${conflictId}/${search}` : null,
    () => getAlternativeFleetOptions(conflictId, search),
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
