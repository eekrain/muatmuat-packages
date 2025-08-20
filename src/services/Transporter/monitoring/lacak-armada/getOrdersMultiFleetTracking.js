import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const isMockOrdersMultiFleetTracking = true;

const apiResultOrdersMultiFleetTracking = {
  data: {
    Message: {
      Code: 200,
      Text: "Multi-fleet tracking data retrieved successfully",
    },
    Data: {
      orderId: "order-uuid-1",
      orderCode: "MT240115001",
      totalVehicles: 8,
      vehicles: [
        {
          vehicleId: "vehicle-uuid-1",
          licensePlate: "B1234XYZ",
          orderStatus: "IN_PROGRESS",
          polylineEncode: "~oifA~i|xSbAcAbBsBfCgDxAgBpBeC",
          driverName: "John Doe",
          currentLocation: {
            latitude: -6.175392,
            longitude: 106.827153,
            lastUpdate: "2024-01-15T10:30:00.000Z",
          },
          driverStatus: {
            mainStatus: "LOADING",
            subStatus: "MENUJU_KE_LOKASI_MUAT",
            displayName: "Menuju ke Lokasi Muat 1",
          },
          trackingStatus: "MENUJU_KE_LOKASI_MUAT",
          sosStatus: {
            hasSos: true,
            sosId: "sos-uuid-1",
          },
          estimatedArrival: "2024-01-15T11:15:00.000Z",
          timeline: {
            statusDefinitions: [
              {
                mappedOrderStatus: "LOADING",
                date: "2024-01-15T10:30:00.000Z",
                children: [
                  {
                    statusCode: "MENUJU_KE_LOKASI_MUAT",
                    statusName: "Menuju ke Lokasi Muat",
                    date: "2024-01-15T10:30:00.000Z",
                    requiresPhoto: false,
                  },
                ],
              },
            ],
          },
        },
        {
          vehicleId: "vehicle-uuid-2",
          licensePlate: "L5678DEF",
          orderStatus: "IN_PROGRESS",
          polylineEncode: "~oifA~i|xSdBeDhCiFjDkGlEoH",
          driverName: "Siti Rahayu",
          currentLocation: {
            latitude: -6.185392,
            longitude: 106.837153,
            lastUpdate: "2024-01-15T10:28:00.000Z",
          },
          driverStatus: {
            mainStatus: "LOADING",
            subStatus: "SEDANG_MUAT",
            displayName: "Sedang Muat di Lokasi 1",
          },
          trackingStatus: "LOADING",
          sosStatus: {
            hasSos: false,
            sosId: null,
          },
          estimatedArrival: "2024-01-15T11:00:00.000Z",
          timeline: {
            statusDefinitions: [
              {
                mappedOrderStatus: "LOADING",
                date: "2024-01-15T10:28:00.000Z",
                children: [
                  {
                    statusCode: "SEDANG_MUAT",
                    statusName: "Sedang Muat",
                    date: "2024-01-15T10:28:00.000Z",
                    requiresPhoto: true,
                    photos: [
                      "https://picsum.photos/400/300?random=1",
                      "https://picsum.photos/400/300?random=2",
                    ],
                  },
                  {
                    statusCode: "ANTRI_DI_LOKASI_MUAT",
                    statusName: "Antri di Lokasi Muat",
                    date: "2024-01-15T10:15:00.000Z",
                    requiresPhoto: false,
                  },
                  {
                    statusCode: "TIBA_DI_LOKASI_MUAT",
                    statusName: "Tiba di Lokasi Muat",
                    date: "2024-01-15T10:10:00.000Z",
                    requiresPhoto: false,
                  },
                  {
                    statusCode: "MENUJU_KE_LOKASI_MUAT",
                    statusName: "Menuju ke Lokasi Muat",
                    date: "2024-01-15T09:45:00.000Z",
                    requiresPhoto: false,
                  },
                ],
              },
              {
                mappedOrderStatus: "CONFIRMED",
                date: "2024-01-15T09:30:00.000Z",
                children: [],
              },
            ],
          },
        },
        {
          vehicleId: "vehicle-uuid-3",
          licensePlate: "D9012GHI",
          orderStatus: "IN_PROGRESS",
          polylineEncode: "~oifA~i|xSfCgEjDmFnEqGrFsH",
          driverName: "Ahmad Fauzi",
          currentLocation: {
            latitude: -6.195392,
            longitude: 106.847153,
            lastUpdate: "2024-01-15T10:25:00.000Z",
          },
          driverStatus: {
            mainStatus: "UNLOADING",
            subStatus: "MENUJU_KE_LOKASI_BONGKAR",
            displayName: "Menuju ke Lokasi Bongkar 1",
          },
          trackingStatus: "MENUJU_KE_LOKASI_BONGKAR",
          sosStatus: {
            hasSos: false,
            sosId: null,
          },
          estimatedArrival: "2024-01-15T12:00:00.000Z",
          timeline: {
            statusDefinitions: [
              {
                mappedOrderStatus: "UNLOADING",
                date: "2024-01-15T10:25:00.000Z",
                children: [
                  {
                    statusCode: "MENUJU_KE_LOKASI_BONGKAR",
                    statusName: "Menuju ke Lokasi Bongkar",
                    date: "2024-01-15T10:25:00.000Z",
                    requiresPhoto: false,
                  },
                ],
              },
              {
                mappedOrderStatus: "LOADING",
                date: "2024-01-15T10:00:00.000Z",
                children: [
                  {
                    statusCode: "SEDANG_MUAT",
                    statusName: "Sedang Muat",
                    date: "2024-01-15T09:40:00.000Z",
                    requiresPhoto: true,
                    photos: ["https://picsum.photos/400/300?random=8"],
                  },
                  {
                    statusCode: "TIBA_DI_LOKASI_MUAT",
                    statusName: "Tiba di Lokasi Muat",
                    date: "2024-01-15T09:20:00.000Z",
                    requiresPhoto: false,
                  },
                  {
                    statusCode: "MENUJU_KE_LOKASI_MUAT",
                    statusName: "Menuju ke Lokasi Muat",
                    date: "2024-01-15T09:00:00.000Z",
                    requiresPhoto: false,
                  },
                ],
              },
              {
                mappedOrderStatus: "CONFIRMED",
                date: "2024-01-15T08:45:00.000Z",
                children: [],
              },
            ],
          },
        },
        {
          vehicleId: "vehicle-uuid-4",
          licensePlate: "B5678ABC",
          orderStatus: "IN_PROGRESS",
          polylineEncode: "~oifA~i|xShDiEjFmGnHqIpJsK",
          driverName: "Budi Santoso",
          currentLocation: {
            latitude: -6.205392,
            longitude: 106.857153,
            lastUpdate: "2024-01-15T10:35:00.000Z",
          },
          driverStatus: {
            mainStatus: "UNLOADING",
            subStatus: "SEDANG_BONGKAR",
            displayName: "Sedang Bongkar di Lokasi 1",
          },
          trackingStatus: "SEDANG_BONGKAR",
          sosStatus: {
            hasSos: false,
            sosId: null,
          },
          estimatedArrival: "2024-01-15T13:00:00.000Z",
          timeline: {
            statusDefinitions: [
              {
                mappedOrderStatus: "UNLOADING",
                date: "2024-01-15T10:35:00.000Z",
                children: [
                  {
                    statusCode: "SEDANG_BONGKAR",
                    statusName: "Sedang Bongkar",
                    date: "2024-01-15T10:35:00.000Z",
                    requiresPhoto: true,
                    photos: ["https://picsum.photos/400/300?random=5"],
                  },
                  {
                    statusCode: "ANTRI_DI_LOKASI_BONGKAR",
                    statusName: "Antri di Lokasi Bongkar",
                    date: "2024-01-15T10:30:00.000Z",
                    requiresPhoto: false,
                  },
                  {
                    statusCode: "TIBA_DI_LOKASI_BONGKAR",
                    statusName: "Tiba di Lokasi Bongkar",
                    date: "2024-01-15T10:25:00.000Z",
                    requiresPhoto: false,
                  },
                  {
                    statusCode: "MENUJU_KE_LOKASI_BONGKAR",
                    statusName: "Menuju ke Lokasi Bongkar",
                    date: "2024-01-15T10:00:00.000Z",
                    requiresPhoto: false,
                  },
                ],
              },
              {
                mappedOrderStatus: "LOADING",
                date: "2024-01-15T09:50:00.000Z",
                children: [
                  {
                    statusCode: "SEDANG_MUAT",
                    statusName: "Sedang Muat",
                    date: "2024-01-15T09:30:00.000Z",
                    requiresPhoto: true,
                    photos: ["https://picsum.photos/400/300?random=6"],
                  },
                ],
              },
            ],
          },
        },
        {
          vehicleId: "vehicle-uuid-5",
          licensePlate: "L9876ZYX",
          orderStatus: "IN_PROGRESS",
          polylineEncode: "~oifA~i|xSjEkFlGmHpIqJrKsL",
          driverName: "Andi Wijaya",
          currentLocation: {
            latitude: -6.215392,
            longitude: 106.867153,
            lastUpdate: "2024-01-15T10:40:00.000Z",
          },
          driverStatus: {
            mainStatus: "UNLOADING",
            subStatus: "ANTRI_DI_LOKASI_BONGKAR",
            displayName: "Antri di Lokasi Bongkar",
          },
          trackingStatus: "ANTRI_DI_LOKASI_BONGKAR",
          sosStatus: {
            hasSos: false,
            sosId: null,
          },
          estimatedArrival: "2024-01-15T13:30:00.000Z",
        },
        {
          vehicleId: "vehicle-uuid-6",
          licensePlate: "D4321KLM",
          orderStatus: "IN_PROGRESS",
          polylineEncode: "~oifA~i|xSlFmGnHoIpJqKrLsM",
          driverName: "Rizky Pratama",
          currentLocation: {
            latitude: -6.225392,
            longitude: 106.877153,
            lastUpdate: "2024-01-15T10:45:00.000Z",
          },
          driverStatus: {
            mainStatus: "UNLOADING",
            subStatus: "TIBA_DI_LOKASI_BONGKAR",
            displayName: "Tiba di Lokasi Bongkar",
          },
          trackingStatus: "TIBA_DI_LOKASI_BONGKAR",
          sosStatus: {
            hasSos: false,
            sosId: null,
          },
          estimatedArrival: "2024-01-15T14:00:00.000Z",
        },
        {
          vehicleId: "vehicle-uuid-7",
          licensePlate: "B7890PQR",
          orderStatus: "IN_PROGRESS",
          polylineEncode: "~oifA~i|xSmGnHoIpJqKrLsMtN",
          driverName: "Dedi Kurniawan",
          currentLocation: {
            latitude: -6.165392,
            longitude: 106.817153,
            lastUpdate: "2024-01-15T10:20:00.000Z",
          },
          driverStatus: {
            mainStatus: "LOADING",
            subStatus: "ANTRI_DI_LOKASI_MUAT",
            displayName: "Antri di Lokasi Muat",
          },
          trackingStatus: "ANTRI_DI_LOKASI_MUAT",
          sosStatus: {
            hasSos: false,
            sosId: null,
          },
          estimatedArrival: "2024-01-15T11:30:00.000Z",
        },
        {
          vehicleId: "vehicle-uuid-8",
          licensePlate: "L3456STU",
          orderStatus: "IN_PROGRESS",
          polylineEncode: "~oifA~i|xSnHoIpJqKrLsMtNuO",
          driverName: "Hendra Wijaya",
          currentLocation: {
            latitude: -6.170392,
            longitude: 106.822153,
            lastUpdate: "2024-01-15T10:25:00.000Z",
          },
          driverStatus: {
            mainStatus: "LOADING",
            subStatus: "TIBA_DI_LOKASI_MUAT",
            displayName: "Tiba di Lokasi Muat",
          },
          trackingStatus: "TIBA_DI_LOKASI_MUAT",
          sosStatus: {
            hasSos: false,
            sosId: null,
          },
          estimatedArrival: "2024-01-15T11:45:00.000Z",
        },
      ],
      pickupLocations: [
        {
          locationId: "pickup-loc-uuid-1",
          sequence: 1,
          fullAddress: "Jl. Sudirman No. 1",
          latitude: -6.175392,
          longitude: 106.827153,
          vehicleCount: 2,
        },
      ],
      dropoffLocations: [
        {
          locationId: "dropoff-loc-uuid-1",
          sequence: 1,
          fullAddress: "Jl. Thamrin No. 5",
          latitude: -6.185392,
          longitude: 106.837153,
          vehicleCount: 1,
        },
      ],
      clusterData: {
        pickupClusters: [
          {
            latitude: -6.175392,
            longitude: 106.827153,
            vehicleCount: 2,
            locationLabel: "Lokasi Muat 1",
          },
        ],
        dropoffClusters: [
          {
            latitude: -6.185392,
            longitude: 106.837153,
            vehicleCount: 1,
            locationLabel: "Lokasi Bongkar 1",
          },
        ],
      },
    },
    Type: "MULTI_FLEET_TRACKING",
  },
};

export const fetcherOrdersMultiFleetTracking = async (orderId) => {
  if (isMockOrdersMultiFleetTracking) {
    const result = apiResultOrdersMultiFleetTracking;
    return result.data.Data;
  }

  const result = await fetcherMuatrans.get(
    `v1/monitoring/orders/${orderId}/multi-fleet-tracking`
  );
  return result?.data?.Data || {};
};

export const useGetOrdersMultiFleetTracking = (orderId) => {
  const cacheKey = orderId
    ? ["monitoring-orders-multi-fleet-tracking", orderId]
    : null;

  return useSWR(cacheKey, () => fetcherOrdersMultiFleetTracking(orderId), {
    refreshInterval: 10000,
    revalidateOnFocus: true,
  });
};
