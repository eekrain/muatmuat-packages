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
          name: "Driver 1",
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
          name: "Driver 1",
          licensePlate: "B 1234 ABC",
          startWaitingTime: "2025-07-29T13:00:00.000Z",
          endWaitingTime: "2025-07-29T15:00:00.000Z", // Renders as "2 Jam 0 Menit"
          waitingTime: "0.9",
          waitingFee: 300000,
          locationSequence: 1,
          locationType: "PICKUP",
          isMultiLocation: false,
        },
        {
          id: "9cf101e8-3645-4f72-a707-7e6576117efd",
          driverId: "51e64187-d4cb-4065-9776-7e1224fc6b35",
          name: "Driver 1",
          licensePlate: "B 1234 ABC",
          startWaitingTime: "2025-07-29T13:00:00.000Z",
          endWaitingTime: "2025-07-29T16:00:00.000Z",
          waitingTime: "3.00",
          waitingFee: 300000,
          locationSequence: 1,
          locationType: "DROPOFF",
          isMultiLocation: false,
        },
        {
          id: "9cf101e8-3645-4f72-a707-7e6576117efd",
          driverId: "51e64187-d4cb-4065-9776-7e1224fc6b35",
          name: "Driver 1",
          licensePlate: "B 1234 ABC",
          startWaitingTime: "2025-07-29T13:00:00.000Z",
          endWaitingTime: "2025-07-29T16:00:00.000Z",
          waitingTime: "3.00",
          waitingFee: 300000,
          locationSequence: 1,
          locationType: "PICKUP",
          isMultiLocation: false,
        },
        {
          id: "9cf101e8-3645-4f72-a707-7e6576117efd",
          driverId: "51e64187-d4cb-5176-9776-7e1224fc6b35",
          name: "Driver 2",
          licensePlate: "B 1234 DEF",
          startWaitingTime: "2025-07-29T13:00:00.000Z",
          endWaitingTime: "2025-07-29T16:00:00.000Z",
          waitingTime: "1.00",
          waitingFee: 100000,
          locationSequence: 1,
          locationType: "DROPOFF",
          isMultiLocation: false,
        },
        {
          id: "9cf101e8-3645-4f72-a707-7e6576117efd",
          driverId: "51e64187-d4cb-5176-9776-7e1224fc6b35",
          name: "Driver 2",
          licensePlate: "B 1234 DEF",
          startWaitingTime: "2025-07-29T13:00:00.000Z",
          endWaitingTime: "2025-07-29T16:00:00.000Z",
          waitingTime: "1.00",
          waitingFee: 100000,
          locationSequence: 1,
          locationType: "DROPOFF",
          isMultiLocation: false,
        },
        {
          id: "9cf101e8-3645-4f72-a707-7e6576117efd",
          driverId: "51e64187-d4cb-6287-9776-7e1224fc6b35",
          name: "Driver 3",
          licensePlate: "B 1234 GHI",
          startWaitingTime: "2025-07-29T13:00:00.000Z",
          endWaitingTime: "2025-07-29T16:00:00.000Z",
          waitingTime: "1.00",
          waitingFee: 100000,
          locationSequence: 1,
          locationType: "PICKUP",
          isMultiLocation: false,
        },
        {
          id: "9cf101e8-3645-4f72-a707-7e6576117efd",
          driverId: "51e64187-d4cb-6287-9776-7e1224fc6b35",
          name: "Driver 3",
          licensePlate: "B 1234 GHI",
          startWaitingTime: "2025-07-29T13:00:00.000Z",
          endWaitingTime: "2025-07-29T16:00:00.000Z",
          waitingTime: "1.00",
          waitingFee: 100000,
          locationSequence: 1,
          locationType: "DROPOFF",
          isMultiLocation: false,
        },
      ],
    },
    Type: "WAITING_TIME_ORDER_DETAIL",
  },
};

const formatMinutesToHoursAndMinutes = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return minutes > 0 ? `${hours} Jam ${minutes} Menit` : `${hours} Jam`;
  }
  return `${minutes} Menit`;
};

const normalizeWaitingTime = (waitingTimeRaw) => {
  // Group data by driverId to handle multiple locations per driver
  const groupedByDriver =
    waitingTimeRaw?.reduce((acc, item) => {
      const driverId = item.driverId;
      if (!acc[driverId]) {
        acc[driverId] = {
          id: `driver-${driverId}`,
          driverId: item.driverId,
          name: item.name,
          licensePlate: item.licensePlate,
          charges: [],
        };
      }

      acc[driverId].charges.push({
        startWaitingTime: item.startWaitingTime,
        endWaitingTime: item.endWaitingTime,
        waitingTime: item.waitingTime,
        waitingFee: item.waitingFee,
        locationSequence: item.locationSequence,
        locationType: item.locationType,
      });

      return acc;
    }, {}) || {};

  // Convert grouped data back to array format like kode-2
  const driversArray = Object.values(groupedByDriver);

  // Transform to match kode-2 output format
  return (
    driversArray.map((driver) => {
      // Calculate total waiting time for this driver
      const totalWaitingTimeMinutes = driver.charges.reduce((total, charge) => {
        return total + parseFloat(charge.waitingTime) * 60;
      }, 0);

      return {
        name: driver.name,
        licensePlate: driver.licensePlate,
        totalWaitingTime: formatMinutesToHoursAndMinutes(
          Math.round(totalWaitingTimeMinutes)
        ),
        totalWaitingTimeMinutes: Math.round(totalWaitingTimeMinutes), // Keep raw minutes if needed
        data: driver.charges.map((charge) => {
          const waitingTimeHours = parseFloat(charge.waitingTime);
          const formattedWaitingTime =
            waitingTimeHours >= 1
              ? `${waitingTimeHours} Jam`
              : `${Math.round(waitingTimeHours * 60)} Menit`;

          return {
            detail: `${
              charge.locationType === "PICKUP"
                ? "Lokasi Muat"
                : "Lokasi Bongkar"
            } ${charge.locationSequence} : ${formattedWaitingTime}`,
            startDate: charge.startWaitingTime,
            endDate: charge.endWaitingTime,
            totalPrice: charge.waitingFee,
            locationType: charge.locationType,
          };
        }),
      };
    }) || []
  );
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
