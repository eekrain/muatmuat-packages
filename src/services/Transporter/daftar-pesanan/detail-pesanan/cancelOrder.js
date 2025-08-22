import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

export const mockCancelOrder = {
  success: {
    data: {
      Message: {
        Code: 200,
        Text: "Order cancelled successfully",
      },
      Data: {
        orderId: "dcdaf886-56d6-4d84-89d6-a21ec18d0bc1",
        orderCode: "MT25A002A",
        invoiceNumber: "INV/MT25A002A",
        cancelledAt: "2024-10-03T10:30:00.000Z",
        cancelledBy: "transporter",
        cancellationReason: "Kendaraan rusak",
        status: "CANCELLED_BY_TRANSPORTER",
      },
      Type: "/v1/transporter/orders/dcdaf886-56d6-4d84-89d6-a21ec18d0bc1/cancel",
    },
  },
  error: {
    data: {
      Message: {
        Code: 400,
        Text: "Order cannot be cancelled",
      },
      Data: {
        errors: [
          {
            field: "orderStatus",
            message: "Order is already in progress and cannot be cancelled",
          },
        ],
      },
      Type: "/v1/transporter/orders/dcdaf886-56d6-4d84-89d6-a21ec18d0bc1/cancel",
    },
  },
};

export const cancelOrder = async (
  orderId,
  payload = {},
  simulateError = false
) => {
  let result;

  if (useMockData) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    result = simulateError
      ? { ...mockCancelOrder.error }
      : { ...mockCancelOrder.success };
  } else {
    try {
      result = await fetcherMuatrans.post(
        `/v1/transporter/orders/${orderId}/cancel`,
        payload
      );
    } catch (error) {
      return {
        success: false,
        data: error?.response?.data || null,
        error: error?.response?.data?.Message?.Text || "Failed to cancel order",
      };
    }
  }

  return {
    success: result?.data?.Message?.Code === 200,
    data: result?.data?.Data || {},
    message: result?.data?.Message?.Text || "Unknown response",
  };
};
