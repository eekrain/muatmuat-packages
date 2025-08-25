import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// --- Configuration ---
// Set to true to use mock data, false for actual API calls.
const useMockData = true;

// --- Mock Data ---

// Mock data for a successful response.
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Top 10 fleets with top 3 carriers retrieved successfully",
    },
    Data: {
      hasData: true,
      items: [
        {
          rank: 1,
          fleetType: "Colt Diesel Engkel",
          logo: "/icons/dashboard/truck-box.svg",
          topCarriers: [
            { rank: 1, carrierType: "Box", orderCount: 120 },
            { rank: 2, carrierType: "Bak Terbuka", orderCount: 118 },
            { rank: 3, carrierType: "Towing", orderCount: 115 },
          ],
        },
        {
          rank: 2,
          fleetType: "Fuso",
          logo: "/icons/dashboard/truck-box.svg",
          topCarriers: [
            { rank: 1, carrierType: "Bak Terbuka", orderCount: 110 },
            { rank: 2, carrierType: "Box", orderCount: 95 },
            { rank: 3, carrierType: "Losbak", orderCount: 80 },
          ],
        },
        {
          rank: 3,
          fleetType: "Tronton",
          logo: "/icons/dashboard/truck-box.svg",
          topCarriers: [
            { rank: 1, carrierType: "Wingbox", orderCount: 105 },
            { rank: 2, carrierType: "Bak Terbuka", orderCount: 90 },
            { rank: 3, carrierType: "Flatbed", orderCount: 75 },
          ],
        },
        {
          rank: 4,
          fleetType: "Pick-up",
          logo: "/icons/dashboard/truck-box.svg",
          topCarriers: [
            { rank: 1, carrierType: "Bak", orderCount: 98 },
            { rank: 2, carrierType: "Box", orderCount: 85 },
            { rank: 3, carrierType: "3 way", orderCount: 70 },
          ],
        },
        {
          rank: 5,
          fleetType: "Colt Diesel Double",
          logo: "/icons/dashboard/truck-box.svg",
          topCarriers: [
            { rank: 1, carrierType: "Box", orderCount: 92 },
            { rank: 2, carrierType: "Bak", orderCount: 88 },
            { rank: 3, carrierType: "Towing", orderCount: 65 },
          ],
        },
        {
          rank: 6,
          fleetType: "Van",
          logo: "/icons/dashboard/truck-box.svg",
          topCarriers: [
            { rank: 1, carrierType: "Box", orderCount: 85 },
            { rank: 2, carrierType: "Penumpang", orderCount: 78 },
            { rank: 3, carrierType: "Pendingin", orderCount: 62 },
          ],
        },
        {
          rank: 7,
          fleetType: "Container",
          logo: "/icons/dashboard/truck-box.svg",
          topCarriers: [
            { rank: 1, carrierType: "20 Feet", orderCount: 81 },
            { rank: 2, carrierType: "40 Feet", orderCount: 77 },
            { rank: 3, carrierType: "High Cube", orderCount: 59 },
          ],
        },
        {
          rank: 8,
          fleetType: "Trailer",
          logo: "/icons/dashboard/truck-box.svg",
          topCarriers: [
            { rank: 1, carrierType: "Flatbed", orderCount: 76 },
            { rank: 2, carrierType: "Lowbed", orderCount: 71 },
            { rank: 3, carrierType: "Telescopic", orderCount: 55 },
          ],
        },
        {
          rank: 9,
          fleetType: "L300",
          logo: "/icons/dashboard/truck-box.svg",
          topCarriers: [
            { rank: 1, carrierType: "Bak", orderCount: 72 },
            { rank: 2, carrierType: "Box", orderCount: 68 },
            { rank: 3, carrierType: "Pick-up", orderCount: 51 },
          ],
        },
        {
          rank: 10,
          fleetType: "Blind Van",
          logo: "/icons/dashboard/truck-box.svg",
          topCarriers: [
            { rank: 1, carrierType: "Standard", orderCount: 65 },
            { rank: 2, carrierType: "Kaca", orderCount: 60 },
            { rank: 3, carrierType: "Kargo", orderCount: 48 },
          ],
        },
      ],
    },
    Type: "TOP10_FLEET_TOP3_CARRIER",
  },
};

// Mock data for a response where NO data is available.
export const mockAPIResultWithoutData = {
  data: {
    Message: {
      Code: 200,
      Text: "No data available for the selected period",
    },
    Data: {
      hasData: false,
      items: [],
    },
    Type: "TOP10_FLEET_TOP3_CARRIER",
  },
};

/**
 * Fetcher function for the Top 10 Fleets and Top 3 Carriers analytics data.
 * @param {Array} cacheKey - The SWR cache key, containing the URL and query parameters.
 * @returns {Promise<Object>} The data portion of the API response.
 */
export const fetchTop10FleetTop3Carrier = async (cacheKey) => {
  const [url, params] = cacheKey;

  if (useMockData) {
    // Return mock data for development.
    // To test the empty state, you can switch this to mockAPIResultWithoutData.
    return mockAPIResult.data.Data;
  }

  try {
    const result = await fetcherMuatrans.get(url, { params });
    // Ensure we return a consistent shape even if the API response is unexpected.
    return result?.data?.Data || { hasData: false, items: [] };
  } catch (error) {
    console.error("Error fetching top fleets and carriers analytics:", error);
    // Return a default empty state on error to prevent UI crashes.
    return { hasData: false, items: [] };
  }
};

/**
 * SWR hook to fetch Top 10 Fleets with their Top 3 Carriers for the dashboard.
 * @param {Object} params - The query parameters for the API request (e.g., { period: 'month' }).
 * @returns {{data: Object, isLoading: boolean, isError: any}} An object containing the fetched data, loading state, and error state.
 */
export const useGetTop10FleetTop3Carrier = (params = {}) => {
  // The cache key uniquely identifies the data request for SWR.
  const cacheKey = ["/v1/dashboard/analytics/top-fleets-carriers", params];

  const { data, error, isLoading } = useSWR(
    cacheKey,
    fetchTop10FleetTop3Carrier,
    {
      revalidateOnFocus: false, // Optional: disable re-fetching on window focus for better performance.
    }
  );

  return {
    data,
    isLoading,
    isError: error,
  };
};
