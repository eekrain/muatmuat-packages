import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

export const mockSOSRealtimeLocations = {
  data: {
    Message: {
      Code: 200,
      Text: "SOS locations retrieved successfully",
    },
    Data: {
      timestamp: "2025-08-04T14:30:00Z",
      locations: [
        {
          sosId: "123e4567-e89b-12d3-a456-426614174000",
          fleetId: "fleet456",
          licensePlate: "B1234CD",
          sosLatitude: -6.123456,
          sosLongitude: 106.789123,
          lastUpdated: "2025-08-04T14:29:50Z",
          sosStatus: "OPEN",
          isUrgent: false,
          countdownMinutes: -45,
          transporter: {
            id: "trans123",
            companyName: "PT ABC Transport",
          },
        },
        {
          sosId: "456e7890-e12b-34c5-d678-901234567890",
          fleetId: "fleet789",
          licensePlate: "B5678EF",
          sosLatitude: -6.234567,
          sosLongitude: 106.876543,
          lastUpdated: "2025-08-04T14:29:45Z",
          sosStatus: "IN_PROGRESS",
          isUrgent: true,
          countdownMinutes: -120,
          transporter: {
            id: "trans456",
            companyName: "PT XYZ Logistics",
          },
        },
        {
          sosId: "789e0123-e45b-67c8-d901-234567890123",
          fleetId: "fleet012",
          licensePlate: "B9012GH",
          sosLatitude: -6.345678,
          sosLongitude: 106.765432,
          lastUpdated: "2025-08-04T14:29:40Z",
          sosStatus: "ACKNOWLEDGED",
          isUrgent: false,
          countdownMinutes: -180,
          transporter: {
            id: "trans789",
            companyName: "PT DEF Cargo",
          },
        },
        {
          sosId: "101e1122-e33b-44c5-d556-667788990011",
          fleetId: "fleet345",
          licensePlate: "B3456IJ",
          sosLatitude: -6.456789,
          sosLongitude: 106.654321,
          lastUpdated: "2025-08-04T14:29:35Z",
          sosStatus: "OPEN",
          isUrgent: true,
          countdownMinutes: 30,
          transporter: {
            id: "trans101",
            companyName: "PT GHI Express",
          },
        },
        {
          sosId: "202e2233-e44b-55c6-d667-778899001122",
          fleetId: "fleet567",
          licensePlate: "B5678KL",
          sosLatitude: -6.56789,
          sosLongitude: 106.54321,
          lastUpdated: "2025-08-04T14:29:30Z",
          sosStatus: "IN_PROGRESS",
          isUrgent: false,
          countdownMinutes: -90,
          transporter: {
            id: "trans202",
            companyName: "PT JKL Freight",
          },
        },
      ],
      mapBounds: {
        north: -6.123456,
        south: -6.56789,
        east: 106.876543,
        west: 106.54321,
      },
      totalActive: 5,
    },
    Type: "SOS_LOCATIONS",
  },
};

export const mockSOSRealtimeLocationsFiltered = {
  data: {
    Message: {
      Code: 200,
      Text: "SOS locations retrieved successfully",
    },
    Data: {
      timestamp: "2025-08-04T14:30:00Z",
      locations: [
        {
          sosId: "123e4567-e89b-12d3-a456-426614174000",
          fleetId: "fleet456",
          licensePlate: "B1234CD",
          sosLatitude: -6.123456,
          sosLongitude: 106.789123,
          lastUpdated: "2025-08-04T14:29:50Z",
          sosStatus: "OPEN",
          isUrgent: false,
          countdownMinutes: -45,
          transporter: {
            id: "trans123",
            companyName: "PT ABC Transport",
          },
        },
        {
          sosId: "456e7890-e12b-34c5-d678-901234567890",
          fleetId: "fleet789",
          licensePlate: "B5678EF",
          sosLatitude: -6.234567,
          sosLongitude: 106.876543,
          lastUpdated: "2025-08-04T14:29:45Z",
          sosStatus: "IN_PROGRESS",
          isUrgent: true,
          countdownMinutes: -120,
          transporter: {
            id: "trans456",
            companyName: "PT XYZ Logistics",
          },
        },
      ],
      mapBounds: {
        north: -6.123456,
        south: -6.234567,
        east: 106.876543,
        west: 106.789123,
      },
      totalActive: 2,
    },
    Type: "SOS_LOCATIONS",
  },
};

