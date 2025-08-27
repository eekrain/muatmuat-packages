import useSWRMutation from "swr/mutation";

import { fetcherMuatrans } from "@/lib/axios";

// Mock config for testing
const IS_MOCK = false;

// Mock response untuk testing
const mockSuccessResponse = {
  Message: {
    Code: 200,
    Text: "Transport request rejected successfully",
  },
  Data: {
    id: "uuid",
    orderCode: "MT-2025-001",
    rejectedAt: "2025-01-15T10:30:00+07:00",
    reason: "CAPACITY_UNAVAILABLE",
    notes: "Tidak ada armada yang tersedia pada waktu tersebut",
    newOrderStatus: "REJECTED",
    toast: {
      type: "success",
      message: "Permintaan MT-2025-001 berhasil ditolak",
      duration: 6000,
    },
  },
  Type: "REJECT_TRANSPORT_REQUEST",
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
  Type: "REJECT_TRANSPORT_REQUEST_ERROR",
};

/**
 * Reject a transport request
 * @param {string} key - SWR key
 * @param {Object} arg - Request arguments
 * @param {string} arg.arg.id - Request ID
 * @param {Object} arg.arg.payload - Request payload with reason and notes
 * @returns {Promise} API response
 */
export const fetcherRejectTransport = async (key, { arg }) => {
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

    // Update reason and notes if provided in payload
    if (arg.payload) {
      if (arg.payload.reason) {
        result.Data.reason = arg.payload.reason;
      }
      if (arg.payload.notes) {
        result.Data.notes = arg.payload.notes;
      }
    }

    return result;
  }

  const { id, payload } = arg;

  const result = await fetcherMuatrans.post(
    `v1/transporter/monitoring/transport-requests/${id}/reject`,
    payload || {}
  );

  return result?.data || {};
};

/**
 * Direct function to reject a transport request
 * @param {string} id - Request ID
 * @param {Object} payload - Request payload with reason and notes
 * @returns {Promise} API response
 */
export const postRejectTransport = async (id, payload = {}) => {
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

    // Update reason and notes if provided in payload
    if (payload) {
      if (payload.reason) {
        result.Data.reason = payload.reason;
      }
      if (payload.notes) {
        result.Data.notes = payload.notes;
      }
    }

    return result;
  }

  const result = await fetcherMuatrans.post(
    `v1/transporter/monitoring/transport-requests/${id}/reject`,
    payload || {}
  );

  return result?.data || {};
};

/**
 * Hook to reject a transport request
 * @returns {Object} SWR mutation object
 */
export const usePostRejectTransport = () => {
  const { trigger, isMutating, data, error } = useSWRMutation(
    "reject-transport-request",
    fetcherRejectTransport
  );

  return {
    rejectRequest: trigger,
    isRejecting: isMutating,
    data,
    error,
  };
};
