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
      Text: "Daftar armada berhasil diambil",
    },
    Data: {
      fleets: [
        {
          id: "uuid-fleet-1",
          licensePlate: "L 8310 SH",
          driverName: "Rizky Pratama",
          truckImage: "/img/truck.png",
          truckType: "Ultra Long Wheelbase Heavy Duty 10x4 Axle Diesel Truck",
          truckCarrierType: "Multi Axle Expandable Flatbed",
          vehicleBrand: "Mitsubishi Fuso Heavy Duty",
          vehicleType: "Commercial Diesel Truck Canter 4 Wheels",
          stnkExpiryDate: "2028-08-20",
          status: "SCHEDULED",
        },
        {
          id: "uuid-fleet-2",
          licensePlate: "L 8311 SH",
          driverName: "Budi Setiawan",
          truckImage: "/img/truck.png",
          truckType: "Cont Diesel Double",
          truckCarrierType: "Bet Terbuka",
          vehicleBrand: "Mitsubishi Fuso",
          vehicleType: "Commercial Diesel Truck",
          stnkExpiryDate: "2028-08-20",
          status: "AVAILABLE",
        },
        {
          id: "uuid-fleet-3",
          licensePlate: "L 8312 SH",
          driverName: "Arief Rahman",
          truckImage: "/img/truck.png",
          truckType: "Medium Truck 6x2",
          truckCarrierType: "Tangki",
          vehicleBrand: "Mitsubishi Fuso",
          vehicleType: "Commercial Diesel Truck",
          stnkExpiryDate: "2028-08-20",
          status: "ON_DUTY",
        },
        {
          id: "uuid-fleet-4",
          licensePlate: "L 8313 SH",
          driverName: "Test",
          truckImage: "/img/truck.png",
          truckType: "Cont Diesel Double",
          truckCarrierType: "Dump",
          vehicleBrand: "Mitsubishi Fuso",
          vehicleType: "Commercial Diesel Truck",
          stnkExpiryDate: "2028-08-20",
          status: "UNASSIGNED",
        },
        {
          id: "uuid-fleet-5",
          licensePlate: "L 8314 SH",
          driverName: "Fajar Nugroho",
          truckImage: "/img/truck.png",
          truckType: "Cont Diesel Double",
          truckCarrierType: "Dump",
          vehicleBrand: "Mitsubishi Fuso",
          vehicleType: "Commercial Diesel Truck",
          stnkExpiryDate: "2028-08-29",
          status: "UNASSIGNED",
        },
        {
          id: "uuid-fleet-6",
          licensePlate: "L 8315 SH",
          driverName: "Hendro Wijaya",
          truckImage: "/img/truck.png",
          truckType: "Cont Diesel Double",
          truckCarrierType: "Dump",
          vehicleBrand: "Mitsubishi Fuso",
          vehicleType: "Commercial Diesel Truck",
          stnkExpiryDate: "2028-08-29",
          status: "SCHEDULED",
        },
        {
          id: "uuid-fleet-7",
          licensePlate: "L 8316 SH",
          driverName: "Agus Salim",
          truckImage: "/img/truck.png",
          truckType: "Cont Diesel Double",
          truckCarrierType: "Bet Terbuka",
          vehicleBrand: "Mitsubishi Fuso",
          vehicleType: "Commercial Diesel Truck",
          stnkExpiryDate: "2028-08-20",
          status: "AVAILABLE",
        },
        {
          id: "uuid-fleet-8",
          licensePlate: "L 8317 SH",
          driverName: "Yudi Hartono",
          truckImage: "/img/truck.png",
          truckType: "Medium Truck 6x2",
          truckCarrierType: "Tangki",
          vehicleBrand: "Mitsubishi Fuso",
          vehicleType: "Commercial Diesel Truck",
          stnkExpiryDate: "2028-08-20",
          status: "ON_DUTY",
        },
        {
          id: "uuid-fleet-9",
          licensePlate: "L 8318 SH",
          driverName: "Sandi Prabowo",
          truckImage: "/img/truck.png",
          truckType: "Cont Diesel Double",
          truckCarrierType: "Bet Terbuka",
          vehicleBrand: "Mitsubishi Fuso",
          vehicleType: "Commercial Diesel Truck",
          stnkExpiryDate: "2028-08-20",
          status: "ON_DUTY",
        },
        {
          id: "uuid-fleet-10",
          licensePlate: "L 8319 SH",
          driverName: "Afix",
          truckImage: "/img/truck.png",
          truckType: "Ultra Long Wheelbase Heavy Duty 10x4 Axle Diesel Truck",
          truckCarrierType: "Multi Axle Expandable Flatbed",
          vehicleBrand: "Mitsubishi Fuso Heavy Duty",
          vehicleType: "Commercial Diesel Truck Canter 4 Wheels",
          stnkExpiryDate: "2028-08-20",
          status: "UNASSIGNED",
        },
        {
          id: "uuid-fleet-11",
          licensePlate: "L 8317 SH",
          driverName: "Yudi Hartono",
          truckImage: "/img/truck.png",
          truckType: "Medium Truck 6x2",
          truckCarrierType: "Tangki",
          vehicleBrand: "Mitsubishi Fuso",
          vehicleType: "Commercial Diesel Truck",
          stnkExpiryDate: "2028-08-20",
          status: "ON_DUTY",
        },
        {
          id: "uuid-fleet-12",
          licensePlate: "L 8318 SH",
          driverName: "Sandi Prabowo",
          truckImage: "/img/truck.png",
          truckType: "Cont Diesel Double",
          truckCarrierType: "Bet Terbuka",
          vehicleBrand: "Mitsubishi Fuso",
          vehicleType: "Commercial Diesel Truck",
          stnkExpiryDate: "2028-08-20",
          status: "ON_DUTY",
        },
        {
          id: "uuid-fleet-13",
          licensePlate: "L 8319 SH",
          driverName: "Afix",
          truckImage: "/img/truck.png",
          truckType: "Ultra Long Wheelbase Heavy Duty 10x4 Axle Diesel Truck",
          truckCarrierType: "Multi Axle Expandable Flatbed",
          vehicleBrand: "Mitsubishi Fuso Heavy Duty",
          vehicleType: "Commercial Diesel Truck Canter 4 Wheels",
          stnkExpiryDate: "2028-08-20",
          status: "UNASSIGNED",
        },
      ],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 10,
        itemsPerPage: 10,
      },
    },
    Type: "GET_TRANSPORTER_FLEET",
  },
};

