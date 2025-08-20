import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

export const mockCombinedSearchFilterResults = {
  data: {
    Message: {
      Code: 200,
      Text: "Combined search and filter completed successfully",
    },
    Data: {
      keyword: "B1234",
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
          relevanceScore: 0.95,
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
            licensePlate: "B1234EF",
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
          relevanceScore: 0.87,
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
            licensePlate: "B1234GH",
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
          relevanceScore: 0.82,
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 3,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    },
    Type: "SOS_SEARCH_FILTER",
  },
};

export const mockCombinedSearchFilterWithCategories = {
  data: {
    Message: {
      Code: 200,
      Text: "Combined search and filter completed successfully",
    },
    Data: {
      keyword: "ABC",
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
          relevanceScore: 0.95,
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    },
    Type: "SOS_SEARCH_FILTER",
  },
};

export const mockCombinedSearchFilterEmpty = {
  data: {
    Message: {
      Code: 200,
      Text: "No results found with combined search and filter",
    },
    Data: {
      keyword: "XYZ999",
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
    Type: "SOS_SEARCH_FILTER_EMPTY",
  },
};

export const getCombinedSearchFilterSOS = async (params = {}) => {
  const {
    keyword = "",
    transporter = [],
    category = [],
    page = 1,
    limit = 10,
    sort = "relevance:desc",
  } = params;

  // Validate required parameters
  if (!keyword || keyword.length < 2 || keyword.length > 50) {
    return {
      data: {
        Message: {
          Code: 400,
          Text: "Keyword must be between 2 and 50 characters",
        },
        Data: {
          keyword: keyword || "",
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
        Type: "SOS_SEARCH_FILTER_ERROR",
      },
      raw: null,
    };
  }

  let result;

  if (useMockData) {
    // Simulate combined search and filter results
    let filteredSOS = [...mockCombinedSearchFilterResults.data.Data.sos];

    // Apply keyword search with relevance scoring
    const searchTerm = keyword.toLowerCase().trim();

    // Calculate relevance scores based on keyword matches
    filteredSOS = filteredSOS.map((sos) => {
      let score = 0;

      // License plate match (highest relevance - 40%)
      if (sos.fleet.licensePlate.toLowerCase().includes(searchTerm)) {
        score += 0.4;
      }

      // Company name match (30%)
      if (sos.transporter.companyName.toLowerCase().includes(searchTerm)) {
        score += 0.3;
      }

      // Driver name match (20%)
      if (sos.driver.fullName.toLowerCase().includes(searchTerm)) {
        score += 0.2;
      }

      // Vehicle type match (10%)
      if (sos.fleet.vehicleType.toLowerCase().includes(searchTerm)) {
        score += 0.1;
      }

      // Description match (5%)
      if (sos.description.toLowerCase().includes(searchTerm)) {
        score += 0.05;
      }

      return { ...sos, relevanceScore: Math.min(score, 1.0) };
    });

    // Filter by relevance score (only show relevant results)
    filteredSOS = filteredSOS.filter((sos) => sos.relevanceScore > 0);

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
    if (sort === "relevance:desc") {
      filteredSOS.sort((a, b) => b.relevanceScore - a.relevanceScore);
    } else if (sort === "relevance:asc") {
      filteredSOS.sort((a, b) => a.relevanceScore - b.relevanceScore);
    } else if (sort === "sosTime:desc") {
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
      result = mockCombinedSearchFilterEmpty.data;
      result.data.Data.keyword = keyword;
      result.data.Data.filters.transporters = transporter;
      result.data.Data.filters.categories = category;
    } else {
      result = {
        ...mockCombinedSearchFilterResults.data,
        Data: {
          keyword,
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
      result = await fetcherMuatrans.get(`/v1/cs/sos/search-filter`, {
        params: {
          keyword,
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
              "Failed to perform combined search and filter",
          },
          Data: {
            keyword,
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
          Type: "SOS_SEARCH_FILTER_ERROR",
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

export const useGetCombinedSearchFilterSOS = (params = {}) => {
  const { keyword, ...otherParams } = params;

  const { data, error, isLoading, mutate } = useSWR(
    keyword && keyword.length >= 2
      ? [`getCombinedSearchFilterSOS`, params]
      : null,
    () => getCombinedSearchFilterSOS(params),
    {
      revalidateOnFocus: false, // Don't revalidate on focus for search
      revalidateOnReconnect: false, // Don't revalidate on reconnect for search
      dedupingInterval: 5000, // Dedupe requests within 5 seconds
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
