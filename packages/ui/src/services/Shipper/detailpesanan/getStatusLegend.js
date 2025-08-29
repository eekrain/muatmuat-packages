import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";
import { OrderStatusEnum } from "@/lib/constants/Shipper/detailpesanan/detailpesanan.enum";

const useMockData = false; // mock detailpesanan

// GET /base_url/v1/orders/{orderId}/status-legend
const apiResultStatusLegend = {
  data: {
    Message: {
      code: 200,
      text: "Success",
    },
    Data: {
      statusLegend: [
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
        //   statusCode: OrderStatusEnum.FLEET_CHANGE,
        //   statusName: "Proses Pergantian Armada",
        // },
        // {
        //   statusCode: OrderStatusEnum.WAITING_REPAYMENT_2,
        //   statusName: "Proses Pergantian Armada",
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

  let result;
  if (useMockData) {
    result = apiResultStatusLegend;
  } else {
    result = await fetcherMuatrans.get(`v1/orders/${orderId}/status-legend`);
  }

  return result?.data?.Data?.statusLegend || [];
};

export const useGetStatusLegend = (orderId) =>
  useSWR(`status-legend/${orderId}`, getStatusLegend);
