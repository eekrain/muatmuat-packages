import useSWRMutation from "swr/mutation";

import { fetcherMuatrans } from "@/lib/axios";

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Estimasi berhasil diperbarui",
    },
    Data: {
      scheduleID: "uuid-schedule-123",
      previousEstimation: {
        distanceKm: 121.5,
        durationMinutes: 480,
      },
      newEstimation: {
        distanceKm: 125.0,
        durationMinutes: 500,
      },
      lastRecalculated: "2024-04-01T11:15:00Z",
    },
    Type: "UPDATE_SCHEDULE_ESTIMATION",
  },
};

// Fetcher function for updating schedule estimation
export const updateScheduleEstimation = async (url, { arg }) => {
  // Check if mock data should be used
  const useMockData = false; // Temporarily disable mock data for testing

  if (useMockData) {
    console.log("🌐 Making MOCK API call to PUT:", url);
    console.log("📤 Request body:", arg);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return mockAPIResult;
  }

  // Real API call
  console.log("🌐 Making REAL API call to PUT:", url);
  console.log("📤 Request body:", arg);

  try {
    const response = await fetcherMuatrans.put(url, arg);
    console.log("✅ Real API response:", response);
    return response;
  } catch (error) {
    console.error("❌ Real API error:", error);

    // Log detailed error information
    if (error.response) {
      console.error("❌ Error response status:", error.response.status);
      console.error("❌ Error response data:", error.response.data);
      console.error("❌ Error response headers:", error.response.headers);
    } else if (error.request) {
      console.error("❌ No response received:", error.request);
    } else {
      console.error("❌ Error setting up request:", error.message);
    }

    throw error;
  }
};

// SWR mutation hook for updating schedule estimation
export const useUpdateScheduleEstimation = (scheduleId) => {
  return useSWRMutation(
    `/v1/transporter/agenda-schedules/${scheduleId}/estimation`,
    updateScheduleEstimation
  );
};
