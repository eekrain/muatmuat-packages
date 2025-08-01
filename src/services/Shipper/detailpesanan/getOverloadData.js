// /api/v1/orders/{orderId}/overload
import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false; // toggle mock data

const apiResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Order detail retrieved successfully",
    },
    Data: {
      overload: [
        {
          driverId: "uuid-1",
          name: "hadi",
          licensePlate: "abc",
          weight: 2000,
          weightUnit: "ton",
          overloadFee: 100000,
        },
        {
          driverId: "uuid-2",
          name: "budi",
          licensePlate: "def",
          weight: 1500,
          weightUnit: "ton",
          overloadFee: 75000,
        },
      ],
    },
    Type: "OVERLOAD_ORDER_DETAIL",
  },
};
const normalizeOverloadData = (overloadData) => {
  const transformedOverloadData = overloadData?.map((item) => ({
    driverName: item.name,
    amount: item.overloadFee,
    overloadWeight: `${(item.weight || 0).toLocaleString("id-ID")} ${item.weightUnit || ""}`,
  }));
  return transformedOverloadData || [];
};
export const getOverloadData = async (cacheKey) => {
  const orderId = cacheKey.split("/")[1];

  let result;

  if (useMockData) {
    result = apiResult;
  } else {
    result = await fetcherMuatrans.get(`v1/orders/${orderId}/overload`);
  }
  const data = normalizeOverloadData(result?.data?.Data?.overload);
  return data;
};

export const useGetOverloadData = (orderId) =>
  useSWR(`overload/${orderId}`, getOverloadData);
