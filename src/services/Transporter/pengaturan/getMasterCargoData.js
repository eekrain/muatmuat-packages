import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

const apiResultMasterCargo = {
  data: {
    Message: {
      Code: 200,
      Text: "Master cargo data retrieved successfully",
    },
    Data: {
      cargoHierarchy: [
        {
          cargoTypeId: "550e8400-e29b-41d4-a716-446655440010",
          cargoTypeName: "Bahan Mentah",
          cargoTypeDescription: "Bahan baku untuk produksi",
          totalCargoInType: 25,
          categories: [
            {
              cargoCategoryId: "550e8400-e29b-41d4-a716-446655440020",
              cargoCategoryName: "Padat",
              cargoCategoryDescription: "Muatan berbentuk padat",
              totalCargoInCategory: 15,
              cargoNames: [
                {
                  cargoNameId: "550e8400-e29b-41d4-a716-446655440030",
                  name: "Pasir",
                  usageCount: 150,
                  isActive: true,
                },
                {
                  cargoNameId: "550e8400-e29b-41d4-a716-446655440031",
                  name: "Batu Bara",
                  usageCount: 120,
                  isActive: true,
                },
                {
                  cargoNameId: "550e8400-e29b-41d4-a716-446655440032",
                  name: "Biji Besi",
                  usageCount: 95,
                  isActive: true,
                },
              ],
            },
            {
              cargoCategoryId: "550e8400-e29b-41d4-a716-446655440021",
              cargoCategoryName: "Cair",
              cargoCategoryDescription: "Muatan berbentuk cair",
              totalCargoInCategory: 10,
              cargoNames: [
                {
                  cargoNameId: "550e8400-e29b-41d4-a716-446655440040",
                  name: "Minyak Mentah",
                  usageCount: 200,
                  isActive: true,
                },
                {
                  cargoNameId: "550e8400-e29b-41d4-a716-446655440041",
                  name: "Bahan Kimia",
                  usageCount: 80,
                  isActive: true,
                },
              ],
            },
          ],
        },
      ],
      totalTypes: 1,
      totalCategories: 2,
      totalCargoNames: 5,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 5,
        hasNextPage: false,
      },
    },
    Type: "MASTER_CARGO_DATA",
  },
};

export const fetcherMasterCargo = async (cacheKey) => {
  const url = "/api/v1/cargos/master";

  if (useMockData) {
    const result = apiResultMasterCargo;
    return result.data.Data;
  }

  const result = await fetcherMuatrans.get(url);
  return result?.data?.Data || {};
};

export const useGetMasterCargo = (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const cacheKey = `master-cargo${queryParams ? `?${queryParams}` : ""}`;

  return useSWR(cacheKey, fetcherMasterCargo);
};
