import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

export const mockTransportersWithHistory = {
  data: {
    Message: {
      Code: 200,
      Text: "Transporters with history retrieved successfully",
    },
    Data: {
      transporters: [
        {
          id: "trans123",
          companyName: "PT ABC Transport",
          historyCount: 12,
          lastResolvedAt: "2025-08-03T10:45:00Z",
          logoUrl: "https://cdn.example.com/logos/abc-transport.png",
          averageResolutionTime: "2 jam 15 menit",
        },
        {
          id: "trans456",
          companyName: "PT XYZ Logistics",
          historyCount: 8,
          lastResolvedAt: "2025-08-02T16:30:00Z",
          logoUrl: "https://cdn.example.com/logos/xyz-logistics.png",
          averageResolutionTime: "3 jam 10 menit",
        },
        {
          id: "trans789",
          companyName: "PT DEF Cargo",
          historyCount: 5,
          lastResolvedAt: "2025-08-01T14:20:00Z",
          logoUrl: "https://cdn.example.com/logos/def-cargo.png",
          averageResolutionTime: "1 jam 45 menit",
        },
        {
          id: "trans101",
          companyName: "PT GHI Express",
          historyCount: 15,
          lastResolvedAt: "2025-08-04T09:30:00Z",
          logoUrl: "https://cdn.example.com/logos/ghi-express.png",
          averageResolutionTime: "2 jam 30 menit",
        },
        {
          id: "trans202",
          companyName: "PT JKL Transport",
          historyCount: 7,
          lastResolvedAt: "2025-07-31T18:20:00Z",
          logoUrl: "https://cdn.example.com/logos/jkl-transport.png",
          averageResolutionTime: "1 jam 55 menit",
        },
        {
          id: "trans303",
          companyName: "PT MNO Cargo",
          historyCount: 20,
          lastResolvedAt: "2025-08-04T11:15:00Z",
          logoUrl: "https://cdn.example.com/logos/mno-cargo.png",
          averageResolutionTime: "3 jam 45 menit",
        },
        {
          id: "trans404",
          companyName: "PT PQR Logistics",
          historyCount: 3,
          lastResolvedAt: "2025-07-30T15:45:00Z",
          logoUrl: "https://cdn.example.com/logos/pqr-logistics.png",
          averageResolutionTime: "1 jam 20 menit",
        },
        {
          id: "trans505",
          companyName: "PT STU Transport",
          historyCount: 18,
          lastResolvedAt: "2025-08-03T16:00:00Z",
          logoUrl: "https://cdn.example.com/logos/stu-transport.png",
          averageResolutionTime: "2 jam 50 menit",
        },
      ],
      total: 8,
      periodInfo: {
        type: "all_time",
        totalHistory: 88,
      },
    },
    Type: "TRANSPORTERS_WITH_HISTORY",
  },
};

export const mockTransportersWithHistoryFiltered = {
  data: {
    Message: {
      Code: 200,
      Text: "Transporters with history retrieved successfully",
    },
    Data: {
      transporters: [
        {
          id: "trans123",
          companyName: "PT ABC Transport",
          historyCount: 12,
          lastResolvedAt: "2025-08-03T10:45:00Z",
          logoUrl: "https://cdn.example.com/logos/abc-transport.png",
          averageResolutionTime: "2 jam 15 menit",
        },
        {
          id: "trans101",
          companyName: "PT GHI Express",
          historyCount: 15,
          lastResolvedAt: "2025-08-04T09:30:00Z",
          logoUrl: "https://cdn.example.com/logos/ghi-express.png",
          averageResolutionTime: "2 jam 30 menit",
        },
        {
          id: "trans202",
          companyName: "PT JKL Transport",
          historyCount: 7,
          lastResolvedAt: "2025-07-31T18:20:00Z",
          logoUrl: "https://cdn.example.com/logos/jkl-transport.png",
          averageResolutionTime: "1 jam 55 menit",
        },
      ],
      total: 3,
      periodInfo: {
        type: "30_DAYS",
        totalHistory: 34,
      },
    },
    Type: "TRANSPORTERS_WITH_HISTORY",
  },
};

export const mockTransportersWithHistorySearch = {
  data: {
    Message: {
      Code: 200,
      Text: "Transporters with history retrieved successfully",
    },
    Data: {
      transporters: [
        {
          id: "trans123",
          companyName: "PT ABC Transport",
          historyCount: 12,
          lastResolvedAt: "2025-08-03T10:45:00Z",
          logoUrl: "https://cdn.example.com/logos/abc-transport.png",
          averageResolutionTime: "2 jam 15 menit",
        },
        {
          id: "trans456",
          companyName: "PT XYZ Logistics",
          historyCount: 8,
          lastResolvedAt: "2025-08-02T16:30:00Z",
          logoUrl: "https://cdn.example.com/logos/xyz-logistics.png",
          averageResolutionTime: "3 jam 10 menit",
        },
      ],
      total: 2,
      periodInfo: {
        type: "all_time",
        totalHistory: 20,
      },
    },
    Type: "TRANSPORTERS_WITH_HISTORY",
  },
};

export const mockTransportersWithHistoryEmpty = {
  data: {
    Message: {
      Code: 200,
      Text: "No transporters found with history",
    },
    Data: {
      transporters: [],
      total: 0,
      periodInfo: {
        type: "all_time",
        totalHistory: 0,
      },
    },
    Type: "TRANSPORTERS_WITH_HISTORY_EMPTY",
  },
};

