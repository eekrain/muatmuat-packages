import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false;

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "History periode berhasil diambil",
    },
    Data: {
      periodHistory: [
        {
          startDate: "2024-01-01",
          endDate: "2024-01-31",
          displayText: "01 Jan 2024 - 31 Jan 2024",
          usedAt: "2024-01-15T10:30:00Z",
        },
        {
          startDate: "2023-12-01",
          endDate: "2023-12-31",
          displayText: "01 Des 2023 - 31 Des 2023",
          usedAt: "2024-01-10T14:20:00Z",
        },
        {
          startDate: "2023-11-15",
          endDate: "2023-11-30",
          displayText: "15 Nov 2023 - 30 Nov 2023",
          usedAt: "2024-01-05T09:15:00Z",
        },
      ],
    },
    Type: "PERIOD_FILTER_HISTORY",
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
    periodHistory: result?.data?.Data.periodHistory || [],
  };
};

// SWR hook for period history
export const useGetPeriodHistory = () =>
  useSWR(`v1/cs/canceled-orders/period-history`, getPeriodHistory);
