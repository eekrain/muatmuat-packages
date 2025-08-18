import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// Set to true to use mock data, false for a real API call.
const isMockEnabled = true;

// Mock API result with data synchronized with the main fleet list service.
export const mockApiResultCsFleetLocations = {
  data: {
    Message: {
      Code: 200,
      Text: "Fleet locations retrieved successfully",
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
          latitude: -6.3972,
          longitude: 106.8249,
          heading: 0, // Direction in degrees
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
          statusColor: "blue",
          hasSOSAlert: true,
          needsResponseChange: false,
        },
        {
          id: "fleet-uuid-90",
          transporterId: "transporter-mja",
          licensePlate: "B7890JKL",
          operationalStatus: "ON_DUTY",
          verificationStatus: "VERIFICATION_APPROVED",
          driverId: "driver-uuid-5",
          latitude: -6.3972,
          longitude: 106.8249,
          heading: 45, // Direction in degrees
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
          statusColor: "blue",
          hasSOSAlert: true,
          needsResponseChange: false,
        },
        {
          id: "fleet-uuid-1",
          transporterId: "transporter-ts",
          licensePlate: "B1234ABC",
          operationalStatus: "ON_DUTY",
          verificationStatus: "VERIFICATION_APPROVED",
          driverId: "driver-uuid-1",
          latitude: -6.2088,
          longitude: 106.8456,
          heading: 90, // Direction in degrees
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
          statusColor: "blue",
          hasSOSAlert: false,
          needsResponseChange: true,
        },
        {
          id: "fleet-uuid-2",
          transporterId: "transporter-ts",
          licensePlate: "B5678XYZ",
          operationalStatus: "ON_DUTY",
          verificationStatus: "VERIFICATION_APPROVED",
          driverId: "driver-uuid-2",
          latitude: -6.9175,
          longitude: 107.6191,
          heading: 135, // Direction in degrees
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
          statusColor: "blue",
          hasSOSAlert: false,
          needsResponseChange: false,
        },
        {
          id: "fleet-uuid-3",
          transporterId: "transporter-ts",
          licensePlate: "B9876DEF",
          operationalStatus: "NOT_PAIRED",
          verificationStatus: "VERIFICATION_APPROVED",
          driverId: null,
          latitude: -6.3025,
          longitude: 106.8951,
          heading: 180, // Direction in degrees
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
          statusColor: "gray",
          hasSOSAlert: false,
          needsResponseChange: false,
        },
        {
          id: "fleet-uuid-4",
          transporterId: "transporter-ts",
          licensePlate: "B4321GHI",
          operationalStatus: "WAITING_LOADING_TIME",
          verificationStatus: "VERIFICATION_APPROVED",
          driverId: "driver-uuid-4",
          latitude: -6.1753,
          longitude: 106.8266,
          heading: 225, // Direction in degrees
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
          statusColor: "yellow",
          hasSOSAlert: false,
          needsResponseChange: false,
        },
        {
          id: "fleet-uuid-6",
          transporterId: "transporter-ts",
          licensePlate: "B2468MNO",
          operationalStatus: "READY_FOR_ORDER",
          verificationStatus: "VERIFICATION_APPROVED",
          driverId: "driver-uuid-6",
          latitude: -6.2618,
          longitude: 106.8106,
          heading: 270, // Direction in degrees
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
          statusColor: "green",
          hasSOSAlert: false,
          needsResponseChange: false,
        },
        {
          id: "fleet-uuid-7",
          transporterId: "transporter-ts",
          licensePlate: "B1357PQR",
          operationalStatus: "ON_DUTY",
          verificationStatus: "VERIFICATION_APPROVED",
          driverId: "driver-uuid-7",
          latitude: -6.1241,
          longitude: 106.7786,
          heading: 315, // Direction in degrees
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
          statusColor: "blue",
          hasSOSAlert: false,
          needsResponseChange: false,
        },
        {
          id: "fleet-uuid-8",
          transporterId: "transporter-ts",
          licensePlate: "B8642STU",
          operationalStatus: "INACTIVE",
          verificationStatus: "VERIFICATION_APPROVED",
          driverId: "driver-uuid-8",
          latitude: -6.5944,
          longitude: 106.7892,
          heading: 0, // Direction in degrees
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
          statusColor: "red",
          hasSOSAlert: false,
          needsResponseChange: false,
        },
        {
          id: "uuid-fleet-id-2",
          transporterId: "transporter-ts",
          licensePlate: "L 5678 DEF",
          operationalStatus: "READY_FOR_ORDER",
          verificationStatus: "VERIFICATION_APPROVED",
          driverId: "driver-uuid-9",
          latitude: -6.9175,
          longitude: 107.6191,
          heading: 45, // Direction in degrees
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
          statusColor: "green",
          hasSOSAlert: false,
          needsResponseChange: false,
        },
      ],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 10,
        itemsPerPage: 10,
        hasNextPage: false,
        hasPrevPage: false,
      },
      summary: {
        totalActiveFleets: 10,
        statusBreakdown: {
          on_duty: 5,
          ready_to_receive_orders: 2,
          not_paired: 1,
          waiting_loading_time: 1,
          inactive: 1,
        },
      },
    },
    Type: "GET_FLEET_LOCATIONS",
  },
};

/**
 * SWR hook to fetch fleet locations for CS monitoring.
 * @returns {object} The SWR response object containing fleet location data.
 */
export const useGetCsFleetLocations = () => {
  const cacheKey = "cs-fleet-locations";

  return useSWR(cacheKey, fetcherCsFleetLocations);
};

/**
 * Fetcher function for fleet locations.
 * Uses mock data if isMockEnabled is true.
 * @returns {Promise<object>} A promise that resolves to the fleet location data.
 */
export const fetcherCsFleetLocations = async () => {
  if (isMockEnabled) {
    return mockApiResultCsFleetLocations.data.Data;
  }

  const result = await fetcherMuatrans.get("/v1/cs/fleet-locations");
  return result?.data?.Data || {};
};
