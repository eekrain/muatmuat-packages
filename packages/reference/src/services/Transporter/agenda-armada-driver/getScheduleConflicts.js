import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Data konflik jadwal berhasil dimuat",
    },
    Data: {
      conflicts: [
        {
          id: "conflict-456",
          conflictType: "TIME_OVERLAP",
          resolutionStatus: "PENDING",
          primarySchedule: {
            agendaStatus: "DIJADWALKAN",
            estimatedDistanceKm: 45.8,
            id: "uuid-11",
            orderCode: "ORD-133",
            fleetLicensePlate: "B9999KONFLIK",
            driverName: "Budi Santoso",
            unloadingName: "Tasikmalaya, Kec. Cihideung",
            loadingName: "Cimahi, Kec. Cimahi Tengah",
            scheduledTime: "2025-08-26T08:00:00Z",
          },
          conflictingSchedule: {
            agendaStatus: "MENUNGGU_JAM_MUAT",
            estimatedDistanceKm: 80.5,
            id: "uuid-3",
            orderCode: "ORD-125",
            fleetLicensePlate: "B9999XYZ",
            driverName: "Rudi Santoso",
            unloadingName: "Probolinggo, Kec. Wonoasih",
            loadingName: "Malang, Kec. Klojen",
            scheduledTime: "2025-08-26T07:00:00Z",
          },
          detectedAt: "2025-08-25T15:30:00Z",
        },
        {
          id: "conflict-789",
          conflictType: "DRIVER_OVERLAP",
          resolutionStatus: "PENDING",
          primarySchedule: {
            agendaStatus: "BERTUGAS",
            estimatedDistanceKm: 25.5,
            id: "uuid-10",
            orderCode: "ORD-132",
            fleetLicensePlate: "B0000SOS",
            driverName: "Ahmad Kurniawan",
            unloadingName: "Karawang, Kec. Karawang Barat",
            loadingName: "Bekasi, Kec. Bekasi Utara",
            scheduledTime: "2025-08-25T10:00:00Z",
          },
          conflictingSchedule: {
            agendaStatus: "BERTUGAS",
            estimatedDistanceKm: 121.5,
            id: "uuid-1",
            orderCode: "ORD-123",
            fleetLicensePlate: "B1234ABC",
            driverName: "John Doe",
            unloadingName: "Bali, Kec. Denpasar",
            loadingName: "Surabaya, Kec. Pabean",
            scheduledTime: "2025-08-24T08:00:00Z",
          },
          detectedAt: "2025-08-24T12:15:00Z",
        },
      ],
    },
    Type: "GET_SCHEDULE_CONFLICTS",
  },
};

/**
 * Mengambil daftar konflik jadwal yang terdeteksi
 * @param {string} resolutionStatus - Status resolusi: PENDING/RESOLVED (default: PENDING)
 * @returns {Promise<Object>} - Data konflik jadwal
 */
export const getScheduleConflicts = async (resolutionStatus = "PENDING") => {
  const useMockData = false; // Set to true to use mock data for development

  if (useMockData) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Filter mock data based on resolution status
    const filteredConflicts = mockAPIResult.data.Data.conflicts.filter(
      (conflict) => conflict.resolutionStatus === resolutionStatus
    );

    return {
      ...mockAPIResult.data.Data,
      conflicts: filteredConflicts,
    };
  }

  // Build query parameters
  const queryParams = new URLSearchParams();
  if (resolutionStatus) {
    queryParams.append("resolution_status", resolutionStatus);
  }

  const url = `/v1/transporter/agenda-schedules/conflicts?${queryParams.toString()}`;
  console.log("🌐 Making REAL API call to:", url);
  console.log("📡 Schedule Conflicts Parameters:", { resolutionStatus });

  try {
    const result = await fetcherMuatrans.get(url);

    console.log("✅ Schedule Conflicts API call successful:", {
      status: result?.status,
      dataLength: result?.data?.Data?.conflicts?.length || 0,
      timestamp: new Date().toLocaleTimeString(),
    });

    // Log the actual response structure for debugging
    console.log("🔍 Schedule Conflicts Response Structure:", {
      hasData: !!result?.data,
      hasDataData: !!result?.data?.Data,
      hasConflicts: !!result?.data?.Data?.conflicts,
      responseKeys: result?.data ? Object.keys(result.data) : [],
      dataKeys: result?.data?.Data ? Object.keys(result.data.Data) : [],
      responseSize: JSON.stringify(result?.data || {}).length,
    });

    // Check if response is empty or has no data
    if (!result?.data || Object.keys(result.data).length === 0) {
      console.log(
        "⚠️ Schedule Conflicts API returned empty response, using mock data"
      );
      return mockAPIResult.data.Data;
    }

    // Check if response has the expected structure
    if (
      result?.data?.Data?.conflicts &&
      result.data.Data.conflicts.length > 0
    ) {
      return result.data.Data;
    } else if (result?.data?.conflicts && result.data.conflicts.length > 0) {
      console.log("🔄 Using alternative response structure: data.conflicts");
      return result.data;
    } else if (result?.data) {
      // Check if data exists but conflicts is empty
      if (
        result.data.Data &&
        (!result.data.Data.conflicts || result.data.Data.conflicts.length === 0)
      ) {
        console.log(
          "⚠️ Schedule Conflicts API returned empty conflicts, using mock data"
        );
        return mockAPIResult.data.Data;
      }
      console.log("🔄 Using fallback response structure: data directly");
      return result.data;
    } else {
      console.error(
        "❌ Unexpected schedule conflicts response structure:",
        result
      );
      throw new Error(
        "Unexpected response structure from schedule conflicts API"
      );
    }
  } catch (error) {
    console.error("❌ Schedule Conflicts API call failed:", {
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
 * SWR hook untuk mengambil daftar konflik jadwal
 * @param {string} resolutionStatus - Status resolusi: PENDING/RESOLVED
 * @returns {Object} - SWR result dengan data konflik jadwal
 */
export const useGetScheduleConflicts = (resolutionStatus = "PENDING") => {
  const { data, error, isLoading, mutate } = useSWR(
    `schedule-conflicts/${resolutionStatus}`,
    () => getScheduleConflicts(resolutionStatus),
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
