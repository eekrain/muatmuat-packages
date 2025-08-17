import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// Use mock data for development since server data is not available yet
const useMockData = true;
// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Fleet tracking data retrieved successfully",
    },
    Data: {
      orderInfo: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        orderCode: "ORD-2024-001",
        orderStatus: "SELESAI",
      },
      fleetSummary: {
        totalFleet: 1,
        activeFleet: 0,
        completedFleet: 1,
      },
      fleetDetails: [
        {
          id: "550e8400-e29b-41d4-a716-446655440001",
          licensePlate: "B 1234 XYZ",
          truckType: "Fuso Box",
          driverInfo: {
            id: "550e8400-e29b-41d4-a716-446655440002",
            name: "Agus Setiawan",
            phoneNumber: "081234567890",
            profileImage: "https://storage.com/drivers/agus.jpg",
          },
          fleetStatus: "COMPLETED",
          milestones: [
            {
              id: "550e8400-e29b-41d4-a716-446655440003",
              statusName: "Armada Tiba di Lokasi Muat",
              completedAt: "2024-01-15T08:30:00Z",
              isCompleted: true,
              icon: "map-pin",
              colorCode: "#4CAF50",
            },
            {
              id: "550e8400-e29b-41d4-a716-446655440004",
              statusName: "Proses Muat Selesai",
              completedAt: "2024-01-15T10:00:00Z",
              isCompleted: true,
              icon: "package",
              colorCode: "#4CAF50",
            },
            {
              id: "550e8400-e29b-41d4-a716-446655440005",
              statusName: "Dalam Perjalanan ke Tujuan",
              completedAt: "2024-01-15T10:15:00Z",
              isCompleted: true,
              icon: "truck",
              colorCode: "#4CAF50",
            },
            {
              id: "550e8400-e29b-41d4-a716-446655440006",
              statusName: "Tiba di Lokasi Bongkar",
              completedAt: "2024-01-15T18:30:00Z",
              isCompleted: true,
              icon: "map-pin",
              colorCode: "#4CAF50",
            },
            {
              id: "550e8400-e29b-41d4-a716-446655440007",
              statusName: "Proses Bongkar Selesai",
              completedAt: "2024-01-15T20:00:00Z",
              isCompleted: true,
              icon: "check-circle",
              colorCode: "#4CAF50",
            },
          ],
          lastLocationUpdate: "2024-01-15T20:00:00Z",
          hasDetailButton: true,
        },
      ],
    },
    Type: "GET_FLEET_TRACKING",
  },
};

// Fetcher function
export const getFleetTracking = async (orderId) => {
  let result;
  if (useMockData) {
    result = mockAPIResult;
  } else {
    result = await fetcherMuatrans.get(
      `/v1/transporter/orders/${orderId}/fleet-tracking`
    );
  }
  const data = result.data.Data;
  return data;
};

// SWR Hook
export const useGetFleetTracking = (orderId) =>
  useSWR(`fleet-tracking/${orderId}`, () => getFleetTracking(orderId));
