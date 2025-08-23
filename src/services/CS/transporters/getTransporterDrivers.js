import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";
import { fetcherMuatransCS } from "@/lib/fetcherBasicAuth";

const useMockData = false;
const useMuatransFetcher = true; // true: use fetcherMuatrans, false: use fetcherMuatransCS (basic auth)

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Daftar driver berhasil diambil",
    },
    Data: {
      drivers: [
        {
          id: "uuid-driver-1",
          photo: "https://storage.url/driver.jpg",
          name: "Ahmad Driver",
          phoneNumber: "+628123456789",
          truckLicensePlate: "B 1234 ABC",
          truckType: "Colt Diesel Double",
          truckCarrierType: "Bak Terbuka",
          status: "ON_DUTY",
        },
        {
          id: "uuid-driver-2",
          photo: "https://storage.url/driver2.jpg",
          name: "Budi Setiawan",
          phoneNumber: "+628123456790",
          truckLicensePlate: "B 5678 DEF",
          truckType: "Colt Diesel Double",
          truckCarrierType: "Dump",
          status: "READY_FOR_ORDER",
        },
        {
          id: "uuid-driver-3",
          photo: "https://storage.url/driver3.jpg",
          name: "Sari Indah",
          phoneNumber: "+628123456791",
          truckLicensePlate: "B 9012 GHI",
          truckType: "Medium Truck 6x2",
          truckCarrierType: "Tangki",
          status: "SCHEDULED",
        },
        {
          id: "uuid-driver-4",
          photo: null,
          name: "Rizky Pratama",
          phoneNumber: "+628123456792",
          truckLicensePlate: "B 3456 JKL",
          truckType: "Ultra Long Wheelbase Heavy Duty 10x4 Axle Diesel Truck",
          truckCarrierType: "Multi Axle Expandable Flatbed",
          status: "NOT_PAIRED",
        },
        {
          id: "uuid-driver-5",
          photo: "https://storage.url/driver5.jpg",
          name: "Fajar Nugroho",
          phoneNumber: "+628123456793",
          truckLicensePlate: null,
          truckType: null,
          truckCarrierType: null,
          status: "INACTIVE",
        },
      ],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 5,
        itemsPerPage: 10,
      },
    },
    Type: "GET_TRANSPORTER_DRIVERS",
  },
};

/**
 * Fetches transporter drivers data
 * @param {string} transporterId - The transporter ID
 * @param {object} params - Query parameters
 * @param {number} params.page - Page number for pagination
 * @param {number} params.limit - Items per page
 * @param {string} params.search - Search keyword
 * @param {string} params.status - Filter by status
 * @param {string} params.sort - Sort field
 * @param {string} params.order - Sort order (asc/desc)
 * @returns {Promise} API response with drivers data
 */
export const getTransporterDrivers = async (transporterId, params = {}) => {
  let result;
  if (useMockData) {
    result = mockAPIResult;
  } else {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.search) queryParams.append("search", params.search);
    if (params.status) queryParams.append("status", params.status);
    if (params.sort) queryParams.append("sort", params.sort);
    if (params.order) queryParams.append("order", params.order);

    const url = `/v1/cs/transporters/${transporterId}/drivers${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    if (useMuatransFetcher) {
      result = await fetcherMuatrans.get(url);
    } else {
      result = await fetcherMuatransCS.get(url);
    }
  }
  const data = result.data.Data;
  return data;
};

/**
 * SWR hook for fetching transporter drivers data
 * @param {string} transporterId - The transporter ID
 * @param {object} params - Query parameters
 * @returns {object} SWR response with data, error, and loading states
 */
export const useGetTransporterDrivers = (transporterId, params = {}) => {
  const cacheKey = `transporter-drivers-${transporterId}-${JSON.stringify(params)}`;
  return useSWR(
    transporterId ? cacheKey : null,
    () => getTransporterDrivers(transporterId, params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );
};

/**
 * SWR mutate function for revalidating transporter drivers data
 * @param {string} transporterId - The transporter ID
 * @param {object} params - Query parameters
 * @returns {function} Mutate function
 */
export const useMutateTransporterDrivers = (transporterId, params = {}) => {
  const cacheKey = `transporter-drivers-${transporterId}-${JSON.stringify(params)}`;
  return useSWR(cacheKey, null).mutate;
};
