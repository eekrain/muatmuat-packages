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
        id: "550e8400-e29b-41d4-a716-446655440001",
        name: "Bak Terbuka",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440002",
        name: "Box",
      },
    ],
    Type: "DASHBOARD_TRANSPORTER_CARRIER_TYPES",
  },
};

/**
 * Fetcher for carrier type filter options.
 * @param {string} url - The API endpoint.
 * @returns {Promise<Array>} A promise that resolves to an array of carrier types.
 */
export const fetcherCarrierTypes = async (url) => {
  if (useMockData) {
    return mockAPIResult.data.Data;
  }
  try {
    const result = await fetcherMuatrans.get(url);
    return result?.data?.Data || []; // Return data or an empty array
  } catch (error) {
    console.error("Error fetching carrier types:", error);
    return []; // Ensure the hook receives an array even on error
  }
};

/**
 * SWR hook to get carrier type options.
 */
export const useGetCarrierTypes = () => {
  const { data, error, isLoading } = useSWR(
    "/v1/transporter/dashboard/analytics/filter/carrier-types",
    fetcherCarrierTypes,
    { revalidateOnFocus: false }
  );

  return {
    data,
    isLoading,
    isError: error,
  };
};
