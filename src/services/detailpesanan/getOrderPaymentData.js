import { addMinutes } from "date-fns";

// GET /api/v1/orders/{orderId}/payment
const apiResultPaymentData = {
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
};

export const getOrderPaymentData = async (cacheKey) => {
  const orderId = cacheKey.split("/")[1];

  const result = apiResultPaymentData;
  return result.Data;

  // const result = await fetcherMuatrans.get(`v1/orders/${orderId}/payment`);

  // return result?.data?.Data || null;
};

export const useGetOrderPaymentData = (orderId) =>
  useSWR(`order-payment/${orderId}`, getOrderPaymentData);
