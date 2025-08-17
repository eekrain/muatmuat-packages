import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const isMockFleetsList = false;

const apiResultFleetsList = {
  data: {
    Message: {
      Code: 200,
      Text: "Success",
    },
    Data: {
      fleets: [
        {
          id: "660e8400-e29b-41d4-a716-446655440001",
          idx: 1,
          licensePlate: "L 9812 AX",
          photoUrl: "/img/mock-armada/one.png",
          truckType: {
            id: "770e8400-e29b-41d4-a716-446655440001",
            name: "Semi Trailer 45 ft - Skeletal",
          },
          carrierTruck: {
            id: "990e8400-e29b-41d4-a716-446655440001",
            name: "Tractor Head 6 x 4",
          },
          assignDriver: null,
          warningDocumentExpired: false,
        },
        {
          id: "660e8400-e29b-41d4-a716-446655440002",
          idx: 2,
          licensePlate: "L 2312 AL",
          photoUrl: "/img/mock-armada/two.png",
          truckType: {
            id: "770e8400-e29b-41d4-a716-446655440002",
            name: "Box",
          },
          carrierTruck: {
            id: "990e8400-e29b-41d4-a716-446655440002",
            name: "Engkel",
          },
          assignDriver: "Dony Pamungkas",
          warningDocumentExpired: false,
        },
        {
          id: "660e8400-e29b-41d4-a716-446655440003",
          idx: 3,
          licensePlate: "AB 1234 ABD",
          photoUrl: "/img/mock-armada/three.png",
          truckType: {
            id: "770e8400-e29b-41d4-a716-446655440003",
            name: "20 ft",
          },
          carrierTruck: {
            id: "990e8400-e29b-41d4-a716-446655440003",
            name: "Wing Box",
          },
          assignDriver: null,
          warningDocumentExpired: true,
        },
        {
          id: "660e8400-e29b-41d4-a716-446655440004",
          idx: 4,
          licensePlate: "D 5678 EF",
          photoUrl: "/img/mock-armada/one.png",
          truckType: {
            id: "770e8400-e29b-41d4-a716-446655440004",
            name: "Semi Trailer 40 ft - Flat Bed",
          },
          carrierTruck: {
            id: "990e8400-e29b-41d4-a716-446655440004",
            name: "Tractor Head 6 x 4",
          },
          assignDriver: null,
          warningDocumentExpired: false,
        },
        {
          id: "660e8400-e29b-41d4-a716-446655440005",
          idx: 5,
          licensePlate: "L 9101 GH",
          photoUrl: "/img/mock-armada/two.png",
          truckType: {
            id: "770e8400-e29b-41d4-a716-446655440005",
            name: "Bak",
          },
          carrierTruck: {
            id: "990e8400-e29b-41d4-a716-446655440005",
            name: "Double Engkel",
          },
          assignDriver: null,
          warningDocumentExpired: false,
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        totalItems: 5,
        totalPages: 1,
      },
    },
    Type: "GET_AVAILABLE_FLEETS",
  },
};

export const fetcherFleetsList = async (_, params = {}) => {
  const { page = 1, limit = 10, search = "" } = params;

  if (isMockFleetsList) {
    const result = apiResultFleetsList;

    // Simulate search filtering
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      const filteredFleets = result.data.Data.fleets.filter(
        (fleet) =>
          fleet.licensePlate.toLowerCase().includes(searchLower) ||
          fleet.carrierTruck.name.toLowerCase().includes(searchLower) ||
          fleet.truckType.name.toLowerCase().includes(searchLower)
      );

      return {
        fleets: filteredFleets,
        pagination: {
          ...result.data.Data.pagination,
          totalItems: filteredFleets.length,
          totalPages: Math.ceil(filteredFleets.length / params.limit || 10),
        },
      };
    }

    return result.data.Data;
  }

  const result = await fetcherMuatrans.get("v1/fleets/available", {
    params: {
      page,
      limit,
      search,
    },
  });
  return result?.data?.Data || {};
};

export const useGetFleetsList = (params = {}) => {
  const { page = 1, limit = 10, search = "" } = params;
  const cacheKey = ["fleets-list", page, limit, search];

  return useSWR(cacheKey, () => fetcherFleetsList(cacheKey, params));
};
