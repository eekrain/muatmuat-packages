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
          licensePlate: "B7890JKL",
          driverName: "Robert Brown",
          transporterName: "CV Moga Jaya Abadi",
          latitude: -6.3972,
          longitude: 106.8249,
          heading: 0,
          lastLocationUpdate: "2025-07-25T11:30:00Z",
          lastLocation: "Sawangan, Depok",
          operationalStatus: "ON_DUTY",
          statusColor: "blue",
          hasSOSAlert: true,
          needsResponseChange: false,
        },
        {
          id: "fleet-uuid-90",
          licensePlate: "B7890JKL",
          driverName: "Robert Brown",
          transporterName: "CV Moga Jaya Abadi",
          latitude: -6.3972,
          longitude: 106.8249,
          heading: 45,
          lastLocationUpdate: "2025-07-25T11:30:00Z",
          lastLocation: "Sawangan, Depok",
          operationalStatus: "ON_DUTY",
          statusColor: "blue",
          hasSOSAlert: true,
          needsResponseChange: false,
        },
        {
          id: "fleet-uuid-1",
          licensePlate: "B1234ABC",
          driverName: "John Doe",
          transporterName: "PT Transport Sejahtera",
          latitude: -6.2088,
          longitude: 106.8456,
          heading: 90,
          lastLocationUpdate: "2025-07-25T10:30:00Z",
          lastLocation: "Gubeng, Surabaya",
          operationalStatus: "ON_DUTY",
          statusColor: "blue",
          hasSOSAlert: false,
          needsResponseChange: true,
        },
        {
          id: "fleet-uuid-2",
          licensePlate: "B5678XYZ",
          driverName: "Jane Smith",
          transporterName: "PT Transport Sejahtera",
          latitude: -6.9175,
          longitude: 107.6191,
          heading: 135,
          lastLocationUpdate: "2025-07-25T11:00:00Z",
          lastLocation: "Kiaracondong, Bandung",
          operationalStatus: "ON_DUTY",
          statusColor: "blue",
          hasSOSAlert: false,
          needsResponseChange: false,
        },
        {
          id: "fleet-uuid-3",
          licensePlate: "B9876DEF",
          driverName: null,
          transporterName: "PT Transport Sejahtera",
          latitude: -6.3025,
          longitude: 106.8951,
          heading: 180,
          lastLocationUpdate: "2025-07-25T09:45:00Z",
          lastLocation: "Cipayung, Jakarta Timur",
          operationalStatus: "NOT_PAIRED",
          statusColor: "gray",
          hasSOSAlert: false,
          needsResponseChange: false,
        },
        {
          id: "fleet-uuid-4",
          licensePlate: "B4321GHI",
          driverName: "Sarah Williams",
          transporterName: "PT Transport Sejahtera",
          latitude: -6.1753,
          longitude: 106.8266,
          heading: 225,
          lastLocationUpdate: "2025-07-25T10:15:00Z",
          lastLocation: "Gambir, Jakarta Pusat",
          operationalStatus: "WAITING_LOADING_TIME",
          statusColor: "yellow",
          hasSOSAlert: false,
          needsResponseChange: false,
        },
        {
          id: "fleet-uuid-6",
          licensePlate: "B2468MNO",
          driverName: "Linda Davis",
          transporterName: "PT Transport Sejahtera",
          latitude: -6.2618,
          longitude: 106.8106,
          heading: 270,
          lastLocationUpdate: "2025-07-25T10:00:00Z",
          lastLocation: "Grogol, Jakarta Barat",
          operationalStatus: "READY_FOR_ORDER",
          statusColor: "green",
          hasSOSAlert: false,
          needsResponseChange: false,
        },
        {
          id: "fleet-uuid-7",
          licensePlate: "B1357PQR",
          driverName: "James Wilson",
          transporterName: "PT Transport Sejahtera",
          latitude: -6.1241,
          longitude: 106.7786,
          heading: 315,
          lastLocationUpdate: "2025-07-25T09:30:00Z",
          lastLocation: "Penjaringan, Jakarta Utara",
          operationalStatus: "ON_DUTY",
          statusColor: "blue",
          hasSOSAlert: false,
          needsResponseChange: false,
        },
        {
          id: "fleet-uuid-8",
          licensePlate: "B8642STU",
          driverName: "Patricia Martinez",
          transporterName: "PT Transport Sejahtera",
          latitude: -6.5944,
          longitude: 106.7892,
          heading: 0,
          lastLocationUpdate: "2025-07-25T11:45:00Z",
          lastLocation: "Ciledug, Tangerang",
          operationalStatus: "INACTIVE",
          statusColor: "red",
          hasSOSAlert: false,
          needsResponseChange: false,
        },
        {
          id: "uuid-fleet-id-2",
          licensePlate: "L 5678 DEF",
          driverName: "Siti Rahayu",
          transporterName: "PT Transport Sejahtera",
          latitude: -6.9175,
          longitude: 107.6191,
          heading: 45,
          lastLocationUpdate: "2024-04-01T10:25:00Z",
          lastLocation: "Dago, Bandung",
          operationalStatus: "READY_FOR_ORDER",
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
