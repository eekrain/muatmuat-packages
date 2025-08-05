import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const isMockFleetList = true;

const apiResultFleetList = {
  data: {
    Message: {
      Code: 200,
      Text: "Fleet list retrieved successfully",
    },
    Data: {
      totalFleets: 25,
      currentPage: 1,
      totalPages: 3,
      fleets: [
        {
          fleetId: "fleet-uuid-4",
          licensePlate: "B5678XYZ",
          driver: {
            driverId: "driver-uuid-2",
            name: "Jane Smith",
            phoneNumber: "+628987654321",
          },
          lastLocation: {
            latitude: -6.9175,
            longitude: 107.6191,
            address: "Bandung",
            lastUpdate: "2025-07-25T11:00:00Z",
          },
          truckType: {
            truckTypeId: "truck-type-uuid-2",
            name: "Box",
          },
          carrierType: {
            carrierId: "carrier-uuid-2",
            name: "Bak Tertutup",
          },
          status: "EMERGENCY",
          isActive: true,
        },
        {
          fleetId: "fleet-uuid-3",
          licensePlate: "B1234ABC",
          driver: {
            driverId: "driver-uuid-1",
            name: "John Doe",
            phoneNumber: "+628123456789",
          },
          lastLocation: {
            latitude: -6.2088,
            longitude: 106.8456,
            address: "Jakarta Selatan",
            lastUpdate: "2025-07-25T10:30:00Z",
          },
          truckType: {
            truckTypeId: "truck-type-uuid-1",
            name: "Pickup",
          },
          carrierType: {
            carrierId: "carrier-uuid-1",
            name: "Bak Terbuka",
          },
          status: "OFFLINE",
          isActive: true,
        },
        {
          fleetId: "fleet-uuid-1",
          licensePlate: "B1234ABC",
          driver: {
            driverId: "driver-uuid-1",
            name: "John Doe",
            phoneNumber: "+628123456789",
          },
          lastLocation: {
            latitude: -6.2088,
            longitude: 106.8456,
            address: "Jakarta Selatan",
            lastUpdate: "2025-07-25T10:30:00Z",
          },
          truckType: {
            truckTypeId: "truck-type-uuid-1",
            name: "Pickup",
          },
          carrierType: {
            carrierId: "carrier-uuid-1",
            name: "Bak Terbuka",
          },
          status: "READY_FOR_ORDER",
          isActive: true,
        },
        {
          fleetId: "fleet-uuid-2",
          licensePlate: "B5678XYZ",
          driver: {
            driverId: "driver-uuid-2",
            name: "Jane Smith",
            phoneNumber: "+628987654321",
          },
          lastLocation: {
            latitude: -6.9175,
            longitude: 107.6191,
            address: "Bandung",
            lastUpdate: "2025-07-25T11:00:00Z",
          },
          truckType: {
            truckTypeId: "truck-type-uuid-2",
            name: "Box",
          },
          carrierType: {
            carrierId: "carrier-uuid-2",
            name: "Bak Tertutup",
          },
          status: "ON_DELIVERY",
          isActive: true,
        },
      ],
    },
    Type: "FLEET_LIST",
  },
};

export const fetcherFleetList = async () => {
  if (isMockFleetList) {
    const result = apiResultFleetList;
    return result.data.Data;
  }

  const result = await fetcherMuatrans.get("/v1/fleet-list");
  return result?.data?.Data || {};
};

export const useGetFleetList = () => {
  const cacheKey = "monitoring-fleet-list";

  return useSWR(cacheKey, fetcherFleetList);
};
