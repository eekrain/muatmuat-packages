import useSWRMutation from "swr/mutation";

import { fetcherMuatrans } from "@/lib/axios";

// Mock config for testing
const IS_MOCK = false;

// Mock response for testing
const mockSuccessResponse = {
  data: {
    Message: {
      Code: 200,
      Text: "Fleet assignment completed successfully",
    },
    Data: {
      assignmentId: "uuid",
      orderInfo: {
        id: "uuid",
        orderCode: "ORD-2024-001",
        newStatus: "ARMADA_DIJADWALKAN",
        statusUpdatedAt: "2024-01-15T15:45:00Z",
      },
      assignedFleet: [
        {
          fleetId: "uuid",
          licensePlate: "B 1234 XYZ",
          driverName: "Agus Setiawan",
          driverPhone: "081234567890",
          assignmentStatus: "ASSIGNED",
          estimatedPickupTime: "2024-01-15T08:00:00Z",
          distanceToPickup: 15.2,
          estimatedArrival: "2024-01-15T07:45:00Z",
        },
      ],
      notifications: {
        driverNotified: true,
        shipperNotified: true,
        notificationsSent: [
          {
            recipient: "driver",
            phone: "081234567890",
            method: "SMS",
            sentAt: "2024-01-15T15:45:00Z",
            status: "DELIVERED",
          },
          {
            recipient: "shipper",
            method: "PUSH_NOTIFICATION",
            sentAt: "2024-01-15T15:45:00Z",
            status: "DELIVERED",
          },
        ],
      },
      nextActions: [
        "Driver akan menerima detail pesanan",
        "Armada bersiap menuju lokasi muat",
        "Monitoring perjalanan armada dimulai",
      ],
      timeline: {
        assignedAt: "2024-01-15T15:45:00Z",
        expectedDriverResponse: "2024-01-15T16:00:00Z",
        expectedDeparture: "2024-01-15T07:30:00Z",
        expectedArrival: "2024-01-15T07:45:00Z",
      },
    },
    Type: "ASSIGN_FLEET_TO_ORDER",
  },
};

// Mock error response for testing
const mockConflictResponse = {
  response: {
    status: 409,
    data: {
      Message: {
        Code: 409,
        Text: "Fleet assignment conflict",
      },
      Data: {
        errors: [
          {
            field: "fleetIds",
            message: "Armada B 1234 XYZ sudah di-assign ke pesanan lain",
          },
        ],
        conflictDetails: {
          conflictedFleet: [
            {
              fleetId: "uuid",
              licensePlate: "B 1234 XYZ",
              conflictWith: "ORD-2024-002",
              assignedAt: "2024-01-15T15:30:00Z",
            },
          ],
          availableAlternatives: [
            {
              fleetId: "uuid2",
              licensePlate: "B 5678 ABC",
              distanceToPickup: 18.5,
              estimatedArrival: "2024-01-15T07:50:00Z",
            },
          ],
        },
      },
      Type: "ASSIGN_FLEET_TO_ORDER_ERROR",
    },
  },
};

/**
 * Assign fleet to order
 * @param {string} key - SWR key
 * @param {Object} arg - Request arguments
 * @param {string} arg.arg.orderId - Order ID
 * @param {Object} arg.arg.data - Request payload
 * @returns {Promise} API response
 */
export const fetcherAssignFleetToOrder = async (key, { arg }) => {
  if (IS_MOCK) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock different scenarios for testing
    const scenario = Math.random();

    if (scenario < 0.8) {
      // 80% success
      return mockSuccessResponse.data;
    } else {
      // 20% conflict
      throw mockConflictResponse;
    }
  }

  const { orderId, data } = arg;

  const payload = {
    assignedFleets: data.assignedFleets,
  };

  const result = await fetcherMuatrans.post(
    `/v1/transporter/orders/${orderId}/assign-fleet`,
    payload
  );

  return result?.data.Data || {};
};

/**
 * Hook to assign fleet to order
 * @returns {Object} SWR mutation object with trigger, isMutating, error, data
 */
export const useAssignFleetToOrder = () => {
  return useSWRMutation("assign-fleet-to-order", fetcherAssignFleetToOrder);
};
