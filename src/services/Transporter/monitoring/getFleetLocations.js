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
          id: "fleet-a",
          licensePlate: "L 1234 ABC",
          driverName: "Budi Santoso",
          latitude: -7.2576, // Central Surabaya - Tunjungan area
          longitude: 112.7378,
          heading: 45, // Direction in degrees (0=North, 90=East, 180=South, 270=West)
          lastLocationUpdate: "2024-04-01T10:30:00Z",
          operationalStatus: "ON_DUTY",
          statusColor: "blue",
          hasSOSAlert: false,
          needsResponseChange: true,
        },
        {
          id: "uuid-fleet-id-2",
          licensePlate: "L 5678 DEF",
          driverName: "Siti Rahayu",
          latitude: -7.2582, // Same neighborhood - 60m south
          longitude: 112.7381,
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
          latitude: -7.2571, // Same neighborhood - 50m north
          longitude: 112.7375,
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
          latitude: -7.2578, // Same neighborhood - 20m southeast
          longitude: 112.7384,
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
          latitude: -7.2574, // Same neighborhood - center
          longitude: 112.7379,
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
