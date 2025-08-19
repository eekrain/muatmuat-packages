import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

export const mockPeriodHistory = {
  data: {
    Message: {
      Code: 200,
      Text: "Period history retrieved successfully",
    },
    Data: {
      history: [
        {
          startDate: "2025-01-01",
          endDate: "2025-01-15",
          displayText: "01 Jan 2025 - 15 Jan 2025",
          searchedAt: "2025-01-20T10:00:00Z",
        },
        {
          startDate: "2024-12-01",
          endDate: "2024-12-31",
          displayText: "01 Dec 2024 - 31 Dec 2024",
          searchedAt: "2025-01-01T09:00:00Z",
        },
        {
          startDate: "2024-11-01",
          endDate: "2024-11-15",
          displayText: "01 Nov 2024 - 15 Nov 2024",
          searchedAt: "2024-11-16T12:30:00Z",
        },
      ],
    },
    Type: "PERIOD_HISTORY",
  },
};

export const getPeriodHistory = async (cacheKey) => {
  let result;

  if (useMockData) {
    result = { ...mockPeriodHistory };
  } else {
    result = await fetcherMuatrans.get(
      "/v1/transporter/withdrawals/period-history"
    );
  }

  return {
    history: result?.data?.Data?.history || [],
    raw: result,
  };
};

export const useGetPeriodHistory = () => {
  const { data, error, isLoading } = useSWR(
    "getPeriodHistory",
    getPeriodHistory
  );

  return {
    history: data?.history || [],
    raw: data?.raw,
    isLoading,
    isError: !!error,
  };
};
