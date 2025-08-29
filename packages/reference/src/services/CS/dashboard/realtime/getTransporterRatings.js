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
      Text: "Transporter ratings retrieved successfully",
    },
    Data: {
      transporters: [
        {
          id: "550e8400-e29b-41d4-a716-446655440000",
          companyName: "PT Angkutan Jaya",
          companyAddress: "Jl. Industri No. 123",
          businessLicenseNumber: "123456789",
          logo: "/img/avatar.png",
          rating: {
            averageRating: 4.5,
            formattedRating: "4,5/5",
            totalRatings: 45,
            ratingDistribution: {
              5: 20,
              4: 15,
              3: 8,
              2: 2,
              1: 0,
            },
          },
          orderStats: {
            totalOrders: 156,
            formattedTotalOrders: "156",
            completedOrders: 150,
            completionRate: 96.2,
          },
          status: {
            isActive: true,
            verificationStatus: "VERIFIED",
            isSuspended: false,
            penaltyCount: 0,
          },
          specializations: {
            isHalalCertified: true,
            halalCertificateNo: "HALAL-123",
            halalExpiryDate: "2025-12-31",
          },
          fleetInfo: {
            totalFleets: 12,
            activeFleets: 10,
            verifiedFleets: 9,
          },
          lastActivity: "2025-08-02T09:30:00+07:00",
        },
      ],
      pagination: {
        currentPage: 1,
        totalPages: 12,
        totalItems: 345,
        itemsPerPage: 10,
        hasNext: true,
        hasPrevious: false,
      },
      appliedFilters: {
        search: "Jaya",
        ratingFilter: [4, 5],
        sort: "company_name",
        order: "asc",
        verificationStatus: "VERIFIED",
      },
      statistics: {
        averageRatingAll: 4.2,
        totalTransporters: 345,
        verifiedTransporters: 298,
        activeTransporters: 312,
      },
    },
    Type: "TRANSPORTER_RATINGS",
  },
};

// Fetcher function for transporter ratings
export const getTransporterRatings = async (url) => {
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
export const useGetTransporterRatings = (queryString) =>
  useSWR(`v1/cs/transporters/ratings?${queryString}`, getTransporterRatings);
