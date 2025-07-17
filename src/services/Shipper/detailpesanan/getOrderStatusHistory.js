import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";

const stepStatus = [
  {
    statusCode: OrderStatusEnum.SCHEDULED_FLEET,
    statusName: "Pesanan Terkonfirmasi",
  },
  {
    statusCode: OrderStatusEnum.LOADING,
    statusName: "Proses Muat",
  },
  {
    statusCode: OrderStatusEnum.UNLOADING,
    statusName: "Proses Bongkar",
  },
  {
    statusCode: OrderStatusEnum.WAITING_REPAYMENT_1,
    statusName: "Menunggu Pembayaran",
  },
  {
    statusCode: OrderStatusEnum.PREPARE_DOCUMENT,
    statusName: "Dokumen Sedang Disiapkan",
  },
  {
    statusCode: OrderStatusEnum.DOCUMENT_DELIVERY,
    statusName: "Proses Pengiriman Dokumen",
  },
  {
    statusCode: OrderStatusEnum.COMPLETED,
    statusName: "Selesai",
  },
];

// GET /base_url/v1/orders/{orderId}/status-history
const apiResultOrderStatusHistory = {
  data: {
    Message: {
      Code: 200,
      Text: "Order status history retrieved successfully",
    },
    Data: {
      driverStatus: [
        {
          driverId: "550e8400-e29b-41d4-a716-446655440021",
          name: "Hendra",
          driverImage: "https://picsum.photos/50",
          licensePlate: "B 1234 CD",
          orderStatus: OrderStatusEnum.WAITING_REPAYMENT_1,
          orderStatusTitle: "Sedang Muat",
          driverStatus: "SEDANG_MUAT",
          driverStatusTitle: "Sedang Muat",
          stepStatus,
        },

        {
          driverId: "550e8400-e29b-41d4-a716-446655440022",
          name: "Ardian Eka",
          driverImage: "https://picsum.photos/50",
          licensePlate: "B 1234 CD",
          orderStatus: OrderStatusEnum.WAITING_REPAYMENT_1,
          orderStatusTitle: "Proses Muat",
          driverStatus: "MENUJU_KE_LOKASI_MUAT_1",
          driverStatusTitle: "Menuju ke Lokasi Bongkar",
          stepStatus,
        },

        {
          driverId: "550e8400-e29b-41d4-a716-446655440023",
          name: "Cakra",
          driverImage: "https://picsum.photos/50",
          licensePlate: "B 1234 CD",
          orderStatus: OrderStatusEnum.WAITING_REPAYMENT_1,
          orderStatusTitle: "Proses Muat",
          driverStatus: "MENUJU_KE_LOKASI_MUAT_1",
          driverStatusTitle: "Menuju ke Lokasi Bongkar",
          stepStatus,
        },
      ],
    },
    Type: "ORDER_STATUS_HISTORY",
  },
};

export const getOrderStatusHistory = async (cacheKey) => {
  const orderId = cacheKey.split("/")[1];

  // const result = apiResultOrderStatusHistory;

  // return result.data.Data;

  const result = await fetcherMuatrans.get(
    `v1/orders/${orderId}/status-history`
  );

  return result?.data?.Data || null;
};

export const useGetOrderStatusHistory = (orderId) =>
  useSWR(`order-status-history/${orderId}`, getOrderStatusHistory);
