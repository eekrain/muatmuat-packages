import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

const statusDefinitions = [
  // {
  //   mappedOrderStatus: "UNLOADING",
  //   children: [
  //     {
  //       statusCode: "MENUJU_KE_LOKASI_BONGKAR_1",
  //       statusName: "Menuju ke Lokasi Bongkar",
  //       date: "2025-08-26T02:17:47.555Z",
  //       requiresQRScan: false,
  //       requiresPhoto: true,
  //       triggersWaitingFee: false,
  //       photoEvidences: {
  //         packages: [
  //           "https://picsum.photos/400/300?random=4",
  //           "https://picsum.photos/400/300?random=5",
  //         ],
  //         pods: [
  //           "https://picsum.photos/400/300?random=34",
  //           "https://picsum.photos/400/300?random=35",
  //         ],
  //       },
  //       beforeStatusCode: "SEDANG_MUAT_2",
  //       beforeStatusName: "Muat di Lokasi 2",
  //     },
  //   ],
  // },
  {
    mappedOrderStatus: "LOADING",
    children: [
      // {
      //   statusCode: "SEDANG_MUAT_2",
      //   statusName: "Sedang Muat di Lokasi 2",
      //   date: "2025-08-26T00:17:47.555Z",
      //   requiresQRScan: false,
      //   requiresPhoto: false,
      //   triggersWaitingFee: false,
      //   photoEvidences: {
      //     packages: [],
      //     pods: [],
      //   },
      // },
      // {
      //   statusCode: "ANTRI_DI_LOKASI_MUAT_2",
      //   statusName: "Antri di Lokasi Muat 2",
      //   date: "2025-08-25T23:17:47.555Z",
      //   requiresQRScan: false,
      //   requiresPhoto: false,
      //   triggersWaitingFee: false,
      //   photoEvidences: {
      //     packages: [],
      //     pods: [],
      //   },
      // },
      // {
      //   statusCode: "TIBA_DI_LOKASI_MUAT_2",
      //   statusName: "Tiba di Lokasi Muat 2",
      //   date: "2025-08-25T22:17:47.555Z",
      //   requiresQRScan: false,
      //   requiresPhoto: true,
      //   triggersWaitingFee: false,
      //   photoEvidences: {
      //     packages: [
      //       "https://picsum.photos/400/300?random=1",
      //       "https://picsum.photos/400/300?random=2",
      //       "https://picsum.photos/400/300?random=3",
      //       "https://picsum.photos/400/300?random=934",
      //     ],
      //     pods: [],
      //   },
      // },
      // {
      //   statusCode: "MENUJU_KE_LOKASI_MUAT_2",
      //   statusName: "Menuju ke Lokasi Muat 2",
      //   date: "2025-08-25T21:17:47.555Z",
      //   requiresQRScan: false,
      //   requiresPhoto: true,
      //   triggersWaitingFee: false,
      //   photoEvidences: {
      //     packages: [
      //       "https://picsum.photos/400/300?random=1",
      //       "https://picsum.photos/400/300?random=2",
      //     ],
      //     pods: [
      //       "https://picsum.photos/400/300?random=934",
      //       "https://picsum.photos/400/300?random=935",
      //     ],
      //   },
      //   beforeStatusCode: "SEDANG_MUAT_1",
      //   beforeStatusName: "Muat di Lokasi",
      // },
      // {
      //   statusCode: "SEDANG_MUAT_1",
      //   statusName: "Sedang Muat di Lokasi",
      //   date: "2025-08-25T19:17:47.555Z",
      //   requiresQRScan: false,
      //   requiresPhoto: false,
      //   triggersWaitingFee: false,
      //   photoEvidences: {
      //     packages: [],
      //     pods: [],
      //   },
      // },
      // {
      //   statusCode: "ANTRI_DI_LOKASI_MUAT_1",
      //   statusName: "Antri di Lokasi Muat",
      //   date: "2025-08-25T18:17:47.555Z",
      //   requiresQRScan: false,
      //   requiresPhoto: false,
      //   triggersWaitingFee: false,
      //   photoEvidences: {
      //     packages: [],
      //     pods: [],
      //   },
      // },
      // {
      //   statusCode: "TIBA_DI_LOKASI_MUAT_1",
      //   statusName: "Tiba di Lokasi Muat 1",
      //   date: "2025-08-25T17:17:47.555Z",
      //   requiresQRScan: false,
      //   requiresPhoto: true,
      //   triggersWaitingFee: false,
      //   photoEvidences: {
      //     packages: ["https://picsum.photos/400/300?random=5"],
      //     pods: [],
      //   },
      // },
      {
        statusCode: "MENUJU_KE_LOKASI_MUAT_1",
        statusName: "Menuju ke Lokasi Muat 1",
        date: "2025-08-25T16:17:47.555Z",
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
];

const apiResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Fleet positions retrieved successfully",
    },
    Data: {
      fleets: [
        {
          id: "cf9e8219-437a-4cb3-aa82-321ff3285fdc",
          licensePlate: "AR 6666 LBA", // [dbm_mt_fleet.license_plate]
          driverName: "Ahmad Masruna", // [dbt_mt_drivers.name]
          driverPhone: "+628123456789", // [dbt_mt_drivers.phone_number]
          transporterName: "PT. Truk Jaya Selalu",
          operationalStatus: "ON_DUTY", // [dbm_mt_fleet.operational_status]
          fleetStatus: "ACTIVE", // [dbm_mt_fleet.fleet_status]
          sosStatus: "ACTIVE", // calculated from [dbt_mt_sos.status]
          lastLatitude: -6.2088, // [dbm_mt_fleet.last_latitude]
          lastLongitude: 106.8456, // [dbm_mt_fleet.last_longitude]
          lastLocationUpdate: "2024-04-01T14:30:00Z", // [dbm_mt_fleet.last_location_update]
          orderId: "uuid", // [dbt_mt_order.id]
          orderStatus: "MENUJU_KE_LOKASI_MUAT", // [dbt_mt_order.order_status]
          replacementFleet: {
            id: "uuid",
            licensePlate: "B 1234 ABC", // [dbm_mt_fleet.license_plate]
            driverName: "Budi Santoso", // [dbt_mt_drivers.name]
            status: "ARMADA_PENGGANTI_BERJALAN",
          },
          statusDefinitions,
        },
        // {
        //   id: "790792a7-1a61-4c9d-bccf-52355f156e07",
        //   licensePlate: "AR 6666 LBA", // [dbm_mt_fleet.license_plate]
        //   driverName: "Ahmad Masruna", // [dbt_mt_drivers.name]
        //   driverPhone: "+628123456789", // [dbt_mt_drivers.phone_number]
        //   transporterName: "PT. Truk Jaya Selalu",
        //   operationalStatus: "ON_DUTY", // [dbm_mt_fleet.operational_status]
        //   fleetStatus: "ACTIVE", // [dbm_mt_fleet.fleet_status]
        //   sosStatus: "", // calculated from [dbt_mt_sos.status]
        //   lastLatitude: -6.2088, // [dbm_mt_fleet.last_latitude]
        //   lastLongitude: 106.8456, // [dbm_mt_fleet.last_longitude]
        //   lastLocationUpdate: "2024-04-01T14:30:00Z", // [dbm_mt_fleet.last_location_update]
        //   orderId: "uuid", // [dbt_mt_order.id]
        //   orderStatus: "MENUJU_KE_LOKASI_MUAT", // [dbt_mt_order.order_status]
        //   replacementFleet: {
        //     id: "uuid",
        //     licensePlate: "B 1234 ABC", // [dbm_mt_fleet.license_plate]
        //     driverName: "Budi Santoso", // [dbt_mt_drivers.name]
        //     status: "ARMADA_PENGGANTI_BERJALAN",
        //   },
        //   statusDefinitions,
        // },
      ],
      pagination: {
        currentPage: 1,
        totalPages: 5,
        totalItems: 50,
        itemsPerPage: 10,
      },
    },
    Type: "FLEET_POSITIONS_LIST",
  },
};

export const fetcherFleetPositions = async () => {
  if (useMockData) {
    const result = apiResult;
    return result.data.Data;
  }

  const result = await fetcherMuatrans.get(`v1/cs/orders/fleet-positions`);
  return result?.data?.Data || {};
};

// SWR hook for additional cost report detail
export const useGetFleetPositions = () =>
  useSWR(`monitoring-orders-multi-fleet-positons`, fetcherFleetPositions);
