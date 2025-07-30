import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const isMockNonActiveDrivers = true;

const apiResultNonActiveDrivers = {
  data: {
    Message: {
      Code: 200,
      Text: "Success",
    },
    Data: {
      drivers: [
        // {
        //   id: "550e8400-e29b-41d4-a716-446655440000",
        //   name: "Jane Smith Driver",
        //   phoneNumber: "081987654321",
        //   profileImage:
        //     "/img/mock-armada/96f3e307242fe2a40610399e1d9d7a279944c89c.jpg",
        //   driverStatus: "NOT_PAIRED",
        //   verificationStatus: "VERIFIED",
        //   fleet: null,
        //   lastActive: "2025-01-15T10:30:00Z",
        //   inactiveReason: "Cuti",
        //   createdAt: "2025-01-15T10:30:00Z",
        // },
        // {
        //   id: "550e8400-e29b-41d4-a716-446655440001",
        //   name: "Ahmad Rizky",
        //   phoneNumber: "081234567890",
        //   profileImage:
        //     "/img/mock-armada/047379f720d4d796e68d0fd7a289a30bd4d2e0ac.jpg",
        //   driverStatus: "NON_ACTIVE",
        //   verificationStatus: "NOT_VERIFIED",
        //   fleet: {
        //     id: "660e8400-e29b-41d4-a716-446655440000",
        //     licensePlate: "B 1234 ABC",
        //     truckType: {
        //       id: "770e8400-e29b-41d4-a716-446655440000",
        //       name: "CDD Box",
        //       carrierTruck: {
        //         name: "Box",
        //       },
        //     },
        //   },
        //   lastActive: "2025-01-10T08:20:00Z",
        //   inactiveReason: "Sakit",
        //   createdAt: "2024-12-01T10:30:00Z",
        //   warningDocumentExpired: true,
        // },
        // {
        //   id: "550e8400-e29b-41d4-a716-446655440002",
        //   name: "Budi Santoso",
        //   phoneNumber: "081555666777",
        //   profileImage:
        //     "/img/mock-armada/d6869c8f3993048b066679deb82fe2198af78db3.jpg",
        //   driverStatus: "NOT_PAIRED",
        //   verificationStatus: "VERIFIED",
        //   fleet: null,
        //   lastActive: "2025-01-05T14:15:00Z",
        //   inactiveReason: null,
        //   createdAt: "2024-11-15T09:00:00Z",
        // },
        // {
        //   id: "550e8400-e29b-41d4-a716-446655440003",
        //   name: "Dedi Kurniawan",
        //   phoneNumber: "081999888777",
        //   profileImage: "/img/mock-armada/driver.png",
        //   driverStatus: "NON_ACTIVE",
        //   verificationStatus: "VERIFIED",
        //   fleet: {
        //     id: "660e8400-e29b-41d4-a716-446655440001",
        //     licensePlate: "B 5678 DEF",
        //     truckType: {
        //       id: "770e8400-e29b-41d4-a716-446655440001",
        //       name: "CDE Box",
        //       carrierTruck: {
        //         name: "Box",
        //       },
        //     },
        //   },
        //   lastActive: "2024-12-20T16:30:00Z",
        //   inactiveReason: "Resign",
        //   createdAt: "2024-10-01T10:00:00Z",
        //   pendingUpdateDriver: true,
        // },
        // {
        //   id: "550e8400-e29b-41d4-a716-446655440004",
        //   name: "Eko Prasetyo",
        //   phoneNumber: "081777888999",
        //   profileImage:
        //     "/img/mock-armada/96f3e307242fe2a40610399e1d9d7a279944c89c.jpg",
        //   driverStatus: "NOT_PAIRED",
        //   verificationStatus: "NOT_VERIFIED",
        //   fleet: {
        //     id: "660e8400-e29b-41d4-a716-446655440002",
        //     licensePlate: "B 9012 GHI",
        //     truckType: {
        //       id: "770e8400-e29b-41d4-a716-446655440002",
        //       name: "Tronton",
        //       carrierTruck: {
        //         name: "Flatbed",
        //       },
        //     },
        //   },
        //   lastActive: "2025-01-01T09:45:00Z",
        //   inactiveReason: "Izin",
        //   createdAt: "2024-09-15T11:30:00Z",
        // },
      ],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 5,
        itemsPerPage: 10,
        hasNextPage: true,
        hasPreviousPage: false,
      },
      summary: {
        total: 0,
        unassigned: 0,
        inactive: 0,
      },
      dataFilter: {
        truckType: [
          { id: "770e8400-e29b-41d4-a716-446655440000", value: "CDD Box" },
          { id: "770e8400-e29b-41d4-a716-446655440001", value: "CDE Box" },
          { id: "770e8400-e29b-41d4-a716-446655440002", value: "Tronton" },
          { id: "770e8400-e29b-41d4-a716-446655440003", value: "Wingbox" },
        ],
        carrierType: [
          { id: "ct-001", value: "Box" },
          { id: "ct-002", value: "Flatbed" },
          { id: "ct-003", value: "Bak" },
          { id: "ct-004", value: "Tangki" },
        ],
        verificationStatus: [
          { id: "VERIFIED", value: "Terverifikasi" },
          { id: "NOT_VERIFIED", value: "Belum Terverifikasi" },
        ],
        driverStatus: [
          { id: "NOT_PAIRED", value: "Belum Dipasangkan" },
          { id: "NON_ACTIVE", value: "Nonaktif" },
        ],
      },
    },
    Type: "GET_INACTIVE_DRIVERS",
  },
};

export const fetcherNonActiveDrivers = async (cacheKey) => {
  // Extract query string from cache key
  const queryString = cacheKey.includes("?") ? cacheKey.split("?")[1] : "";
  const url = queryString
    ? `v1/drivers/inactive?${queryString}`
    : "v1/drivers/inactive";

  if (isMockNonActiveDrivers) {
    const result = apiResultNonActiveDrivers;
    return result.data.Data;
  }

  const result = await fetcherMuatrans.get(url);
  return result?.data?.Data || {};
};

export const useGetNonActiveDriversData = (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const cacheKey = `non-active-drivers${queryParams ? `?${queryParams}` : ""}`;

  return useSWR(cacheKey, fetcherNonActiveDrivers);
};
