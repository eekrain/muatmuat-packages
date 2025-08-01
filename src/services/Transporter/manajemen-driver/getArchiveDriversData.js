import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const isMockArchiveDrivers = true;

const apiResultArchiveDrivers = {
  data: {
    Message: {
      Code: 200,
      Text: "Success",
    },
    Data: {
      drivers: [
        {
          id: "550e8400-e29b-41d4-a716-446655440000",
          name: "Charlie Wilson Driver",
          phoneNumber: "081111222333",
          profileImage:
            "/img/mock-armada/96f3e307242fe2a40610399e1d9d7a279944c89c.jpg",
          driverStatus: "DELETED",
          deletedAt: "2025-01-15T16:30:00Z",
          createdAt: "2025-01-10T08:30:00Z",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440001",
          name: "Diana Martinez",
          phoneNumber: "081222333444",
          profileImage:
            "/img/mock-armada/047379f720d4d796e68d0fd7a289a30bd4d2e0ac.jpg",
          driverStatus: "DELETED",
          deletedAt: "2025-01-14T10:20:00Z",
          createdAt: "2024-12-20T09:15:00Z",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440002",
          name: "Edward Thompson",
          phoneNumber: "081333444555",
          profileImage:
            "/img/mock-armada/d6869c8f3993048b066679deb82fe2198af78db3.jpg",
          driverStatus: "DELETED",
          deletedAt: "2025-01-13T14:45:00Z",
          createdAt: "2024-11-15T11:30:00Z",
        },
      ],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 3,
        itemsPerPage: 10,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    },
    Type: "GET_ARCHIVED_DRIVERS",
  },
};

export const fetcherArchiveDrivers = async (cacheKey) => {
  // Extract query string from cache key
  const queryString = cacheKey.includes("?") ? cacheKey.split("?")[1] : "";
  const url = queryString
    ? `v1/drivers/archived?${queryString}`
    : "v1/drivers/archived";

  if (isMockArchiveDrivers) {
    const result = apiResultArchiveDrivers;
    return result.data.Data;
  }

  const result = await fetcherMuatrans.get(url);
  return result?.data?.Data || {};
};

export const useGetArchiveDriversData = (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const cacheKey = `archive-drivers${queryParams ? `?${queryParams}` : ""}`;

  return useSWR(cacheKey, fetcherArchiveDrivers);
};
