import useSWRMutation from "swr/mutation";

import { fetcherMuatrans } from "@/lib/axios";

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Order confirmed as ready successfully",
    },
    Data: {
      orderId: "550e8400-e29b-41d4-a716-446655440000",
      status: "READY",
      confirmedAt: "2024-01-05T10:00:00Z",
      confirmedBy: "transporter",
    },
    Type: "CONFIRM_ORDER_READY",
  },
};

/**
 * Confirm that the transporter is ready for the order
 * @param {string} orderId - The order ID
 * @param {Object} data - Request body data
 * @returns {Promise} API response
 */
export const confirmReady = async (orderId, data = {}) => {
  const url = `/v1/transporter/orders/${orderId}/confirm-ready`;
  return fetcherMuatrans.post(url, data);
};

/**
 * SWR mutation hook for confirming order ready status
 * @param {string} orderId - The order ID
 * @returns {Object} SWR mutation object
 */
export const useConfirmReady = (orderId) =>
  useSWRMutation(
    `/v1/transporter/orders/${orderId}/confirm-ready`,
    (url, { arg }) => fetcherMuatrans.post(url, arg)
  );
