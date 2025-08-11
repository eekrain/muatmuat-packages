import useSWRMutation from "swr/mutation";

import { fetcherMuatrans } from "@/lib/axios";

// Mock config for testing
const IS_MOCK = true;

// Mock response untuk testing
const mockSuccessResponse = {
  data: {
    Message: {
      Code: 200,
      Text: "Scheduled request accepted successfully",
    },
    Data: {
      id: "550e8400-e29b-41d4-a716-446655440001",
      orderCode: "MT25A001A",
      acceptedAt: "2025-08-11T10:30:00+07:00",
      acceptedVehicleCount: 2,
      requiredVehicleCount: 2,
      newOrderStatus: "PERLU_ASSIGN_ARMADA",
      nextAction: {
        type: "ASSIGN_VEHICLE",
        description: "Assign vehicles to this order",
        redirectTo: "/orders/active",
      },
      toast: {
        type: "success",
        message: "Permintaan MT25A001A berhasil diterima",
        duration: 6000,
      },
    },
    Type: "ACCEPT_SCHEDULED_TRANSPORT_REQUEST",
  },
};

/**
 * Accept scheduled transport request
 * @param {string} key - SWR key
 * @param {Object} arg - Request arguments
 * @param {string} arg.arg.id - Request ID
 * @param {Object} arg.arg.data - Request payload
 * @returns {Promise} API response
 */
export const fetcherAcceptScheduledTransportRequest = async (key, { arg }) => {
  if (IS_MOCK) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock different scenarios for testing
    const scenario = Math.random();

    if (scenario < 0.7) {
      // 70% success
      return mockSuccessResponse.data;
    } else if (scenario < 0.8) {
      // 10% pesanan sudah diambil
      throw {
        response: {
          status: 422,
          data: {
            Message: {
              Code: 422,
              Text: "Request validation failed",
            },
            Data: {
              errors: [
                {
                  field: "orderStatus",
                  message: "Request is no longer available for acceptance",
                },
              ],
            },
            Type: "ACCEPT_SCHEDULED_TRANSPORT_REQUEST_ERROR",
          },
        },
      };
    } else if (scenario < 0.9) {
      // 10% perubahan unit
      throw {
        response: {
          status: 422,
          data: {
            Message: {
              Code: 422,
              Text: "Request validation failed",
            },
            Data: {
              errors: [
                {
                  field: "vehicleCount",
                  message: "Vehicle count cannot exceed required count",
                },
              ],
            },
            Type: "ACCEPT_SCHEDULED_TRANSPORT_REQUEST_ERROR",
          },
        },
      };
    } else {
      // 10% akun ditangguhkan
      throw {
        response: {
          status: 422,
          data: {
            Message: {
              Code: 422,
              Text: "Account suspended during process",
            },
            Data: {
              errors: [
                {
                  field: "account",
                  message: "User account is suspended",
                },
              ],
            },
            Type: "ACCEPT_SCHEDULED_TRANSPORT_REQUEST_ERROR",
          },
        },
      };
    }
  }

  const { id, data } = arg;

  const payload = {
    acceptType: data.type === "all" ? "ALL" : "PARTIAL",
    vehicleCount: data.type === "partial" ? data.truckCount : null,
    acceptTerms: true,
  };

  const result = await fetcherMuatrans.post(
    `v1/transporter/monitoring/transport-requests/${id}/accept-scheduled`,
    payload
  );

  return result?.data || {};
};

/**
 * Hook to accept scheduled transport request
 * @returns {Object} SWR mutation object
 */
export const usePostAcceptScheduledTransportRequest = () => {
  return useSWRMutation(
    "accept-scheduled-transport-request",
    fetcherAcceptScheduledTransportRequest
  );
};
