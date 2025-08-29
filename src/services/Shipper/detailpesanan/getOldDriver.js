// /api/v1/orders/{orderId}/old-driver/{driverId}
import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";
import { OrderStatusEnum } from "@/lib/constants/Shipper/detailpesanan/detailpesanan.enum";

const useMockData = true;

const apiResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Order detail retrieved successfully",
    },
    Data: {
      driver: {
        driverId: "uuid",
        name: "hadi",
        licensePlate: "abc",
        profileImage: "http",
        phoneNumber: "08123738437",
        orderStatus: OrderStatusEnum.COMPLETED,
        orderStatusTitle: "Proses Muat",
      },
      stepStatus: [
        {
          statusCode: OrderStatusEnum.CONFIRMED,
          statusName: "Pesanan Terkonfirmasi",
        },
        //   {
        //     statusCode: OrderStatusEnum.SCHEDULED_FLEET,
        //     statusName: "Pesanan Terkonfirmasi",
        //   },
        {
          statusCode: OrderStatusEnum.LOADING,
          statusName: "Proses Muat",
        },
        {
          statusCode: OrderStatusEnum.UNLOADING,
          statusName: "Proses Bongkar",
        },
        {
          statusCode: OrderStatusEnum.FLEET_CHANGE,
          statusName: "Proses Pergantian Armada",
        },
        // {
        //   statusCode: OrderStatusEnum.WAITING_REPAYMENT_1,
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
        //   {
        //     statusCode: OrderStatusEnum.CANCELED_BY_SHIPPER,
        //     statusName: "Dibatalkan",
        //   },
      ],
    },
    Type: "OLD_DRIVER",
  },
};

// Fetcher function for old driver detail
export const fetcherOldDriver = async (cacheKey) => {
  const orderId = cacheKey.split("/")[1];
  const driverId = cacheKey.split("/")[2];

  let result;
  if (useMockData) {
    result = apiResult;
  } else {
    result = await fetcherMuatrans.get(
      `/v1/orders/${orderId}/old-driver/${driverId}`
    );
  }
  return result?.data?.Data || null;
};

// SWR hook for old driver detail
export const useGetOldDriver = (orderId, driverId) =>
  useSWR(
    orderId && driverId ? `oldDriver/${orderId}/${driverId}` : null,
    fetcherOldDriver
  );
