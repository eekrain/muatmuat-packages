import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

export const mockSOSStatusCheck = {
  data: {
    Message: {
      Code: 200,
      Text: "SOS status check completed successfully",
    },
    Data: {
      exists: true,
      activeCount: 5,
      inProgressCount: 3,
      openCount: 2,
    },
    Type: "SOS_CHECK",
  },
};

export const mockSOSStatusCheckNoData = {
  data: {
    Message: {
      Code: 200,
      Text: "No active SOS reports found",
    },
    Data: {
      exists: false,
      activeCount: 0,
      inProgressCount: 0,
      openCount: 0,
    },
    Type: "SOS_CHECK",
  },
};

export const getStatusCheckSOS = async (params = {}) => {
  let result;

  if (useMockData) {
    // Simulate different scenarios based on params or random selection
    const hasActiveSOS = Math.random() > 0.3; // 70% chance of having active SOS

    if (hasActiveSOS) {
      result = mockSOSStatusCheck;
    } else {
      result = mockSOSStatusCheckNoData;
    }
  } else {
    try {
      result = await fetcherMuatrans.get(`/v1/cs/sos/check`, {
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
              "Failed to retrieve SOS status",
          },
          Data: {
            exists: false,
            activeCount: 0,
            inProgressCount: 0,
            openCount: 0,
          },
          Type: "SOS_CHECK_ERROR",
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

export const useGetStatusCheckSOS = (params = {}) => {
  const { data, error, isLoading, mutate } = useSWR(
    [`getStatusCheckSOS`, params],
    () => getStatusCheckSOS(params),
    {
      refreshInterval: 30000, // Refresh every 30 seconds for real-time SOS monitoring
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
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
