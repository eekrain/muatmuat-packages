import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// --- Configuration ---
const useMockData = false; // Set to true to use mock data

// --- Mock Data ---
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "OK",
    },
    Data: [
      {
        id: "26ff8b9e-b8cc-40a9-9b9e-a3404752c5fd",
        name: "Colt Diesel Double",
      },
      {
        id: "6a072bae-88c6-4d72-879b-f47de16706d4",
        name: "Colt Diesel Engkel",
      },
    ],
    Type: "DASHBOARD_TRANSPORTER_FLEET_TYPES",
  },
};

/**
 * Fetcher for fleet type filter options.
 * @param {string} url - The API endpoint.
 * @returns {Promise<Array>} A promise that resolves to an array of fleet types.
 */
export const fetcherFleetTypes = async (url) => {
  if (useMockData) {
    return mockAPIResult.data.Data;
  }
  try {
    const result = await fetcherMuatrans.get(url);
    return result?.data?.Data || []; // Return data or an empty array
  } catch (error) {
    console.error("Error fetching fleet types:", error);
    return []; // Ensure the hook receives an array even on error
  }
};

/**
 * SWR hook to get fleet type options.
 */
export const useGetFleetTypes = () => {
  const { data, error, isLoading } = useSWR(
    "/v1/transporter/dashboard/analytics/filter/fleet-types",
    fetcherFleetTypes,
    { revalidateOnFocus: false }
  );

  return {
    data,
    isLoading,
    isError: error,
  };
};
