import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

export const mockSOSHistorySearchResults = {
  data: {
    Message: {
      Code: 200,
      Text: "History search completed successfully",
    },
    Data: {
      keyword: "B5678",
      history: [
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
          relevanceScore: 0.93,
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
            licensePlate: "B5678GH",
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
          relevanceScore: 0.87,
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
            licensePlate: "B5678IJ",
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
    Type: "SOS_HISTORY_SEARCH",
  },
};

export const mockSOSHistorySearchFiltered = {
  data: {
    Message: {
      Code: 200,
      Text: "History search completed successfully",
    },
    Data: {
      keyword: "Ban",
      history: [
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
    Type: "SOS_HISTORY_SEARCH",
  },
};

export const mockSOSHistorySearchEmpty = {
  data: {
    Message: {
      Code: 200,
      Text: "No history found with search criteria",
    },
    Data: {
      keyword: "XYZ999",
      history: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
    },
    Type: "SOS_HISTORY_SEARCH_EMPTY",
  },
};

export const getHistorySearchSOS = async (params = {}) => {
  const {
    keyword = "",
    page = 1,
    limit = 10,
    sort = "resolvedAt:desc",
  } = params;

  // Validate keyword length
  if (!keyword || keyword.length < 2 || keyword.length > 50) {
    return {
      data: {
        Message: {
          Code: 400,
          Text: "Keyword must be between 2 and 50 characters",
        },
        Data: {
          keyword: keyword || "",
          history: [],
          pagination: {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          },
        },
        Type: "SOS_HISTORY_SEARCH_ERROR",
      },
      raw: null,
    };
  }

  let result;

  if (useMockData) {
    // Simulate search results based on keyword
    const searchTerm = keyword.toLowerCase().trim();

    // Check if keyword matches any patterns
    const hasLicensePlateMatch =
      searchTerm.includes("b5678") ||
      searchTerm.includes("5678") ||
      searchTerm.includes("b");

    const hasCategoryMatch =
      searchTerm.includes("ban") ||
      searchTerm.includes("mesin") ||
      searchTerm.includes("medis");

    const hasCompanyMatch =
      searchTerm.includes("xyz") ||
      searchTerm.includes("logistics") ||
      searchTerm.includes("def") ||
      searchTerm.includes("cargo");

    const hasDriverMatch =
      searchTerm.includes("jane") ||
      searchTerm.includes("bob") ||
      searchTerm.includes("alice");

    if (
      hasLicensePlateMatch ||
      hasCategoryMatch ||
      hasCompanyMatch ||
      hasDriverMatch
    ) {
      // Filter results based on search relevance
      let filteredHistory = [...mockSOSHistorySearchResults.data.Data.history];

      // Apply relevance scoring based on keyword matches
      filteredHistory = filteredHistory.map((history) => {
        let score = 0;

        // License plate match (highest relevance - 40%)
        if (history.fleet.licensePlate.toLowerCase().includes(searchTerm)) {
          score += 0.4;
        }

        // Category match (30%)
        if (
          history.sosCategory.categoryName.toLowerCase().includes(searchTerm)
        ) {
          score += 0.3;
        }

        // Company name match (20%)
        if (
          history.transporter.companyName.toLowerCase().includes(searchTerm)
        ) {
          score += 0.2;
        }

        // Driver name match (10%)
        if (history.driver.fullName.toLowerCase().includes(searchTerm)) {
          score += 0.1;
        }

        return { ...history, relevanceScore: Math.min(score, 1.0) };
      });

      // Sort by relevance score (descending)
      filteredHistory.sort((a, b) => b.relevanceScore - a.relevanceScore);

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedHistory = filteredHistory.slice(startIndex, endIndex);

      // Update pagination info
      const updatedPagination = {
        page,
        limit,
        total: filteredHistory.length,
        totalPages: Math.ceil(filteredHistory.length / limit),
        hasNext: endIndex < filteredHistory.length,
        hasPrev: page > 1,
      };

      result = {
        ...mockSOSHistorySearchResults.data,
        Data: {
          keyword,
          history: paginatedHistory,
          pagination: updatedPagination,
        },
      };
    } else {
      result = mockSOSHistorySearchEmpty.data;
      result.data.Data.keyword = keyword;
    }
  } else {
    try {
      result = await fetcherMuatrans.get(`/v1/cs/sos/history/search`, {
        params: {
          keyword,
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
              "Failed to perform SOS history search",
          },
          Data: {
            keyword,
            history: [],
            pagination: {
              page: 1,
              limit: 10,
              total: 0,
              totalPages: 0,
              hasNext: false,
              hasPrev: false,
            },
          },
          Type: "SOS_HISTORY_SEARCH_ERROR",
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

export const useGetHistorySearchSOS = (params = {}) => {
  const { keyword, ...otherParams } = params;

  const { data, error, isLoading, mutate } = useSWR(
    keyword && keyword.length >= 2 ? [`getHistorySearchSOS`, params] : null,
    () => getHistorySearchSOS(params),
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