export const mockSOSRealtimeLocationsEmpty = {
  data: {
    Message: {
      Code: 200,
      Text: "No active SOS locations found",
    },
    Data: {
      timestamp: "2025-08-04T14:30:00Z",
      locations: [],
      mapBounds: {
        north: 0,
        south: 0,
        east: 0,
        west: 0,
      },
      totalActive: 0,
    },
    Type: "SOS_LOCATIONS_EMPTY",
  },
};

export const getSOSRealtimeLocations = async (params = {}) => {
  const { refresh = false, bbox = "" } = params;

  let result;

  if (useMockData) {
    // Simulate different scenarios based on parameters
    if (bbox) {
      // Parse bounding box and filter locations
      const bboxCoords = bbox
        .split(",")
        .map((coord) => parseFloat(coord.trim()));

      if (bboxCoords.length === 4) {
        const [west, south, east, north] = bboxCoords;

        // Filter locations within bounding box
        const filteredLocations =
          mockSOSRealtimeLocations.data.Data.locations.filter(
            (location) =>
              location.sosLatitude >= south &&
              location.sosLatitude <= north &&
              location.sosLongitude >= west &&
              location.sosLongitude <= east
          );

        if (filteredLocations.length > 0) {
          // Calculate new map bounds for filtered area
          const latitudes = filteredLocations.map((loc) => loc.sosLatitude);
          const longitudes = filteredLocations.map((loc) => loc.sosLongitude);

          const newMapBounds = {
            north: Math.max(...latitudes),
            south: Math.min(...latitudes),
            east: Math.max(...longitudes),
            west: Math.min(...longitudes),
          };

          result = {
            ...mockSOSRealtimeLocations.data,
            Data: {
              timestamp: new Date().toISOString(),
              locations: filteredLocations,
              mapBounds: newMapBounds,
              totalActive: filteredLocations.length,
            },
          };
        } else {
          result = mockSOSRealtimeLocationsEmpty.data;
          result.data.Data.timestamp = new Date().toISOString();
        }
      } else {
        // Invalid bbox format, return all locations
        result = mockSOSRealtimeLocations.data;
        result.data.Data.timestamp = new Date().toISOString();
      }
    } else {
      // No bbox filter, return all locations
      result = mockSOSRealtimeLocations.data;
      result.data.Data.timestamp = new Date().toISOString();
    }

    // Simulate refresh behavior
    if (refresh) {
      // Update timestamps to simulate fresh data
      result.data.Data.locations = result.data.Data.locations.map(
        (location) => ({
          ...location,
          lastUpdated: new Date().toISOString(),
        })
      );
    }
  } else {
    try {
      result = await fetcherMuatrans.get(`/v1/cs/sos/locations`, {
        params: { refresh, bbox },
      });
    } catch (error) {
      // Handle error response
      return {
        data: {
          Message: {
            Code: error.response?.status || 500,
            Text:
              error.response?.data?.Message?.Text ||
              "Failed to retrieve SOS realtime locations",
          },
          Data: {
            timestamp: new Date().toISOString(),
            locations: [],
            mapBounds: {
              north: 0,
              south: 0,
              east: 0,
              west: 0,
            },
            totalActive: 0,
          },
          Type: "SOS_LOCATIONS_ERROR",
        },
        raw: error.response,
      };
    }
  }

  return {
    data: result?.data || {},
    raw: result,
  };
};

export const useGetSOSRealtimeLocations = (params = {}) => {
  const { data, error, isLoading, mutate } = useSWR(
    [`getSOSRealtimeLocations`, params],
    () => getSOSRealtimeLocations(params),
    {
      refreshInterval: 10000, // Refresh every 10 seconds for real-time locations
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      errorRetryInterval: 2000,
    }
  );

  return {
    data: data?.data || {},
    raw: data?.raw,
    isLoading,
    isError: !!error,
    mutate, // Expose mutate for manual refresh
  };
};
