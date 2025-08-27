import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Opsi filter berhasil dimuat",
    },
    Data: {
      statusOptions: [
        {
          value: "DIJADWALKAN",
          label: "Dijadwalkan",
          count: 2,
          color: "#FFF9C1",
        },
        {
          value: "BERTUGAS",
          label: "Bertugas",
          count: 2,
          color: "#E2F2FF",
        },
        {
          value: "MENUNGGU_JAM_MUAT",
          label: "Menunggu Jam Muat & Dijadwalkan",
          count: 2,
          color: "#FFE6CC",
        },
        {
          value: "PENGIRIMAN_SELESAI",
          label: "Pengiriman Selesai",
          count: 2,
          color: "#FFFFFF",
        },
        {
          value: "NON_AKTIF",
          label: "Non Aktif",
          count: 1,
          color: "#F5F5F5",
        },
        {
          value: "SOS",
          label: "Urgent Issue & SOS",
          count: 1,
          color: "#FFE6E6",
        },
        {
          value: "KONFLIK",
          label: "Jadwal Bermasalah",
          count: 1,
          color: "#FFF3CD",
        },
      ],
      truckTypeOptions: [
        {
          id: "cdd-box",
          name: "CDD - box",
          count: 2,
        },
        {
          id: "tronton-box",
          name: "Tronton - Box",
          count: 2,
        },
        {
          id: "pickup-box",
          name: "Pickup - Box",
          count: 2,
        },
        {
          id: "colt-diesel-double-box",
          name: "Colt Diesel Double - Box",
          count: 2,
        },
        {
          id: "colt-diesel-engkel-engkel",
          name: "Colt Diesel Engkel - Engkel",
          count: 1,
        },
      ],
    },
    Type: "GET_FILTER_OPTIONS",
  },
};

/**
 * Mengambil opsi filter yang tersedia untuk agenda armada dan driver
 * @param {string} viewType - Jenis tampilan: "armada" atau "driver"
 * @returns {Promise<Object>} - Opsi filter yang tersedia
 */
export const getAgendaFilterOptions = async (viewType = "armada") => {
  const useMockData = false; // Set to false to use real API calls

  if (useMockData) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockAPIResult.data.Data;
  }

  const url = `/v1/transporter/agenda-schedules/filter-options?Id=${viewType}`;
  console.log("🌐 Making REAL API call to:", url);
  console.log("📡 Filter Options Parameters:", { viewType });

  try {
    const result = await fetcherMuatrans.get(url);

    console.log("✅ Filter Options API call successful:", {
      status: result?.status,
      dataLength: result?.data?.Data?.statusOptions?.length || 0,
      timestamp: new Date().toLocaleTimeString(),
    });

    // Log the actual response structure for debugging
    console.log("🔍 Filter Options Response Structure:", {
      hasData: !!result?.data,
      hasDataData: !!result?.data?.Data,
      hasStatusOptions: !!result?.data?.Data?.statusOptions,
      responseKeys: result?.data ? Object.keys(result.data) : [],
      dataKeys: result?.data?.Data ? Object.keys(result.data.Data) : [],
      responseSize: JSON.stringify(result?.data || {}).length,
    });

    // Check if response is empty or has no data
    if (!result?.data || Object.keys(result.data).length === 0) {
      console.log(
        "⚠️ Filter Options API returned empty response, using mock data"
      );
      return mockAPIResult.data.Data;
    }

    // Check if response has the expected structure
    if (
      result?.data?.Data?.statusOptions &&
      result.data.Data.statusOptions.length > 0
    ) {
      return result.data.Data;
    } else if (
      result?.data?.statusOptions &&
      result.data.statusOptions.length > 0
    ) {
      console.log(
        "🔄 Using alternative response structure: data.statusOptions"
      );
      return result.data;
    } else if (result?.data) {
      // Check if data exists but statusOptions is empty
      if (
        result.data.Data &&
        (!result.data.Data.statusOptions ||
          result.data.Data.statusOptions.length === 0)
      ) {
        console.log(
          "⚠️ Filter Options API returned empty statusOptions, using mock data"
        );
        return mockAPIResult.data.Data;
      }
      console.log("🔄 Using fallback response structure: data directly");
      return result.data;
    } else {
      console.error("❌ Unexpected filter options response structure:", result);
      throw new Error("Unexpected response structure from filter options API");
    }
  } catch (error) {
    console.error("❌ Filter Options API call failed:", {
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
 * SWR hook untuk mengambil opsi filter agenda
 * @param {string} viewType - Jenis tampilan: "armada" atau "driver"
 * @returns {Object} - SWR result dengan data filter options
 */
export const useGetAgendaFilterOptions = (viewType = "armada") => {
  const { data, error, isLoading, mutate } = useSWR(
    `agenda-filter-options/${viewType}`,
    () => getAgendaFilterOptions(viewType),
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
