import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const isMockData = false;

const apiResult = {
  data: {
    Message: {
      Code: 200,
      Text: "OK",
    },
    Data: {
      orderInfo: {
        id: "44019d47-7429-4964-83ef-a586781a3755",
        orderCode: "MT25AA139",
        orderStatus: "UNLOADING",
      },
      fleetSummary: {
        totalFleet: 1,
        activeFleet: 1,
        completedFleet: 0,
      },
      fleetDetails: [
        {
          id: "45be2b3e-fa6f-45f0-902d-56de90d212e2",
          licensePlate: "B 1235 ABC",
          truckType: "Colt Diesel Double",
          driverInfo: {
            id: "569ff94f-af56-4510-bad0-2f552f9f1b9d",
            name: "John Doe Driver",
            phoneNumber: "081234567890",
            profileImage:
              "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1752811896934.webp",
          },
          fleetStatus: "labelMTFleetStatusOnDuty",
          milestones: [
            {
              id: "c1706cc7-6c56-4cfb-9707-3306cf8b39bb",
              statusName: "Menuju ke Lokasi Muat ",
              completedAt: "2025-08-24T11:07:12.221Z",
              isCompleted: true,
              icon: "circle",
              colorCode: "#4CAF50",
            },
            {
              id: "6d34e58d-cd7c-42d8-867b-bd078ff47c14",
              statusName: "Tiba di Lokasi Muat ",
              completedAt: "2025-08-24T11:07:22.969Z",
              isCompleted: true,
              icon: "circle",
              colorCode: "#4CAF50",
            },
            {
              id: "7946db7b-8473-4804-bbed-51ef3217c1de",
              statusName: "Antri di Lokasi Muat ",
              completedAt: "2025-08-24T11:07:27.899Z",
              isCompleted: true,
              icon: "circle",
              colorCode: "#4CAF50",
            },
            {
              id: "c046fc0c-0695-4d71-8c8b-35572e2259aa",
              statusName: "Sedang Muat ",
              completedAt: "2025-08-24T11:07:34.156Z",
              isCompleted: true,
              icon: "circle",
              colorCode: "#4CAF50",
            },
            {
              id: "ae1b1cc3-4cb1-4cae-a7ba-2ff2b97aee02",
              statusName: "Menuju ke Lokasi Bongkar ",
              completedAt: "2025-08-24T11:07:47.378Z",
              isCompleted: true,
              icon: "circle",
              colorCode: "#4CAF50",
            },
            {
              id: "6aec9c23-8db4-461b-a486-7793400b7a5b",
              statusName: "Tiba di Lokasi Bongkar 2",
              completedAt: "2025-08-24T11:07:53.153Z",
              isCompleted: true,
              icon: "circle",
              colorCode: "#4CAF50",
            },
            {
              id: "c48c50c5-8e7e-4561-9e4f-ae622ed7f1ca",
              statusName: "Antri di Lokasi Bongkar 2",
              completedAt: "2025-08-24T11:07:59.217Z",
              isCompleted: true,
              icon: "circle",
              colorCode: "#4CAF50",
            },
            {
              id: "1a99e432-ef5f-443b-a298-31d09f090061",
              statusName: "Sedang Bongkar ",
              completedAt: "2025-08-24T11:08:09.916Z",
              isCompleted: true,
              icon: "circle",
              colorCode: "#4CAF50",
            },
            {
              id: "f126e0ad-d598-445c-8fd7-5908a261f98f",
              statusName: "PREPARE_DOCUMENT",
              completedAt: "2025-08-24T11:08:20.586Z",
              isCompleted: true,
              icon: "circle",
              colorCode: "#4CAF50",
            },
            {
              id: "8055723f-917e-45b1-91a4-2b6c3a8ae971",
              statusName: "Tiba di Lokasi Bongkar ",
              completedAt: "2025-08-24T11:13:16.752Z",
              isCompleted: true,
              icon: "circle",
              colorCode: "#4CAF50",
            },
          ],
          lastLocationUpdate: null,
          hasDetailButton: true,
        },
      ],
    },
    Type: "VEHICLE_UPDATE",
  },
};

export const fetcherFleetTracking = async (orderId) => {
  if (isMockData) {
    const result = apiResult;
    return result.data.Data;
  }

  const result = await fetcherMuatrans.get(
    `/v1/transporter/orders/${orderId}/fleet-tracking`
  );
  return result?.data?.Data || {};
};

export const useGetFleetTracking = (orderId) => {
  const cacheKey = orderId ? ["fleet-tracking", orderId] : null;

  return useSWR(cacheKey, () => fetcherFleetTracking(orderId), {
    refreshInterval: 30000, // Refetch every 30 seconds for live tracking
    revalidateOnFocus: true,
  });
};
