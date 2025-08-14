import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const isMockAvailableVehicles = true;

// Get dynamic dates for testing
const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);

// Format date to ISO string with timezone
const formatDateForAPI = (date, hours = 8) => {
  const d = new Date(date);
  d.setHours(hours, 0, 0, 0);
  return d.toISOString().replace("Z", "+07:00");
};

const mockApiResultAvailableVehicles = {
  Message: {
    Code: 200,
    Text: "Daftar armada tersedia berhasil diambil",
  },
  Data: {
    orderInfo: {
      id: "uuid-order-001",
      orderCode: "MT240001",
      requiredTruckType: {
        id: "uuid-truck-type-001",
        name: "Truck Engkel",
        maxWeight: 5.0,
      },
      requiredTruckCount: 3,
      loadTimeStart: formatDateForAPI(tomorrow, 8),
    },
    availableVehicles: [
      // {
      //   id: "uuid-fleet-001",
      //   licensePlate: "B 1234 ABC",
      //   truckImage: "/img/mock-armada/one.png",
      //   truckType: {
      //     id: "uuid-truck-type-001",
      //     name: "Truck Engkel",
      //     maxWeight: 5.0,
      //   },
      //   carrierTruck: {
      //     id: "uuid-carrier-001",
      //     name: "Box",
      //     description: "Box tertutup untuk barang umum",
      //   },
      //   vehicleBrand: {
      //     id: "uuid-brand-001",
      //     name: "Mitsubishi",
      //   },
      //   vehicleType: {
      //     id: "uuid-vehicle-type-001",
      //     name: "Canter",
      //   },
      //   registrationYear: 2020,
      //   driver: {
      //     id: "uuid-driver-001",
      //     name: "John Doe",
      //     phoneNumber: "081234567890",
      //     profileImage: "/img/mock-armada/driver.png",
      //     driverStatus: "AVAILABLE",
      //     simExpiryDate: "2025-12-31",
      //     verificationStatus: "VERIFIED",
      //   },
      //   fleetStatus: "ACTIVE",
      //   operationalStatus: "READY_FOR_ORDER",
      //   lastLocation: {
      //     latitude: -6.2088,
      //     longitude: 106.8456,
      //     lastUpdate: formatDateForAPI(today, 14),
      //   },
      //   documents: {
      //     stnkExpiry: "2025-08-15",
      //     kirExpiry: "2024-12-20",
      //     isDocumentValid: true,
      //   },
      //   nearestSchedule: null,
      //   isPotentialOverload: false,
      // },
      // {
      //   id: "uuid-fleet-002",
      //   licensePlate: "L 5678 DEF",
      //   truckImage: "/img/mock-armada/two.png",
      //   truckType: {
      //     id: "uuid-truck-type-001",
      //     name: "Truck Engkel",
      //     maxWeight: 5.0,
      //   },
      //   carrierTruck: {
      //     id: "uuid-carrier-002",
      //     name: "Wing Box",
      //     description: "Wing box untuk loading samping",
      //   },
      //   vehicleBrand: {
      //     id: "uuid-brand-002",
      //     name: "Hino",
      //   },
      //   vehicleType: {
      //     id: "uuid-vehicle-type-002",
      //     name: "Dutro",
      //   },
      //   registrationYear: 2021,
      //   driver: {
      //     id: "uuid-driver-002",
      //     name: "Budi Santoso",
      //     phoneNumber: "081234567891",
      //     profileImage: "/img/mock-armada/driver.png",
      //     driverStatus: "AVAILABLE",
      //     simExpiryDate: "2026-03-15",
      //     verificationStatus: "VERIFIED",
      //   },
      //   fleetStatus: "ACTIVE",
      //   operationalStatus: "READY_FOR_ORDER",
      //   lastLocation: {
      //     latitude: -6.2095,
      //     longitude: 106.846,
      //     lastUpdate: formatDateForAPI(today, 13),
      //   },
      //   documents: {
      //     stnkExpiry: "2026-01-10",
      //     kirExpiry: "2025-05-15",
      //     isDocumentValid: true,
      //   },
      //   nearestSchedule: {
      //     date: formatDateForAPI(tomorrow, 16),
      //     orderCode: "MT240002",
      //   },
      //   isPotentialOverload: true,
      // },
      // {
      //   id: "uuid-fleet-003",
      //   licensePlate: "N 9012 GHI",
      //   truckImage: "/img/mock-armada/three.png",
      //   truckType: {
      //     id: "uuid-truck-type-001",
      //     name: "Truck Engkel",
      //     maxWeight: 5.0,
      //   },
      //   carrierTruck: {
      //     id: "uuid-carrier-001",
      //     name: "Box",
      //     description: "Box tertutup untuk barang umum",
      //   },
      //   vehicleBrand: {
      //     id: "uuid-brand-003",
      //     name: "Isuzu",
      //   },
      //   vehicleType: {
      //     id: "uuid-vehicle-type-003",
      //     name: "Elf",
      //   },
      //   registrationYear: 2019,
      //   driver: {
      //     id: "uuid-driver-003",
      //     name: "Ahmad Rizki",
      //     phoneNumber: "081234567892",
      //     profileImage: "/img/mock-armada/driver.png",
      //     driverStatus: "ON_DUTY",
      //     simExpiryDate: "2025-09-20",
      //     verificationStatus: "VERIFIED",
      //   },
      //   fleetStatus: "ACTIVE",
      //   operationalStatus: "ON_DUTY",
      //   lastLocation: {
      //     latitude: -6.21,
      //     longitude: 106.8465,
      //     lastUpdate: formatDateForAPI(today, 12),
      //   },
      //   documents: {
      //     stnkExpiry: "2025-06-25",
      //     kirExpiry: "2024-11-30",
      //     isDocumentValid: true,
      //   },
      //   nearestSchedule: null,
      //   isPotentialOverload: false,
      // },
      // {
      //   id: "uuid-fleet-004",
      //   licensePlate: "D 3456 JKL",
      //   truckImage: "/img/mock-armada/one.png",
      //   truckType: {
      //     id: "uuid-truck-type-001",
      //     name: "Truck Engkel",
      //     maxWeight: 5.0,
      //   },
      //   carrierTruck: {
      //     id: "uuid-carrier-003",
      //     name: "Flatbed",
      //     description: "Flatbed untuk material konstruksi",
      //   },
      //   vehicleBrand: {
      //     id: "uuid-brand-001",
      //     name: "Mitsubishi",
      //   },
      //   vehicleType: {
      //     id: "uuid-vehicle-type-004",
      //     name: "Fuso",
      //   },
      //   registrationYear: 2022,
      //   driver: {
      //     id: "uuid-driver-004",
      //     name: "Siti Nurhaliza",
      //     phoneNumber: "081234567893",
      //     profileImage: "/img/mock-armada/driver.png",
      //     driverStatus: "AVAILABLE",
      //     simExpiryDate: "2027-02-28",
      //     verificationStatus: "VERIFIED",
      //   },
      //   fleetStatus: "ACTIVE",
      //   operationalStatus: "READY_FOR_ORDER",
      //   lastLocation: {
      //     latitude: -6.2085,
      //     longitude: 106.845,
      //     lastUpdate: formatDateForAPI(today, 15),
      //   },
      //   documents: {
      //     stnkExpiry: "2027-03-20",
      //     kirExpiry: "2026-07-15",
      //     isDocumentValid: true,
      //   },
      //   nearestSchedule: null,
      //   isPotentialOverload: false,
      // },
      // {
      //   id: "uuid-fleet-005",
      //   licensePlate: "F 7890 MNO",
      //   truckImage: "/img/mock-armada/two.png",
      //   truckType: {
      //     id: "uuid-truck-type-001",
      //     name: "Truck Engkel",
      //     maxWeight: 5.0,
      //   },
      //   carrierTruck: {
      //     id: "uuid-carrier-001",
      //     name: "Box",
      //     description: "Box tertutup untuk barang umum",
      //   },
      //   vehicleBrand: {
      //     id: "uuid-brand-002",
      //     name: "Hino",
      //   },
      //   vehicleType: {
      //     id: "uuid-vehicle-type-005",
      //     name: "Ranger",
      //   },
      //   registrationYear: 2018,
      //   driver: {
      //     id: "uuid-driver-005",
      //     name: "Eko Prasetyo",
      //     phoneNumber: "081234567894",
      //     profileImage: "/img/mock-armada/driver.png",
      //     driverStatus: "REST",
      //     simExpiryDate: "2025-05-10",
      //     verificationStatus: "VERIFIED",
      //   },
      //   fleetStatus: "ACTIVE",
      //   operationalStatus: "WAITING_LOADING_TIME",
      //   lastLocation: {
      //     latitude: -6.209,
      //     longitude: 106.8455,
      //     lastUpdate: formatDateForAPI(today, 11),
      //   },
      //   documents: {
      //     stnkExpiry: "2025-04-12",
      //     kirExpiry: "2024-09-25",
      //     isDocumentValid: true,
      //   },
      //   nearestSchedule: {
      //     date: formatDateForAPI(tomorrow, 10),
      //     orderCode: "MT240003",
      //   },
      //   isPotentialOverload: false,
      // },
    ],
  },
  Type: "AVAILABLE_VEHICLES_LIST",
};

export const fetcherAvailableVehicles = async (cacheKey) => {
  // Extract orderId from cache key
  const orderId = cacheKey.split("/").pop();
  const url = `/v1/transporter/orders/${orderId}/available-vehicle`;

  if (isMockAvailableVehicles) {
    return mockApiResultAvailableVehicles.Data;
  }

  const result = await fetcherMuatrans.get(url);
  return result?.data?.Data || {};
};

export const useGetAvailableVehiclesList = (orderId) => {
  const cacheKey = orderId ? `available-vehicles/${orderId}` : null;

  return useSWR(cacheKey, fetcherAvailableVehicles);
};
