import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

export const mockSOSListData = {
  data: {
    Message: {
      Code: 200,
      Text: "SOS list retrieved successfully",
    },
    Data: {
      sos: [
        {
          id: "123e4567-e89b-12d3-a456-426614174000",
          sosStatus: "OPEN",
          isUrgent: false,
          escalationLevel: 1,
          sosTime: "2025-08-04T10:30:00Z",
          responseDeadline: "2025-08-04T12:30:00Z",
          acknowledgedAt: null,
          acknowledgedByUserID: null,
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
          description: "Mesin mati mendadak",
          countdownMinutes: -45,
        },
        {
          id: "456e7890-e89b-12d3-a456-426614174001",
          sosStatus: "IN_PROGRESS",
          isUrgent: true,
          escalationLevel: 2,
          sosTime: "2025-08-04T09:15:00Z",
          responseDeadline: "2025-08-04T11:15:00Z",
          acknowledgedAt: "2025-08-04T09:20:00Z",
          acknowledgedByUserID: "user123",
          transporter: {
            id: "trans456",
            companyName: "PT XYZ Logistics",
            logoUrl: "https://cdn.example.com/logos/xyz-logistics.png",
          },
          fleet: {
            id: "fleet789",
            licensePlate: "B5678EF",
            vehicleType: "Colt Diesel",
            imageUrl: "https://cdn.example.com/vehicles/fleet789.jpg",
          },
          driver: {
            id: "driver012",
            fullName: "Jane Smith",
            phoneNumber: "08987654321",
          },
          sosCategory: {
            id: "cat002",
            categoryName: "Kecelakaan",
          },
          location: {
            sosLatitude: -6.234567,
            sosLongitude: 106.890234,
            lastAddress: "Jalan Thamrin No. 456, Jakarta",
          },
          description: "Kecelakaan ringan di tol km 23",
          countdownMinutes: 30,
        },
        {
          id: "789e0123-e89b-12d3-a456-426614174002",
          sosStatus: "ACKNOWLEDGED",
          isUrgent: false,
          escalationLevel: 1,
          sosTime: "2025-08-04T08:00:00Z",
          responseDeadline: "2025-08-04T10:00:00Z",
          acknowledgedAt: "2025-08-04T08:05:00Z",
          acknowledgedByUserID: "user456",
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
            phoneNumber: "08765432109",
          },
          sosCategory: {
            id: "cat003",
            categoryName: "Medis",
          },
          location: {
            sosLatitude: -6.345678,
            sosLongitude: 106.901345,
            lastAddress: "Jalan Gatot Subroto No. 789, Jakarta",
          },
          description: "Sopir pingsan karena kelelahan",
          countdownMinutes: -120,
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
      counters: {
        active: 5,
        history: 20,
      },
    },
    Type: "SOS_LIST",
  },
};

export const mockSOSListEmpty = {
  data: {
    Message: {
      Code: 404,
      Text: "No SOS reports found",
    },
    Data: {
      sos: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
    },
    Type: "SOS_LIST_EMPTY",
  },
};

export const getListSOSData = async (params = {}) => {
  const {
    page = 1,
    limit = 10,
    sort = "sosTime:asc",
    search = "",
    status = "",
    category = "",
    isUrgent = "",
    escalationLevel = "",
  } = params;

  let result;

  if (useMockData) {
    // Always return mock data when useMockData is true
    // Apply filters to mock data
    let filteredSOS = [...mockSOSListData.data.Data.sos];

    // Filter by status
    if (status) {
      filteredSOS = filteredSOS.filter((sos) => sos.sosStatus === status);
    }

    // Filter by category
    if (category) {
      filteredSOS = filteredSOS.filter(
        (sos) => sos.sosCategory.id === category
      );
    }

    // Filter by urgency
    if (isUrgent !== "") {
      filteredSOS = filteredSOS.filter(
        (sos) => sos.isUrgent === (isUrgent === "true")
      );
    }

    // Filter by escalation level
    if (escalationLevel) {
      filteredSOS = filteredSOS.filter(
        (sos) => sos.escalationLevel === parseInt(escalationLevel)
      );
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedSOS = filteredSOS.slice(startIndex, endIndex);

    // Update pagination info
    const updatedPagination = {
      ...mockSOSListData.data.Data.pagination,
      page,
      limit,
      total: filteredSOS.length,
      totalPages: Math.ceil(filteredSOS.length / limit),
      hasNext: endIndex < filteredSOS.length,
      hasPrev: page > 1,
    };

    result = {
      ...mockSOSListData.data,
      Data: {
        ...mockSOSListData.data.Data,
        sos: paginatedSOS,
        pagination: updatedPagination,
      },
    };
  } else {
    try {
      result = await fetcherMuatrans.get(`/v1/cs/sos`, {
        params: {
          page,
          limit: Math.min(limit, 50), // Ensure limit doesn't exceed 50
          sort,
          search,
          status,
          category,
          isUrgent,
          escalationLevel,
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
              "Failed to retrieve SOS list",
          },
          Data: {
            sos: [],
            pagination: {
              page: 1,
              limit: 10,
              total: 0,
              totalPages: 0,
              hasNext: false,
              hasPrev: false,
            },
            counters: {
              active: 0,
              history: 0,
            },
          },
          Type: "SOS_LIST_ERROR",
        },
        raw: error.response,
      };
    }
  }

  return {
    data: result?.data || {},
    raw: result,
  };
};

export const useGetListSOSData = (params = {}) => {
  const { data, error, isLoading, mutate } = useSWR(
    [`getListSOSData`, params],
    () => getListSOSData(params),
    {
      refreshInterval: 60000, // Refresh every 1 minute for SOS list
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  return {
    data: data || {}, // Remove extra .data access
    raw: data?.raw,
    isLoading,
    isError: !!error,
    mutate, // Expose mutate for manual refresh
  };
};
