import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

export const mockSOSHistoryData = {
  data: {
    Message: {
      Code: 200,
      Text: "SOS history retrieved successfully",
    },
    Data: {
      history: [
        {
          id: "hist123e4567-e89b-12d3-a456-426614174000",
          sosStatus: "RESOLVED",
          sosTime: "2025-08-03T08:30:00Z",
          resolvedAt: "2025-08-03T10:45:00Z",
          resolutionDuration: "2 jam 15 menit",
          resolvedTimeRelative: "1 hari lalu",
          transporter: {
            id: "trans123",
            companyName: "PT ABC Transport",
            logoUrl: "https://cdn.example.com/logos/abc-transport.png",
          },
          fleet: {
            id: "fleet456",
            licensePlate: "B1234CD",
            vehicleType: "Truk Fuso",
            imageUrl: "https://cdn.example.com/vehicles/fleet456.jpg",
          },
          driver: {
            id: "driver789",
            fullName: "John Doe",
            phoneNumber: "08123456789",
          },
          sosCategory: {
            id: "cat001",
            categoryName: "Mesin",
          },
          location: {
            sosLatitude: -6.123456,
            sosLongitude: 106.789123,
            lastAddress: "Jalan Sudirman No. 123, Jakarta",
          },
          resolution: "Ban diganti dengan ban cadangan",
          escalationLevel: 1,
          wasUrgent: false,
        },
        {
          id: "hist456e7890-e12b-34c5-d678-901234567890",
          sosStatus: "RESOLVED",
          sosTime: "2025-08-02T14:20:00Z",
          resolvedAt: "2025-08-02T16:30:00Z",
          resolutionDuration: "2 jam 10 menit",
          resolvedTimeRelative: "2 hari lalu",
          transporter: {
            id: "trans456",
            companyName: "PT XYZ Logistics",
            logoUrl: "https://cdn.example.com/logos/xyz-logistics.png",
          },
          fleet: {
            id: "fleet789",
            licensePlate: "B5678EF",
            vehicleType: "Truk Engkel",
            imageUrl: "https://cdn.example.com/vehicles/fleet789.jpg",
          },
          driver: {
            id: "driver012",
            fullName: "Jane Smith",
            phoneNumber: "08234567890",
          },
          sosCategory: {
            id: "cat002",
            categoryName: "Ban",
          },
          location: {
            sosLatitude: -6.234567,
            sosLongitude: 106.876543,
            lastAddress: "Jalan Gatot Subroto km 27",
          },
          resolution: "Komponen elektronik diperbaiki",
          escalationLevel: 2,
          wasUrgent: true,
        },
        {
          id: "hist789e0123-e45b-67c8-d901-234567890123",
          sosStatus: "RESOLVED",
          sosTime: "2025-08-01T09:15:00Z",
          resolvedAt: "2025-08-01T11:00:00Z",
          resolutionDuration: "1 jam 45 menit",
          resolvedTimeRelative: "3 hari lalu",
          transporter: {
            id: "trans789",
            companyName: "PT DEF Cargo",
            logoUrl: "https://cdn.example.com/logos/def-cargo.png",
          },
          fleet: {
            id: "fleet012",
            licensePlate: "B9012GH",
            vehicleType: "Tronton",
            imageUrl: "https://cdn.example.com/vehicles/fleet012.jpg",
          },
          driver: {
            id: "driver345",
            fullName: "Bob Johnson",
            phoneNumber: "08345678901",
          },
          sosCategory: {
            id: "cat003",
            categoryName: "Medis",
          },
          location: {
            sosLatitude: -6.345678,
            sosLongitude: 106.765432,
            lastAddress: "Jalan Thamrin No. 456, Jakarta",
          },
          resolution: "Sopir dibawa ke rumah sakit terdekat",
          escalationLevel: 3,
          wasUrgent: true,
        },
        {
          id: "hist101e1122-e33b-44c5-d556-667788990011",
          sosStatus: "RESOLVED",
          sosTime: "2025-07-31T16:45:00Z",
          resolvedAt: "2025-07-31T18:20:00Z",
          resolutionDuration: "1 jam 35 menit",
          resolvedTimeRelative: "4 hari lalu",
          transporter: {
            id: "trans101",
            companyName: "PT GHI Express",
            logoUrl: "https://cdn.example.com/logos/ghi-express.png",
          },
          fleet: {
            id: "fleet345",
            licensePlate: "B3456IJ",
            vehicleType: "Truk Fuso",
            imageUrl: "https://cdn.example.com/vehicles/fleet345.jpg",
          },
          driver: {
            id: "driver678",
            fullName: "Alice Brown",
            phoneNumber: "08456789012",
          },
          sosCategory: {
            id: "cat001",
            categoryName: "Mesin",
          },
          location: {
            sosLatitude: -6.456789,
            sosLongitude: 106.654321,
            lastAddress: "Jalan Sudirman No. 789, Jakarta",
          },
          resolution: "Mesin diperbaiki di bengkel terdekat",
          escalationLevel: 1,
          wasUrgent: false,
        },
        {
          id: "hist202e2233-e44b-55c6-d667-778899001122",
          sosStatus: "RESOLVED",
          sosTime: "2025-07-30T11:30:00Z",
          resolvedAt: "2025-07-30T13:15:00Z",
          resolutionDuration: "1 jam 45 menit",
          resolvedTimeRelative: "5 hari lalu",
          transporter: {
            id: "trans202",
            companyName: "PT JKL Freight",
            logoUrl: "https://cdn.example.com/logos/jkl-freight.png",
          },
          fleet: {
            id: "fleet567",
            licensePlate: "B5678KL",
            vehicleType: "Colt Diesel",
            imageUrl: "https://cdn.example.com/vehicles/fleet567.jpg",
          },
          driver: {
            id: "driver901",
            fullName: "Charlie Wilson",
            phoneNumber: "08567890123",
          },
          sosCategory: {
            id: "cat004",
            categoryName: "Bahan Bakar",
          },
          location: {
            sosLatitude: -6.56789,
            sosLongitude: 106.54321,
            lastAddress: "Jalan Gatot Subroto km 15",
          },
          resolution: "Bensin diisi ulang dari jerigen cadangan",
          escalationLevel: 1,
          wasUrgent: false,
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 25,
        totalPages: 3,
        hasNext: true,
        hasPrev: false,
      },
      summary: {
        totalResolved: 25,
        averageResolutionTime: "2 jam 30 menit",
        mostCommonCategory: "Mesin",
      },
    },
    Type: "SOS_HISTORY",
  },
};

export const mockSOSHistoryDataPage2 = {
  data: {
    Message: {
      Code: 200,
      Text: "SOS history retrieved successfully",
    },
    Data: {
      history: [
        {
          id: "hist303e3344-e55b-66c7-d778-889900112233",
          sosStatus: "RESOLVED",
          sosTime: "2025-07-29T13:20:00Z",
          resolvedAt: "2025-07-29T15:45:00Z",
          resolutionDuration: "2 jam 25 menit",
          resolvedTimeRelative: "6 hari lalu",
          transporter: {
            id: "trans303",
            companyName: "PT MNO Shipping",
            logoUrl: "https://cdn.example.com/logos/mno-shipping.png",
          },
          fleet: {
            id: "fleet789",
            licensePlate: "B7890MN",
            vehicleType: "Truk Container",
            imageUrl: "https://cdn.example.com/vehicles/fleet789.jpg",
          },
          driver: {
            id: "driver234",
            fullName: "David Kim",
            phoneNumber: "08678901234",
          },
          sosCategory: {
            id: "cat002",
            categoryName: "Ban",
          },
          location: {
            sosLatitude: -6.678901,
            sosLongitude: 106.432109,
            lastAddress: "Jalan Sudirman No. 999, Jakarta",
          },
          resolution: "Ban depan diganti dengan ban baru",
          escalationLevel: 2,
          wasUrgent: true,
        },
        {
          id: "hist404e4455-e66b-77c8-d889-990011223344",
          sosStatus: "RESOLVED",
          sosTime: "2025-07-28T10:15:00Z",
          resolvedAt: "2025-07-28T12:00:00Z",
          resolutionDuration: "1 jam 45 menit",
          resolvedTimeRelative: "7 hari lalu",
          transporter: {
            id: "trans404",
            companyName: "PT PQR Delivery",
            logoUrl: "https://cdn.example.com/logos/pqr-delivery.png",
          },
          fleet: {
            id: "fleet012",
            licensePlate: "B0123PQ",
            vehicleType: "Truk Fuso",
            imageUrl: "https://cdn.example.com/vehicles/fleet012.jpg",
          },
          driver: {
            id: "driver567",
            fullName: "Emma Davis",
            phoneNumber: "08789012345",
          },
          sosCategory: {
            id: "cat001",
            categoryName: "Mesin",
          },
          location: {
            sosLatitude: -6.789012,
            sosLongitude: 106.321098,
            lastAddress: "Jalan Thamrin No. 888, Jakarta",
          },
          resolution: "Filter udara dibersihkan dan diganti",
          escalationLevel: 1,
          wasUrgent: false,
        },
      ],
      pagination: {
        page: 2,
        limit: 10,
        total: 25,
        totalPages: 3,
        hasNext: true,
        hasPrev: true,
      },
      summary: {
        totalResolved: 25,
        averageResolutionTime: "2 jam 30 menit",
        mostCommonCategory: "Mesin",
      },
    },
    Type: "SOS_HISTORY",
  },
};

export const mockSOSHistoryDataEmpty = {
  data: {
    Message: {
      Code: 200,
      Text: "No SOS history found",
    },
    Data: {
      history: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
      summary: {
        totalResolved: 0,
        averageResolutionTime: "0 menit",
        mostCommonCategory: "N/A",
      },
    },
    Type: "SOS_HISTORY_EMPTY",
  },
};

export const getHistoryDataSOS = async (params = {}) => {
  const { page = 1, limit = 10, sort = "resolvedAt:desc" } = params;

  let result;

  if (useMockData) {
    // Simulate different scenarios based on parameters
    if (page === 1) {
      result = mockSOSHistoryData.data;
    } else if (page === 2) {
      result = mockSOSHistoryDataPage2.data;
    } else {
      result = mockSOSHistoryDataEmpty.data;
    }

    // Apply sorting if needed
    if (sort === "resolvedAt:asc") {
      result.Data.history.sort(
        (a, b) => new Date(a.resolvedAt) - new Date(b.resolvedAt)
      );
    } else if (sort === "sosTime:desc") {
      result.Data.history.sort(
        (a, b) => new Date(b.sosTime) - new Date(a.sosTime)
      );
    } else if (sort === "sosTime:asc") {
      result.Data.history.sort(
        (a, b) => new Date(a.sosTime) - new Date(b.sosTime)
      );
    } else if (sort === "escalationLevel:desc") {
      result.Data.history.sort((a, b) => b.escalationLevel - a.escalationLevel);
    } else if (sort === "escalationLevel:asc") {
      result.Data.history.sort((a, b) => a.escalationLevel - b.escalationLevel);
    }

    // Update pagination info based on current page
    if (page > 1) {
      result.Data.pagination.page = page;
      result.Data.pagination.hasPrev = page > 1;
      result.Data.pagination.hasNext = page < result.Data.pagination.totalPages;
    }
  } else {
    try {
      result = await fetcherMuatrans.get(`/v1/cs/sos/history`, {
        params: {
          page,
          limit: Math.min(limit, 50), // Ensure limit doesn't exceed 50
          sort,
        },
      });
    } catch (error) {
      // Handle error response
      return {
        data: {
          Message: {
            Code: error.response?.status || 500,
            Text:
              error.response?.data?.Message?.Text ||
              "Failed to retrieve SOS history",
          },
          Data: {
            history: [],
            pagination: {
              page: 1,
              limit: 10,
              total: 0,
              totalPages: 0,
              hasNext: false,
              hasPrev: false,
            },
            summary: {
              totalResolved: 0,
              averageResolutionTime: "0 menit",
              mostCommonCategory: "N/A",
            },
          },
          Type: "SOS_HISTORY_ERROR",
        },
        raw: error.response,
      };
    }
  }

  return {
    data: result,
    raw: result,
  };
};

export const useGetHistoryDataSOS = (params = {}) => {
  const { data, error, isLoading, mutate } = useSWR(
    [`getHistoryDataSOS`, params],
    () => getHistoryDataSOS(params),
    {
      refreshInterval: 300000, // Refresh every 5 minutes for history data
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      errorRetryInterval: 10000,
    }
  );

  return {
    data: data?.data || {},
    raw: data?.raw,
    isLoading,
    isError: !!error,
    mutate, // Expose mutate for manual refresh
  };
};
