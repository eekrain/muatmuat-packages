import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// Mock API result for development/testing
export const mockAPIResult = {
  Data: {
    message: {
      code: 200,
      text: "Success",
    },
    Data: {
      instantOrder: {
        minHoursFromNow: 1,
        maxDaysFromNow: 1,
      },
      scheduledOrder: {
        minDaysFromNow: 24,
        maxDaysFromNow: 30,
      },
      loadingTime: {
        minRangeHours: 1,
        maxRangeHours: 8,
      },
      waitingTime: {
        toleranceHours: 12,
        hourlyRate: 50000,
      },
      currentServerTime: "2025-05-21T12:30:00+07:00",
    },
    type: "GET_ORDER_SETTINGS_TIME",
  },
};

/**
 * Fetch order settings time from API
 * @returns {Promise<Object>} API response
 */
export const getOrderSettingsTime = async () => {
  try {
    const response = await fetcherMuatrans.get("/v1/orders/settings/time");
    return response.data;
  } catch (error) {
    console.error("Error fetching order settings time:", error);
    throw error;
  }
};

/**
 * SWR hook for order settings time
 * @returns {Object} SWR response
 */
export const useGetOrderSettingsTime = () => {
  return useSWR("v1/orders/settings/time", getOrderSettingsTime);
};
