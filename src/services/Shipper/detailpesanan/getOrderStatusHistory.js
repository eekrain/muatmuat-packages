import { fetcherMuatrans } from "@/lib/axios";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";

const useMockData = false; // toggle mock data

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
  // {
  //   statusCode: OrderStatusEnum.UNLOADING,
  //   statusName: "Menunggu Pelunasan",
  // },
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
  // {
  //   statusCode: OrderStatusEnum.CANCELED_BY_SHIPPER,
  //   statusName: "Dibatalkan",
  // },
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
          orderStatus: OrderStatusEnum.LOADING,
          orderStatusTitle: "Sedang Muat",
          driverStatus: "SEDANG_MUAT",
          driverStatusTitle: "Antri di lokasi muat",
          stepStatus,
        },
        // {
        //   driverId: "550e8400-e29b-41d4-a716-446655440022",
        //   name: "Ardian Eka",
        //   driverImage: "https://picsum.photos/50",
        //   licensePlate: "B 1234 CD",
        //   orderStatus: OrderStatusEnum.UNLOADING,
        //   orderStatusTitle: "Proses Muat",
        //   driverStatus: "MENUJU_KE_LOKASI_MUAT_1",
        //   driverStatusTitle: "Proses Muat",
        //   stepStatus,
        // },
        // {
        //   driverId: "550e8400-e29b-41d4-a716-446655440023",
        //   name: "Cakra",
        //   driverImage: "https://picsum.photos/50",
        //   licensePlate: "B 1234 CD",
        //   orderStatus: OrderStatusEnum.UNLOADING,
        //   orderStatusTitle: "Proses Muat",
        //   driverStatus: "MENUJU_KE_LOKASI_MUAT_1",
        //   driverStatusTitle: "Proses Muat",
        //   stepStatus,
        // },
      ],
    },
    Type: "ORDER_STATUS_HISTORY",
  },
};

export const getOrderStatusHistory = async (cacheKey) => {
  const orderId = cacheKey.split("/")[1];

  let result;
  if (useMockData) {
    result = apiResultOrderStatusHistory;
  } else {
    result = await fetcherMuatrans.get(`v1/orders/${orderId}/status-history`);
  }

  return result?.data?.Data || null;
};

export const useGetOrderStatusHistory = (orderId) =>
  useSWR(`order-status-history/${orderId}`, getOrderStatusHistory);
