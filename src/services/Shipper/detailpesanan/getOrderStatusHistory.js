import { fetcherMuatrans } from "@/lib/axios";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";

// GET /base_url/v1/orders/{orderId}/status-history
const apiResultOrderStatusHistory = {
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
        orderStatus: OrderStatusEnum.LOADING,
        orderStatusTitle: "Proses Muat",
        driverStatus: "MENUJU_KE_LOKASI_MUAT_1",
        driverStatusTitle: "Tiba di Lokasi Muat",
        stepStatus: [
          {
            statusCode: OrderStatusEnum.CONFIRMED,
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
            statusCode: OrderStatusEnum.COMPLETED,
            statusName: "Selesai",
          },
        ],
      },

      {
        driverId: "550e8400-e29b-41d4-a716-446655440022",
        name: "Ardian Eka",
        driverImage: "https://picsum.photos/50",
        licensePlate: "B 1234 CD",
        orderStatus: OrderStatusEnum.LOADING,
        orderStatusTitle: "Proses Muat",
        driverStatus: "MENUJU_KE_LOKASI_MUAT_1",
        driverStatusTitle: "Tiba di Lokasi Muat",
        stepStatus: [
          {
            statusCode: OrderStatusEnum.CONFIRMED,
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
            statusCode: OrderStatusEnum.COMPLETED,
            statusName: "Selesai",
          },
        ],
      },

      {
        driverId: "550e8400-e29b-41d4-a716-446655440023",
        name: "Cakra",
        driverImage: "https://picsum.photos/50",
        licensePlate: "B 1234 CD",
        orderStatus: OrderStatusEnum.LOADING,
        orderStatusTitle: "Proses Muat",
        driverStatus: "MENUJU_KE_LOKASI_MUAT_1",
        driverStatusTitle: "Tiba di Lokasi Muat",
        stepStatus: [
          {
            statusCode: OrderStatusEnum.CONFIRMED,
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
            statusCode: OrderStatusEnum.COMPLETED,
            statusName: "Selesai",
          },
        ],
      },
    ],
  },
  Type: "ORDER_STATUS_HISTORY",
};

export const getOrderStatusHistory = async (cacheKey) => {
  const orderId = cacheKey.split("/")[1];

  // const result = apiResultOrderStatusHistory;

  // return result.Data;

  const result = await fetcherMuatrans.get(
    `v1/orders/${orderId}/status-history`
  );

  return result?.data?.Data || null;
};

export const useGetOrderStatusHistory = (orderId) =>
  useSWR(`order-status-history/${orderId}`, getOrderStatusHistory);
