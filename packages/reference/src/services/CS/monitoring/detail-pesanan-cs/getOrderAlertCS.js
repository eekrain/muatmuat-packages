import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true; // cs detailpesanan

// GET /api/v1/cs/orders/{orderId}/alerts
const apiResult = {
  data: {
    Message: {
      code: 200,
      text: "Success",
    },
    Data: {
      alerts: [
        // {
        //   type: "TRANSPORTER_CANCEL_ORDER",
        //   date: "2025-06-01T10:00:00+07:00",
        //   label: "Transporter membatalkan pesanan.",
        //   data: null,
        // },
        // {
        //   type: "TRANSPORTER_CHANGE_ARMADA",
        //   date: "2025-06-01T10:00:00+07:00",
        //   label:
        //     "PT. Siba Surya (Transporter) melakukan perubahan armada pada pesanan.",
        //   data: { transporter: "PT. Siba Surya (Transporter)" }, // data yg dipake buat replace setelah translasi "... melakukan perubahan armada pada pesanan."
        // },
        // {
        //   type: "ARMADA_NOT_ENOUGH",
        //   date: "2025-06-01T10:00:00+07:00",
        //   label:
        //     "<strong>6 dari 9</strong> armada belum terpenuhi. Segera konfirmasi ke transporter atau tugaskan pengganti.",
        //   data: { has: 6, from: 9 },
        // },
        {
          type: "ARMADA_NOT_ENOUGH",
          date: "2025-06-01T10:00:00+07:00",
          label:
            "Permintaan perubahan telah dikirim. Tunggu konfirmasi dari transporter lama dan baru, atau hubungi transporter terkait untuk mempercepat proses. Armada yang masuk daftar permintaan jasa angkut memerlukan persetujuan GM muatrans",
          data: null,
        },
      ],
    },
    Type: "ORDER_ALERTS",
  },
};

export const getOrderAlertsCS = async (cacheKey) => {
  const orderId = cacheKey.split("/")[1];
  let result;
  if (useMockData) {
    result = apiResult;
  } else {
    result = await fetcherMuatrans.get(`v1/orders/${orderId}/alerts`);
  }
  return result?.data?.Data?.alerts || [];
};

export const useGetOrderAlertsCS = (orderId) =>
  useSWR(`order-alerts/${orderId}`, getOrderAlertsCS);
