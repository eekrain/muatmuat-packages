import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

export const mockSOSRoute = {
  data: {
    Message: {
      Code: 200,
      Text: "SOS route retrieved successfully",
    },
    Data: {
      sosId: "123e4567-e89b-12d3-a456-426614174000",
      fleetId: "fleet456",
      licensePlate: "B1234CD",
      routePoints: [
        {
          latitude: -6.12,
          longitude: 106.785,
          timestamp: "2025-08-04T10:00:00Z",
          address: "Jalan MH Thamrin, Jakarta",
          speed: 45,
        },
        {
          latitude: -6.1215,
          longitude: 106.7875,
          timestamp: "2025-08-04T10:15:00Z",
          address: "Jalan Sudirman, Jakarta",
          speed: 40,
        },
        {
          latitude: -6.123456,
          longitude: 106.789123,
          timestamp: "2025-08-04T10:30:00Z",
          address: "Jalan Sudirman No. 123, Jakarta",
          speed: 0,
          isSosLocation: true,
        },
      ],
      routeSummary: {
        totalDistance: "5.2 km",
        travelTime: "30 menit",
        averageSpeed: "35 km/h",
        lastUpdate: "2025-08-04T10:30:00Z",
      },
      sosLocation: {
        latitude: -6.123456,
        longitude: 106.789123,
        address: "Jalan Sudirman No. 123, Jakarta",
        timestamp: "2025-08-04T10:30:00Z",
      },
    },
    Type: "SOS_ROUTE",
  },
};

export const mockSOSRouteDetailed = {
  data: {
    Message: {
      Code: 200,
      Text: "SOS route retrieved successfully",
    },
    Data: {
      sosId: "456e7890-e12b-34c5-d678-901234567890",
      fleetId: "fleet789",
      licensePlate: "B5678EF",
      routePoints: [
        {
          latitude: -6.1,
          longitude: 106.8,
          timestamp: "2025-08-04T08:00:00Z",
          address: "Depot Muat - Jakarta Utara",
          speed: 0,
        },
        {
          latitude: -6.105,
          longitude: 106.795,
          timestamp: "2025-08-04T08:15:00Z",
          address: "Jalan Tol Jakarta-Cikampek",
          speed: 60,
        },
        {
          latitude: -6.11,
          longitude: 106.79,
          timestamp: "2025-08-04T08:30:00Z",
          address: "Jalan Tol Jakarta-Cikampek",
          speed: 65,
        },
        {
          latitude: -6.115,
          longitude: 106.785,
          timestamp: "2025-08-04T08:45:00Z",
          address: "Jalan Tol Jakarta-Cikampek",
          speed: 70,
        },
        {
          latitude: -6.12,
          longitude: 106.78,
          timestamp: "2025-08-04T09:00:00Z",
          address: "Jalan MH Thamrin, Jakarta",
          speed: 35,
        },
        {
          latitude: -6.1215,
          longitude: 106.7875,
          timestamp: "2025-08-04T09:15:00Z",
          address: "Jalan Sudirman, Jakarta",
          speed: 30,
        },
        {
          latitude: -6.123456,
          longitude: 106.789123,
          timestamp: "2025-08-04T09:30:00Z",
          address: "Jalan Sudirman No. 123, Jakarta",
          speed: 0,
          isSosLocation: true,
        },
      ],
      routeSummary: {
        totalDistance: "12.8 km",
        travelTime: "1 jam 30 menit",
        averageSpeed: "42 km/h",
        lastUpdate: "2025-08-04T09:30:00Z",
      },
      sosLocation: {
        latitude: -6.123456,
        longitude: 106.789123,
        address: "Jalan Sudirman No. 123, Jakarta",
        timestamp: "2025-08-04T09:30:00Z",
      },
    },
    Type: "SOS_ROUTE",
  },
};

