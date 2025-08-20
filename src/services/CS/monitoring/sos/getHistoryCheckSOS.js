import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

export const mockSOSHistoryCheck = {
  data: {
    Message: {
      Code: 200,
      Text: "SOS history check completed successfully",
    },
    Data: {
      exists: true,
      totalHistory: 25,
      lastResolvedAt: "2025-08-04T12:15:00Z",
      periodSummary: {
        last7Days: 5,
        last30Days: 15,
        last90Days: 22,
      },
    },
    Type: "SOS_HISTORY_CHECK",
  },
};

export const mockSOSHistoryCheckHighVolume = {
  data: {
    Message: {
      Code: 200,
      Text: "SOS history check completed successfully",
    },
    Data: {
      exists: true,
      totalHistory: 150,
      lastResolvedAt: "2025-08-04T14:30:00Z",
      periodSummary: {
        last7Days: 25,
        last30Days: 85,
        last90Days: 142,
      },
    },
    Type: "SOS_HISTORY_CHECK",
  },
};

export const mockSOSHistoryCheckLowVolume = {
  data: {
    Message: {
      Code: 200,
      Text: "SOS history check completed successfully",
    },
    Data: {
      exists: true,
      totalHistory: 8,
      lastResolvedAt: "2025-08-03T18:45:00Z",
      periodSummary: {
        last7Days: 2,
        last30Days: 6,
        last90Days: 8,
      },
    },
    Type: "SOS_HISTORY_CHECK",
  },
};

export const mockSOSHistoryCheckNoData = {
  data: {
    Message: {
      Code: 200,
      Text: "No SOS history found",
    },
    Data: {
      exists: false,
      totalHistory: 0,
      lastResolvedAt: null,
      periodSummary: {
        last7Days: 0,
        last30Days: 0,
        last90Days: 0,
      },
    },
    Type: "SOS_HISTORY_CHECK",
  },
};

export const getHistoryCheckSOS = async (params = {}) => {
  let result;

  if (useMockData) {
    // Simulate different scenarios based on random selection or params
    const scenarios = [
      { probability: 0.4, data: mockSOSHistoryCheck.data }, // 40% - Normal volume
      { probability: 0.3, data: mockSOSHistoryCheckHighVolume.data }, // 30% - High volume
      { probability: 0.2, data: mockSOSHistoryCheckLowVolume.data }, // 20% - Low volume
      { probability: 0.1, data: mockSOSHistoryCheckNoData.data }, // 10% - No data
    ];

    // Random selection based on probability
    const random = Math.random();
    let cumulativeProbability = 0;

    for (const scenario of scenarios) {
      cumulativeProbability += scenario.probability;
      if (random <= cumulativeProbability) {
        result = scenario.data;
        break;
      }
    }

    // Update timestamp to current time for realistic simulation
    if (result) {
      result.Data = {
        ...result.Data,
        lastResolvedAt: result.Data.lastResolvedAt
          ? new Date(
              Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
            ).toISOString() // Random time within last 7 days
          : null,
      };
    }
  } else {
    try {
      result = await fetcherMuatrans.get(`/v1/cs/sos/history/check`, {
        params,
      });
    } catch (error) {
      // Handle error response
      return {
        data: {
          Message: {
            Code: error.response?.status || 500,
            Text:
              error.response?.data?.Message?.Text ||
              "Failed to check SOS history",
          },
          Data: {
            exists: false,
            totalHistory: 0,
            lastResolvedAt: null,
            periodSummary: {
              last7Days: 0,
              last30Days: 0,
              last90Days: 0,
            },
          },
          Type: "SOS_HISTORY_CHECK_ERROR",
        },
        raw: error.response,
      };
    }
  }

  return {
    data: result?.data || {},
    raw: result,
  };
};

export const useGetHistoryCheckSOS = (params = {}) => {
  const { data, error, isLoading, mutate } = useSWR(
    [`getHistoryCheckSOS`, params],
    () => getHistoryCheckSOS(params),
    {
      refreshInterval: 300000, // Refresh every 5 minutes for history data
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      errorRetryInterval: 10000,
    }
  );

  return {
    data: data?.data || {},
    raw: data?.raw,
    isLoading,
    isError: !!error,
    mutate, // Expose mutate for manual refresh
  };
};
