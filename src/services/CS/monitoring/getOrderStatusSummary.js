import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false; // CS order status summary

// GET /api/v1/cs/orders/{orderId}/status-summary
const apiResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Status summary berhasil diambil",
    },
    Data: {
      primaryStatus: {
        statusCode: "LOADING",
        statusName: "Proses Muat",
        statusDescription:
          "Armada sedang dalam proses memuat barang di lokasi muat",
        lastUpdated: "2025-08-25T10:30:00Z",
      },
      isMultipleStatus: true,
      statusBreakdown: [
        {
          statusCode: "LOADING",
          statusName: "Proses Muat",
          unitCount: 15,
          percentage: 60.0,
          fleetIds: ["fleet-001", "fleet-002", "fleet-003"],
        },
        {
          statusCode: "ON_THE_WAY",
          statusName: "Dalam Perjalanan",
          unitCount: 8,
          percentage: 32.0,
          fleetIds: ["fleet-004", "fleet-005"],
        },
        {
          statusCode: "WAITING",
          statusName: "Menunggu",
          unitCount: 2,
          percentage: 8.0,
          fleetIds: ["fleet-006"],
        },
      ],
      orderChanges: {
        hasChanges: true,
        changeCount: 3,
        lastChangeDateTime: "2025-08-25T09:15:00Z",
        pendingChanges: [
          {
            changeId: "change-001",
            changeType: "ROUTE_CHANGE",
            changeDescription:
              "Perubahan rute pengiriman dari Bandung ke Cirebon",
            changedAt: "2025-08-25T09:15:00Z",
            isChangeConfirmed: false,
            requiresResponse: true,
          },
        ],
      },
      paymentInfo: {
        paymentStatus: "PENDING",
        paymentMethod: "BANK_TRANSFER",
        totalPrice: 15750000.0,
        paymentDue: "2025-08-25T23:59:59Z",
      },
    },
    Type: "STATUS_SUMMARY_SUCCESS",
  },
};

export const getOrderStatusSummary = async (cacheKey) => {
  const orderId = cacheKey.split("/")[1];
  let result;
  if (useMockData) {
    result = apiResult;
  } else {
    result = await fetcherMuatrans.get(
      `v1/cs/orders/${orderId}/status-summary`
    );
  }
  return result?.data?.Data || null;
};

export const useGetOrderStatusSummary = (orderId, options = {}) => {
  const swrOptions = {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0, // Disable auto refresh by default
    ...options,
  };

  return useSWR(
    orderId ? `order-status-summary/${orderId}` : null,
    getOrderStatusSummary,
    swrOptions
  );
};