/**
 * Fetches transporter fleet data
 * @param {string} transporterId - The transporter ID
 * @param {object} params - Query parameters
 * @param {number} params.page - Page number for pagination
 * @param {number} params.limit - Items per page
 * @param {string} params.search - Search keyword
 * @param {string} params.status - Filter by status
 * @param {string} params.sort - Sort field
 * @param {string} params.order - Sort order (asc/desc)
 * @returns {Promise} API response with fleet data
 */
export const getTransporterFleets = async (transporterId, params = {}) => {
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

    const url = `/v1/cs/transporters/${transporterId}/fleets${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
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
 * SWR hook for fetching transporter fleet data
 * @param {string} transporterId - The transporter ID
 * @param {object} params - Query parameters
 * @returns {object} SWR response with data, error, and loading states
 */
export const useGetTransporterFleets = (transporterId, params = {}) => {
  const cacheKey = `transporter-fleets-${transporterId}-${JSON.stringify(params)}`;
  return useSWR(
    transporterId ? cacheKey : null,
    () => getTransporterFleets(transporterId, params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );
};

/**
 * SWR mutate function for revalidating transporter fleet data
 * @param {string} transporterId - The transporter ID
 * @param {object} params - Query parameters
 * @returns {function} Mutate function
 */
export const useMutateTransporterFleets = (transporterId, params = {}) => {
  const cacheKey = `transporter-fleets-${transporterId}-${JSON.stringify(params)}`;
  return useSWR(cacheKey, null).mutate;
};
