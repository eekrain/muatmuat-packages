import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "User journey status retrieved successfully",
    },
    Data: {
      addFleetCompleted: true,
      addDriverCompleted: true,
      fleetDriverAssignmentCompleted: true,
      areaSettingCompleted: true,
      allStepsCompleted: true, // set to true to display Analytics, set False
      nextStep: "FLEET_DRIVER_ASSIGNMENT", // ENUM: ADD_FLEET, ADD_DRIVER, FLEET_DRIVER_ASSIGNMENT, AREA_SETTING, COMPLETED
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
