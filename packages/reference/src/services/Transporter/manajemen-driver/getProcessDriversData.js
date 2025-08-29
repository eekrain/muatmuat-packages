import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const isMockProcessDrivers = false;

const apiResultProcessDrivers = {
  data: {
    Message: {
      Code: 200,
      Text: "Success",
    },
    Data: {
      drivers: [
        {
          id: "550e8400-e29b-41d4-a716-446655440000",
          name: "Bob Johnson Driver",
          phoneNumber: "081123456789",
          profileImage:
            "/img/mock-armada/96f3e307242fe2a40610399e1d9d7a279944c89c.jpg",
          driverStatus: "IN_PROGRESS",
          createdAt: "2025-01-16T08:30:00Z",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440001",
          name: "Alice Williams",
          phoneNumber: "081234567890",
          profileImage:
            "/img/mock-armada/047379f720d4d796e68d0fd7a289a30bd4d2e0ac.jpg",
          driverStatus: "REJECTED",
          createdAt: "2025-01-15T14:20:00Z",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440002",
          name: "Charlie Brown",
          phoneNumber: "081345678901",
          profileImage:
            "/img/mock-armada/d6869c8f3993048b066679deb82fe2198af78db3.jpg",
          driverStatus: "IN_PROGRESS",
          createdAt: "2025-01-14T09:15:00Z",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440003",
          name: "David Lee",
          phoneNumber: "081456789012",
          profileImage: "/img/mock-armada/driver.png",
          driverStatus: "REJECTED",
          createdAt: "2025-01-13T16:45:00Z",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440004",
          name: "Emma Davis",
          phoneNumber: "081567890123",
          profileImage:
            "/img/mock-armada/96f3e307242fe2a40610399e1d9d7a279944c89c.jpg",
          driverStatus: "IN_PROGRESS",
          createdAt: "2025-01-12T11:30:00Z",
        },
      ],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 5,
        itemsPerPage: 10,
        hasNextPage: false,
        hasPreviousPage: false,
      },
      summary: {
        total: 1,
        underReview: 1,
        rejected: 1,
      },
      dataFilter: {
        driverStatus: [
          { id: "IN_PROGRESS", value: "Dalam Tinjauan" },
          { id: "REJECTED", value: "Verifikasi Ditolak" },
        ],
      },
    },
    Type: "GET_REGISTRATION_PROCESS_DRIVERS",
  },
};

export const fetcherProcessDrivers = async (cacheKey) => {
  // Extract query string from cache key
  const queryString = cacheKey.includes("?") ? cacheKey.split("?")[1] : "";
  const url = queryString
    ? `v1/drivers/registration-process?${queryString}`
    : "v1/drivers/registration-process";

  if (isMockProcessDrivers) {
    const result = apiResultProcessDrivers;
    return result.data.Data;
  }

  const result = await fetcherMuatrans.get(url);
  return result?.data?.Data || {};
};

export const useGetProcessDriversData = (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const cacheKey = `process-drivers${queryParams ? `?${queryParams}` : ""}`;

  return useSWR(cacheKey, fetcherProcessDrivers);
};
