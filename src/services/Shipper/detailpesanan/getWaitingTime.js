import { intervalToDuration, parseISO } from "date-fns";
import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false; // mock detailpesanan

// GET /api/v1/orders/${orderId}/waiting-time
const apiResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Order detail retrieved successfully",
    },
    Data: {
      waitingTime: [
        {
          id: "9cf101e8-3645-4f72-a707-7e6576117efd",
          driverId: "51e64187-d4cb-4065-9776-7e1224fc6b35",
          name: "Eka",
          licensePlate: "B 1234 ABC",
          startWaitingTime: "2025-08-11T13:00:00.000Z",
          endWaitingTime: "2025-08-11T13:55:00.000Z", // Renders as "0 Jam 55 Menit"
          waitingTime: "0.25",
          waitingFee: 300000,
          locationSequence: 1,
          locationType: "PICKUP",
          isMultiLocation: false,
        },
        {
          id: "9cf101e8-3645-4f72-a707-7e6576117efd",
          driverId: "51e64187-d4cb-4065-9776-7e1224fc6b35",
          name: "Cakra",
          licensePlate: "B 1234 ABC",
          startWaitingTime: "2025-07-29T13:00:00.000Z",
          endWaitingTime: "2025-07-29T15:00:00.000Z", // Renders as "2 Jam 0 Menit"
          waitingTime: "0.9",
          waitingFee: 300000,
          locationSequence: 1,
          locationType: "PICKUP",
          isMultiLocation: false,
        },
      ],
    },
    Type: "WAITING_TIME_ORDER_DETAIL",
  },
};

const normalizeWaitingTime = (waitingTimeRaw) => {
  if (!waitingTimeRaw) {
    return [];
  }

  return waitingTimeRaw.map((item) => {
    const startDate = parseISO(item.startWaitingTime);
    const endDate = parseISO(item.endWaitingTime);
    const duration = intervalToDuration({ start: startDate, end: endDate });

    // Unconditionally format the string as "hh Jam mm Menit"
    const formattedWaitingTime = `${duration.hours || 0} Jam ${duration.minutes || 0} Menit`;

    return {
      name: item.name,
      licensePlate: item.licensePlate,
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
};

export const getWaitingTime = async (cacheKey) => {
  const orderId = cacheKey.split("/")[1];
  let result;
  if (useMockData) {
    result = apiResult;
  } else {
    result = await fetcherMuatrans.get(`v1/orders/${orderId}/waiting-time`);
  }
  const data = normalizeWaitingTime(result?.data?.Data?.waitingTime);
  return data;
};

export const useGetWaitingTime = (orderId) =>
  useSWR(`waiting-time/${orderId}`, getWaitingTime);
