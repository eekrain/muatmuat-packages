import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false;

export const mockAPIResult = {
  data: {
    Message: { Code: 200, Text: "Status summary berhasil diambil" },
    Data: {
      primaryStatus: {
        statusCode: "LOADING",
        statusName: "Proses Muat",
        statusDescription: "Proses pemuatan barang sedang berlangsung",
        lastUpdated: "2025-08-05T10:30:00Z",
      },
      isMultipleStatus: true,
      statusBreakdown: [
        {
          statusCode: "LOADING",
          statusName: "Proses Muat",
          unitCount: 15,
          percentage: 60.0,
          fleetIds: ["uuid1", "uuid2"],
        },
        {
          statusCode: "WAITING",
          statusName: "Menunggu",
          unitCount: 10,
          percentage: 40.0,
          fleetIds: ["uuid3", "uuid4"],
        },
      ],
      orderChanges: {
        hasChanges: true,
        changeCount: 2,
        lastChangeDateTime: "2025-08-05T09:15:00Z",
        pendingChanges: [
          {
            changeId: "change-uuid-1",
            changeType: "ROUTE_CHANGE",
            changeDescription: "Perubahan rute pengiriman",
            changedAt: "2025-08-05T09:15:00Z",
            isChangeConfirmed: false,
            requiresResponse: true,
          },
        ],
      },
      paymentInfo: {
        paymentStatus: "PENDING",
        paymentMethod: "CREDIT",
        totalPrice: 5000000,
        paymentDue: "2025-08-05T23:59:59Z",
      },
    },
    Type: "STATUS_SUMMARY_SUCCESS",
  },
};

export const fetcherOrderStatusSummary = async (orderId) => {
  if (!orderId) {
    throw new Error("Order ID is required");
  }

  const url = `/api/v1/cs/orders/${orderId}/status-summary`;

  if (useMockData) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockAPIResult.data.Data;
  }

  try {
    const result = await fetcherMuatrans.get(url);

    if (result?.data?.Message?.Code === 200) {
      return result.data.Data || {};
    } else {
      const errorMsg =
        result?.data?.Message?.Text || "Failed to fetch order status summary";
      throw new Error(errorMsg);
    }
  } catch (error) {
    if (error.response) {
      const statusCode = error.response.status;
      const errorMessage = error.response.data?.Message?.Text || "Server error";

      if (statusCode === 400) {
        throw new Error("Invalid order ID format");
      } else if (statusCode === 401) {
        throw new Error("Unauthorized - Please login again");
      } else if (statusCode === 403) {
        throw new Error("Forbidden - Access denied");
      } else if (statusCode === 404) {
        throw new Error("Order not found");
      } else if (statusCode >= 500) {
        throw new Error("Server error - Please try again later");
      } else {
        throw new Error(errorMessage);
      }
    } else if (error.request) {
      throw new Error("Network error - Please check your connection");
    } else {
      throw new Error(error.message || "An unexpected error occurred");
    }
  }
};

export const useGetOrderStatusSummary = (orderId) => {
  const cacheKey = orderId ? `order-status-summary-${orderId}` : null;

  const { data, error, isLoading, mutate } = useSWR(
    cacheKey,
    () => fetcherOrderStatusSummary(orderId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 30000,
    }
  );

  return {
    data,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
};
