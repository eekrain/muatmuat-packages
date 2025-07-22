import useSWR from "swr";

import fetcherMuatrans from "@/lib/axios";

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

export const getCargoNames = (params) => {
  // params: { page, limit, ... } (optional)
  const query = params ? `?${new URLSearchParams(params).toString()}` : "";
  return fetcherMuatrans.get(`/v1/orders/cargos/names${query}`);
};

export const useGetCargoNames = (params) => {
  // params: { page, limit, ... } (optional)
  const key = params
    ? ["v1/orders/cargos/names", params]
    : "v1/orders/cargos/names";
  return useSWR(key, () => getCargoNames(params));
};
