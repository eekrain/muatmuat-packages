import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";

// GET /base_url/v1/orders/{orderId}/status-legend
const apiResultStatusLegend = {
  data: {
    Message: {
      code: 200,
      text: "Success",
    },
    Data: {
      statusLegend: [
        // {
        //   statusCode: OrderStatusEnum.CONFIRMED,
        //   statusName: "Pesanan Terkonfirmasi",
        // },
        {
          statusCode: OrderStatusEnum.SCHEDULED_FLEET,
          statusName: "Armada Dijadwalkan",
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
        //   statusCode: OrderStatusEnum.WAITING_REPAYMENT_1,
        //   statusName: "Menunggu Pelunasan",
        // },
        // {
        //   statusCode: OrderStatusEnum.PREPARE_DOCUMENT,
        //   statusName: "Dokumen Sedang Disiapkan",
        // },
        // {
        //   statusCode: OrderStatusEnum.DOCUMENT_DELIVERY,
        //   statusName: "Proses Pengiriman Dokumen",
        // },
        {
          statusCode: OrderStatusEnum.COMPLETED,
          statusName: "Selesai",
        },
        // {
        //   statusCode: OrderStatusEnum.CANCELED_BY_SHIPPER,
        //   statusName: "Dibatalkan",
        // },
      ],
    },
    Type: "STATUS_LEGEND",
  },
};

export const getStatusLegend = async (cacheKey) => {
  const orderId = cacheKey.split("/")[1];

  await new Promise((resolve) => setTimeout(resolve, 1000));
  const result = apiResultStatusLegend;
  return result?.data?.Data?.statusLegend || [];

  // const result = await fetcherMuatrans.get(
  //   `v1/orders/${orderId}/status-legend`
  // );

  // return result?.data?.Data?.statusLegend || [];
};

export const useGetStatusLegend = (orderId) =>
  useSWR(`status-legend/${orderId}`, getStatusLegend);
