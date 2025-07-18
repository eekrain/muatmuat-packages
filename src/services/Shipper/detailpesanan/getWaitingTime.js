import { fetcherMuatrans } from "@/lib/axios";

const IS_MOCK = false;

// GET /api/v1/orders/${orderId}/waiting-time
const apiResult = {
  Message: {
    Code: 200,
    Text: "Order detail retrieved successfully",
  },
  Data: {
    waitingTime: [
      {
        driverId: "uuid",
        name: "hadi",
        licensePlate: "abc",
        startWaitingTime: "raw date",
        endWaitingTime: "raw date",
        waitingTime: 100,
        waitingFee: 100000,
      },
    ],
  },
  Type: "WAITING_TIME_ORDER_DETAIL",
};

export const getWaitingTime = async (cacheKey) => {
  const orderId = cacheKey.split("/")[1];
  let result;
  if (IS_MOCK) {
    result = apiResult;
  } else {
    result = await fetcherMuatrans.get(`v1/orders/${orderId}/waiting-time`);
  }

  return result?.data?.Data?.waitingTime || [];
};

export const useGetWaitingTime = (orderId) =>
  useSWR(`waiting-time/${orderId}`, getWaitingTime);
