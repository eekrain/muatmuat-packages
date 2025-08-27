import useSWRMutation from "swr/mutation";

import { fetcherMuatrans } from "@/lib/axios";

// --- Configuration ---
// Set to true to use mock data, false for actual API calls.
const useMockData = false; // Changed back to false for production

// --- Mock Data ---
// Mock data for the user journey step update response.
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "User journey step updated successfully",
    },
    Data: {
      stepName: "addFleet",
      isCompleted: true,
      completedAt: "2025-01-22T10:30:00Z",
      updatedAt: "2025-01-22T10:30:00Z",
    },
    Type: "UPDATE_USER_JOURNEY_STEP",
  },
};

/**
 * Fetcher function for updating user journey step.
 * @param {string} url - The API endpoint URL.
 * @param {Object} options - SWR options containing the request body.
 * @returns {Promise<Object>} The API response data.
 */
export const updateUserJourneyStep = async (url, { arg }) => {
  if (useMockData) {
    // Return mock data if enabled
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
    throw error;
  }
};

/**
 * SWR mutation hook for updating user journey step.
 * @returns {Object} An object containing the mutation function and state.
 */
export const useUpdateUserJourneyStep = () => {
  return useSWRMutation("update-user-journey-step", (url, { arg }) =>
    updateUserJourneyStep(url, arg)
  );
};
