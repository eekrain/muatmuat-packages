import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

export const mockSOSHistoryFilterResults = {
  data: {
    Message: {
      Code: 200,
      Text: "History filter applied successfully",
    },
    Data: {
      filters: {
        transporters: ["trans123", "trans456"],
        categories: ["cat001"],
        period: {
          type: "30_DAYS",
          startDate: "2025-07-05",
          endDate: "2025-08-04",
        },
        appliedAt: "2025-08-04T14:30:00Z",
      },
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
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 10,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
      periodSummary: {
        totalInPeriod: 10,
        averageResolutionTime: "2 jam 25 menit",
        urgentCases: 3,
        escalatedCases: 2,
      },
    },
    Type: "SOS_HISTORY_FILTER",
  },
};

export const mockSOSHistoryFilterWithCategories = {
  data: {
    Message: {
      Code: 200,
      Text: "History filter applied successfully",
    },
    Data: {
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
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
      periodSummary: {
        totalInPeriod: 2,
        averageResolutionTime: "2 jam 12 menit",
        urgentCases: 1,
        escalatedCases: 1,
      },
    },
    Type: "SOS_HISTORY_FILTER",
  },
};

export const mockSOSHistoryFilterEmpty = {
  data: {
    Message: {
      Code: 200,
      Text: "No history found with applied filters",
    },
    Data: {
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
      periodSummary: {
        totalInPeriod: 0,
        averageResolutionTime: "0 jam 0 menit",
        urgentCases: 0,
        escalatedCases: 0,
      },
    },
    Type: "SOS_HISTORY_FILTER_EMPTY",
  },
};

export const getHistoryFilterSOS = async (params = {}) => {
  const {
    transporter = [],
    category = [],
    periodType = "30_DAYS",
    startDate = "",
    endDate = "",
    page = 1,
    limit = 10,
    sort = "resolvedAt:desc",
  } = params;

  let result;

  if (useMockData) {
    // Simulate filter results based on parameters
    let filteredHistory = [...mockSOSHistoryFilterResults.data.Data.history];

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
    if (sort === "resolvedAt:asc") {
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
    } else {
      // Default: resolvedAt:desc
      filteredHistory.sort(
        (a, b) => new Date(b.resolvedAt) - new Date(a.resolvedAt)
      );
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

    // Calculate period summary
    const urgentCases = filteredHistory.filter(
      (history) => history.wasUrgent
    ).length;
    const escalatedCases = filteredHistory.filter(
      (history) => history.escalationLevel > 1
    ).length;

    // Calculate average resolution time
    let totalMinutes = 0;
    let validResolutions = 0;

    filteredHistory.forEach((history) => {
      const duration = history.resolutionDuration;
      if (duration && duration.includes("jam")) {
        const hours = parseInt(duration.match(/(\d+)\s*jam/)?.[1] || "0");
        const minutes = parseInt(duration.match(/(\d+)\s*menit/)?.[1] || "0");
        totalMinutes += hours * 60 + minutes;
        validResolutions++;
      }
    });

    const averageMinutes =
      validResolutions > 0 ? totalMinutes / validResolutions : 0;
    const averageHours = Math.floor(averageMinutes / 60);
    const averageMins = Math.round(averageMinutes % 60);
    const averageResolutionTime = `${averageHours} jam ${averageMins} menit`;

    // Update period summary
    const updatedPeriodSummary = {
      totalInPeriod: filteredHistory.length,
      averageResolutionTime,
      urgentCases,
      escalatedCases,
    };

    // Determine which mock data to use based on filters
    if (filteredHistory.length === 0) {
      result = mockSOSHistoryFilterEmpty.data;
      result.data.Data.filters = {
        transporters: transporter,
        categories: category,
        period: {
          type: periodType,
          startDate: startDate || "2025-07-05",
          endDate: endDate || "2025-08-04",
        },
        appliedAt: new Date().toISOString(),
      };
    } else if (
      category.length > 0 &&
      category.includes("cat001") &&
      category.includes("cat002")
    ) {
      result = mockSOSHistoryFilterWithCategories.data;
      result.data.Data.filters.transporters =
        transporter.length > 0 ? transporter : ["trans123", "trans456"];
      result.data.Data.filters.categories = category;
      result.data.Data.filters.period.type = periodType;
      if (startDate && endDate) {
        result.data.Data.filters.period.startDate = startDate;
        result.data.Data.filters.period.endDate = endDate;
      }
    } else {
      result = mockSOSHistoryFilterResults.data;
      result.data.Data.filters.transporters =
        transporter.length > 0 ? transporter : ["trans123", "trans456"];
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
    result.data.Data.periodSummary = updatedPeriodSummary;
  } else {
    try {
      result = await fetcherMuatrans.get(`/v1/cs/sos/history/filter`, {
        params: {
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
              "Failed to apply SOS history filter",
          },
          Data: {
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
            periodSummary: {
              totalInPeriod: 0,
              averageResolutionTime: "0 jam 0 menit",
              urgentCases: 0,
              escalatedCases: 0,
            },
          },
          Type: "SOS_HISTORY_FILTER_ERROR",
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

export const useGetHistoryFilterSOS = (params = {}) => {
  const {
    transporter,
    category,
    periodType,
    startDate,
    endDate,
    ...otherParams
  } = params;

  const { data, error, isLoading, mutate } = useSWR(
    [`getHistoryFilterSOS`, params],
    () => getHistoryFilterSOS(params),
    {
      refreshInterval: 300000, // Refresh every 5 minutes
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  return {
    data: data?.data || {},
    raw: data?.raw,
    isLoading,
    isError: !!error,
    mutate,
  };
};
