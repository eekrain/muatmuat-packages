import useSWRMutation from "swr/mutation";

import { fetcherMuatrans } from "@/lib/axios";

// Mock config for testing
const IS_MOCK = false;

// Mock response untuk testing
const mockSuccessResponse = {
  Message: {
    Code: 200,
    Text: "Request acknowledgment recorded successfully",
  },
  Data: {
    id: "uuid",
    orderCode: "MT-2025-001",
    acknowledgedAt: "2025-01-15T10:30:00+07:00",
    orderStatus: "TAKEN_BY_OTHER",
    toast: {
      type: "success",
      message: "Permintaan MT-2025-001 berhasil ditutup",
      duration: 6000,
    },
  },
  Type: "ACKNOWLEDGE_REQUEST_TAKEN",
};

// Mock error response
const mockErrorResponse = {
  Message: {
    Code: 404,
    Text: "Transport request not found",
  },
  Data: {
    errors: [
      {
        field: "id",
        message: "Request with specified ID does not exist or access denied",
      },
    ],
  },
  Type: "ACKNOWLEDGE_REQUEST_TAKEN_ERROR",
};

/**
 * Acknowledge a taken transport request
 * @param {string} key - SWR key
 * @param {Object} arg - Request arguments
 * @param {string} arg.arg.id - Request ID
 * @returns {Promise} API response
 */
export const fetcherAcknowledgeRequest = async (key, { arg }) => {
  if (IS_MOCK) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simulate 10% chance of not found error
    if (Math.random() < 0.1) {
      return Promise.reject({
        response: {
          status: 404,
          data: mockErrorResponse,
        },
      });
    }

    // Success response
    const result = JSON.parse(JSON.stringify(mockSuccessResponse));
    result.Data.id = arg.id;
    return result;
  }

  const { id } = arg;

  const result = await fetcherMuatrans.post(
    `v1/transporter/monitoring/transport-requests/${id}/acknowledge-taken`
  );

  return result?.data || {};
};

/**
 * Direct function to acknowledge a taken transport request
 * @param {string} id - Request ID
 * @returns {Promise} API response
 */
export const postAcknowledgeRequest = async (id) => {
  if (IS_MOCK) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simulate 10% chance of not found error
    if (Math.random() < 0.1) {
      return Promise.reject({
        response: {
          status: 404,
          data: mockErrorResponse,
        },
      });
    }

    // Success response
    const result = JSON.parse(JSON.stringify(mockSuccessResponse));
    result.Data.id = id;
    return result;
  }

  const result = await fetcherMuatrans.post(
    `v1/transporter/monitoring/transport-requests/${id}/acknowledge-taken`
  );

  return result?.data || {};
};

/**
 * Hook to acknowledge a taken transport request
 * @returns {Object} SWR mutation object
 */
export const usePostAcknowledgeRequest = () => {
  const { trigger, isMutating, data, error } = useSWRMutation(
    "acknowledge-request-taken",
    fetcherAcknowledgeRequest
  );

  return {
    acknowledgeRequest: trigger,
    isAcknowledging: isMutating,
    data,
    error,
  };
};
