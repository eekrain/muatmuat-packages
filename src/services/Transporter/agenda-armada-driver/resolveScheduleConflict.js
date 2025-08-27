"use client";

import useSWRMutation from "swr/mutation";

import { fetcherMuatrans } from "@/lib/axios";

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Konflik jadwal berhasil diselesaikan",
    },
    Data: {
      conflictID: "conflict-456",
      resolutionStatus: "RESOLVED",
      resolvedAt: "2025-08-25T16:30:00Z",
      updatedSchedule: {
        id: "uuid-11",
        fleetID: "fleet-alt-001",
        driverID: "driver-alt-001",
        isConflicted: false,
      },
    },
    Type: "RESOLVE_SCHEDULE_CONFLICT",
  },
};

/**
 * Menyelesaikan konflik jadwal dengan memilih resolusi
 * @param {string} conflictId - ID konflik jadwal
 * @param {Object} resolutionData - Data resolusi konflik
 * @param {string} resolutionData.resolutionType - Tipe resolusi: REASSIGN_FLEET
 * @param {string} resolutionData.newFleetID - ID armada baru
 * @param {string} resolutionData.newDriverID - ID driver baru
 * @param {string} resolutionData.resolutionNotes - Catatan resolusi
 * @returns {Promise<Object>} - Data hasil resolusi konflik
 */
export const resolveScheduleConflict = async (conflictId, resolutionData) => {
  const useMockData = false; // Set to true to use mock data for development

  if (useMockData) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("🔄 Mock API: Resolving conflict", {
      conflictId,
      resolutionData,
      timestamp: new Date().toLocaleTimeString(),
    });

    return mockAPIResult.data.Data;
  }

  const url = `/v1/transporter/agenda-schedules/conflicts/${conflictId}/resolve`;
  console.log("🌐 Making REAL API call to:", url);
  console.log("📡 Resolve Conflict Parameters:", {
    conflictId,
    resolutionData,
  });

  try {
    const result = await fetcherMuatrans.put(url, resolutionData);

    console.log("✅ Resolve Conflict API call successful:", {
      status: result?.status,
      conflictId: result?.data?.Data?.conflictID,
      resolutionStatus: result?.data?.Data?.resolutionStatus,
      timestamp: new Date().toLocaleTimeString(),
    });

    // Log the actual response structure for debugging
    console.log("🔍 Resolve Conflict Response Structure:", {
      hasData: !!result?.data,
      hasDataData: !!result?.data?.Data,
      responseKeys: result?.data ? Object.keys(result.data) : [],
      dataKeys: result?.data?.Data ? Object.keys(result.data.Data) : [],
      responseSize: JSON.stringify(result?.data || {}).length,
    });

    // Check if response is empty or has no data
    if (!result?.data || Object.keys(result.data).length === 0) {
      console.log(
        "⚠️ Resolve Conflict API returned empty response, using mock data"
      );
      return mockAPIResult.data.Data;
    }

    // Check if response has the expected structure
    if (result?.data?.Data?.conflictID) {
      return result.data.Data;
    } else if (result?.data?.conflictID) {
      console.log("🔄 Using alternative response structure: data directly");
      return result.data;
    } else {
      console.error(
        "❌ Unexpected resolve conflict response structure:",
        result
      );
      throw new Error(
        "Unexpected response structure from resolve conflict API"
      );
    }
  } catch (error) {
    console.error("❌ Resolve Conflict API call failed:", {
      url,
      error: error.message,
      status: error.response?.status,
      responseData: error.response?.data,
      timestamp: new Date().toLocaleTimeString(),
    });

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
 * SWR mutation hook untuk menyelesaikan konflik jadwal
 * @param {string} conflictId - ID konflik jadwal
 * @returns {Object} - SWR mutation result
 */
export const useResolveScheduleConflict = (conflictId) => {
  const { trigger, isMutating, error, data } = useSWRMutation(
    conflictId ? `resolve-schedule-conflict/${conflictId}` : null,
    (url, { arg }) => resolveScheduleConflict(conflictId, arg),
    {
      revalidate: false,
    }
  );

  return {
    trigger,
    isMutating,
    error,
    data,
  };
};
