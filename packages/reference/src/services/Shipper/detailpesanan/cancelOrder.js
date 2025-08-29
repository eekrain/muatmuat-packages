import useSWRMutation from "swr/mutation";

import { fetcherMuatrans } from "@/lib/axios";

const cancelOrder = async (url, { arg }) => {
  return await fetcherMuatrans.post(url, arg);
};

/**
 * Hook to cancel an order.
 * Calls POST /v1/orders/{orderId}/cancel with cancellation reason.
 * @param {string} orderId - The ID of the order to cancel.
 * @returns {object} The SWR mutation response object.
 */
export const useCancelOrder = (orderId) => {
  const {
    trigger: triggerCancelOrder,
    isMutating: isCancelingOrder,
    error: cancelOrderError,
  } = useSWRMutation(`/v1/orders/${orderId}/cancel`, cancelOrder);

  return {
    triggerCancelOrder,
    isCancelingOrder,
    cancelOrderError,
  };
};
