import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false;

export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Order count by status retrieved successfully",
    },
    Data: {
      statusCounts: {
        all: 48,
        needsChangeResponse: 5,
        needsReadyConfirmation: 8,
        needsFleetAssignment: 12,
      },
      lastUpdated: "2024-01-15T08:30:00Z",
    },
    Type: "GET_ORDER_COUNT_BY_STATUS",
  },
};

export const getOrdersCountByStatus = async (url) => {
  let result;
  if (useMockData) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    result = mockAPIResult;
  } else {
    result = await fetcherMuatrans.get(url);
  }
  return {
    statusCounts: result?.data?.Data?.statusCounts || {},
  };
};

export const useGetOrdersCountByStatus = (userId) =>
  useSWR(
    userId ? `v1/transporter/orders/count-by-status?userId=${userId}` : null,
    getOrdersCountByStatus
  );
