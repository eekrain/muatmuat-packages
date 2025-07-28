import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false; // toggle mock data

// Pengembalian Dana Diproses
// 25 Jul 2025 10:07 WIB // requestedAt
// Dana Terkirim
// 25 Jul 2025 10:07 WIB // processedAt

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Refund details retrieved successfully",
    },
    Data: {
      orderId: "550e8400-e29b-41d4-a716-446655440000",
      orderCode: "MT25AA001",
      refundStatus: "REFUND_PROCESSING", // REFUND_PROCESSING || REFUND_COMPLETED
      requestedAt: "2025-02-10T10:00:00Z",
      processedAt: null,
      completedAt: null,
      bankAccount: {
        bankName: "Bank Central Asia",
        accountNumber: "1234567890",
        accountHolderName: "John Doe",
      },
      refundBreakdown: {
        originalAmount: 1500000.0,
        waitingTimeFee: 100000.0,
        penaltyAmount: 225000.0,
        adminFee: 25000.0,
        totalRefundAmount: 1175000.0,
      },
    },
    Type: "REFUND_DETAILS",
  },
};

export const getRefundDetails = async (orderId) => {
  let result;
  if (useMockData) {
    result = mockAPIResult;
  } else {
    result = await fetcherMuatrans.get(`/v1/orders/${orderId}/refund`);
  }

  return result.data?.Data || null;
};

export const useGetRefundDetails = (orderId) => {
  // SWR key includes orderId for cache separation
  return useSWR(orderId ? `/api/v1/orders/${orderId}/refund` : null, () =>
    getRefundDetails(orderId)
  );
};
