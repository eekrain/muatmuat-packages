import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false; // toggle mock data

// GET /api/v1/orders/{orderId}/review
const apiResultDriverReviews = {
  data: {
    Message: {
      Code: 200,
      Text: "Driver reviews retrieved successfully",
    },
    Data: {
      orderId: "uuid-order-123",
      orderCode: "MTR/250208/001/AAA",
      drivers: [
        {
          driverId: "uuid-driver-1",
          name: "Ahmad Rahman",
          phoneNumber: "081234567891",
          profileImage: "https://example.com/driver1.jpg",
          licensePlate: "B 1234 CD",
          canReview: true,
          reviewedAt: "",
          rating: 0,
          review: "",
        },
        {
          driverId: "uuid-driver-2",
          name: "Budi Santoso",
          phoneNumber: "081234567892",
          profileImage: "https://example.com/driver2.jpg",
          licensePlate: "B 5678 EF",
          canReview: false,
          reviewedAt: "2025-02-11T16:00:00Z",
          rating: 5,
          review: "Driver sangat baik dan profesional",
        },
      ],
    },
    summary: {
      totalReviews: 1,
      averageRating: 5,
      ratingDistribution: {
        5: 1,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      },
    },
    Type: "GET_ORDER_DRIVER_REVIEWS",
  },
};

export const getOrderDriverReviews = async (cacheKey) => {
  const orderId = cacheKey.split("/")[1];

  let result;
  if (useMockData) {
    result = apiResultDriverReviews;
  } else {
    result = await fetcherMuatrans
      .get(`v1/orders/${orderId}/reviews`)
      .catch((error) => {
        console.log("Error when get order driver reviews", error);
        return null;
      });
  }

  return result?.data?.Data || null;
};

export const useGetOrderDriverReviews = (orderId) =>
  useSWR(`order-driver-reviews/${orderId}`, getOrderDriverReviews);
