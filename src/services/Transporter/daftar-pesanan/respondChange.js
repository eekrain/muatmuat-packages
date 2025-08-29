import useSWRMutation from "swr/mutation";

import { fetcherMuatrans } from "@/lib/axios";

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Response to order change submitted successfully",
    },
    Data: {
      orderId: "550e8400-e29b-41d4-a716-446655440000",
      response: "ACCEPT",
      responseType: "accept",
      submittedAt: "2024-01-05T10:00:00Z",
      submittedBy: "transporter",
      fleetId: null,
      incomeAdjustment: {
        amount: 50000,
        currency: "IDR",
        reason: "Route change compensation",
      },
    },
    Type: "RESPOND_ORDER_CHANGE",
  },
};

/**
 * Respond to order change request
 * @param {string} orderId - The order ID
 * @param {Object} data - Request body data
 * @param {string} data.response - Response type: "ACCEPT", "ACCEPT_WITH_FLEET_CHANGE", "REJECT"
 * @param {string} [data.fleetId] - Fleet ID for fleet change (required if response is ACCEPT_WITH_FLEET_CHANGE)
 * @param {string} [data.reason] - Reason for rejection (optional)
 * @returns {Promise} API response
 */
export const respondChange = async (orderId, data) => {
  const url = `/v1/transporter/orders/${orderId}/respond-change`;
  return fetcherMuatrans.post(url, data);
};

/**
 * SWR mutation hook for responding to order changes
 * @param {string} orderId - The order ID
 * @returns {Object} SWR mutation object
 */
export const useRespondChange = (orderId) =>
  useSWRMutation(
    `/v1/transporter/orders/${orderId}/respond-change`,
    (url, { arg }) => fetcherMuatrans.post(url, arg)
  );
