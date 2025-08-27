import useSWRMutation from "swr/mutation";

import { fetcherMuatrans } from "@/lib/axios";

// Mock config for testing
const IS_MOCK = false;

// Mock response untuk testing
const mockSuccessResponse = {
  Message: {
    Code: 200,
    Text: "Scheduled request accepted successfully",
  },
  Data: {
    id: "uuid",
    orderCode: "MT-2025-001",
    acceptedAt: "2025-01-15T10:30:00+07:00",
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
      message: "Permintaan MT-2025-001 berhasil diterima",
      duration: 6000,
    },
  },
  Type: "ACCEPT_SCHEDULED_TRANSPORT_REQUEST",
};

// Mock error responses
const mockErrorResponses = {
  validation: {
    Message: {
      Code: 422,
      Text: "Request validation failed",
    },
    Data: {
      errors: [
        {
          field: "vehicleCount",
          message: "Vehicle count cannot exceed required count of 2",
        },
      ],
    },
    Type: "ACCEPT_SCHEDULED_TRANSPORT_REQUEST_ERROR",
  },
  terms: {
    Message: {
      Code: 422,
      Text: "Request validation failed",
    },
    Data: {
      errors: [
        {
          field: "acceptTerms",
          message: "Terms and conditions must be accepted",
        },
      ],
    },
    Type: "ACCEPT_SCHEDULED_TRANSPORT_REQUEST_ERROR",
  },
  status: {
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
};

/**
 * Accept scheduled transport request
 * @param {string} key - SWR key
 * @param {Object} arg - Request arguments
 * @param {string} arg.arg.id - Request ID
 * @param {Object} arg.arg.payload - Request payload with acceptType, vehicleCount, and acceptTerms
 * @returns {Promise} API response
 */
export const fetcherAcceptScheduledTransportRequest = async (key, { arg }) => {
  if (IS_MOCK) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Validate payload
    if (!arg.payload.acceptTerms) {
      return Promise.reject({
        response: {
          status: 422,
          data: mockErrorResponses.terms,
        },
      });
    }

    if (arg.payload.vehicleCount && arg.payload.vehicleCount > 10) {
      // Simulate vehicle count error
      return Promise.reject({
        response: {
          status: 422,
          data: mockErrorResponses.validation,
        },
      });
    }

    // Mock different scenarios for testing
    const scenario = Math.random();

    if (scenario < 0.85) {
      // 85% success
      const result = JSON.parse(JSON.stringify(mockSuccessResponse));
      result.Data.id = arg.id;
      return result;
    } else {
      // 15% error - order no longer available
      return Promise.reject({
        response: {
          status: 422,
          data: mockErrorResponses.status,
        },
      });
    }
  }

  const { id, payload } = arg;

  // Validate payload according to API spec
  if (!payload.acceptTerms) {
    return Promise.reject({
      response: {
        status: 422,
        data: mockErrorResponses.terms,
      },
    });
  }

  const result = await fetcherMuatrans.post(
    `v1/transporter/monitoring/transport-requests/${id}/accept-scheduled`,
    payload
  );

  return result?.data || {};
};

/**
 * Direct function to accept scheduled transport request
 * @param {string} id - Request ID
 * @param {Object} payload - Request payload with acceptType, vehicleCount, and acceptTerms
 * @returns {Promise} API response
 */
export const postAcceptScheduledTransportRequest = async (id, payload) => {
  if (IS_MOCK) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Validate payload
    if (!payload.acceptTerms) {
      return Promise.reject({
        response: {
          status: 422,
          data: mockErrorResponses.terms,
        },
      });
    }

    if (payload.vehicleCount && payload.vehicleCount > 10) {
      // Simulate vehicle count error
      return Promise.reject({
        response: {
          status: 422,
          data: mockErrorResponses.validation,
        },
      });
    }

    // Mock different scenarios for testing
    const scenario = Math.random();

    if (scenario < 0.85) {
      // 85% success
      const result = JSON.parse(JSON.stringify(mockSuccessResponse));
      result.Data.id = id;
      return result;
    } else {
      // 15% error - order no longer available
      return Promise.reject({
        response: {
          status: 422,
          data: mockErrorResponses.status,
        },
      });
    }
  }

  // Validate payload according to API spec
  if (!payload.acceptTerms) {
    return Promise.reject({
      response: {
        status: 422,
        data: mockErrorResponses.terms,
      },
    });
  }

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
  const { trigger, isMutating, data, error } = useSWRMutation(
    "accept-scheduled-transport-request",
    fetcherAcceptScheduledTransportRequest
  );

  return {
    acceptRequest: trigger,
    isAccepting: isMutating,
    data,
    error,
  };
};
