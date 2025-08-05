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
          id: "uuid-fleet-id-1",
          licensePlate: "R1234AA",
          driverName: "John Doe",
          latitude: -7.7264,
          longitude: 109.0079,
          lastLocationUpdate: "2024-04-01T10:30:00Z",
          operationalStatus: "READY_FOR_ORDER",
          statusColor: "green",
          hasSOSAlert: false,
          needsResponseChange: false,
        },
        {
          id: "uuid-fleet-id-2",
          licensePlate: "R5678AB",
          driverName: "Jane Smith",
          latitude: -7.735,
          longitude: 109.015,
          lastLocationUpdate: "2024-04-01T10:25:00Z",
          operationalStatus: "BUSY",
          statusColor: "yellow",
          hasSOSAlert: false,
          needsResponseChange: false,
        },
        {
          id: "uuid-fleet-id-3",
          licensePlate: "R9012AC",
          driverName: "Bob Johnson",
          latitude: -7.718,
          longitude: 109.002,
          lastLocationUpdate: "2024-04-01T10:20:00Z",
          operationalStatus: "READY_FOR_ORDER",
          statusColor: "green",
          hasSOSAlert: true,
          needsResponseChange: false,
        },
      ],
      pagination: {
        page: 1,
        limit: 100,
        total: 25,
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
