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
            name: null,
            phoneNumber: null,
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
        {
          fleetId: "fleet-uuid-5",
          licensePlate: "B9876DEF",
          driver: {
            driverId: "driver-uuid-3",
            name: "Michael Johnson",
            phoneNumber: "+628111222333",
          },
          lastLocation: {
            latitude: -6.3025,
            longitude: 106.8951,
            address: "Jakarta Timur",
            lastUpdate: "2025-07-25T09:45:00Z",
          },
          truckType: {
            truckTypeId: "truck-type-uuid-3",
            name: "Tronton",
          },
          carrierType: {
            carrierId: "carrier-uuid-3",
            name: "Container",
          },
          status: "READY_FOR_ORDER",
          isActive: true,
        },
        {
          fleetId: "fleet-uuid-6",
          licensePlate: "B4321GHI",
          driver: {
            driverId: "driver-uuid-4",
            name: "Sarah Williams",
            phoneNumber: "+628222333444",
          },
          lastLocation: {
            latitude: -6.1753,
            longitude: 106.8266,
            address: "Jakarta Pusat",
            lastUpdate: "2025-07-25T10:15:00Z",
          },
          truckType: {
            truckTypeId: "truck-type-uuid-1",
            name: "Pickup",
          },
          carrierType: {
            carrierId: "carrier-uuid-1",
            name: "Bak Terbuka",
          },
          status: "ON_DELIVERY",
          isActive: true,
        },
        {
          fleetId: "fleet-uuid-7",
          licensePlate: "B7890JKL",
          driver: {
            driverId: "driver-uuid-5",
            name: "Robert Brown",
            phoneNumber: "+628333444555",
          },
          lastLocation: {
            latitude: -6.3972,
            longitude: 106.8249,
            address: "Depok",
            lastUpdate: "2025-07-25T11:30:00Z",
          },
          truckType: {
            truckTypeId: "truck-type-uuid-2",
            name: "Box",
          },
          carrierType: {
            carrierId: "carrier-uuid-2",
            name: "Bak Tertutup",
          },
          status: "READY_FOR_ORDER",
          isActive: true,
        },
        {
          fleetId: "fleet-uuid-8",
          licensePlate: "B2468MNO",
          driver: {
            driverId: "driver-uuid-6",
            name: "Linda Davis",
            phoneNumber: "+628444555666",
          },
          lastLocation: {
            latitude: -6.2618,
            longitude: 106.8106,
            address: "Jakarta Barat",
            lastUpdate: "2025-07-25T10:00:00Z",
          },
          truckType: {
            truckTypeId: "truck-type-uuid-4",
            name: "Engkel",
          },
          carrierType: {
            carrierId: "carrier-uuid-1",
            name: "Bak Terbuka",
          },
          status: "OFFLINE",
          isActive: true,
        },
        {
          fleetId: "fleet-uuid-9",
          licensePlate: "B1357PQR",
          driver: {
            driverId: "driver-uuid-7",
            name: "James Wilson",
            phoneNumber: "+628555666777",
          },
          lastLocation: {
            latitude: -6.1241,
            longitude: 106.7786,
            address: "Jakarta Utara",
            lastUpdate: "2025-07-25T09:30:00Z",
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
        {
          fleetId: "fleet-uuid-10",
          licensePlate: "B8642STU",
          driver: {
            driverId: "driver-uuid-8",
            name: "Patricia Martinez",
            phoneNumber: "+628666777888",
          },
          lastLocation: {
            latitude: -6.5944,
            longitude: 106.7892,
            address: "Tangerang",
            lastUpdate: "2025-07-25T11:45:00Z",
          },
          truckType: {
            truckTypeId: "truck-type-uuid-3",
            name: "Tronton",
          },
          carrierType: {
            carrierId: "carrier-uuid-3",
            name: "Container",
          },
          status: "EMERGENCY",
          isActive: true,
        },
        {
          fleetId: "fleet-uuid-11",
          licensePlate: "B9753VWX",
          driver: {
            driverId: "driver-uuid-9",
            name: "David Garcia",
            phoneNumber: "+628777888999",
          },
          lastLocation: {
            latitude: -6.2297,
            longitude: 106.6894,
            address: "Tangerang Selatan",
            lastUpdate: "2025-07-25T10:45:00Z",
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
          fleetId: "fleet-uuid-12",
          licensePlate: "B3698YZA",
          driver: {
            driverId: "driver-uuid-10",
            name: "Jennifer Anderson",
            phoneNumber: "+628888999000",
          },
          lastLocation: {
            latitude: -6.3319,
            longitude: 106.7355,
            address: "Bekasi",
            lastUpdate: "2025-07-25T11:15:00Z",
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
        {
          fleetId: "fleet-uuid-13",
          licensePlate: "B1592BCD",
          driver: {
            driverId: "driver-uuid-11",
            name: "Christopher Lee",
            phoneNumber: "+628999000111",
          },
          lastLocation: {
            latitude: -6.4058,
            longitude: 106.8175,
            address: "Bogor",
            lastUpdate: "2025-07-25T09:00:00Z",
          },
          truckType: {
            truckTypeId: "truck-type-uuid-4",
            name: "Engkel",
          },
          carrierType: {
            carrierId: "carrier-uuid-1",
            name: "Bak Terbuka",
          },
          status: "OFFLINE",
          isActive: true,
        },
        {
          fleetId: "fleet-uuid-14",
          licensePlate: "B7531EFG",
          driver: {
            driverId: "driver-uuid-12",
            name: "Amanda Rodriguez",
            phoneNumber: "+628000111222",
          },
          lastLocation: {
            latitude: -6.2382,
            longitude: 106.9756,
            address: "Cibubur",
            lastUpdate: "2025-07-25T11:00:00Z",
          },
          truckType: {
            truckTypeId: "truck-type-uuid-3",
            name: "Tronton",
          },
          carrierType: {
            carrierId: "carrier-uuid-3",
            name: "Container",
          },
          status: "READY_FOR_ORDER",
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