export const mockSOSRouteShort = {
  data: {
    Message: {
      Code: 200,
      Text: "SOS route retrieved successfully",
    },
    Data: {
      sosId: "789e0123-e45b-67c8-d901-234567890123",
      fleetId: "fleet012",
      licensePlate: "B5678GH",
      routePoints: [
        {
          latitude: -6.2,
          longitude: 106.7,
          timestamp: "2025-08-04T14:00:00Z",
          address: "Gudang Bongkar - Jakarta Selatan",
          speed: 0,
        },
        {
          latitude: -6.201,
          longitude: 106.701,
          timestamp: "2025-08-04T14:05:00Z",
          address: "Jalan Gatot Subroto",
          speed: 25,
        },
        {
          latitude: -6.202,
          longitude: 106.702,
          timestamp: "2025-08-04T14:10:00Z",
          address: "Jalan Gatot Subroto km 27",
          speed: 0,
          isSosLocation: true,
        },
      ],
      routeSummary: {
        totalDistance: "0.8 km",
        travelTime: "10 menit",
        averageSpeed: "15 km/h",
        lastUpdate: "2025-08-04T14:10:00Z",
      },
      sosLocation: {
        latitude: -6.202,
        longitude: 106.702,
        address: "Jalan Gatot Subroto km 27",
        timestamp: "2025-08-04T14:10:00Z",
      },
    },
    Type: "SOS_ROUTE",
  },
};

export const mockSOSRouteNotFound = {
  data: {
    Message: {
      Code: 404,
      Text: "SOS route not found",
    },
    Data: {
      sosId: "invalid-id",
      fleetId: null,
      licensePlate: null,
      routePoints: [],
      routeSummary: {
        totalDistance: "0 km",
        travelTime: "0 menit",
        averageSpeed: "0 km/h",
        lastUpdate: null,
      },
      sosLocation: null,
    },
    Type: "SOS_ROUTE_NOT_FOUND",
  },
};

export const getRouteSOS = async (id, params = {}) => {
  if (!id) {
    return {
      data: {
        Message: {
          Code: 400,
          Text: "SOS ID is required",
        },
        Data: {
          sosId: "",
          fleetId: null,
          licensePlate: null,
          routePoints: [],
          routeSummary: {
            totalDistance: "0 km",
            travelTime: "0 menit",
            averageSpeed: "0 km/h",
            lastUpdate: null,
          },
          sosLocation: null,
        },
        Type: "SOS_ROUTE_ERROR",
      },
      raw: null,
    };
  }

  let result;

  if (useMockData) {
    // Simulate route data based on SOS ID
    if (id === "123e4567-e89b-12d3-a456-426614174000") {
      result = mockSOSRoute.data;
    } else if (id === "456e7890-e12b-34c5-d678-901234567890") {
      result = mockSOSRouteDetailed.data;
    } else if (id === "789e0123-e45b-67c8-d901-234567890123") {
      result = mockSOSRouteShort.data;
    } else {
      result = mockSOSRouteNotFound.data;
      result.data.Data.sosId = id;
    }
  } else {
    try {
      result = await fetcherMuatrans.get(`/v1/cs/sos/${id}/route`, {
        params,
      });
    } catch (error) {
      // Handle error response
      return {
        data: {
          Message: {
            Code: error.response?.status || 500,
            Text:
              error.response?.data?.Message?.Text ||
              "Failed to retrieve SOS route",
          },
          Data: {
            sosId: id,
            fleetId: null,
            licensePlate: null,
            routePoints: [],
            routeSummary: {
              totalDistance: "0 km",
              travelTime: "0 menit",
              averageSpeed: "0 km/h",
              lastUpdate: null,
            },
            sosLocation: null,
          },
          Type: "SOS_ROUTE_ERROR",
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

export const useGetRouteSOS = (id, params = {}) => {
  const { data, error, isLoading, mutate } = useSWR(
    id ? [`getRouteSOS`, id, params] : null,
    () => getRouteSOS(id, params),
    {
      refreshInterval: 30000, // Refresh every 30 seconds for real-time updates
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  return {
    data: data?.data || {},
    raw: data?.raw,
    isLoading,
    isError: !!error,
    mutate,
  };
};