export const getHistoryTransporterFilter = async (params = {}) => {
  const { search = "", periodType = "all_time" } = params;

  let result;

  if (useMockData) {
    // Simulate filter results based on parameters
    let filteredTransporters = [
      ...mockTransportersWithHistory.data.Data.transporters,
    ];

    // Apply search filter
    if (search && search.trim() !== "") {
      const searchTerm = search.toLowerCase().trim();
      filteredTransporters = filteredTransporters.filter((transporter) =>
        transporter.companyName.toLowerCase().includes(searchTerm)
      );
    }

    // Apply period filter
    if (periodType === "30_DAYS") {
      // Simulate 30 days filter - reduce history count and adjust last resolved date
      filteredTransporters = filteredTransporters.map((transporter) => {
        const lastResolved = new Date(transporter.lastResolvedAt);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        if (lastResolved >= thirtyDaysAgo) {
          // Reduce history count for 30 days period
          const reducedCount = Math.max(
            1,
            Math.floor(transporter.historyCount * 0.4)
          );
          return {
            ...transporter,
            historyCount: reducedCount,
          };
        } else {
          // No history in last 30 days
          return {
            ...transporter,
            historyCount: 0,
          };
        }
      });

      // Filter out transporters with no history in 30 days
      filteredTransporters = filteredTransporters.filter(
        (transporter) => transporter.historyCount > 0
      );
    } else if (periodType === "90_DAYS") {
      // Simulate 90 days filter
      filteredTransporters = filteredTransporters.map((transporter) => {
        const lastResolved = new Date(transporter.lastResolvedAt);
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        if (lastResolved >= ninetyDaysAgo) {
          // Reduce history count for 90 days period
          const reducedCount = Math.max(
            1,
            Math.floor(transporter.historyCount * 0.7)
          );
          return {
            ...transporter,
            historyCount: reducedCount,
          };
        } else {
          // No history in last 90 days
          return {
            ...transporter,
            historyCount: 0,
          };
        }
      });

      // Filter out transporters with no history in 90 days
      filteredTransporters = filteredTransporters.filter(
        (transporter) => transporter.historyCount > 0
      );
    } else if (periodType === "1_WEEK") {
      // Simulate 1 week filter
      filteredTransporters = filteredTransporters.map((transporter) => {
        const lastResolved = new Date(transporter.lastResolvedAt);
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        if (lastResolved >= oneWeekAgo) {
          // Reduce history count for 1 week period
          const reducedCount = Math.max(
            1,
            Math.floor(transporter.historyCount * 0.2)
          );
          return {
            ...transporter,
            historyCount: reducedCount,
          };
        } else {
          // No history in last week
          return {
            ...transporter,
            historyCount: 0,
          };
        }
      });

      // Filter out transporters with no history in 1 week
      filteredTransporters = filteredTransporters.filter(
        (transporter) => transporter.historyCount > 0
      );
    }

    // Sort by history count (descending) for better presentation
    filteredTransporters.sort((a, b) => b.historyCount - a.historyCount);

    // Calculate total history count for period
    const totalHistory = filteredTransporters.reduce(
      (sum, transporter) => sum + transporter.historyCount,
      0
    );

    // Determine which mock data to use based on filters
    if (filteredTransporters.length === 0) {
      result = mockTransportersWithHistoryEmpty.data;
      result.data.Data.periodInfo.type = periodType;
    } else if (search && search.trim() !== "") {
      result = mockTransportersWithHistorySearch.data;
      result.data.Data.transporters = filteredTransporters;
      result.data.Data.total = filteredTransporters.length;
      result.data.Data.periodInfo.type = periodType;
      result.data.Data.periodInfo.totalHistory = totalHistory;
    } else if (periodType !== "all_time") {
      result = mockTransportersWithHistoryFiltered.data;
      result.data.Data.transporters = filteredTransporters;
      result.data.Data.total = filteredTransporters.length;
      result.data.Data.periodInfo.type = periodType;
      result.data.Data.periodInfo.totalHistory = totalHistory;
    } else {
      result = mockTransportersWithHistory.data;
      result.data.Data.transporters = filteredTransporters;
      result.data.Data.total = filteredTransporters.length;
      result.data.Data.periodInfo.totalHistory = totalHistory;
    }
  } else {
    try {
      result = await fetcherMuatrans.get(
        `/v1/cs/sos/transporters/with-history`,
        {
          params: {
            search,
            periodType,
          },
        }
      );
    } catch (error) {
      // Handle error response
      return {
        data: {
          Message: {
            Code: error.response?.status || 500,
            Text:
              error.response?.data?.Message?.Text ||
              "Failed to retrieve transporters with history",
          },
          Data: {
            transporters: [],
            total: 0,
            periodInfo: {
              type: periodType,
              totalHistory: 0,
            },
          },
          Type: "TRANSPORTERS_WITH_HISTORY_ERROR",
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

export const useGetHistoryTransporterFilter = (params = {}) => {
  const { search, periodType, ...otherParams } = params;

  const { data, error, isLoading, mutate } = useSWR(
    [`getHistoryTransporterFilter`, params],
    () => getHistoryTransporterFilter(params),
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
