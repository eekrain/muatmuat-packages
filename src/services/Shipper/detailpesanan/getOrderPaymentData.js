import { addMinutes } from "date-fns";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true; // toggle mock data

// GET /api/v1/orders/{orderId}/payment
const apiResultPaymentData = {
  data: {
    Message: {
      Code: 200,
      Text: "Order detail retrieved successfully",
    },
    Data: {
      payment: {
        paymentId: "uuid-payment-123",
        method: "va_bca",
        vaNumber: "12345678901234567890",
        amount: 1500000.0,
        status: "PENDING",
        expiredAt: addMinutes(new Date(), 90).toISOString(),
      },
    },
    Type: "PAYMENT_ORDER_DETAIL",
  },
};

export const getOrderPaymentData = async (cacheKey) => {
  const orderId = cacheKey.split("/")[1];

  let result;
  if (useMockData) {
    result = apiResultPaymentData;
  } else {
    result = await fetcherMuatrans
      .get(`v1/orders/${orderId}/payment`)
      .catch((error) => {
        console.log("Error when get order payment data", error);
        return null;
      });
  }

  return result?.data?.Data || null;
};

export const useGetOrderPaymentData = (orderId) =>
  useSWR(`order-payment/${orderId}`, getOrderPaymentData);
