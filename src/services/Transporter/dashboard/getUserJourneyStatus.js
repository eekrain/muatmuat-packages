import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// Set to true to use mock data, false to make a real API call
const useMockData = true;

// Mock API result based on the provided success response
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "User journey status retrieved successfully",
    },
    Data: {
      addFleetCompleted: true,
      addDriverCompleted: true,
      fleetDriverAssignmentCompleted: false,
      areaSettingCompleted: false,
      allStepsCompleted: false,
      nextStep: "FLEET_DRIVER_ASSIGNMENT",
    },
    Type: "USER_JOURNEY_STATUS",
  },
};

export const fetcherUserJourneyStatus = async (cacheKey) => {
  const url = "/api/v1/user-journey/status";

  if (useMockData) {
    // Return mock data if enabled
    return mockAPIResult.data.Data;
  }

  // Perform the actual API call
  const result = await fetcherMuatrans.get(url);
  return result?.data?.Data || {}; // Return the data or an empty object on failure
};

export const useGetUserJourneyStatus = () => {
  const cacheKey = "user-journey-status";

  return useSWR(cacheKey, fetcherUserJourneyStatus);
};
