import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false; // mock detailpesanan

// GET /base_data/v1/orders/tracking/{orderId}/location?driverId={driverId}
const apiResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Fleet location retrieved successfully",
    },
    Data: {
      orderId: "uuid-order-123",
      orderCode: "MTR/250208/001/AAA",
      route: {
        pickupPoints: [
          {
            name: "Lokasi Muat",
            latitude: -7.2445,
            longitude: 112.7723,
          },
          // {
          //   name: "Lokasi Muat 2",
          //   latitude: -7.2601,
          //   longitude: 112.7589,
          // },
        ],
        dropoffPoints: [
          {
            name: "Lokasi Bongkar",
            latitude: -7.2504,
            longitude: 112.7344,
          },
          // {
          //   name: "Lokasi Muat 2",
          //   latitude: -7.2601,
          //   longitude: 112.7589,
          // },
        ],
      },
      fleets: [
        {
          fleetId: "uuid-fleet-1",
          driverId: "uuid-driver-1",
          driverName: "Ahmad Rahman",
          licensePlate: "B 1234 CD",
          currentLocation: {
            latitude: -6.25,
            longitude: 106.83,
            accuracy: 10.5,
            heading: 135.0,
            speed: 45.2,
            encodedPolyline: "nffk@_xhoTnd@wQf^f^nKf^gEf^oKnd@wQnd@oKnd@",
            lastUpdate: "2025-02-10T09:45:00Z",
          },
          status: "HEADING_TO_DROPOFF",
          estimatedArrival: {
            nextDestination: "Lokasi Bongkar 1",
            estimatedTime: "2025-02-10T11:30:00Z",
            remainingDistance: 8.5,
          },
        },
      ],
    },
    Type: "FLEET_TRACKING",
  },
};

const normalizeTrackingLocations = (data) => {
  if (!data) return null;
  const locationMarkers = [];
  const locationPolyline = [];
  for (const point of data.route.pickupPoints) {
    locationMarkers.push({
      position: { lat: point.latitude, lng: point.longitude },
      title: point.name,
      icon: "/icons/marker-lokasi-muat.svg",
      type: "pickup",
    });
    locationPolyline.push({ lat: point.latitude, lng: point.longitude });
  }
  for (const point of data.route.dropoffPoints) {
    locationMarkers.push({
      position: { lat: point.latitude, lng: point.longitude },
      title: point.name,
      icon: "/icons/marker-lokasi-bongkar.svg",
      type: "dropoff",
    });
    locationPolyline.push({ lat: point.latitude, lng: point.longitude });
  }
  let encodedTruckPolyline = null;
  if (Array.isArray(data.fleets)) {
    if (data.fleets.length > 0 && data.fleets[0].currentLocation) {
      encodedTruckPolyline = data.fleets[0].currentLocation.encodedPolyline;
    }
  } else if (data.fleets && data.fleets.currentLocation) {
    encodedTruckPolyline = data.fleets.currentLocation.encodedPolyline;
  }
  console.log("DATA TRACKING:", data);

  return { locationMarkers, locationPolyline, encodedTruckPolyline };
};
export const getTrackingLocations = async (cacheKey) => {
  const orderId = cacheKey.split("/")[1];
  const driverId = cacheKey.split("/")[2];
  let response;
  if (useMockData) {
    response = apiResult;
  } else {
    response = await fetcherMuatrans.get(
      `v1/orders/tracking/${orderId}/location?driverId=${driverId}`
    );
  }
  return normalizeTrackingLocations(response?.data?.Data);
};

export const useGetTrackingLocations = (orderId, driverId) =>
  useSWR(`getTrackingLocations/${orderId}/${driverId}`, getTrackingLocations);
