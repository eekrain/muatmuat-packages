import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// --- Configuration ---
// Set to true to use mock data, false for actual API calls.
const useMockData = true;

// --- Mock Data ---
// Mock data for the user's onboarding journey status.
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
      allStepsCompleted: true, // This can be toggled to test different UI states
      nextStep: "COMPLETED", // ENUM: ADD_FLEET, ADD_DRIVER, FLEET_DRIVER_ASSIGNMENT, AREA_SETTING, COMPLETED
    },
    Type: "USER_JOURNEY_STATUS",
  },
};

/**
 * Fetcher function for the user journey status.
 * The `_cacheKey` parameter is unused but required by SWR.
 * @param {string} _cacheKey - The SWR cache key (unused).
 * @returns {Promise<Object>} The data portion of the API response.
 */
export const fetcherUserJourneyStatus = async (_cacheKey) => {
  const url = "/api/v1/user-journey/status";

  if (useMockData) {
    // Return mock data if enabled
    return mockAPIResult.data.Data;
  }

  try {
    // Perform the actual API call
    const result = await fetcherMuatrans.get(url);
    return result?.data?.Data || {}; // Return the data or an empty object on failure
  } catch (error) {
    console.error("Error fetching user journey status:", error);
    return {}; // Ensure the hook receives an object even on error
  }
};

/**
 * SWR hook to fetch the user's onboarding journey status.
 * @returns {Object} An object containing the fetched data, loading state, and error state from useSWR.
 */
export const useGetUserJourneyStatus = () => {
  const cacheKey = "user-journey-status";

  const { data, error, isLoading } = useSWR(
    cacheKey,
    fetcherUserJourneyStatus,
    {
      revalidateOnFocus: false, // Optional: disable re-fetching on window focus
    }
  );

  return {
    data,
    isLoading,
    isError: error,
  };
};
