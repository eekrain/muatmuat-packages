import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false; // mock detailpesanan

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Payment timer retrieved successfully",
    },
    Data: {
      paymentDueDateTime: "2025-02-08T15:00:00Z",
      currentServerTime: "2025-02-08T10:30:00Z",
      remainingTimeSeconds: 16200,
      isExpired: false,
      paymentMethod: "va_bca",
      amount: 1500000.0,
    },
    Type: "PAYMENT_TIMER",
  },
};

export const getPaymentTimer = async (cacheKey) => {
  const orderId = cacheKey.split("/")[1];

  let result;

  if (useMockData) {
    result = mockAPIResult;
  } else {
    result = await fetcherMuatrans.get(`v1/payments/payment-timer/${orderId}`);
  }

  return result?.data?.Data;
};

export const useGetPaymentTimer = (orderId) =>
  useSWR(`payment-timer/${orderId}`, getPaymentTimer);
