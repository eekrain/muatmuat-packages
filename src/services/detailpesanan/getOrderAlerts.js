// GET /api/v1/orders/{orderId}/alerts
const apiResult = {
  message: {
    code: 200,
    text: "Success",
  },
  data: {
    alerts: [
      {
        type: "DELIVERY_DELAY",
        date: "2025-05-21T14:30:00+07:00",
        label: "Harap tunjukan QR Code ke pihak driver",
        info: "QR Code diperlukan agar driver dapat melanjutkan proses muat atau bongkar barang.",
      },
    ],
  },
  type: "ORDER_ALERTS",
};

export const getOrderAlerts = async (cacheKey) => {
  const orderId = cacheKey.split("/")[1];
  const result = apiResult;
  return result.data;
};

export const useGetOrderAlerts = (orderId) =>
  useSWR(orderId ? `order-alerts/${orderId}` : null, getOrderAlerts);
