import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false;

// Mock API result for development/testing
const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Fleet detailed info retrieved successfully",
    },
    Data: {
      fleetInfo: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        licensePlate: "B 1234 XYZ",
        truckType: "Fuso Box",
        vehicleBrand: "Mitsubishi",
        registrationYear: 2020,
        dimensions: {
          length: 6.0,
          width: 2.5,
          height: 2.8,
          unit: "m",
        },
      },
      driverInfo: {
        id: "550e8400-e29b-41d4-a716-446655440001",
        name: "Agus Setiawan",
        phoneNumber: "081234567890",
        profileImage: "https://storage.com/drivers/agus.jpg",
        licenseExpiry: "2025-12-31",
        verificationStatus: "VERIFIED",
      },
      routeInfo: {
        orderCode: "ORD-2024-001",
        routeType: "COMPLEX",
        pickupLocations: [
          {
            sequence: 1,
            address: "Jakarta Pusat",
            coordinates: {
              latitude: -6.2088,
              longitude: 106.8456,
            },
          },
          {
            sequence: 2,
            address: "Jakarta Timur",
            coordinates: {
              latitude: -6.2614,
              longitude: 106.8978,
            },
          },
        ],
        dropoffLocations: [
          {
            sequence: 1,
            address: "Surabaya Pusat",
            coordinates: {
              latitude: -7.2575,
              longitude: 112.7521,
            },
          },
          {
            sequence: 2,
            address: "Surabaya Timur",
            coordinates: {
              latitude: -7.3318,
              longitude: 112.7763,
            },
          },
        ],
        totalDistance: 850.5,
        estimatedDuration: "12 hours",
      },
      statusHistory: [
        {
          id: "550e8400-e29b-41d4-a716-446655440002",
          mainStatus: "ON_DUTY",
          subStatus: "LOADING_COMPLETED",
          statusName: "Proses Muat Selesai",
          timestamp: "2024-01-15T10:00:00Z",
          location: {
            latitude: -6.2088,
            longitude: 106.8456,
            address: "Jakarta Pusat",
          },
          notes: "Muatan sudah dimuat dengan baik",
        },
      ],
      gpsRoute: {
        hasActiveTracking: true,
        routeHistory: [
          {
            latitude: -6.2088,
            longitude: 106.8456,
            timestamp: "2024-01-15T08:30:00Z",
            speed: 0,
            heading: 45,
          },
          {
            latitude: -6.22,
            longitude: 106.85,
            timestamp: "2024-01-15T09:00:00Z",
            speed: 60,
            heading: 90,
          },
          {
            latitude: -6.23,
            longitude: 106.86,
            timestamp: "2024-01-15T09:30:00Z",
            speed: 45,
            heading: 135,
          },
        ],
        routeVisualization: {
          yellowLine: ["~oifA~i|xSbAcAbBsBfCgDxAgBpBeC"],
          orangeLine: [],
        },
      },
    },
    Type: "GET_FLEET_DETAILED_INFO",
  },
};

// Fetcher function

// Normalizer function to transform fleet detailed info to map format
export const normalizeFleetDataForMap = (data) => {
  if (!data) return null;

  const locationMarkers = [];
  const locationPolyline = [];

  // Add pickup locations
  if (data.routeInfo?.pickupLocations) {
    data.routeInfo.pickupLocations.forEach((point) => {
      locationMarkers.push({
        position: {
          lat: point.coordinates.latitude,
          lng: point.coordinates.longitude,
        },
        title: point.address,
        icon: "/icons/marker-lokasi-muat.svg",
      });
      locationPolyline.push({
        lat: point.coordinates.latitude,
        lng: point.coordinates.longitude,
      });
    });
  }

  // Add dropoff locations
  if (data.routeInfo?.dropoffLocations) {
    data.routeInfo.dropoffLocations.forEach((point) => {
      locationMarkers.push({
        position: {
          lat: point.coordinates.latitude,
          lng: point.coordinates.longitude,
        },
        title: point.address,
        icon: "/icons/marker-lokasi-bongkar.svg",
      });
      locationPolyline.push({
        lat: point.coordinates.latitude,
        lng: point.coordinates.longitude,
      });
    });
  }

  // Add truck marker if GPS route history exists
  if (data.gpsRoute?.routeHistory?.length > 0) {
    const latestPosition =
      data.gpsRoute.routeHistory[data.gpsRoute.routeHistory.length - 1];
    locationMarkers.push({
      position: {
        lat: latestPosition.latitude,
        lng: latestPosition.longitude,
      },
      title: data.fleetInfo?.licensePlate || "Truck",
      icon: "/icons/marker-truck.svg",
      rotation: latestPosition.heading || 0,
      fleet: {
        licensePlate: data.fleetInfo?.licensePlate,
        hasSOSAlert: false, // This should come from actual data
        needsResponseChange: false, // This should come from actual data
      },
      onClick: (marker) => {
        console.log("Truck clicked:", marker);
      },
    });
  }

  // Get encoded polyline from GPS route visualization
  const encodedTruckPolyline =
    data.gpsRoute?.routeVisualization?.yellowLine?.length > 0
      ? data.gpsRoute.routeVisualization.yellowLine.join(",")
      : null;

  return { locationMarkers, locationPolyline, encodedTruckPolyline };
};
export const getFleetDetailedInfo = async (fleetId) => {
  let result;
  if (useMockData) {
    result = mockAPIResult;
  } else {
    result = await fetcherMuatrans.get(
      `/v1/transporter/fleet/${fleetId}/detailed-info`
    );
  }

  const data = normalizeFleetDataForMap(result?.data?.Data);
  return data;
};
// SWR hook for GET request
export const useGetFleetDetailedInfo = (fleetId) =>
  useSWR(fleetId ? `fleet-detailed-info/${fleetId}` : null, () =>
    getFleetDetailedInfo(fleetId)
  );
