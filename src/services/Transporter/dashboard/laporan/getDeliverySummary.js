import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// --- Configuration ---
// Set to true to use mock data, false for actual API calls.
const useMockData = true;

// --- Mock Data ---
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Delivery summary retrieved successfully",
    },
    Data: {
      hasData: true,
      totalItems: 3,
      totalPages: 1,
      currentPage: 1,
      itemsPerPage: 10,
      appliedFilters: {
        period: "all",
        search: "",
        truckTypes: [],
        carrierTypes: [],
      },
      deliveries: [
        {
          orderID: "uuid-order-1",
          orderCode: "MT2025080001",
          completedDate: "2025-08-15T15:23:00Z",
          routes: {
            loading: [{ city: "Jakarta Utara", province: "DKI Jakarta" }],
            unloading: [{ city: "Surabaya", province: "Jawa Timur" }],
            hasMoreLocations: false,
          },
          fleet: {
            licensePlate: "B 1234 CD",
            truckTypeName: "Colt Diesel Engkel",
            carrierTypeName: "Box",
          },
          totalDistance: 93.5,
          totalTonnage: 180,
          utilizedFleets: 1,
        },
        {
          orderID: "uuid-order-2",
          orderCode: "MT2025080002",
          completedDate: "2025-08-16T11:05:00Z",
          routes: {
            loading: [{ city: "Bekasi", province: "Jawa Barat" }],
            unloading: [{ city: "Semarang", province: "Jawa Tengah" }],
            hasMoreLocations: true,
          },
          fleet: {
            licensePlate: "L 0291 AA",
            truckTypeName: "Tractor Head 6x4",
            carrierTypeName: "Flatbed Container",
          },
          totalDistance: 77,
          totalTonnage: 180,
          utilizedFleets: 1,
        },
        {
          orderID: "uuid-order-3",
          orderCode: "MT2025080003",
          completedDate: "2025-08-17T09:45:00Z",
          routes: {
            loading: [{ city: "Bandung", province: "Jawa Barat" }],
            unloading: [{ city: "Yogyakarta", province: "DIY" }],
            hasMoreLocations: false,
          },
          fleet: {
            licensePlate: "L 2412 AA",
            truckTypeName: "Colt Diesel Engkel",
            carrierTypeName: "Box",
          },
          totalDistance: 55,
          totalTonnage: 180,
          utilizedFleets: 1,
        },
      ],
      dataFilter: {
        truckTypes: [
          { id: "cde", value: "Colt Diesel Engkel" },
          { id: "th6x4", value: "Tractor Head 6x4" },
        ],
        carrierTypes: [
          { id: "box", value: "Box" },
          { id: "flatbed", value: "Flatbed Container" },
        ],
      },
    },
    Type: "DELIVERY_SUMMARY",
  },
};

/**
 * Fetcher function for the delivery summary report.
 * @param {Array} args - SWR key arguments.
 * @param {string} args[0] - The API endpoint URL.
 * @param {Object} args[1] - The query parameters.
 * @returns {Promise<Object>} The data portion of the API response.
 */
export const fetcherDeliverySummary = async ([url, params]) => {
  if (useMockData) {
    // Returns the entire `Data` object, including `deliveries` and `dataFilter`.
    return mockAPIResult.data.Data;
  }
  const result = await fetcherMuatrans.get(url, { params });
  return result?.data?.Data || {};
};

/**
 * SWR hook to fetch the delivery summary report.
 * @param {Object} params - Query parameters for the API call.
 * @returns {Object} An object containing the fetched data, loading state, and error state.
 */
export const useGetDeliverySummary = (params = {}) => {
  const cleanedParams = {};
  for (const key in params) {
    if (params[key] !== null && params[key] !== "") {
      cleanedParams[key] = params[key];
    }
  }

  const { data, error, isLoading, mutate } = useSWR(
    ["/v1/transporter/reports/delivery-summary", cleanedParams],
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
