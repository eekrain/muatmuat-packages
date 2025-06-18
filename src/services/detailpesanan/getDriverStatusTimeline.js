import { sub } from "date-fns";
import useSWR from "swr";

const apiResult = {
  Message: {
    Code: 200,
    Text: "Driver status definitions retrieved successfully",
  },
  Data: {
    driverId: "uuid-driver-1",
    name: "Ahmad Rahman",
    phoneNumber: "081234567891",
    profileImage: "https://picsum.photos/50",
    statusDriver: "SEDANG_BONGKAR_DI_LOKASI_2",
    statusTitle: "Sedang Bongkar di Lokasi 2",
    licensePlate: "B 1234 CD",
    statusDefinitions: [
      {
        mappedOrderStatus: "UNLOADING",
        children: [
          {
            statusCode: "SEDANG_BONGKAR_DI_LOKASI_2",
            statusName: "Sedang Bongkar di Lokasi 2",
            date: sub(new Date(), { hours: 2 }).toISOString(),
            requiresQRScan: false,
            requiresPhoto: false,
            triggersWaitingFee: false,
            photoEvidences: {
              packages: [],
              pods: [],
            },
          },
          {
            statusCode: "ANTRI_DI_LOKASI_BONGKAR_2",
            statusName: "Antri di Lokasi Bongkar 2",
            date: sub(new Date(), { hours: 3 }).toISOString(),
            requiresQRScan: false,
            requiresPhoto: false,
            triggersWaitingFee: false,
            photoEvidences: {
              packages: [],
              pods: [],
            },
          },
          {
            statusCode: "TIBA_DI_LOKASI_BONGKAR_2",
            statusName: "Tiba di Lokasi Bongkar 2",
            date: sub(new Date(), { hours: 4 }).toISOString(),
            requiresQRScan: false,
            requiresPhoto: true,
            triggersWaitingFee: false,
            photoEvidences: {
              packages: [
                "https://picsum.photos/400/300?random=8",
                "https://picsum.photos/400/300?random=9",
              ],
              pods: [],
            },
          },
          {
            statusCode: "MENUJU_LOKASI_BONGKAR_2",
            statusName: "Menuju ke Lokasi Bongkar 2", // This statusName will be updated
            date: sub(new Date(), { hours: 5 }).toISOString(),
            requiresQRScan: false,
            requiresPhoto: true,
            triggersWaitingFee: false,
            photoEvidences: {
              packages: [
                "https://picsum.photos/400/300?random=4",
                "https://picsum.photos/400/300?random=5",
              ],
              pods: [
                "https://picsum.photos/400/300?random=42",
                "https://picsum.photos/400/300?random=43",
              ],
            },
          },

          {
            statusCode: "SEDANG_BONGKAR_DI_LOKASI_1",
            statusName: "Sedang Bongkar di Lokasi 1",
            date: sub(new Date(), { hours: 7 }).toISOString(),
            requiresQRScan: false,
            requiresPhoto: false,
            triggersWaitingFee: false,
            photoEvidences: {
              packages: [],
              pods: [],
            },
          },
          {
            statusCode: "ANTRI_DI_LOKASI_BONGKAR_1",
            statusName: "Antri di Lokasi Bongkar 1",
            date: sub(new Date(), { hours: 8 }).toISOString(),
            requiresQRScan: false,
            requiresPhoto: false,
            triggersWaitingFee: false,
            photoEvidences: {
              packages: [],
              pods: [],
            },
          },
          {
            statusCode: "TIBA_DI_LOKASI_BONGKAR_1",
            statusName: "Tiba di Lokasi Bongkar 1",
            date: sub(new Date(), { hours: 9 }).toISOString(),
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
            statusCode: "MENUJU_LOKASI_BONGKAR_1",
            statusName: "Menuju ke Lokasi Bongkar 1", // This statusName will be updated
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
        mappedOrderStatus: "LOADING",
        children: [
          {
            statusCode: "SEDANG_MUAT_DI_LOKASI_2",
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
            statusCode: "ANTRI_DI_LOKASI_MUAT_2",
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
            statusCode: "TIBA_DI_LOKASI_MUAT_2",
            statusName: "Tiba di Lokasi Muat 2",
            date: sub(new Date(), { hours: 14 }).toISOString(),
            requiresQRScan: false,
            requiresPhoto: true,
            triggersWaitingFee: false,
            photoEvidences: {
              packages: [
                "https://picsum.photos/400/300?random=1",
                "https://picsum.photos/400/300?random=2",
              ],
              pods: [],
            },
          },
          {
            statusCode: "MENUJU_LOKASI_MUAT_2",
            statusName: "Menuju ke Lokasi Muat 2", // This statusName will be updated
            date: sub(new Date(), { hours: 15 }).toISOString(),
            requiresQRScan: false,
            requiresPhoto: true,
            triggersWaitingFee: false,
            photoEvidences: {
              packages: [
                "https://picsum.photos/400/300?random=1",
                "https://picsum.photos/400/300?random=2",
                "https://picsum.photos/400/300?random=3",
              ],
              pods: [
                "https://picsum.photos/400/300?random=934",
                "https://picsum.photos/400/300?random=935",
              ],
            },
          },
          {
            statusCode: "SEDANG_MUAT_DI_LOKASI_1",
            statusName: "Sedang Muat di Lokasi 1",
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
            statusCode: "ANTRI_DI_LOKASI_MUAT_1",
            statusName: "Antri di Lokasi Muat 1",
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
            statusCode: "TIBA_DI_LOKASI_MUAT_1",
            statusName: "Tiba di Lokasi Muat 1",
            date: sub(new Date(), { hours: 19 }).toISOString(),
            requiresQRScan: false,
            requiresPhoto: true,
            triggersWaitingFee: false,
            photoEvidences: {
              packages: [
                "https://picsum.photos/400/300?random=5",
                "https://picsum.photos/400/300?random=6",
              ],
              pods: [],
            },
          },
          {
            statusCode: "MENUJU_LOKASI_MUAT_1",
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
};

const transformDriverStatusData = (data) => {
  // 1. Create the dataDriver object
  const dataDriver = {
    driverId: data.driverId,
    name: data.name,
    phoneNumber: data.phoneNumber,
    profileImage: data.profileImage,
    statusDriver: data.statusDriver,
    statusTitle: data.statusTitle,
    licensePlate: data.licensePlate,
  };

  // 2. Create a deep copy of statusDefinitions to avoid mutating the original apiResult
  const newStatusDefinitions = JSON.parse(
    JSON.stringify(data.statusDefinitions)
  );

  // 3. Create a flattened array of all children. This array will contain references
  //    to the objects within newStatusDefinitions, allowing in-place modification.
  const allStatuses = newStatusDefinitions.flatMap((def) => def.children);

  // 4. Iterate through the flattened array to apply transformations
  allStatuses.forEach((currentStatus, index) => {
    // Check if the current status is a "MENUJU_" type and requires a photo
    if (
      currentStatus.statusCode.startsWith("MENUJU_") &&
      currentStatus.requiresPhoto === true
    ) {
      // Ensure there is a next status in the array to reference
      if (index + 1 < allStatuses.length) {
        const nextStatus = allStatuses[index + 1];

        // Update current statusName as per your example
        currentStatus.statusName = nextStatus.statusName;
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

  const result = transformDriverStatusData(apiResult.Data);

  return result;
};

export const useGetDriverStatusTimeline = ({ orderId, driverId }) =>
  useSWR(
    orderId ? `driverStatusTimeline/${orderId}/${driverId}` : null,
    fetcher
  );
