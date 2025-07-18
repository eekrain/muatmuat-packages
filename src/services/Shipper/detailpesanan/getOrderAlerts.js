import { fetcherMuatrans } from "@/lib/axios";

const useMockData_getOrderAlerts = false;
// GET /api/v1/orders/{orderId}/alerts
const apiResult = {
  data: {
    Message: {
      code: 200,
      text: "Success",
    },
    Data: {
      alerts: [
        // {
        //   type: "REMINDER_REPAYMENT_ORDER",
        //   date: "2025-06-01T10:00:00+07:00",
        //   label:
        //     "Pesanan Anda memiliki tambahan biaya. Mohon selesaikan pembayaran sebelum tanggal <b>18 Juni 2024</b>.",
        //   info: "",
        // },
        // {
        //   type: "WAITING_TIME_CHARGE",
        //   date: "2025-06-02T10:00:00+07:00",
        //   label: "Driver kamu akan dikenakan biaya waktu tunggu.",
        //   info: "",
        // },
        // {
        //   type: "SHOW_QRCODE_DRIVER",
        //   date: "2025-06-03T10:00:00+07:00",
        //   label: "Harap tunjukkan QR Code ke pihak driver",
        //   info: "QR Code diperlukan agar driver dapat melanjutkan proses muat atau bongkar barang.",
        // },
        // {
        //   type: "REFUND_IN_PROCESS",
        //   date: "2025-06-04T10:00:00+07:00",
        //   label: "Pengembalian dana sedang dalam proses.",
        //   info: "Pengembalian dana sedang dalam proses, jumlah dana akan disesuakan setelah dikurangi <b>Admin Pembatalan</b> dan <b>Tambahan Biaya</b>. Info lebih lanjut hubungi Customer Service.",
        // },
        // {
        //   type: "REFUND_COMPLETED",
        //   date: "2025-06-05T10:00:00+07:00",
        //   label: "Pengembalian dana berhasil diproses.",
        //   info: "Proses pengembalian dana telah berhasil dicairkan ke rekening kamu. Info lebih lanjut hubungi Customer Service.",
        // },
        // {
        //   type: "ORDER_CHANGES_CONFIRMATION",
        //   date: "2025-06-06T10:00:00+07:00",
        //   label: "Perubahan pesanan telah kamu lakukan.",
        //   info: "",
        // },
        // {
        //   type: "CONFIRMATION_WAITING_PREPARE_FLEET",
        //   date: "2025-06-07T10:00:00+07:00",
        //   label:
        //     "Mohon konfirmasi pesanan ini dikarenakan kami membutuhkan waktu lebih lama untuk mempersiapkan armada.",
        //   info: "",
        // },
      ],
    },
    Type: "ORDER_ALERTS",
  },
};

export const getOrderAlerts = async (cacheKey) => {
  const orderId = cacheKey.split("/")[1];
  let result;
  if (useMockData_getOrderAlerts) {
    result = apiResult;
  } else {
    result = await fetcherMuatrans.get(`v1/orders/${orderId}/alerts`);
  }
  return result?.data?.Data?.alerts || [];
};

export const useGetOrderAlerts = (orderId) =>
  useSWR(`order-alerts/${orderId}`, getOrderAlerts);
