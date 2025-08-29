import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true; // Set to false to use real API

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Data periode berhasil dimuat",
    },
    Data: {
      availableMonths: {
        2025: [1, 2, 3, 4, 5, 6, 7, 8],
        2024: [1, 2, 3, 4, 5, 6, 7, 8],
        2023: [10, 11, 12],
      },
      dataRanges: {
        earliest: "2023-10-01",
        latest: "2024-04-30",
      },
    },
    Type: "GET_AVAILABLE_PERIODS",
  },
};

export const getAvailableSchedulePeriods = async () => {
  if (useMockData) {
    // Return mock data for development
    return mockAPIResult.data;
  }

  const result = await fetcherMuatrans.get(
    "v1/transporter/agenda-schedules/available-periods"
  );
  return result.data;
};

export const useGetAvailableSchedulePeriods = () =>
  useSWR("agenda-schedules/available-periods", getAvailableSchedulePeriods);
