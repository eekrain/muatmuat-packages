import useSWR from "swr";

const apiResultExpiredVehicles = {
  data: {
    Message: {
      Code: 200,
      Text: "Success",
    },
    Data: {
      items: [
        {
          id: "uuid-fleet-1",
          licensePlate: "L 1234 TY",
          photoUrl: "/img/mock-armada/one.png",
          truckType: {
            id: "uuid-truck-type-1",
            name: "Truk Fuso",
          },
          carrierType: {
            id: "uuid-carrier-type-1",
            name: "Box",
          },
          stnkExpiryDate: "2025-12-31",
          kirExpiryDate: "2025-11-15",
          status: "NOT_PAIRED",
        },
        {
          id: "uuid-fleet-2",
          licensePlate: "B 5678 XY",
          photoUrl: "/img/mock-armada/two.png",
          truckType: {
            id: "uuid-truck-type-2",
            name: "Truk Hino",
          },
          carrierType: {
            id: "uuid-carrier-type-2",
            name: "Flatbed",
          },
          stnkExpiryDate: "2025-02-15",
          kirExpiryDate: "2025-03-20",
          status: "INACTIVE",
        },
        {
          id: "uuid-fleet-3",
          licensePlate: "D 9012 AB",
          photoUrl: "/img/mock-armada/three.png",
          truckType: {
            id: "uuid-truck-type-3",
            name: "Truk Mitsubishi",
          },
          carrierType: {
            id: "uuid-carrier-type-3",
            name: "Container",
          },
          stnkExpiryDate: "2025-01-10",
          kirExpiryDate: "2025-01-05",
          status: "NOT_PAIRED",
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        totalItems: 25,
        totalPages: 3,
      },
    },
    Type: "EXPIRING_DOCUMENTS_LIST",
  },
};

export const fetcherExpiredVehicles = async (cacheKey) => {
  // Extract query string from cache key
  // const queryString = cacheKey.includes('?') ? cacheKey.split('?')[1] : '';
  // const url = queryString ? `v1/fleets/expiring-documents?${queryString}` : 'v1/vehicles/expired';

  // const result = await fetcherMuatrans.get(url);
  // return result?.data?.Data || {};

  const result = apiResultExpiredVehicles;
  return result.data.Data;
};

export const useGetExpiredVehicles = (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const cacheKey = `expired-vehicles${queryParams ? `?${queryParams}` : ""}`;

  return useSWR(cacheKey, fetcherExpiredVehicles);
};
