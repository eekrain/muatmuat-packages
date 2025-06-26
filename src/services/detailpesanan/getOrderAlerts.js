import { fetcherMuatrans } from "@/lib/axios";

// GET /api/v1/orders/{orderId}/alerts
const apiResult = {
  Message: {
    code: 200,
    text: "Success",
  },
  Data: {
    alerts: [
      {
        type: "DELIVERY_DELAY",
        date: "2025-05-21T14:30:00+07:00",
        label: "Harap tunjukan QR Code ke pihak driver",
        info: "QR Code diperlukan agar driver dapat melanjutkan proses muat atau bongkar barang.",
      },
    ],
  },
  Type: "ORDER_ALERTS",
};

export const getOrderAlerts = async (cacheKey) => {
  const orderId = cacheKey.split("/")[1];
  // const result = apiResult;
  // return result.data;

  const result = await fetcherMuatrans.get(`v1/orders/${orderId}/alerts`);

  return result?.data?.Data || [];
};

export const useGetOrderAlerts = (orderId) =>
  useSWR(`order-alerts/${orderId}`, getOrderAlerts);
