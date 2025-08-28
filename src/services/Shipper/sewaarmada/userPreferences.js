import useSWR from "swr";

import { useSWRMutateHook } from "@/hooks/use-swr";

import { fetcherMuatrans } from "@/lib/axios";

/**
 * Get user preferences for sewaarmada feature
 * @returns {Promise<Object>} User preferences response
 */
export const getUserPreferences = async () => {
  try {
    const response = await fetcherMuatrans.get("/v1/orders/user-preferences");
    return response.data;
  } catch (error) {
    console.error("Error getting user preferences:", error);
    throw error;
  }
};

/**
 * Hook for getting user preferences
 * @returns {Object} SWR hook with user preferences data
 */
export const useGetUserPreferences = () => {
  return useSWR("v1/orders/user-preferences", getUserPreferences);
};

/**
 * Save user preferences for sewaarmada feature
 * @param {Object} preferences - User preferences object
 * @param {boolean} preferences.shouldShowPopup - Whether to show popup
 * @param {string} preferences.language - Language preference
 * @returns {Promise<Object>} Response from API
 */
export const saveUserPreferences = async (preferences) => {
  try {
    const response = await fetcherMuatrans.post(
      "/v1/orders/user-preferences",
      preferences
    );
    return response.data;
  } catch (error) {
    console.error("Error saving user preferences:", error);
    throw error;
  }
};

/**
 * Hook for saving user preferences
 * @returns {Object} SWR mutation hook with trigger function
 */
export const useSaveUserPreferences = () => {
  return useSWRMutateHook("v1/orders/user-preferences", "POST");
};
