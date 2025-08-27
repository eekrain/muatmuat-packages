import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// --- Configuration ---
// Set to true to use mock data, false for actual API calls.
const useMockData = false;

// --- Mock Data ---
// Mock data for the user's onboarding journey status, matching the new API contract.
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "User journey status retrieved successfully",
    },
    Data: {
      isComplete: true,
      steps: {
        addFleet: {
          isCompleted: true,
          completedAt: "2025-07-21T08:11:15.222Z",
          stepNumber: 1,
        },
        addDriver: {
          isCompleted: true,
          completedAt: "2025-07-21T08:09:17.677Z",
          stepNumber: 2,
        },
        pairFleetDriver: {
          isCompleted: true,
          completedAt: "2025-08-05T14:46:57.836Z",
          stepNumber: 3,
        },
        configureServiceArea: {
          isCompleted: true,
          completedAt: "2025-08-26T09:44:56.534Z",
          stepNumber: 4,
        },
      },
      currentStep: null, // Indicates completion, null if isComplete is true
      progressPercentage: 100,
      userId: "0681f5a7-daf0-4581-b593-9d017c2cfd85",
      transporterId: "0681f5a7-daf0-4581-b593-9d017c2cfd85",
    },
    Type: "GET_USER_JOURNEY_STATUS_SUCCESS",
  },
};

/**
 * Fetcher function for the user journey status.
 * @param {string} _cacheKey - The SWR cache key (unused but required by SWR).
 * @returns {Promise<Object>} The data portion of the API response.
 */
export const fetcherUserJourneyStatus = async (_cacheKey) => {
  const url = "/v1/transporter/user/journey-status";

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

  const { data, error, isLoading, mutate } = useSWR(
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
    mutate,
  };
};
