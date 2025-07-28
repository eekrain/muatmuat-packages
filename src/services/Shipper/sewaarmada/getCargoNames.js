import useSWR from "swr";

import fetcherMuatrans from "@/lib/axios";

const useMockData = true; // toggle mock data

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      code: 200,
      text: "Success",
    },
    Data: {
      cargoNames: [
        {
          cargoNameId: "550e8400-e29b-41d4-a716-446655440030",
          name: "Beras",
          cargoTypeId: "550e8400-e29b-41d4-a716-446655440031",
          cargoCategoryId: "550e8400-e29b-41d4-a716-446655440032",
        },
        {
          cargoNameId: "550e8400-e29b-41d4-a716-446655440033",
          name: "Gula",
          cargoTypeId: "550e8400-e29b-41d4-a716-446655440031",
          cargoCategoryId: "550e8400-e29b-41d4-a716-446655440032",
          usageCount: 85,
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        totalItems: 2,
        totalPages: 1,
      },
    },
    Type: "CARGO_NAMES",
  },
};

export const getCargoNames = async (cacheKey) => {
  const params = cacheKey?.split("/")?.[1];

  let result;
  if (useMockData) {
    result = mockAPIResult;
  } else {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    result = await fetcherMuatrans.get(`/v1/orders/cargos/names?${query}`);
  }

  const data = result.data?.Data?.cargoNames;
  if (!data) return [];
  return data.map((item) => ({
    value: item.cargoNameId,
    label: item.name,
    // Jika ingin menambah properti lain dari API, bisa ditambahkan di sini
  }));
};

export const useGetCargoNames = ({ cargoTypeId, cargoCategoryId }) => {
  return useSWR(
    `getCargoNames/${new URLSearchParams({ cargoTypeId, cargoCategoryId }).toString()}`,
    getCargoNames
  );
};
