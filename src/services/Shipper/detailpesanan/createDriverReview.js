import useSWRMutation from "swr/mutation";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false; // toggle mock data

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 201,
      Text: "Driver review created successfully",
    },
    Data: {
      ratingId: "uuid-rating-123",
      orderId: "uuid-order-123",
      driverId: "uuid-order-123",
      rating: 5,
      review:
        "Driver sangat profesional dan tepat waktu. Pengiriman berjalan lancar.",
      reviewLength: 67,
      ratedAt: "2024-01-05T10:00:00Z",
    },
    Type: "CREATE_DRIVER_REVIEW",
  },
};

export const createDriverReview = async (url, { arg }) => {
  let result;
  if (useMockData) {
    result = mockAPIResult;
  } else {
    result = await fetcherMuatrans.post(url, arg);
  }
  return result;
};

export const useCreateDriverReview = (orderId) =>
  useSWRMutation(`/v1/orders/${orderId}/reviews`, createDriverReview);
