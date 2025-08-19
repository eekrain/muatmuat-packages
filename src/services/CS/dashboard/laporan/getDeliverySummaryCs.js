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
      Text: "CS Delivery summary retrieved successfully",
    },
    Data: {
      hasData: true,
      totalItems: 4,
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
          completedDate: "2025-04-13T15:23:00Z",
          transporterName: "Agam Tunggal Jaya",
          transporterLogo: "https://picsum.photos/200/300", // Placeholder path
          routes: {
            loading: [
              {
                address: "Jalan Dinoyo No. 111, Kec. Tegalsari, Kota Surabaya",
              },
              { address: "Jl. Wonorejo II/88, Kec. Wonorejo, Kota Surabaya" },
            ],
            unloading: [
              {
                address:
                  "Jl. Terusan Kawi No.16 Bareng, Kec. Klojen, Kab. Pasuruan",
              },
              { address: "Jalan Raden Intan Kav. 14, Kec. Blimbing, Malang" },
            ],
            hasMoreLocations: true,
          },
          fleet: {
            licensePlate: "L 1234 FF",
            truckTypeName: "Colt Diesel Engkel",
            carrierTypeName: "Box",
          },
          totalDistance: 93.5,
          totalTonnage: 180,
        },
        {
          orderID: "uuid-order-2",
          completedDate: "2025-04-13T15:23:00Z",
          transporterName: "PT Kalimantan Timur Jaya Sentosa",
          transporterLogo: "https://picsum.photos/200/300", // Placeholder path
          routes: {
            loading: [{ address: "Kota Tangerang Selatan Selatan" }],
            unloading: [{ address: "Kab. Malang, Kec. Singosari" }],
            hasMoreLocations: false,
          },
          fleet: {
            licensePlate: "L 1234 FF",
            truckTypeName: "Tractor head 6 x 4 dan Semi Jumbo",
            carrierTypeName: "Flatbed Container Jumbo",
          },
          totalDistance: 77,
          totalTonnage: 180,
        },
        {
          orderID: "uuid-order-3",
          completedDate: "2025-04-12T15:23:00Z",
          transporterName: "PT Siba Surya",
          transporterLogo: "https://picsum.photos/200/300", // Placeholder path
          routes: {
            loading: [{ address: "Kota Surabaya, Kec. Tegalsari" }],
            unloading: [{ address: "Kab. Malang, Kec. Singosari" }],
            hasMoreLocations: false,
          },
          fleet: {
            licensePlate: "L 1234 FF",
            truckTypeName: "Colt Diesel Double",
            carrierTypeName: "Bak Terbuka",
          },
          totalDistance: 55,
          totalTonnage: 180,
        },
        {
          orderID: "uuid-order-4",
          completedDate: "2025-04-12T16:45:00Z",
          transporterName: "Gemilang Mandiri",
          transporterLogo: "https://picsum.photos/200/300", // Placeholder path
          routes: {
            loading: [{ address: "Kota Bandung, Kec. Batununggal" }],
            unloading: [{ address: "Kab. Bandung Barat, Kec. Padalarang" }],
            hasMoreLocations: false,
          },
          fleet: {
            licensePlate: "B 4567 GG",
            truckTypeName: "Truk Fuso",
            carrierTypeName: "Bak Tertutup",
          },
          totalDistance: 75,
          totalTonnage: 250,
        },
      ],
      dataFilter: {
        truckTypes: [
          { id: "cde", value: "Colt Diesel Engkel" },
          { id: "cdd", value: "Colt Diesel Double" },
          { id: "fuso", value: "Truk Fuso" },
          { id: "th6x4", value: "Tractor Head 6x4" },
        ],
        carrierTypes: [
          { id: "box", value: "Box" },
          { id: "flatbed", value: "Flatbed Container" },
          { id: "bak_terbuka", value: "Bak Terbuka" },
          { id: "bak_tertutup", value: "Bak Tertutup" },
        ],
      },
    },
    Type: "CS_DELIVERY_SUMMARY",
  },
};

/**
 * Fetcher function for the CS delivery summary report.
 * @param {Array} args - SWR key arguments.
 * @param {string} args[0] - The API endpoint URL.
 * @param {Object} args[1] - The query parameters.
 * @returns {Promise<Object>} The data portion of the API response.
 */
export const fetcherCsDeliverySummary = async ([url, params]) => {
  if (useMockData) {
    return mockAPIResult.data.Data;
  }
  const result = await fetcherMuatrans.get(url, { params });
  return result?.data?.Data || {};
};

/**
 * SWR hook to fetch the CS delivery summary report.
 * @param {Object} params - Query parameters for the API call.
 * @returns {Object} An object containing the fetched data, loading state, and error state.
 */
export const useGetCsDeliverySummary = (params = {}) => {
  const cleanedParams = {};
  for (const key in params) {
    if (params[key] !== null && params[key] !== "") {
      cleanedParams[key] = params[key];
    }
  }

  const { data, error, isLoading, mutate } = useSWR(
    ["/v1/cs/reports/delivery-summary", cleanedParams],
    fetcherCsDeliverySummary,
    { revalidateOnFocus: false }
  );

  return {
    data,
    isLoading,
    isError: error,
    mutate,
  };
};
