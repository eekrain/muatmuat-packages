// GET /api/v1/orders/{orderId}/alerts
const apiResult = {
  data: {
    Message: {
      code: 200,
      text: "Success",
    },
    Data: {
      alerts: [
        {
          type: "DELIVERY_DELAY",
          date: "2025-05-21T14:30:00+07:00",
          label: "Pengembalian dana sedang dalam proses.",
          info: "Pengembalian dana sedang dalam proses, jumlah dana akan disesuakan setelah dikurangi <b>Admin Pembatalan</b> dan <b>Tambahan Biaya</b>. Info lebih lanjut hubungi Customer Service.",
        },
      ],
    },
    Type: "ORDER_ALERTS",
  },
};

export const getOrderAlerts = async (cacheKey) => {
  const orderId = cacheKey.split("/")[1];
  const result = apiResult;
  // return result.data.Data.alerts;
  return [];

  // const result = await fetcherMuatrans.get(`v1/orders/${orderId}/alerts`);

  // return result?.data?.Data?.alerts || [];
};

export const useGetOrderAlerts = (orderId) =>
  useSWR(`order-alerts/${orderId}`, getOrderAlerts);
