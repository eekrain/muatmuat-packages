import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const isMockData = true;

const apiResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Fleet positions retrieved successfully",
    },
    Data: {
      fleets: [
        {
          id: "uuid",
          licensePlate: "AR 6666 LBA", // [dbm_mt_fleet.license_plate]
          driverName: "Ahmad Masruna", // [dbt_mt_drivers.name]
          driverPhone: "+628123456789", // [dbt_mt_drivers.phone_number]
          operationalStatus: "ON_DUTY", // [dbm_mt_fleet.operational_status]
          fleetStatus: "ACTIVE", // [dbm_mt_fleet.fleet_status]
          sosStatus: "", // calculated from [dbt_mt_sos.status]
          lastLatitude: -6.2088, // [dbm_mt_fleet.last_latitude]
          lastLongitude: 106.8456, // [dbm_mt_fleet.last_longitude]
          lastLocationUpdate: "2024-04-01T14:30:00Z", // [dbm_mt_fleet.last_location_update]
          orderId: "uuid", // [dbt_mt_order.id]
          orderStatus: "WAITING_CHANGE_FLEET", // [dbt_mt_order.order_status]
          replacementFleet: {
            id: "uuid",
            licensePlate: "B 1234 ABC", // [dbm_mt_fleet.license_plate]
            driverName: "Budi Santoso", // [dbt_mt_drivers.name]
            status: "ARMADA_PENGGANTI_BERJALAN",
          },
        },
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
  if (isMockData) {
    const result = apiResult;
    return result.data.Data;
  }

  const result = await fetcherMuatrans.get(
    `v1/transporter/orders/fleet-positions`
  );
  return result?.data?.Data || {};
};

// SWR hook for additional cost report detail
export const useGetFleetPositions = () =>
  useSWR(`monitoring-orders-multi-fleet-positons`, fetcherFleetPositions);
