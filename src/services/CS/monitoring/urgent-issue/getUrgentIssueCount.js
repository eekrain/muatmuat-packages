import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";
import { fetcherMuatransCS } from "@/lib/fetcherBasicAuth";

const useMockData = false;
const useMuatransFetcher = true; // true: use fetcherMuatrans, false: use fetcherMuatransCS (basic auth)

// Mock API result for development/testing
export const mockUrgentIssueCount = {
  data: {
    Data: {
      new_count: 15,
      process_count: 8,
      completed_count: 25,
      total_active: 23,
      has_new: true,
      blinking_required: true,
      counter_display: "23",
    },
  },
};

// Fetcher function for urgent issue count
export const getUrgentIssueCount = async () => {
  let result;
  if (useMockData) {
    result = mockUrgentIssueCount;
  } else {
    if (useMuatransFetcher) {
      result = await fetcherMuatrans.get("/v1/cs/urgent-issues/count");
    } else {
      result = await fetcherMuatransCS.get("/v1/cs/urgent-issues/count");
    }
  }

  return result?.data?.Data;
};

// SWR hook for urgent issue count
export const useGetUrgentIssueCount = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "urgent-issue-count",
    getUrgentIssueCount,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  return {
    data: data,
    isLoading,
    isError: !!error,
    mutate,
  };
};
