// /api/v1/orders/{orderId}/old-driver/{driverId}
import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

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
        orderStatus: "LOADING",
        orderStatusTitle: "Proses Muat",
      },
      stepStatus: [
        {
          statusCode: "CONFIRMED",
          statusName: "Pesanan Terkonfirmasi",
        },
        {
          statusCode: "LOADING",
          statusName: "Proses Muat",
        },
        {
          statusCode: "UNLOADING",
          statusName: "Proses Bongkar",
        },
        {
          statusCode: "COMPLETED",
          statusName: "Selesai",
        },
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
export const useGetOldDriver = (orderId, driverId = "uuid") =>
  useSWR(
    orderId && driverId ? `oldDriver/${orderId}/${driverId}` : null,
    fetcherOldDriver
  );
