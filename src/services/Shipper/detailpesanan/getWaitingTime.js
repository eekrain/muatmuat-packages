import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false; // toggle mock data

// GET /api/v1/orders/${orderId}/waiting-time
const apiResult = {
  Message: {
    Code: 200,
    Text: "Order detail retrieved successfully",
  },
  Data: {
    waitingTime: [
      {
        id: "9cf101e8-3645-4f72-a707-7e6576117efd",
        driverId: "51e64187-d4cb-4065-9776-7e1224fc6b35",
        name: "Test Driver",
        licensePlate: "B 1234 ABC",
        startWaitingTime: "2025-07-29T13:00:00.000Z",
        endWaitingTime: "2025-07-29T16:00:00.000Z",
        waitingTime: "3.00",
        waitingFee: 300000,
        locationSequence: 1,
        locationType: "PICKUP",
        isMultiLocation: false,
      },
    ],
  },
  Type: "WAITING_TIME_ORDER_DETAIL",
};

const normalizeWaitingTime = (waitingTimeRaw) => {
  const transformedWaitingTime = waitingTimeRaw?.map((item) => {
    const waitingTimeHours = parseFloat(item.waitingTime);
    const formattedWaitingTime =
      waitingTimeHours >= 1
        ? `${waitingTimeHours} Jam`
        : `${Math.round(waitingTimeHours * 60)} Menit`;

    return {
      name: item.name,
      durasiTotal: formattedWaitingTime,
      data: [
        {
          detail: `${item.locationType === "PICKUP" ? "Lokasi Muat" : "Lokasi Bongkar"} ${item.locationSequence} : ${formattedWaitingTime}`,
          startDate: item.startWaitingTime,
          endDate: item.endWaitingTime,
          totalPrice: item.waitingFee,
        },
      ],
    };
  });
  return transformedWaitingTime || [];
};

export const getWaitingTime = async (cacheKey) => {
  const orderId = cacheKey.split("/")[1];
  let result;
  if (useMockData) {
    result = apiResult;
  } else {
    result = await fetcherMuatrans.get(`v1/orders/${orderId}/waiting-time`);
  }
  console.log("🚀 ~ getWaitingTime ~ result:", result);
  const data = normalizeWaitingTime(result?.data?.Data?.waitingTime);
  console.log("🚀 ~ getWaitingTime ~ data:", data);
  return data;
};

export const useGetWaitingTime = (orderId) =>
  useSWR(`waiting-time/${orderId}`, getWaitingTime);
