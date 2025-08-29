import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

export const mockHistorySearchFilterResults = {
  data: {
    Message: {
      Code: 200,
      Text: "Combined history search and filter completed successfully",
    },
    Data: {
      keyword: "B5678",
      filters: {
        transporters: ["trans456"],
        categories: ["cat002"],
        period: {
          type: "30_DAYS",
          startDate: "2025-07-05",
          endDate: "2025-08-04",
        },
        appliedAt: "2025-08-04T14:30:00Z",
      },
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
            imageUrl: "https://cdn.example.com/vehicles/fleet789.jpg",
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
    Type: "SOS_HISTORY_SEARCH_FILTER",
  },
};

export const mockHistorySearchFilterWithCategories = {
  data: {
    Message: {
      Code: 200,
      Text: "Combined history search and filter completed successfully",
    },
    Data: {
      keyword: "Ban",
      filters: {
        transporters: ["trans123", "trans456"],
        categories: ["cat001", "cat002"],
        period: {
          type: "30_DAYS",
          startDate: "2025-07-05",
          endDate: "2025-08-04",
        },
        appliedAt: "2025-08-04T14:30:00Z",
      },
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
        {
          id: "hist202e2233-e44b-55c6-d667-778899001122",
          sosStatus: "RESOLVED",
          sosTime: "2025-07-30T11:30:00Z",
          resolvedAt: "2025-07-30T13:15:00Z",
          resolutionDuration: "1 jam 45 menit",
          resolvedTimeRelative: "5 hari lalu",
          transporter: {
            id: "trans202",
            companyName: "PT JKL Transport",
            logoUrl: "https://cdn.example.com/logos/jkl-transport.png",
          },
          fleet: {
            id: "fleet456",
            licensePlate: "B5678KL",
            vehicleType: "Truk Box",
            imageUrl: "https://cdn.example.com/vehicles/fleet456.jpg",
          },
          driver: {
            id: "driver789",
            fullName: "Charlie Wilson",
            phoneNumber: "08567890123",
          },
          sosCategory: {
            id: "cat002",
            categoryName: "Ban",
          },
          location: {
            sosLatitude: -6.56789,
            sosLongitude: 106.54321,
            lastAddress: "Jalan Sudirman No. 101, Jakarta",
          },
          resolution: "Ban diganti dengan ban baru",
          escalationLevel: 1,
          wasUrgent: false,
          relevanceScore: 0.88,
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
    Type: "SOS_HISTORY_SEARCH_FILTER",
  },
};

export const mockHistorySearchFilterEmpty = {
  data: {
    Message: {
      Code: 200,
      Text: "No history found with search and filter criteria",
    },
    Data: {
      keyword: "XYZ999",
      filters: {
        transporters: ["trans999"],
        categories: ["cat999"],
        period: {
          type: "30_DAYS",
          startDate: "2025-07-05",
          endDate: "2025-08-04",
        },
        appliedAt: "2025-08-04T14:30:00Z",
      },
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
    Type: "SOS_HISTORY_SEARCH_FILTER_EMPTY",
  },
};

export const getHistorySearchFilterSOS = async (params = {}) => {
  const {
    keyword = "",
    transporter = [],
    category = [],
    periodType = "30_DAYS",
    startDate = "",
    endDate = "",
    page = 1,
    limit = 10,
    sort = "relevance:desc",
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
          filters: {
            transporters: transporter,
            categories: category,
            period: {
              type: periodType,
              startDate: startDate || "",
              endDate: endDate || "",
            },
            appliedAt: new Date().toISOString(),
          },
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
        Type: "SOS_HISTORY_SEARCH_FILTER_ERROR",
      },
      raw: null,
    };
  }

  let result;

  if (useMockData) {
    // Simulate combined search and filter results
    let filteredHistory = [...mockHistorySearchFilterResults.data.Data.history];

    // Apply keyword search with relevance scoring
    const searchTerm = keyword.toLowerCase().trim();
    filteredHistory = filteredHistory.map((history) => {
      let score = 0;

      // License plate match (highest relevance - 40%)
      if (history.fleet.licensePlate.toLowerCase().includes(searchTerm)) {
        score += 0.4;
      }

      // Category match (30%)
      if (history.sosCategory.categoryName.toLowerCase().includes(searchTerm)) {
        score += 0.3;
      }

      // Company name match (20%)
      if (history.transporter.companyName.toLowerCase().includes(searchTerm)) {
        score += 0.2;
      }

      // Driver name match (10%)
      if (history.driver.fullName.toLowerCase().includes(searchTerm)) {
        score += 0.1;
      }

      // Description/resolution match (additional 20% if found)
      if (
        history.resolution.toLowerCase().includes(searchTerm) ||
        (history.description &&
          history.description.toLowerCase().includes(searchTerm))
      ) {
        score += 0.2;
      }

      return { ...history, relevanceScore: Math.min(score, 1.0) };
    });

    // Filter by relevance score (only show relevant results)
    filteredHistory = filteredHistory.filter(
      (history) => history.relevanceScore > 0
    );

    // Apply transporter filter
    if (transporter.length > 0) {
      filteredHistory = filteredHistory.filter((history) =>
        transporter.includes(history.transporter.id)
      );
    }

    // Apply category filter
    if (category.length > 0) {
      filteredHistory = filteredHistory.filter((history) =>
        category.includes(history.sosCategory.id)
      );
    }

    // Apply period filter
    if (periodType === "CUSTOM" && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filteredHistory = filteredHistory.filter((history) => {
        const resolvedDate = new Date(history.resolvedAt);
        return resolvedDate >= start && resolvedDate <= end;
      });
    } else if (periodType === "1_WEEK") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      filteredHistory = filteredHistory.filter((history) => {
        const resolvedDate = new Date(history.resolvedAt);
        return resolvedDate >= oneWeekAgo;
      });
    } else if (periodType === "90_DAYS") {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      filteredHistory = filteredHistory.filter((history) => {
        const resolvedDate = new Date(history.resolvedAt);
        return resolvedDate >= ninetyDaysAgo;
      });
    }
    // Default 30_DAYS is already filtered in mock data

    // Apply sorting
    if (sort === "relevance:desc") {
      // Sort by relevance score (descending), then by resolved time (descending)
      filteredHistory.sort((a, b) => {
        if (b.relevanceScore !== a.relevanceScore) {
          return b.relevanceScore - a.relevanceScore;
        }
        return new Date(b.resolvedAt) - new Date(a.resolvedAt);
      });
    } else if (sort === "relevance:asc") {
      // Sort by relevance score (ascending), then by resolved time (ascending)
      filteredHistory.sort((a, b) => {
        if (a.relevanceScore !== b.relevanceScore) {
          return a.relevanceScore - b.relevanceScore;
        }
        return new Date(a.resolvedAt) - new Date(b.resolvedAt);
      });
    } else if (sort === "resolvedAt:desc") {
      filteredHistory.sort(
        (a, b) => new Date(b.resolvedAt) - new Date(a.resolvedAt)
      );
    } else if (sort === "resolvedAt:asc") {
      filteredHistory.sort(
        (a, b) => new Date(a.resolvedAt) - new Date(b.resolvedAt)
      );
    } else if (sort === "sosTime:desc") {
      filteredHistory.sort((a, b) => new Date(b.sosTime) - new Date(a.sosTime));
    } else if (sort === "sosTime:asc") {
      filteredHistory.sort((a, b) => new Date(a.sosTime) - new Date(b.sosTime));
    } else if (sort === "escalationLevel:desc") {
      filteredHistory.sort((a, b) => b.escalationLevel - a.escalationLevel);
    } else if (sort === "escalationLevel:asc") {
      filteredHistory.sort((a, b) => a.escalationLevel - b.escalationLevel);
    }

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

    // Determine which mock data to use based on filters
    if (filteredHistory.length === 0) {
      result = mockHistorySearchFilterEmpty.data;
      result.data.Data.keyword = keyword;
      result.data.Data.filters.transporters = transporter;
      result.data.Data.filters.categories = category;
      result.data.Data.filters.period.type = periodType;
      if (startDate && endDate) {
        result.data.Data.filters.period.startDate = startDate;
        result.data.Data.filters.period.endDate = endDate;
      }
    } else if (
      category.length > 0 &&
      category.includes("cat001") &&
      category.includes("cat002")
    ) {
      result = mockHistorySearchFilterWithCategories.data;
      result.data.Data.keyword = keyword;
      result.data.Data.filters.transporters =
        transporter.length > 0 ? transporter : ["trans123", "trans456"];
      result.data.Data.filters.categories = category;
      result.data.Data.filters.period.type = periodType;
      if (startDate && endDate) {
        result.data.Data.filters.period.startDate = startDate;
        result.data.Data.filters.period.endDate = endDate;
      }
    } else {
      result = mockHistorySearchFilterResults.data;
      result.data.Data.keyword = keyword;
      result.data.Data.filters.transporters =
        transporter.length > 0 ? transporter : ["trans456"];
      result.data.Data.filters.categories = category;
      result.data.Data.filters.period.type = periodType;
      if (startDate && endDate) {
        result.data.Data.filters.period.startDate = startDate;
        result.data.Data.filters.period.endDate = endDate;
      }
    }

    // Update the result with filtered data
    result.data.Data.history = paginatedHistory;
    result.data.Data.pagination = updatedPagination;
  } else {
    try {
      result = await fetcherMuatrans.get(`/v1/cs/sos/history/search-filter`, {
        params: {
          keyword,
          transporter,
          category,
          periodType,
          startDate,
          endDate,
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
              "Failed to perform combined history search and filter",
          },
          Data: {
            keyword,
            filters: {
              transporters: transporter,
              categories: category,
              period: {
                type: periodType,
                startDate: startDate || "",
                endDate: endDate || "",
              },
              appliedAt: new Date().toISOString(),
            },
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
          Type: "SOS_HISTORY_SEARCH_FILTER_ERROR",
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

export const useGetHistorySearchFilterSOS = (params = {}) => {
  const {
    keyword,
    transporter,
    category,
    periodType,
    startDate,
    endDate,
    ...otherParams
  } = params;

  const { data, error, isLoading, mutate } = useSWR(
    keyword && keyword.length >= 2
      ? [`getHistorySearchFilterSOS`, params]
      : null,
    () => getHistorySearchFilterSOS(params),
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
