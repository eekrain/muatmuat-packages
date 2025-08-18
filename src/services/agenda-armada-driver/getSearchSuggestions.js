import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

import {
  HARDCODED_DRIVERS,
  HARDCODED_PLATES,
} from "../Transporter/agenda-armada-driver/getAgendaSchedules";

const useMockData = true; // Set to true to use mock data

// Generate mock suggestions based on search query using hardcoded data
const generateMockSuggestions = (query, _viewType = "armada", limit = 5) => {
  const suggestions = [];
  const searchLower = query.toLowerCase();

  // Add matching license plates
  const matchingPlates = HARDCODED_PLATES.filter((plate) =>
    plate.toLowerCase().includes(searchLower)
  );

  matchingPlates.slice(0, Math.ceil(limit / 2)).forEach((plate) => {
    suggestions.push({
      type: "LICENSE_PLATE",
      value: plate, // Keep original format with spaces for proper filtering
      label: plate, // Show only the plate number
      fleetID: `fleet-${plate.toLowerCase().replace(/\s/g, "-")}`,
    });
  });

  // Add matching driver names
  const matchingDrivers = HARDCODED_DRIVERS.filter((driver) =>
    driver.toLowerCase().includes(searchLower)
  );

  matchingDrivers.slice(0, Math.floor(limit / 2) + 1).forEach((driver) => {
    suggestions.push({
      type: "DRIVER_NAME",
      value: driver,
      label: `${driver} - Driver`,
      driverID: `driver-${driver.toLowerCase().replace(/\s/g, "-")}`,
    });
  });

  return suggestions.slice(0, limit);
};
// Mock API result for development/testing - will be generated dynamically
export const getMockAPIResult = (query, viewType, limit) => ({
  data: {
    Message: {
      Code: 200,
      Text: "Saran pencarian berhasil dimuat",
    },
    Data: {
      suggestions: generateMockSuggestions(query, viewType, limit),
      cacheHit: true,
    },
    Type: "GET_SEARCH_SUGGESTIONS",
  },
});

/**
 * Fetches search suggestions for agenda schedules
 * @param {Object} params - Search parameters
 * @param {string} params.query - Search query (min 2 characters)
 * @param {string} params.view_type - View type: 'armada' or 'driver' (default: 'armada')
 * @param {number} params.limit - Maximum suggestions (default: 5)
 * @returns {Promise} API response
 */
export const getSearchSuggestions = async (params) => {
  const { query, view_type = "armada", limit = 5 } = params;

  const searchParams = new URLSearchParams({
    query,
    view_type,
    limit: limit.toString(),
  });

  if (useMockData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getMockAPIResult(query, view_type, limit));
      }, 500); // Reduced timeout for better UX
    });
  }

  return fetcherMuatrans.post(
    `/v1/transporter/agenda-schedules/search-suggestions?${searchParams}`
  );
};

/**
 * SWR hook for getting search suggestions
 * @param {string} query - Search query
 * @param {string} viewType - View type: 'armada' or 'driver'
 * @param {number} limit - Maximum suggestions
 * @returns {Object} SWR response with data, error, isLoading
 */
export const useGetSearchSuggestions = (
  query,
  viewType = "armada",
  limit = 5
) => {
  // Only fetch if query has at least 2 characters
  const shouldFetch = query && query.trim().length >= 2;

  return useSWR(
    shouldFetch ? `search-suggestions/${query}/${viewType}/${limit}` : null,
    () =>
      getSearchSuggestions({ query: query.trim(), view_type: viewType, limit }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 1000, // Dedupe requests within 1 second
    }
  );
};
