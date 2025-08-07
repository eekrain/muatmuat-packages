import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const isMockGetDriversSimExpiry = false; // Enable mock for testing

const mockGetDriversSimExpiryResponse = {
  Message: {
    Code: 200,
    Text: "Success",
  },
  Data: {
    drivers: [
      {
        id: "550e8400-e29b-41d4-a716-446655440000",
        name: "Ahmad Maulana",
        phoneNumber: "082120899123",
        profileImage:
          "/img/mock-armada/047379f720d4d796e68d0fd7a289a30bd4d2e0ac.jpg",
        simExpiryDate: "2025-01-14",
        status: "NOT_PAIRED",
        verificationStatus: "NOT_VERIFIED",
        createdAt: "2025-01-16T08:30:00Z",
      },
      {
        id: "660e8400-e29b-41d4-a716-446655440001",
        name: "Dony Pamungkas",
        phoneNumber: "082310812201",
        profileImage:
          "/img/mock-armada/047379f720d4d796e68d0fd7a289a30bd4d2e0ac.jpg",
        simExpiryDate: "2025-01-14",
        status: "NON_ACTIVE",
        verificationStatus: "VERIFIED",
        createdAt: "2025-01-16T08:30:00Z",
      },
    ],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 2,
      itemsPerPage: 10,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  },
  Type: "GET_DRIVERS_SIM_EXPIRY",
};

export const getDriversSimExpiry = async (params = {}) => {
  if (isMockGetDriversSimExpiry) {
    return mockGetDriversSimExpiryResponse;
  }

  const searchParams = new URLSearchParams();

  if (params.page) searchParams.append("page", params.page);
  if (params.limit) searchParams.append("limit", params.limit);
  if (params.search) searchParams.append("search", params.search);
  if (params.status) searchParams.append("status", params.status);
  if (params.sort) searchParams.append("sort", params.sort);
  if (params.order) searchParams.append("order", params.order);

  const result = await fetcherMuatrans.get(
    `v1/drivers/sim-expiry?${searchParams.toString()}`
  );
  return result?.data;
};

export const useGetDriversSimExpiry = (params = {}) => {
  const key = params ? ["v1/drivers/sim-expiry", params] : null;

  const { data, error, isLoading, mutate } = useSWR(key, () =>
    getDriversSimExpiry(params)
  );

  return {
    data: data?.Data,
    error,
    isLoading,
    mutate,
  };
};
