import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// Use mock data for development since server data is not available yet
const useMockData = false;

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Vehicle assignment updated successfully",
    },
    Data: {
      orderId: "dcdaf886-56d6-4d84-89d6-a21ec18d0bc1",
      changeId: "change-uuid-001",
      previousVehicle: {
        vehicleId: "old-vehicle-uuid",
        licensePlate: "B 1111 OLD",
        truckType: "Colt Diesel Engkel - Box",
        driver: {
          driverId: "old-driver-uuid",
          name: "Old Driver",
          phoneNumber: "081111111111",
        },
        status: "ARMADA_DIJADWALKAN",
      },
      newVehicle: {
        vehicleId: "fleet-uuid-001",
        licensePlate: "B 1234 XYZ",
        truckType: "Fuso 6 Roda - Box",
        driver: {
          driverId: "driver-uuid-001",
          name: "John Driver",
          phoneNumber: "081234567890",
          profileImage: "https://storage.example.com/driver1.jpg",
        },
        status: "ARMADA_DIJADWALKAN",
      },
      scheduleChanges: {
        loadTimeChanged: false,
        loadTimeStart: "2025-03-15T18:00:00Z",
        loadTimeEnd: "2025-03-15T19:00:00Z",
        routeAffected: false,
      },
      changeDetails: {
        changedAt: "2025-03-15T14:30:00Z",
        changedBy: "user-uuid-001",
        reason: "Armada sebelumnya mengalami kerusakan",
        effectiveTime: "2025-03-15T15:00:00Z",
        penaltyAmount: 0.0,
      },
      notifications: {
        newDriverNotified: true,
        customerNotified: true,
        oldDriverNotified: true,
        dispatcherNotified: true,
      },
      validation: {
        vehicleCapacityCheck: "PASSED",
        driverAvailabilityCheck: "PASSED",
        scheduleConflictCheck: "PASSED",
        routeCompatibilityCheck: "PASSED",
      },
    },
    Type: "VEHICLE_UPDATE",
  },
};

// Fetcher function
export const assignFleet = async (orderId, oldVehicleId, requestBody) => {
  let result;
  if (useMockData) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    result = mockAPIResult;
  } else {
    result = await fetcherMuatrans.put(
      `/v1/transporter/orders/${orderId}/vehicles/${oldVehicleId}/replace`,
      requestBody
    );
  }
  const data = result.data.Data;
  return data;
};

// Hook for assigning fleet
export const useAssignFleet = (orderId, oldVehicleId, requestBody) =>
  useSWR(requestBody ? `assign-fleet/${orderId}/${oldVehicleId}` : null, () =>
    assignFleet(orderId, oldVehicleId, requestBody)
  );
