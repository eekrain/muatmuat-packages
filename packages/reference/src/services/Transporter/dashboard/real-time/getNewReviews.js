import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false;

export const mockNewReviewsData = {
  data: {
    Message: {
      Code: 200,
      Text: "New reviews retrieved successfully",
    },
    Data: {
      reviews: [
        {
          reviewId: "REV-2025-001",
          orderId: "ORD-2025-001234",
          orderNumber: "MTO240122001",
          driverId: "DRV-001",
          driverName: "Ahmad Suryanto",
          shipperName: "PT Maju Jaya",
          rating: 5,
          comment:
            "Driver sangat profesional dan barang sampai dengan selamat. Terima kasih!",
          commentPreview: "Driver sangat profesional dan barang…",
          route: "Jakarta - Surabaya",
          completedDate: "2025-01-22T16:00:00Z",
          reviewDate: "2025-01-22T18:30:00Z",
          isNew: true,
        },
        {
          reviewId: "REV-2025-002",
          orderId: "ORD-2025-001235",
          orderNumber: "MTO240122002",
          driverId: "DRV-002",
          driverName: "Budi Santoso",
          shipperName: "CV Berkah Jaya",
          rating: 4,
          comment: "Pelayanan baik, pengiriman tepat waktu.",
          commentPreview: "Pelayanan baik, pengiriman tepat waktu.",
          route: "Jakarta - Bandung",
          completedDate: "2025-01-23T10:00:00Z",
          reviewDate: "2025-01-23T11:30:00Z",
          isNew: true,
        },
      ],
      pagination: {
        currentPage: 1,
        totalPages: 3,
        totalItems: 28,
        itemsPerPage: 10,
      },
      summary: {
        totalNewReviews: 28,
        averageRating: 4.6,
        ratingDistribution: { 5: 18, 4: 6, 3: 3, 2: 1, 1: 0 },
      },
    },
    Type: "NEW_REVIEWS_LIST",
  },
};

export const fetcherNewReviews = async (cacheKey) => {
  const [url, params] = cacheKey;

  if (useMockData) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return mockNewReviewsData.data.Data;
  }

  try {
    const result = await fetcherMuatrans.get(url, { params });
    return result?.data?.Data || {};
  } catch (error) {
    console.error("Error fetching new reviews:", error);
    return {};
  }
};

export const useGetNewReviews = (params = {}) => {
  const cacheKey = ["/v1/transporter/alerts/new-reviews", params];

  const { data, error, isLoading, mutate } = useSWR(
    cacheKey,
    fetcherNewReviews,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    data,
    isLoading,
    isError: error,
    mutate,
  };
};
