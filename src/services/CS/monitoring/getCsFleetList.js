import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// Set to true to use mock data, false for a real API call.
const isMockEnabled = true;

// Mock API result matching the /v1/cs/fleet contract with the new fleet data
export const mockApiResultCsFleet = {
  data: {
    Message: {
      Code: 200,
      Text: "Fleet list retrieved successfully",
    },
    Data: {
      fleets: [
        {
          id: "fleet-uuid-5",
          transporterId: "transporter-mja",
          licensePlate: "B7890JKL",
          operationalStatus: "ON_DUTY",
          verificationStatus: "VERIFICATION_APPROVED",
          driverId: "driver-uuid-5",
          lastLatitude: -6.3972,
          lastLongitude: 106.8249,
          lastLocation: "Sawangan, Depokasdfasdfs",
          lastLocationUpdate: "2025-07-25T11:30:00Z",
          transporter: {
            id: "transporter-mja",
            companyName: "CV Moga Jaya Abadi",
            picPhone1: "+628333444555",
          },
          driver: {
            id: "driver-uuid-5",
            name: "Robert Brown",
            phoneNumber: "+628333444555",
          },
          vehicleType: { name: "Box" },
          hasSOSAlert: true,
          detailSOS: {
            sosId: "sos-uuid-2",
            sosCategory: "MECHANICAL_ISSUE",
            description: "Mesin overheating",
            reportAt: "2025-07-25T11:20:00Z",
            completedAt: "2025-07-25T11:20:00Z",
            photos: ["/img/kanan.png", "/img/kiri.png"],
            sosStatus: "NEW",
          },
          needsResponseChange: false,
        },
        {
          id: "fleet-uuid-90",
          transporterId: "transporter-mja",
          licensePlate: "B7890JKL",
          operationalStatus: "ON_DUTY",
          verificationStatus: "VERIFICATION_APPROVED",
          driverId: "driver-uuid-5",
          lastLatitude: -6.3972,
          lastLongitude: 106.8249,
          lastLocation: "Sawangan, Depokasdfasdfs",
          lastLocationUpdate: "2025-07-25T11:30:00Z",
          transporter: {
            id: "transporter-mja",
            companyName: "CV Moga Jaya Abadi",
            picPhone1: "+628333444555",
          },
          driver: {
            id: "driver-uuid-5",
            name: "Robert Brown",
            phoneNumber: "+628333444555",
          },
          vehicleType: { name: "Box" },
          hasSOSAlert: true,
          detailSOS: {
            sosId: "sos-uuid-80",
            sosCategory: null,
            description: null,
            reportAt: "2025-07-25T11:20:00Z",
            photos: ["/img/kanan.png", "/img/kiri.png"],
            sosStatus: "NEW",
          },
          needsResponseChange: false,
        },
        {
          id: "fleet-uuid-1",
          transporterId: "transporter-ts",
          licensePlate: "B1234ABC",
          operationalStatus: "ON_DUTY",
          verificationStatus: "VERIFICATION_APPROVED",
          driverId: "driver-uuid-1",
          lastLatitude: -6.2088,
          lastLongitude: 106.8456,
          lastLocation: "Gubeng, Surabaya",
          lastLocationUpdate: "2025-07-25T10:30:00Z",
          transporter: {
            id: "transporter-ts",
            companyName: "PT Transport Sejahtera",
            picPhone1: "+628123456789",
          },
          driver: {
            id: "driver-uuid-1",
            name: "John Doe",
            phoneNumber: "+628123456789",
          },
          vehicleType: { name: "Pickup" },
          hasSOSAlert: false,
          detailSOS: null,
          needsResponseChange: true,
        },
        {
          id: "fleet-uuid-2",
          transporterId: "transporter-ts",
          licensePlate: "B5678XYZ",
          operationalStatus: "ON_DUTY",
          verificationStatus: "VERIFICATION_APPROVED",
          driverId: "driver-uuid-2",
          lastLatitude: -6.9175,
          lastLongitude: 107.6191,
          lastLocation: "Kiaracondong, Bandung",
          lastLocationUpdate: "2025-07-25T11:00:00Z",
          transporter: {
            id: "transporter-ts",
            companyName: "PT Transport Sejahtera",
            picPhone1: "+628987654321",
          },
          driver: {
            id: "driver-uuid-2",
            name: "Jane Smith",
            phoneNumber: "+628987654321",
          },
          vehicleType: { name: "Box" },
          hasSOSAlert: false,
          detailSOS: {
            sosId: "sos-uuid-90",
            sosCategory: "ACCIDENT",
            description: "Kecelakaan di tol km 23",
            reportAt: "2025-07-25T11:20:00Z",
            completedAt: "2025-07-25T11:20:00Z",
            photos: ["/img/kanan.png", "/img/kiri.png"],
            sosStatus: "ACKNOWLEDGE",
          },
          needsResponseChange: false,
        },
        {
          id: "fleet-uuid-3",
          transporterId: "transporter-ts",
          licensePlate: "B9876DEF",
          operationalStatus: "NOT_PAIRED",
          verificationStatus: "VERIFICATION_APPROVED",
          driverId: null,
          lastLatitude: -6.3025,
          lastLongitude: 106.8951,
          lastLocation: "Cipayung, Jakarta Timur",
          lastLocationUpdate: "2025-07-25T09:45:00Z",
          transporter: {
            id: "transporter-ts",
            companyName: "PT Transport Sejahtera",
            picPhone1: null,
          },
          driver: {
            id: null,
            name: null,
            phoneNumber: null,
          },
          vehicleType: { name: "Tronton" },
          hasSOSAlert: false,
          detailSOS: null,
          needsResponseChange: false,
        },
        {
          id: "fleet-uuid-4",
          transporterId: "transporter-ts",
          licensePlate: "B4321GHI",
          operationalStatus: "WAITING_LOADING_TIME",
          verificationStatus: "VERIFICATION_APPROVED",
          driverId: "driver-uuid-4",
          lastLatitude: -6.1753,
          lastLongitude: 106.8266,
          lastLocation: "Gambir, Jakarta Pusat",
          lastLocationUpdate: "2025-07-25T10:15:00Z",
          transporter: {
            id: "transporter-ts",
            companyName: "PT Transport Sejahtera",
            picPhone1: "+628222333444",
          },
          driver: {
            id: "driver-uuid-4",
            name: "Sarah Williams",
            phoneNumber: "+628222333444",
          },
          vehicleType: { name: "Pickup" },
          hasSOSAlert: false,
          detailSOS: null,
          needsResponseChange: false,
        },
        {
          id: "fleet-uuid-6",
          transporterId: "transporter-ts",
          licensePlate: "B2468MNO",
          operationalStatus: "READY_FOR_ORDER",
          verificationStatus: "VERIFICATION_APPROVED",
          driverId: "driver-uuid-6",
          lastLatitude: -6.2618,
          lastLongitude: 106.8106,
          lastLocation: "Grogol, Jakarta Barat",
          lastLocationUpdate: "2025-07-25T10:00:00Z",
          transporter: {
            id: "transporter-ts",
            companyName: "PT Transport Sejahtera",
            picPhone1: "+628444555666",
          },
          driver: {
            id: "driver-uuid-6",
            name: "Linda Davis",
            phoneNumber: "+628444555666",
          },
          vehicleType: { name: "Engkel" },
          hasSOSAlert: false,
          detailSOS: null,
          needsResponseChange: false,
        },
        {
          id: "fleet-uuid-7",
          transporterId: "transporter-ts",
          licensePlate: "B1357PQR",
          operationalStatus: "ON_DUTY",
          verificationStatus: "VERIFICATION_APPROVED",
          driverId: "driver-uuid-7",
          lastLatitude: -6.1241,
          lastLongitude: 106.7786,
          lastLocation: "Penjaringan, Jakarta Utara",
          lastLocationUpdate: "2025-07-25T09:30:00Z",
          transporter: {
            id: "transporter-ts",
            companyName: "PT Transport Sejahtera",
            picPhone1: "+628555666777",
          },
          driver: {
            id: "driver-uuid-7",
            name: "James Wilson",
            phoneNumber: "+628555666777",
          },
          vehicleType: { name: "Box" },
          hasSOSAlert: false,
          detailSOS: null,
          needsResponseChange: false,
        },
        {
          id: "fleet-uuid-8",
          transporterId: "transporter-ts",
          licensePlate: "B8642STU",
          operationalStatus: "INACTIVE",
          verificationStatus: "VERIFICATION_APPROVED",
          driverId: "driver-uuid-8",
          lastLatitude: -6.5944,
          lastLongitude: 106.7892,
          lastLocation: "Ciledug, Tangerang",
          lastLocationUpdate: "2025-07-25T11:45:00Z",
          transporter: {
            id: "transporter-ts",
            companyName: "PT Transport Sejahtera",
            picPhone1: "+628666777888",
          },
          driver: {
            id: "driver-uuid-8",
            name: "Patricia Martinez",
            phoneNumber: "+628666777888",
          },
          vehicleType: { name: "Tronton" },
          hasSOSAlert: false,
          detailSOS: {
            sosId: "sos-uuid-3",
            sosCategory: "MEDICAL",
            description: "Sopir pingsan",
            reportAt: "2025-07-25T11:40:00Z",
            completedAt: "2025-07-25T11:40:00Z",
            photos: [],
          },
          needsResponseChange: false,
        },
        {
          id: "uuid-fleet-id-2",
          transporterId: "transporter-ts",
          licensePlate: "L 5678 DEF",
          operationalStatus: "READY_FOR_ORDER",
          verificationStatus: "VERIFICATION_APPROVED",
          driverId: "driver-uuid-9",
          lastLatitude: -6.9175,
          lastLongitude: 107.6191,
          lastLocation: "Dago, Bandung",
          lastLocationUpdate: "2024-04-01T10:25:00Z",
          transporter: {
            id: "transporter-ts",
            companyName: "PT Transport Sejahtera",
            picPhone1: "+628777888999",
          },
          driver: {
            id: "driver-uuid-9",
            name: "Siti Rahayu",
            phoneNumber: "+628777888999",
          },
          vehicleType: { name: "Box" },
          hasSOSAlert: false,
          detailSOS: null,
          needsResponseChange: false,
        },
      ],
      pagination: {
        currentPage: 1,
        totalPages: 3,
        totalItems: 10,
        itemsPerPage: 10,
        hasNextPage: true,
        hasPrevPage: false,
      },
      summary: {
        totalActiveFleets: 10,
        statusBreakdown: {
          ready_to_receive_orders: 5,
          on_duty: 15,
          inactive: 1,
          not_paired: 3,
          scheduled_today: 0,
        },
      },
    },
    Type: "FLEET_LIST",
  },
};

export const useGetFleetList = (params = {}) => {
  const cacheKey = ["monitoring-fleet-list", params];
  return useSWR(cacheKey, () => fetcherFleetList(params));
};

export const fetcherFleetList = async (params = {}) => {
  if (isMockEnabled) {
    const filteredData = {
      ...mockApiResultCsFleet.data.Data,
      fleets: mockApiResultCsFleet.data.Data.fleets.filter((fleet) => {
        if (params.truckStatus && params.truckStatus.length > 0) {
          return params.truckStatus.includes(fleet.operationalStatus);
        }
        return true;
      }),
    };
    return filteredData;
  }
  const result = await fetcherMuatrans.get("/v1/fleet-list", { params });
  return result?.data?.Data || {};
};
