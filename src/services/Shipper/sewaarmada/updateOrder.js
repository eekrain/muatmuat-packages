import useSWRMutation from "swr/mutation";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false; // toggle mock data

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    message: {
      code: 200,
      text: "Order modification processed successfully",
    },
    data: {
      orderId: "550e8400-e29b-41d4-a716-446655440090",
      cost_impact: {
        additional_cost: 0,
        penalty_fee: 0,
        total_adjustment: 0,
      },
    },
    type: "ORDER_MODIFICATION",
  },
};

export const updateOrder = async (url, { arg }) => {
  let result;
  if (useMockData) {
    result = mockAPIResult;
  } else {
    result = await fetcherMuatrans.put(url, arg);
  }
  return result;
};

export const useUpdateOrder = (orderId) =>
  useSWRMutation(`/v1/orders/${orderId}/update`, updateOrder);
