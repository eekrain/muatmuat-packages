import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false;

// Mock API result for development/testing
export const mockAPIResult = {
  Message: {
    Code: 200,
    Text: "OK",
  },
  Data: {
    statusCounts: {
      all: 11,
      waitingPayment: 7,
      awaitingSettlement: 0,
      documentProcess: 0,
    },
    lastUpdated: "2025-08-11T02:32:21.148Z",
  },
  Type: "/v1/orders/count-by-status",
};

// Fetcher function for count by status
export const getCountByStatus = async (url) => {
  let result;
  if (useMockData) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    result = mockAPIResult;
  } else {
    result = await fetcherMuatrans.get(url);
  }
  return result?.data?.Data.statusCounts || {};
};

// SWR mutation hook
export const useGetCountByStatus = (defaultPage) =>
  useSWR(defaultPage ? "v1/orders/count-by-status" : null, getCountByStatus);
