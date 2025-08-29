import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Estimasi jadwal berhasil dimuat",
    },
    Data: {
      currentEstimation: {
        days: 2,
        distanceKm: 121.5,
        durationMinutes: 480,
      },
      scheduleId: "uuid-schedule-123",
      lastUpdated: "2024-04-01T10:30:00Z",
    },
    Type: "GET_SCHEDULE_ESTIMATION",
  },
};

// Fetcher function for getting schedule estimation
export const getScheduleEstimation = async (url) => {
  // Check if mock data should be used
  const useMockData = false; // Temporarily disable mock data for testing

  if (useMockData) {
    console.log("🌐 Making MOCK API call to GET:", url);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return mockAPIResult;
  }

  // Real API call
  console.log("🌐 Making REAL API call to GET:", url);

  try {
    const response = await fetcherMuatrans.get(url);
    console.log("✅ Real API response:", response);
    return response;
  } catch (error) {
    console.error("❌ Real API error:", error);
    throw error;
  }
};

// SWR hook for getting schedule estimation
export const useGetScheduleEstimation = (scheduleId) => {
  return useSWR(
    scheduleId
      ? `/v1/transporter/agenda-schedules/${scheduleId}/estimation`
      : null,
    getScheduleEstimation
  );
};
