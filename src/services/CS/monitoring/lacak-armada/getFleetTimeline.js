import useSWRMutation from "swr/mutation";

import { fetcherMuatransCS } from "@/lib/fetcherBasicAuth";

const useMockData = true;

const apiResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Queue status retrieved successfully",
    },
    Data: {
      estimatedArrival: "2025-08-28T10:00:00.000Z", // nullable, kalo bukan lagi menuju harusnya null
      statusDefinitions: [
        {
          mappedOrderStatus: "UNLOADING",
          children: [
            {
              statusCode: "ANTRI_DI_LOKASI_BONGKAR",
              statusName: "Antri di Lokasi Bongkar 1",
              date: "2025-08-28T09:43:25.570Z",
              requiresQRScan: false,
              requiresPhoto: false,
              triggersWaitingFee: false,
              photoEvidences: {
                packages: [],
                pods: [],
              },
            },
            {
              statusCode: "TIBA_DI_LOKASI_BONGKAR",
              statusName: "Tiba di Lokasi Bongkar 1",
              date: "2025-08-28T08:43:25.570Z",
              requiresQRScan: false,
              requiresPhoto: true,
              triggersWaitingFee: false,
              photoEvidences: {
                packages: [
                  "https://picsum.photos/400/300?random=4",
                  "https://picsum.photos/400/300?random=5",
                ],
                pods: [],
              },
            },
            {
              statusCode: "MENUJU_KE_LOKASI_BONGKAR",
              statusName: "Menuju ke Lokasi Bongkar",
              date: "2025-08-28T07:43:25.570Z",
              requiresQRScan: false,
              requiresPhoto: true,
              triggersWaitingFee: false,
              photoEvidences: {
                packages: [
                  "https://picsum.photos/400/300?random=4",
                  "https://picsum.photos/400/300?random=5",
                ],
                pods: [
                  "https://picsum.photos/400/300?random=34",
                  "https://picsum.photos/400/300?random=35",
                ],
              },
              beforeStatusCode: "SEDANG_MUAT",
              beforeStatusName: "Muat di Lokasi",
            },
          ],
        },
        {
          mappedOrderStatus: "LOADING",
          children: [
            {
              statusCode: "SEDANG_MUAT",
              statusName: "Sedang Muat di Lokasi",
              date: "2025-08-28T00:43:25.570Z",
              requiresQRScan: false,
              requiresPhoto: false,
              triggersWaitingFee: false,
              photoEvidences: {
                packages: [],
                pods: [],
              },
            },
            {
              statusCode: "ANTRI_DI_LOKASI_MUAT",
              statusName: "Antri di Lokasi Muat",
              date: "2025-08-27T23:43:25.570Z",
              requiresQRScan: false,
              requiresPhoto: false,
              triggersWaitingFee: false,
              photoEvidences: {
                packages: [],
                pods: [],
              },
            },
            {
              statusCode: "TIBA_DI_LOKASI_MUAT",
              statusName: "Tiba di Lokasi Muat 1",
              date: "2025-08-27T22:43:25.570Z",
              requiresQRScan: false,
              requiresPhoto: true,
              triggersWaitingFee: false,
              photoEvidences: {
                packages: ["https://picsum.photos/400/300?random=5"],
                pods: [],
              },
            },
            {
              statusCode: "MENUJU_KE_LOKASI_MUAT",
              statusName: "Menuju ke Lokasi Muat 1",
              date: "2025-08-27T21:43:25.570Z",
              requiresQRScan: false,
              requiresPhoto: false,
              triggersWaitingFee: false,
              photoEvidences: {
                packages: [],
                pods: [],
              },
            },
          ],
        },
      ],
    },
    Type: "LOADING_QUEUE_STATUS",
  },
};

export const getFleetTimeline = async (orderId, vehicleId) => {
  if (useMockData) {
    const result = apiResult;
    return result.data.Data;
  }

  const result = await fetcherMuatransCS.get(
    `v1/cs/orders/${orderId}/timeline/${vehicleId}`
  );
  return result?.data?.Data || {};
};

// SWR hook for additional cost report detail
export const useGetFleetTimelineMutation = () => {
  const { trigger, data } = useSWRMutation(
    `get-fleet-timeline`,
    (orderId, vehicleId) => getFleetTimeline(orderId, vehicleId)
  );

  return { trigger, data };
};
