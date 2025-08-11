import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const isMockFleetLocations = true;

const apiResultFleetLocations = {
  data: {
    Message: {
      Code: 200,
      Text: "Fleet locations retrieved successfully",
    },
    Data: {
      fleets: [
        {
          id: "fleet-uuid-1",
          licensePlate: "B1234ABC",
          driverName: "John Doe",
          latitude: -6.2088, // Jakarta - Monas area
          longitude: 106.8456,
          heading: 45, // Direction in degrees (0=North, 90=East, 180=South, 270=West)
          lastLocationUpdate: "2025-07-25T10:30:00Z",
          operationalStatus: "ON_DUTY",
          statusColor: "blue",
          hasSOSAlert: false,
          needsResponseChange: true,
        },
        {
          id: "uuid-fleet-id-2",
          licensePlate: "L 5678 DEF",
          driverName: "Siti Rahayu",
          latitude: -6.9175, // Bandung city center
          longitude: 107.6191,
          heading: 180,
          lastLocationUpdate: "2024-04-01T10:25:00Z",
          operationalStatus: "READY_FOR_ORDER",
          statusColor: "green",
          hasSOSAlert: false,
          needsResponseChange: false,
        },
        {
          id: "uuid-fleet-id-3",
          licensePlate: "L 9012 GHI",
          driverName: "Ahmad Fauzi",
          latitude: -6.9903, // Semarang - Simpang Lima area
          longitude: 110.4229,
          heading: 270,
          lastLocationUpdate: "2024-04-01T10:20:00Z",
          operationalStatus: "NOT_PAIRED",
          statusColor: "gray",
          hasSOSAlert: false,
          needsResponseChange: false,
        },
        {
          id: "uuid-fleet-id-4",
          licensePlate: "L 3456 JKL",
          driverName: "Eko Prasetyo",
          latitude: -7.7956, // Yogyakarta - Malioboro area
          longitude: 110.3695,
          heading: 135,
          lastLocationUpdate: "2024-04-01T10:28:00Z",
          operationalStatus: "WAITING_LOADING_TIME",
          statusColor: "yellow",
          hasSOSAlert: false,
          needsResponseChange: false,
        },
        {
          id: "uuid-fleet-id-5",
          licensePlate: "L 7890 MNO",
          driverName: "Dewi Lestari",
          latitude: -7.2575, // Surabaya - Tunjungan Plaza area
          longitude: 112.7378,
          heading: 0,
          lastLocationUpdate: "2024-04-01T10:15:00Z",
          operationalStatus: "INACTIVE",
          statusColor: "red",
          hasSOSAlert: true,
          needsResponseChange: false,
        },
      ],
      pagination: {
        page: 1,
        limit: 100,
        total: 5,
        totalPages: 1,
      },
    },
    Type: "GET_FLEET_LOCATIONS",
  },
};

export const fetcherFleetLocations = async () => {
  if (isMockFleetLocations) {
    const result = apiResultFleetLocations;
    return result.data.Data;
  }

  const result = await fetcherMuatrans.get("v1/monitoring/fleet-locations");
  return result?.data?.Data || {};
};

export const useGetFleetLocations = () => {
  const cacheKey = "monitoring-fleet-locations";

  return useSWR(cacheKey, fetcherFleetLocations);
};
