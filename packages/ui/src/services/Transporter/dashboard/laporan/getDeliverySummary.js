import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// --- Configuration ---
// Set to false to use actual API calls.
const useMockData = false;

// --- Mock Data (Unchanged) ---
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "OK",
    },
    Data: {
      reports: [
        {
          licensePlate: "B 1111 FMI",
          fleet: {
            truckTypeId: "26ff8b9e-b8cc-40a9-9b9e-a3404752c5fd",
            truckTypeName: "Colt Diesel Double",
            carrierTypeId: "550e8400-e29b-41d4-a716-446655440001",
            carrierTypeName: "Bak Terbuka",
          },
          totalDistance: 21.22,
          totalTonnage: 100,
        },
        {
          licensePlate: "B 1234 ABC",
          fleet: {
            truckTypeId: "26ff8b9e-b8cc-40a9-9b9e-a3404752c5fd",
            truckTypeName: "Colt Diesel Double",
            carrierTypeId: "550e8400-e29b-41d4-a716-446655440001",
            carrierTypeName: "Bak Terbuka",
          },
          totalDistance: 48.9,
          totalTonnage: 50102,
        },
        {
          licensePlate: "L 9191 PRS",
          fleet: {
            truckTypeId: "8e545657-fff1-4b99-94d4-f52c53f5cc52",
            truckTypeName: "Medium Truck 4 x 2 + Gandengan",
            carrierTypeId: "550e8400-e29b-41d4-a716-446655440001",
            carrierTypeName: "Bak Terbuka",
          },
          totalDistance: 20.85,
          totalTonnage: 6000,
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        totalItems: 3,
        totalPages: 1,
      },
    },
    Type: "DASHBOARD_TRANSPORTER_DELIVERY_SUMMARY_REPORT",
  },
};

/**
 * Transforms the raw API data into the structure expected by the UI components.
 */
const transformAPIData = (apiData) => {
  if (!apiData || !apiData.reports) {
    return {
      deliveries: [],
      totalItems: 0,
      totalPages: 1,
      currentPage: 1,
      itemsPerPage: 10,
      hasData: false,
    };
  }

  return {
    deliveries: apiData.reports,
    totalItems: apiData.pagination.totalItems,
    totalPages: apiData.pagination.totalPages,
    currentPage: apiData.pagination.page,
    itemsPerPage: apiData.pagination.limit,
    hasData: (apiData.reports || []).length > 0,
  };
};

/**
 * Fetcher function for the delivery summary report.
 */
export const fetcherDeliverySummary = async ([url, params]) => {
  if (useMockData) {
    return transformAPIData(mockAPIResult.data.Data);
  }

  try {
    // Assuming `fetcherMuatrans.get` returns the full Axios response object.
    const response = await fetcherMuatrans.get(url, { params });
    // ✨ FIX: Access the payload correctly via `response.data.Data`.
    // `response.data` is the API response body.
    // `response.data.Data` is the specific data object we need to transform.
    return transformAPIData(response?.data?.Data);
  } catch (error) {
    console.error("Failed to fetch delivery summary:", error);
    // Re-throw the error so SWR can correctly manage the error state.
    throw error;
  }
};

/**
 * SWR hook to fetch the delivery summary report.
 */
export const useGetDeliverySummary = (params = {}) => {
  const cleanedParams = Object.entries(params).reduce((acc, [key, value]) => {
    if (value !== null && value !== "") {
      acc[key] = value;
    }
    return acc;
  }, {});

  const { data, error, isLoading, mutate } = useSWR(
    [
      "/v1/transporter/dashboard/analytics/delivery-summary/report",
      cleanedParams,
    ],
    fetcherDeliverySummary,
    { revalidateOnFocus: false }
  );

  return {
    data,
    isLoading,
    isError: error,
    mutate,
  };
};
