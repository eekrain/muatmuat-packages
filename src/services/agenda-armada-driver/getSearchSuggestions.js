import useSWR from "swr";
import xior from "xior";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true; // Set to true to use mock data

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

  let result;

  const searchParams = new URLSearchParams({
    query,
    view_type,
    limit: limit.toString(),
  });

  if (useMockData) {
    result = await xior.get(
      `/api/v1/transporter/agenda-schedules/search-suggestion?${searchParams}`
    );
  } else {
    result = fetcherMuatrans.post(
      `/v1/transporter/agenda-schedules/search-suggestion?${searchParams}`
    );
  }

  return result.data?.Data;
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
