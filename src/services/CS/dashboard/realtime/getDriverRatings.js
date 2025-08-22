import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";
import { fetcherMuatransCS } from "@/lib/fetcherBasicAuth";

const useMockData = false; // true: use mock data, false: use real API
const useMuatransFetcher = false; // true: use fetcherMuatrans, false: use axios (basic auth)

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Driver ratings retrieved successfully",
    },
    Data: {
      transporter: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        companyName: "PT Angkutan Jaya",
        overallRating: 4.3,
        totalDrivers: 15,
        activeDrivers: 12,
      },
      drivers: [
        {
          id: "550e8400-e29b-41d4-a716-446655440001",
          name: "John Doe",
          phoneNumber: "081234567890",
          rating: {
            averageRating: 4.5,
            formattedRating: "4,5/5",
            totalRatings: 28,
            ratingDistribution: {
              5: 15,
              4: 10,
              3: 3,
              2: 0,
              1: 0,
            },
          },
          orderStats: {
            totalOrders: 30,
            formattedTotalOrders: "30",
            completedOrders: 28,
            completionRate: 93.3,
          },
          status: {
            isActive: true,
            driverStatus: "AVAILABLE",
            verificationStatus: "VERIFIED",
            whatsappVerified: true,
          },
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440002",
          name: "Jane Smith",
          phoneNumber: "081234567891",
          rating: {
            averageRating: 4.2,
            formattedRating: "4,2/5",
            totalRatings: 15,
            ratingDistribution: {
              5: 8,
              4: 5,
              3: 2,
              2: 0,
              1: 0,
            },
          },
          orderStats: {
            totalOrders: 18,
            formattedTotalOrders: "18",
            completedOrders: 15,
            completionRate: 83.3,
          },
          status: {
            isActive: true,
            driverStatus: "BUSY",
            verificationStatus: "VERIFIED",
            whatsappVerified: true,
          },
        },
      ],
      pagination: {
        currentPage: 1,
        totalPages: 2,
        totalItems: 15,
        itemsPerPage: 10,
        hasNext: true,
        hasPrevious: false,
      },
      appliedFilters: {
        search: "",
        ratingFilter: [],
        sort: "name",
        order: "asc",
        activeOnly: false,
      },
    },
    Type: "DRIVER_RATINGS",
  },
};

// Fetcher function for driver ratings
export const getDriverRatings = async (url) => {
  let result;
  if (useMockData) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    result = mockAPIResult;
  } else {
    if (useMuatransFetcher) {
      result = await fetcherMuatrans.get(url);
    } else {
      // Create Basic Auth header using environment variables
      result = await fetcherMuatransCS.get(url);
    }
    const data = result?.data?.Data;
    return data;
  }
};

// SWR hook
export const useGetDriverRatings = (transporterId, queryString) =>
  useSWR(
    transporterId
      ? `v1/cs/transporters/${transporterId}/drivers/ratings?${queryString}`
      : null,
    getDriverRatings
  );
