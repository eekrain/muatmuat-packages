import { sub } from "date-fns";
import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";
import { OrderStatusEnum } from "@/lib/constants/Shipper/detailpesanan/detailpesanan.enum";
import { DriverStatusEnum } from "@/lib/constants/Shipper/detailpesanan/driver-status.enum";

import { getOrderDetail } from "../detailpesanan/getDetailPesananData";

const useMockData = false; // mock detailpesanan

const apiResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Driver status definitions retrieved successfully",
    },
    Data: {
      driverId: "uuid-driver-1",
      name: "Wawan",
      phoneNumber: "081234567891",
      profileImage: "https://picsum.photos/50",
      statusDriver: DriverStatusEnum.UNLOADING.BONGKAR.code,
      statusTitle: "Sedang Muat di Lokasi 2",
      licensePlate: "B 1234 CD",
      statusDefinitions: [
        // {
        //   mappedOrderStatus: OrderStatusEnum.COMPLETED,
        //   date: new Date().toISOString(),
        //   shippingEvidence: {
        //     packages: [
        //       "https://picsum.photos/400/300?random=4",
        //       "https://picsum.photos/400/300?random=5",
        //     ],
        //     pods: [
        //       // "https://picsum.photos/400/300?random=42",
        //       // "https://picsum.photos/400/300?random=43",
        //     ],
        //   },
        // },
        {
          mappedOrderStatus: OrderStatusEnum.CANCELED_BY_SHIPPER,
          date: new Date().toISOString(),
        },
        // {
        //   mappedOrderStatus: OrderStatusEnum.DOCUMENT_DELIVERY,
        //   date: new Date().toISOString(),
        //   shippingEvidence: {
        //     date: "",
        //     photo: [],
        //     noted: "",
        //   },
        // },
        // {
        //   mappedOrderStatus: OrderStatusEnum.PREPARE_DOCUMENT,
        //   date: new Date().toISOString(),
        // },
        // {
        //   mappedOrderStatus: OrderStatusEnum.WAITING_REPAYMENT_1,
        //   date: new Date().toISOString(),
        // },
        {
          mappedOrderStatus: OrderStatusEnum.UNLOADING,
          children: [
            // {
            //   statusCode: DriverStatusEnum.UNLOADING.SELESAI.code,
            //   statusName: "Menuju ke Lokasi Bongkar 2", // This statusName will be updated
            //   date: sub(new Date(), { hours: 5 }).toISOString(),
            //   requiresQRScan: false,
            //   requiresPhoto: true,
            //   triggersWaitingFee: false,
            //   photoEvidences: {
            //     packages: [
            //       "https://picsum.photos/400/300?random=4",
            //       "https://picsum.photos/400/300?random=5",
            //     ],
            //     pods: [
            //       "https://picsum.photos/400/300?random=42",
            //       "https://picsum.photos/400/300?random=43",
            //     ],
            //   },
            // },
            // {
            //   statusCode: `${DriverStatusEnum.UNLOADING.BONGKAR.code}_2`,
            //   statusName: "Sedang Bongkar di Lokasi 2",
            //   date: sub(new Date(), { hours: 2 }).toISOString(),
            //   requiresQRScan: false,
            //   requiresPhoto: false,
            //   triggersWaitingFee: false,
            //   photoEvidences: {
            //     packages: [],
            //     pods: [],
            //   },
            // },
            // {
            //   statusCode: `${DriverStatusEnum.UNLOADING.ANTRI.code}_2`,
            //   statusName: "Antri di Lokasi Bongkar 2",
            //   date: sub(new Date(), { hours: 3 }).toISOString(),
            //   requiresQRScan: false,
            //   requiresPhoto: false,
            //   triggersWaitingFee: false,
            //   photoEvidences: {
            //     packages: [],
            //     pods: [],
            //   },
            // },
            // {
            //   statusCode: `${DriverStatusEnum.UNLOADING.TIBA.code}_2`,
            //   statusName: "Tiba di Lokasi Bongkar 2",
            //   date: sub(new Date(), { hours: 4 }).toISOString(),
            //   requiresQRScan: false,
            //   requiresPhoto: true,
            //   triggersWaitingFee: false,
            //   photoEvidences: {
            //     packages: [
            //       "https://picsum.photos/400/300?random=8",
            //       "https://picsum.photos/400/300?random=4",
            //       "https://picsum.photos/400/300?random=5",
            //       "https://picsum.photos/400/300?random=43",
            //     ],
            //     pods: [],
            //   },
            // },
            // {
            //   statusCode: `${DriverStatusEnum.UNLOADING.MENUJU.code}_2`,
            //   statusName: "Menuju ke Lokasi Bongkar 2", // This statusName will be updated
            //   date: sub(new Date(), { hours: 5 }).toISOString(),
            //   requiresQRScan: false,
            //   requiresPhoto: true,
            //   triggersWaitingFee: false,
            //   photoEvidences: {
            //     packages: [
            //       "https://picsum.photos/400/300?random=4",
            //       "https://picsum.photos/400/300?random=5",
            //     ],
            //     pods: [
            //       "https://picsum.photos/400/300?random=42",
            //       "https://picsum.photos/400/300?random=43",
            //     ],
            //   },
            // },

            // {
            //   statusCode: DriverStatusEnum.UNLOADING.BONGKAR.code,
            //   // statusCode: `${DriverStatusEnum.UNLOADING.BONGKAR.code}_1`,
            //   statusName: "Sedang Bongkar di Lokasi 1",
            //   date: sub(new Date(), { hours: 7 }).toISOString(),
            //   requiresQRScan: false,
            //   requiresPhoto: false,
            //   triggersWaitingFee: false,
            //   photoEvidences: {
            //     packages: [],
            //     pods: [],
            //   },
            // },
            // {
            //   statusCode: DriverStatusEnum.UNLOADING.ANTRI.code,
            //   // statusCode: `${DriverStatusEnum.UNLOADING.ANTRI.code}_1`,
            //   statusName: "Antri di Lokasi Bongkar 1",
            //   date: sub(new Date(), { hours: 8 }).toISOString(),
            //   requiresQRScan: false,
            //   requiresPhoto: false,
            //   triggersWaitingFee: false,
            //   photoEvidences: {
            //     packages: [],
            //     pods: [],
            //   },
            // },
            // {
            //   statusCode: DriverStatusEnum.UNLOADING.TIBA.code,
            //   // statusCode: `${DriverStatusEnum.UNLOADING.TIBA.code}_1`,
            //   statusName: "Tiba di Lokasi Bongkar 1",
            //   date: sub(new Date(), { hours: 9 }).toISOString(),
            //   requiresQRScan: false,
            //   requiresPhoto: true,
            //   triggersWaitingFee: false,
            //   photoEvidences: {
            //     packages: [
            //       "https://picsum.photos/400/300?random=4",
            //       "https://picsum.photos/400/300?random=5",
            //     ],
            //     pods: [
            //       // "https://picsum.photos/400/300?random=34",
            //       // "https://picsum.photos/400/300?random=35",
            //     ],
            //   },
            // },
            {
              // statusCode: DriverStatusEnum.UNLOADING.MENUJU.code,
              statusCode: `${DriverStatusEnum.UNLOADING.MENUJU.code}_1`,
              statusName: "Menuju ke Lokasi Bongkar", // This statusName will be updated
              date: sub(new Date(), { hours: 10 }).toISOString(),
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
            },
          ],
        },
        {
          mappedOrderStatus: OrderStatusEnum.LOADING,
          children: [
            {
              statusCode: `${DriverStatusEnum.LOADING.MUAT.code}_2`,
              statusName: "Sedang Muat di Lokasi 2",
              date: sub(new Date(), { hours: 12 }).toISOString(),
              requiresQRScan: false,
              requiresPhoto: false,
              triggersWaitingFee: false,
              photoEvidences: {
                packages: [],
                pods: [],
              },
            },
            {
              statusCode: `${DriverStatusEnum.LOADING.ANTRI.code}_2`,
              statusName: "Antri di Lokasi Muat 2",
              date: sub(new Date(), { hours: 13 }).toISOString(),
              requiresQRScan: false,
              requiresPhoto: false,
              triggersWaitingFee: false,
              photoEvidences: {
                packages: [],
                pods: [],
              },
            },
            {
              statusCode: `${DriverStatusEnum.LOADING.TIBA.code}_2`,
              statusName: "Tiba di Lokasi Muat 2",
              date: sub(new Date(), { hours: 14 }).toISOString(),
              requiresQRScan: false,
              requiresPhoto: true,
              triggersWaitingFee: false,
              photoEvidences: {
                packages: [
                  "https://picsum.photos/400/300?random=1",
                  "https://picsum.photos/400/300?random=2",
                  "https://picsum.photos/400/300?random=3",
                  "https://picsum.photos/400/300?random=934",
                ],
                pods: [],
              },
            },
            {
              statusCode: `${DriverStatusEnum.LOADING.MENUJU.code}_2`,
              statusName: "Menuju ke Lokasi Muat 2", // This statusName will be updated
              date: sub(new Date(), { hours: 15 }).toISOString(),
              requiresQRScan: false,
              requiresPhoto: true,
              triggersWaitingFee: false,
              photoEvidences: {
                packages: [
                  "https://picsum.photos/400/300?random=1",
                  "https://picsum.photos/400/300?random=2",
                ],
                pods: [
                  "https://picsum.photos/400/300?random=934",
                  "https://picsum.photos/400/300?random=935",
                ],
              },
            },

            {
              // statusCode: DriverStatusEnum.LOADING.MUAT.code,
              statusCode: `${DriverStatusEnum.LOADING.MUAT.code}_1`,
              statusName: "Sedang Muat di Lokasi",
              date: sub(new Date(), { hours: 17 }).toISOString(),
              requiresQRScan: false,
              requiresPhoto: false,
              triggersWaitingFee: false,
              photoEvidences: {
                packages: [],
                pods: [],
              },
            },
            {
              // statusCode: DriverStatusEnum.LOADING.ANTRI.code,
              statusCode: `${DriverStatusEnum.LOADING.ANTRI.code}_1`,
              statusName: "Antri di Lokasi Muat",
              date: sub(new Date(), { hours: 18 }).toISOString(),
              requiresQRScan: false,
              requiresPhoto: false,
              triggersWaitingFee: false,
              photoEvidences: {
                packages: [],
                pods: [],
              },
            },
            {
              // statusCode: DriverStatusEnum.LOADING.TIBA.code,
              statusCode: `${DriverStatusEnum.LOADING.TIBA.code}_1`,
              statusName: "Tiba di Lokasi Muat 1",
              date: sub(new Date(), { hours: 19 }).toISOString(),
              requiresQRScan: false,
              requiresPhoto: true,
              triggersWaitingFee: false,
              photoEvidences: {
                packages: [
                  "https://picsum.photos/400/300?random=5",
                  // "https://picsum.photos/400/300?random=6",
                  // "https://picsum.photos/400/300?random=934",
                  // "https://picsum.photos/400/300?random=935",
                ],
                pods: [],
              },
            },
            {
              // statusCode: DriverStatusEnum.LOADING.MENUJU.code,
              statusCode: `${DriverStatusEnum.LOADING.MENUJU.code}_1`,
              statusName: "Menuju ke Lokasi Muat 1",
              date: sub(new Date(), { hours: 20 }).toISOString(),
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
    Type: "DRIVER_STATUS_DEFINITIONS",
  },
};

const transformDriverStatusData = (dataDriverTimeline, dataOrderDetail) => {
  // 1. Create the dataDriver object
  const dataDriver = {
    driverId: dataDriverTimeline.driverId,
    name: dataDriverTimeline.name,
    phoneNumber: dataDriverTimeline.phoneNumber,
    profileImage: dataDriverTimeline.profileImage,
    orderStatus: dataOrderDetail.general?.orderStatus,
    driverStatus: dataDriverTimeline.statusDriver,
    statusTitle: dataDriverTimeline.statusTitle,
    licensePlate: dataDriverTimeline.licensePlate,
  };
  // 2. Create a deep copy of statusDefinitions to avoid mutating the original apiResult
  const newStatusDefinitions = JSON.parse(
    JSON.stringify(dataDriverTimeline.statusDefinitions)
  );

  // 3. Create a flattened array of all children. This array will contain references
  //    to the objects within newStatusDefinitions, allowing in-place modification.
  const allStatuses = newStatusDefinitions.flatMap((def) => def.children);

  // 4. Iterate through the flattened array to apply transformations
  allStatuses.forEach((currentStatus, index) => {
    if (!currentStatus) return;
    // Check if the current status is a "MENUJU_" type and requires a photo
    if (
      currentStatus.statusCode.startsWith("MENUJU_") &&
      currentStatus.requiresPhoto === true
    ) {
      // Ensure there is a next status in the array to reference
      if (index + 1 < allStatuses.length) {
        const nextStatus = allStatuses[index + 1];

        // Add new properties: beforeStatusCode and beforeStatusName
        currentStatus.beforeStatusCode = nextStatus.statusCode;
        currentStatus.beforeStatusName = nextStatus.statusName.replace(
          "Sedang ",
          ""
        );
      }
    }
  });

  // 5. Return the final transformed object
  return {
    dataDriver: dataDriver,
    statusDefinitions: newStatusDefinitions, // Contains the modified children
  };
};

const fetcher = async (cacheKey) => {
  const orderId = cacheKey.split("/")[1];
  const driverId = cacheKey.split("/")[2];
  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    const [dataDriverTimeline, dataOrderDetail] = await Promise.all([
      useMockData
        ? apiResult
        : fetcherMuatrans.get(
            `v1/orders/status-driver?orderId=${orderId}&driverId=${driverId}`
          ),
      getOrderDetail(`detailpesanan/${orderId}`),
    ]);
    const result = transformDriverStatusData(
      dataDriverTimeline.data.Data,
      dataOrderDetail
    );

    return result;
  } catch (error) {
    console.error("Error fetching driver status timeline", error);
  }
};

export const useGetDriverStatusTimeline = (orderId, driverId) =>
  useSWR(
    !!orderId && !!driverId
      ? `driverStatusTimeline/${orderId}/${driverId}`
      : null,
    fetcher
  );
