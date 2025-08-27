import useSWRMutation from "swr/mutation";

import { fetcherMuatrans } from "@/lib/axios";

// Mock config for testing
const IS_MOCK = false;

// Mock success response
const mockSuccessResponse = {
  Message: {
    Code: 200,
    Text: "Request save status updated successfully",
  },
  Data: {
    id: "uuid",
    orderCode: "MT-2025-001",
    isSaved: true,
    savedAt: "2025-01-15T10:30:00+07:00",
    savedCount: 3,
  },
  Type: "TOGGLE_SAVE_TRANSPORT_REQUEST",
};

// Mock error response
const mockErrorResponse = {
  Message: {
    Code: 409,
    Text: "Request is no longer available for saving",
  },
  Data: {
    errors: [
      {
        field: "orderStatus",
        message: "Request has been taken by another transporter",
      },
    ],
  },
  Type: "TOGGLE_SAVE_TRANSPORT_REQUEST_ERROR",
};

/**
 * Toggle save status of transport request
 * @param {string} key - SWR key
 * @param {Object} arg - Request arguments
 * @param {string} arg.arg.id - Request ID
 * @param {Object} arg.arg.payload - Request payload with save boolean
 * @returns {Promise} API response
 */
export const fetcherToggleSaveTransport = async (key, { arg }) => {
  if (IS_MOCK) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock different scenarios for testing
    const scenario = Math.random();

    if (scenario < 0.85) {
      // 85% success
      const result = JSON.parse(JSON.stringify(mockSuccessResponse));
      result.Data.id = arg.id;
      result.Data.isSaved = arg.payload.save;
      return result;
    } else {
      // 15% error - request no longer available
      return Promise.reject({
        response: {
          status: 409,
          data: mockErrorResponse,
        },
      });
    }
  }

  const { id, payload } = arg;

  const result = await fetcherMuatrans.post(
    `v1/transporter/monitoring/transport-requests/${id}/save`,
    payload
  );

  return result?.data || {};
};

/**
 * Direct function to toggle save status of transport request
 * @param {string} id - Request ID
 * @param {Object} payload - Request payload with save boolean
 * @returns {Promise} API response
 */
export const postToggleSaveTransport = async (id, payload) => {
  if (IS_MOCK) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock different scenarios for testing
    const scenario = Math.random();

    if (scenario < 0.85) {
      // 85% success
      const result = JSON.parse(JSON.stringify(mockSuccessResponse));
      result.Data.id = id;
      result.Data.isSaved = payload.save;
      return result;
    } else {
      // 15% error - request no longer available
      return Promise.reject({
        response: {
          status: 409,
          data: mockErrorResponse,
        },
      });
    }
  }

  const result = await fetcherMuatrans.post(
    `v1/transporter/monitoring/transport-requests/${id}/save`,
    payload
  );

  return result?.data || {};
};

/**
 * Hook to toggle save status of transport request
 * @returns {Object} SWR mutation object
 */
export const usePostToggleSaveTransport = () => {
  const { trigger, isMutating, data, error } = useSWRMutation(
    "toggle-save-transport-request",
    fetcherToggleSaveTransport
  );

  return {
    toggleSave: trigger,
    isToggling: isMutating,
    data,
    error,
  };
};
