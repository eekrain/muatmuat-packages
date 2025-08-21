import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false;

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    success: true,
    Data: {
      history: [
        {
          start_date: "2025-01-02",
          end_date: "2025-02-28",
          searched_at: "2025-01-20T10:00:00Z",
        },
        {
          start_date: "2025-06-02",
          end_date: "2025-08-03",
          searched_at: "2025-01-20T10:00:00Z",
        },
        {
          start_date: "2025-06-04",
          end_date: "2025-08-12",
          searched_at: "2025-01-20T10:00:00Z",
        },
      ],
    },
  },
};

// Fetcher function for period history
export const getPeriodHistory = async (url) => {
  let result;
  if (useMockData) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    result = mockAPIResult;
  } else {
    result = await fetcherMuatrans.get(url);
  }
  return {
    history: result?.data?.Data.history || [],
  };
};

// SWR hook for period history
export const useGetPeriodHistory = () =>
  useSWR(`v1/cs/additional-cost-reports/period-history`, getPeriodHistory);
