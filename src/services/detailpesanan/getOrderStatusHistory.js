// GET /base_url/v1/orders/{orderId}/status-history
const apiResultOrderStatusHistory = {
  Message: {
    Code: 200,
    Text: "Order status history retrieved successfully",
  },
  Data: {
    statusHistory: [
      // {
      //   statusHistoryId: "550e8400-e29b-41d4-a716-446655440020",
      //   statusCode: OrderStatusEnum.CONFIRMED,
      //   statusName: "Pesanan Terkonfirmasi",
      // },
      // {
      //   statusHistoryId: "550e8400-e29b-41d4-a716-446655440021",
      //   statusCode: OrderStatusEnum.LOADING,
      //   statusName: "Proses Muat",
      // },
      // {
      //   statusHistoryId: "550e8400-e29b-41d4-a716-446655440021",
      //   statusCode: "UNLOADING",
      //   statusName: "Proses Bongkar",
      // },
      // {
      //   statusHistoryId: "550e8400-e29b-41d4-a716-446655440021",
      //   statusCode: OrderStatusEnum.PREPARE_DOCUMENT,
      //   statusName: "Dokumen Sedang Disiapkan",
      // },
      // {
      //   statusHistoryId: "550e8400-e29b-41d4-a716-446655440021",
      //   statusCode: OrderStatusEnum.DOCUMENT_DELIVERY,
      //   statusName: "Proses Pengiriman Dokumen",
      // },
      // {
      //   statusHistoryId: "550e8400-e29b-41d4-a716-446655440021",
      //   statusCode: "COMPLETED",
      //   statusName: "Selesai",
      // },
      // {
      //   statusHistoryId: "550e8400-e29b-41d4-a716-446655440021",
      //   statusCode: OrderStatusEnum.CANCELED_BY_SHIPPER,
      //   statusName: "Dibatalkan",
      // },
    ],
    driverStatus: [
      // {
      //   driverId: "550e8400-e29b-41d4-a716-446655440021",
      //   name: "Ahmad Rahman",
      //   driverPhoto: "https://picsum.photos/50",
      //   licensePlate: "B 1234 CD",
      //   statusDriver: "CANCELED_BY_SHIPPER",
      //   statusTitle: "Sedang Bongkar di Lokasi 2",
      //   stepStatus: [
      //     {
      //       statusCode: "MENUJU_LOKASI_MUAT_1",
      //       statusName: "Menuju Lokasi Muat 1",
      //     },
      //     {
      //       statusCode: "MENUJU_LOKASI_MUAT_2",
      //       statusName: "Menuju Lokasi Muat 2",
      //     },
      //     {
      //       statusCode: "MENUJU_LOKASI_BONGKAR_1",
      //       statusName: "Menuju Lokasi Bongkar 1",
      //     },
      //     {
      //       statusCode: "MENUJU_LOKASI_BONGKAR_2",
      //       statusName: "Menuju Lokasi Bongkar 2",
      //     },
      //   ],
      // },
      // {
      //   driverId: "550e8400-e29b-41d4-a716-446655440022",
      //   name: "Ardian Eka",
      //   driverPhoto: "https://picsum.photos/50",
      //   licensePlate: "B 1234 CD",
      //   statusDriver: "LOADING_2",
      //   statusTitle: "Sedang Bongkar di Lokasi 2",
      //   stepStatus: [
      //     {
      //       statusCode: "LOADING_1",
      //       statusName: "Menuju Lokasi Muat 1",
      //     },
      //     {
      //       statusCode: "LOADING_2",
      //       statusName: "Menuju Lokasi Muat 2",
      //     },
      //     {
      //       statusCode: "UNLOADING_1",
      //       statusName: "Menuju Lokasi Bongkar 1",
      //     },
      //     {
      //       statusCode: "UNLOADING_2",
      //       statusName: "Menuju Lokasi Bongkar 2",
      //     },
      //   ],
      // },
    ],
  },
  Type: "ORDER_STATUS_HISTORY",
};

export const getOrderStatusHistory = async (cacheKey) => {
  const orderId = cacheKey.split("/")[1];

  const result = apiResultOrderStatusHistory;

  return result.Data;

  // const result = await fetcherMuatrans.get(
  //   `v1/orders/${orderId}/status-history`
  // );

  // return result?.data?.Data || null;
};

export const useGetOrderStatusHistory = (orderId) =>
  useSWR(`order-status-history/${orderId}`, getOrderStatusHistory);
