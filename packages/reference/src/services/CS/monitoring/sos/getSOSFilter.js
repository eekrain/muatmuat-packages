import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

export const mockSOSFilterResults = {
  data: {
    Message: {
      Code: 200,
      Text: "SOS filter applied successfully",
    },
    Data: {
      filters: {
        transporters: ["trans123", "trans456"],
        categories: [],
        appliedAt: "2025-08-04T14:30:00Z",
      },
      sos: [
        {
          id: "123e4567-e89b-12d3-a456-426614174000",
          sosStatus: "OPEN",
          isUrgent: false,
          escalationLevel: 1,
          sosTime: "2025-08-04T10:30:00Z",
          responseDeadline: "2025-08-04T12:30:00Z",
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
          transporter: {
            id: "trans123",
            companyName: "PT ABC Transport",
            logoUrl: "https://cdn.example.com/logos/abc-transport.png",
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
        {
          id: "101e1122-e89b-12d3-a456-426614174003",
          sosStatus: "OPEN",
          isUrgent: true,
          escalationLevel: 3,
          sosTime: "2025-08-04T07:30:00Z",
          responseDeadline: "2025-08-04T09:30:00Z",
          transporter: {
            id: "trans456",
            companyName: "PT XYZ Logistics",
            logoUrl: "https://cdn.example.com/logos/xyz-logistics.png",
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
            phoneNumber: "08654321098",
          },
          sosCategory: {
            id: "cat001",
            categoryName: "Mesin",
          },
          location: {
            sosLatitude: -6.456789,
            sosLongitude: 106.912456,
            lastAddress: "Jalan Sudirman No. 999, Jakarta",
          },
          description: "Mesin overheating, perlu bantuan segera",
          countdownMinutes: 15,
        },
        {
          id: "202e2233-e89b-12d3-a456-426614174004",
          sosStatus: "IN_PROGRESS",
          isUrgent: false,
          escalationLevel: 1,
          sosTime: "2025-08-04T06:45:00Z",
          responseDeadline: "2025-08-04T08:45:00Z",
          transporter: {
            id: "trans123",
            companyName: "PT ABC Transport",
            logoUrl: "https://cdn.example.com/logos/abc-transport.png",
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
            phoneNumber: "08543210987",
          },
          sosCategory: {
            id: "cat004",
            categoryName: "Bahan Bakar",
          },
          location: {
            sosLatitude: -6.56789,
            sosLongitude: 106.923567,
            lastAddress: "Jalan Thamrin No. 888, Jakarta",
          },
          description: "Bensin habis di tengah jalan",
          countdownMinutes: -90,
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 15,
        totalPages: 2,
        hasNext: true,
        hasPrev: false,
      },
    },
    Type: "SOS_FILTER",
  },
};

export const mockSOSFilterWithCategories = {
  data: {
    Message: {
      Code: 200,
      Text: "SOS filter applied successfully",
    },
    Data: {
      filters: {
        transporters: ["trans123"],
        categories: ["cat001", "cat002"],
        appliedAt: "2025-08-04T14:30:00Z",
      },
      sos: [
        {
          id: "123e4567-e89b-12d3-a456-426614174000",
          sosStatus: "OPEN",
          isUrgent: false,
          escalationLevel: 1,
          sosTime: "2025-08-04T10:30:00Z",
          responseDeadline: "2025-08-04T12:30:00Z",
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
          id: "789e0123-e89b-12d3-a456-426614174002",
          sosStatus: "ACKNOWLEDGED",
          isUrgent: false,
          escalationLevel: 1,
          sosTime: "2025-08-04T08:00:00Z",
          responseDeadline: "2025-08-04T10:00:00Z",
          transporter: {
            id: "trans123",
            companyName: "PT ABC Transport",
            logoUrl: "https://cdn.example.com/logos/abc-transport.png",
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
        total: 2,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    },
    Type: "SOS_FILTER",
  },
};

export const mockSOSFilterEmpty = {
  data: {
    Message: {
      Code: 200,
      Text: "No SOS found with applied filters",
    },
    Data: {
      filters: {
        transporters: ["trans999"],
        categories: ["cat999"],
        appliedAt: "2025-08-04T14:30:00Z",
      },
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
    Type: "SOS_FILTER_EMPTY",
  },
};

export const getSOSFilter = async (params = {}) => {
  const {
    transporter = [],
    category = [],
    page = 1,
    limit = 10,
    sort = "sosTime:asc",
  } = params;

  // Validate required parameters
  if (!transporter || !Array.isArray(transporter) || transporter.length === 0) {
    return {
      data: {
        Message: {
          Code: 400,
          Text: "Transporter IDs are required",
        },
        Data: {
          filters: {
            transporters: [],
            categories: [],
            appliedAt: new Date().toISOString(),
          },
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
        Type: "SOS_FILTER_ERROR",
      },
      raw: null,
    };
  }

  let result;

  if (useMockData) {
    // Simulate different scenarios based on filter parameters
    let filteredSOS = [...mockSOSFilterResults.data.Data.sos];

    // Apply transporter filter
    if (transporter.length > 0) {
      filteredSOS = filteredSOS.filter((sos) =>
        transporter.includes(sos.transporter.id)
      );
    }

    // Apply category filter
    if (category.length > 0) {
      filteredSOS = filteredSOS.filter((sos) =>
        category.includes(sos.sosCategory.id)
      );
    }

    // Apply sorting
    if (sort === "sosTime:desc") {
      filteredSOS.sort((a, b) => new Date(b.sosTime) - new Date(a.sosTime));
    } else if (sort === "sosTime:asc") {
      filteredSOS.sort((a, b) => new Date(a.sosTime) - new Date(b.sosTime));
    } else if (sort === "escalationLevel:desc") {
      filteredSOS.sort((a, b) => b.escalationLevel - a.escalationLevel);
    } else if (sort === "escalationLevel:asc") {
      filteredSOS.sort((a, b) => a.escalationLevel - b.escalationLevel);
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedSOS = filteredSOS.slice(startIndex, endIndex);

    // Update pagination info
    const updatedPagination = {
      page,
      limit,
      total: filteredSOS.length,
      totalPages: Math.ceil(filteredSOS.length / limit),
      hasNext: endIndex < filteredSOS.length,
      hasPrev: page > 1,
    };

    if (filteredSOS.length === 0) {
      result = mockSOSFilterEmpty.data;
      result.data.Data.filters.transporters = transporter;
      result.data.Data.filters.categories = category;
    } else {
      result = {
        ...mockSOSFilterResults.data,
        Data: {
          filters: {
            transporters: transporter,
            categories: category,
            appliedAt: new Date().toISOString(),
          },
          sos: paginatedSOS,
          pagination: updatedPagination,
        },
      };
    }
  } else {
    try {
      result = await fetcherMuatrans.get(`/v1/cs/sos/filter`, {
        params: {
          transporter,
          category,
          page,
          limit,
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
              "Failed to apply SOS filter",
          },
          Data: {
            filters: {
              transporters: transporter,
              categories: category,
              appliedAt: new Date().toISOString(),
            },
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
          Type: "SOS_FILTER_ERROR",
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

export const useGetSOSFilter = (params = {}) => {
  const { transporter, ...otherParams } = params;

  const { data, error, isLoading, mutate } = useSWR(
    transporter && transporter.length > 0 ? [`getSOSFilter`, params] : null,
    () => getSOSFilter(params),
    {
      refreshInterval: 30000, // Refresh every 30 seconds for real-time updates
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
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
