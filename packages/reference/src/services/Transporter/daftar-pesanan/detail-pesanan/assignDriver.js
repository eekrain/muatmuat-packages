import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// Use mock data for development since server data is not available yet
const useMockData = false;

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Driver assignment updated successfully",
    },
    Data: {
      orderId: "dcdaf886-56d6-4d84-89d6-a21ec18d0bc1",
      vehicleId: "fleet-uuid-001",
      changeId: "change-uuid-002",
      previousDriver: {
        driverId: "old-driver-uuid",
        name: "Jane Old",
        phoneNumber: "081111111111",
      },
      newDriver: {
        driverId: "driver-uuid-001",
        name: "John Doe",
        phoneNumber: "081234567890",
        profileImage: "https://example.com/driver.jpg",
      },
      vehicle: {
        licensePlate: "B 1234 ABC",
        truckType: "Colt Diesel Engkel - Box",
      },
      changeDetails: {
        changedAt: "2025-03-15T14:30:00Z",
        changedBy: "user-uuid-001",
        reason: "Driver sebelumnya berhalangan hadir",
        effectiveTime: "2025-03-15T15:00:00Z",
      },
      notifications: {
        driverNotified: true,
        customerNotified: true,
        previousDriverNotified: true,
      },
    },
    Type: "DRIVER_UPDATE",
  },
};

// Fetcher function
export const assignDriver = async (orderId, vehicleId, requestBody) => {
  let result;
  if (useMockData) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    result = mockAPIResult;
  } else {
    result = await fetcherMuatrans.put(
      `/v1/transporter/orders/${orderId}/vehicles/${vehicleId}/driver`,
      requestBody
    );
  }
  const data = result.data.Data;
  return data;
};

// Hook for assigning driver
export const useAssignDriver = (orderId, vehicleId, requestBody) =>
  useSWR(requestBody ? `assign-driver/${orderId}/${vehicleId}` : null, () =>
    assignDriver(orderId, vehicleId, requestBody)
  );
