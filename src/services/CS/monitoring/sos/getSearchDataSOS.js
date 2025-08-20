import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

export const mockSOSSearchResults = {
  data: {
    Message: {
      Code: 200,
      Text: "Search completed successfully",
    },
    Data: {
      keyword: "B1234",
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
            id: "trans789",
            companyName: "PT DEF Cargo",
            logoUrl: "https://cdn.example.com/logos/def-cargo.png",
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
    Type: "SOS_SEARCH",
  },
};

export const mockSOSSearchNoResults = {
  data: {
    Message: {
      Code: 200,
      Text: "Search completed with no results",
    },
    Data: {
      keyword: "XYZ999",
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
    Type: "SOS_SEARCH_EMPTY",
  },
};

export const mockSOSSearchError = {
  data: {
    Message: {
      Code: 400,
      Text: "Invalid search parameters",
    },
    Data: {
      errors: [
        {
          field: "keyword",
          message: "Keyword must be between 2 and 50 characters",
        },
      ],
    },
    Type: "SOS_SEARCH_ERROR",
  },
};

export const getSearchDataSOS = async (params = {}) => {
  const { keyword = "", page = 1, limit = 10, sort = "sosTime:asc" } = params;

  // Validate keyword length
  if (!keyword || keyword.length < 2 || keyword.length > 50) {
    return {
      data: mockSOSSearchError.data,
      raw: null,
    };
  }

  let result;

  if (useMockData) {
    // Simulate search results based on keyword
    const searchTerm = keyword.toLowerCase();

    // Check if keyword matches any license plate patterns
    const hasLicensePlateMatch =
      searchTerm.includes("b1234") ||
      searchTerm.includes("1234") ||
      searchTerm.includes("b");

    // Check if keyword matches company names
    const hasCompanyMatch =
      searchTerm.includes("abc") ||
      searchTerm.includes("transport") ||
      searchTerm.includes("logistics");

    // Check if keyword matches driver names
    const hasDriverMatch =
      searchTerm.includes("john") ||
      searchTerm.includes("jane") ||
      searchTerm.includes("bob");

    // Check if keyword matches vehicle types
    const hasVehicleMatch =
      searchTerm.includes("truk") ||
      searchTerm.includes("fuso") ||
      searchTerm.includes("colt");

    if (
      hasLicensePlateMatch ||
      hasCompanyMatch ||
      hasDriverMatch ||
      hasVehicleMatch
    ) {
      // Filter results based on search relevance
      let filteredSOS = [...mockSOSSearchResults.data.Data.sos];

      // Apply relevance scoring based on keyword matches
      filteredSOS = filteredSOS.map((sos) => {
        let score = 0;

        // License plate match (highest relevance)
        if (sos.fleet.licensePlate.toLowerCase().includes(searchTerm)) {
          score += 0.4;
        }

        // Company name match
        if (sos.transporter.companyName.toLowerCase().includes(searchTerm)) {
          score += 0.3;
        }

        // Driver name match
        if (sos.driver.fullName.toLowerCase().includes(searchTerm)) {
          score += 0.2;
        }

        // Vehicle type match
        if (sos.fleet.vehicleType.toLowerCase().includes(searchTerm)) {
          score += 0.1;
        }

        return { ...sos, relevanceScore: Math.min(score, 1.0) };
      });

      // Sort by relevance score (descending)
      filteredSOS.sort((a, b) => b.relevanceScore - a.relevanceScore);

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

      result = {
        ...mockSOSSearchResults.data,
        Data: {
          keyword,
          sos: paginatedSOS,
          pagination: updatedPagination,
        },
      };
    } else {
      result = mockSOSSearchNoResults.data;
    }
  } else {
    try {
      result = await fetcherMuatrans.get(`/v1/cs/sos/search`, {
        params: {
          keyword,
          page,
          limit,
          sort,
        },
      });
    } catch (error) {
      // Handle error response
      if (error.response?.status === 400) {
        return {
          data: {
            Message: {
              Code: 400,
              Text:
                error.response?.data?.Message?.Text ||
                "Invalid search parameters",
            },
            Data: {
              keyword,
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
            Type: "SOS_SEARCH_ERROR",
          },
          raw: error.response,
        };
      }

      return {
        data: {
          Message: {
            Code: error.response?.status || 500,
            Text:
              error.response?.data?.Message?.Text ||
              "Failed to perform SOS search",
          },
          Data: {
            keyword,
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
          Type: "SOS_SEARCH_ERROR",
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

export const useGetSearchDataSOS = (params = {}) => {
  const { keyword, ...otherParams } = params;

  const { data, error, isLoading, mutate } = useSWR(
    keyword && keyword.length >= 2 ? [`getSearchDataSOS`, params] : null,
    () => getSearchDataSOS(params),
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
