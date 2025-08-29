import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const isMockOrdersFleetTracking = true;

const apiResultOrdersFleetTracking = {
  data: {
    Message: {
      Code: 200,
      Text: "Multi-fleet tracking data retrieved successfully",
    },
    Data: {
      orderId: "order-uuid-1", // [dbt_mt_order.id]
      orderCode: "MT240115001", // [dbt_mt_order.orderCode]
      totalVehicles: 3,
      vehicles: [
        {
          vehicleId: "vehicle-uuid-1", // [dbm_mt_fleet.id]
          licensePlate: "B1234XYZ", // [dbm_mt_fleet.licensePlate]
          orderStatus: "IN_PROGRESS",
          polylineEncode: "~oifA~i|xSbAcAbBsBfCgDxAgBpBeC",
          driverName: "John Doe", // [dbt_mt_drivers.name]
          currentLocation: {
            latitude: -6.175392, // [dbm_mt_fleet.lastLatitude]
            longitude: 106.827153, // [dbm_mt_fleet.lastLongitude]
            lastUpdate: "2024-01-15T10:30:00.000Z", // [dbm_mt_fleet.lastLocationUpdate]
          },
          driverStatus: {
            mainStatus: "HEADING_TO_PICKUP", // [dbt_mt_driver_status_log.mainStatus]
            subStatus: "IN_TRANSIT", // [dbt_mt_driver_status_log.subStatus]
            displayName: "Menuju ke Lokasi Muat 1", // [dbm_mt_driver_status_definition.displayName]
          },
          sosStatus: {
            hasSos: false,
            sosId: null,
          },
          estimatedArrival: "2024-01-15T11:15:00.000Z",
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
            mainStatus: "AT_PICKUP",
            subStatus: "LOADING",
            displayName: "Sedang Muat di Lokasi 1",
          },
          sosStatus: {
            hasSos: true,
            sosId: "sos-uuid-1",
          },
          estimatedArrival: "2024-01-15T11:00:00.000Z",
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
            mainStatus: "HEADING_TO_DROPOFF",
            subStatus: "IN_TRANSIT",
            displayName: "Menuju ke Lokasi Bongkar 1",
          },
          sosStatus: {
            hasSos: false,
            sosId: null,
          },
          estimatedArrival: "2024-01-15T12:00:00.000Z",
        },
      ],
      pickupLocations: [
        {
          locationId: "pickup-loc-uuid-1", // [dbt_mt_location.id]
          sequence: 1, // [dbt_mt_location.sequence]
          fullAddress: "Jl. Sudirman No. 1, Jakarta Pusat", // [dbt_mt_location.fullAddress]
          latitude: -6.175392, // [dbt_mt_location.latitude]
          longitude: 106.827153, // [dbt_mt_location.longitude]
          vehicleCount: 2,
        },
        {
          locationId: "pickup-loc-uuid-2",
          sequence: 2,
          fullAddress: "Jl. Gatot Subroto No. 10, Jakarta Selatan",
          latitude: -6.235392,
          longitude: 106.837153,
          vehicleCount: 1,
        },
      ],
      dropoffLocations: [
        {
          locationId: "dropoff-loc-uuid-1", // [dbt_mt_location.id]
          sequence: 1, // [dbt_mt_location.sequence]
          fullAddress: "Jl. Thamrin No. 5, Jakarta Pusat", // [dbt_mt_location.fullAddress]
          latitude: -6.185392, // [dbt_mt_location.latitude]
          longitude: 106.837153, // [dbt_mt_location.longitude]
          vehicleCount: 1,
        },
        {
          locationId: "dropoff-loc-uuid-2",
          sequence: 2,
          fullAddress: "Jl. Rasuna Said No. 15, Jakarta Selatan",
          latitude: -6.225392,
          longitude: 106.847153,
          vehicleCount: 2,
        },
      ],
    },
    Type: "MULTI_FLEET_TRACKING",
  },
};

export const fetcherOrdersFleetTracking = async (orderId) => {
  if (isMockOrdersFleetTracking) {
    const result = apiResultOrdersFleetTracking;
    return result.data.Data;
  }

  const result = await fetcherMuatrans.get(
    `v1/monitoring/orders/${orderId}/fleet-tracking`
  );
  return result?.data?.Data || {};
};

export const useGetOrdersFleetTracking = (orderId) => {
  const cacheKey = orderId
    ? ["monitoring-orders-fleet-tracking", orderId]
    : null;

  return useSWR(cacheKey, () => fetcherOrdersFleetTracking(orderId), {
    refreshInterval: 10000, // Refresh every 10 seconds for real-time tracking
    revalidateOnFocus: true,
  });
};
