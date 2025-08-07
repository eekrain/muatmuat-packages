// /api/v1/orders/{orderId}/cancellation-history
import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false; // mock detailpesanan

const apiResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Cancellation history retrieved successfully",
    },
    Data: {
      cancellationId: "550e8400-e29b-41d4-a716-446655440031",
      orderId: "550e8400-e29b-41d4-a716-446655440000",
      cancelledAt: "2025-02-10T10:00:00Z",
      cancelledBy: "Shipper",
      reason: {
        reasonId: "550e8400-e29b-41d4-a716-446655440030",
        reasonName: "Perubahan jadwal mendadak",
        reasonCategory: "CUSTOMER",
        // additionalInfo:
        //   "Kami terpaksa membatalkan pemesanan jasa angkut truk karena terjadi perubahan rencana logistik yang tidak terduga. Terima kasih atas pengertiannya.",
        additionalInfo:
          "Pembayaran tidak dilakukan sampai melewati batas waktu yang telah ditetapkan.",
      },
      hasRefund: true,
      refundStatus: "REFUND_PROCESSING",
    },
    Type: "CANCELLATION_HISTORY",
  },
};

export const getCancellationHistory = async (cacheKey) => {
  const orderId = cacheKey.split("/")[1];

  let result;

  if (useMockData) {
    result = apiResult;
  } else {
    result = await fetcherMuatrans
      .get(`v1/orders/${orderId}/cancellation-history`)
      .catch((error) => {
        console.log("Error when get cancellation history", error);
        return null;
      });
  }

  return result?.data?.Data?.reason ? result?.data?.Data : null;
};

export const useGetCancellationHistory = (orderId) =>
  useSWR(`cancellation-history/${orderId}`, getCancellationHistory);
