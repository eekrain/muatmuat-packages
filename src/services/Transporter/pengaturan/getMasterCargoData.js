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
          totalCargoInType: 5,
          categories: [
            {
              cargoCategoryId: "550e8400-e29b-41d4-a716-446655440020",
              cargoCategoryName: "Padat",
              cargoCategoryDescription: "Muatan berbentuk padat",
              totalCargoInCategory: 3,
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
              totalCargoInCategory: 2,
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
        {
          cargoTypeId: "550e8400-e29b-41d4-a716-446655440050",
          cargoTypeName: "Barang Jadi",
          cargoTypeDescription: "Produk siap untuk didistribusikan",
          totalCargoInType: 4,
          categories: [
            {
              cargoCategoryId: "550e8400-e29b-41d4-a716-446655440060",
              cargoCategoryName: "Elektronik",
              cargoCategoryDescription: "Barang-barang elektronik",
              totalCargoInCategory: 2,
              cargoNames: [
                {
                  cargoNameId: "550e8400-e29b-41d4-a716-446655440070",
                  name: "Televisi",
                  usageCount: 180,
                  isActive: true,
                },
                {
                  cargoNameId: "550e8400-e29b-41d4-a716-446655440071",
                  name: "Kulkas",
                  usageCount: 130,
                  isActive: true,
                },
              ],
            },
            {
              cargoCategoryId: "550e8400-e29b-41d4-a716-446655440061",
              cargoCategoryName: "Furnitur",
              cargoCategoryDescription: "Perabotan rumah tangga",
              totalCargoInCategory: 2,
              cargoNames: [
                {
                  cargoNameId: "550e8400-e29b-41d4-a716-446655440080",
                  name: "Meja",
                  usageCount: 220,
                  isActive: true,
                },
                {
                  cargoNameId: "550e8400-e29b-41d4-a716-446655440081",
                  name: "Kursi",
                  usageCount: 300,
                  isActive: true,
                },
              ],
            },
          ],
        },
      ],
      totalTypes: 2,
      totalCategories: 4,
      totalCargoNames: 9,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 9,
        hasNextPage: false,
      },
    },
    Type: "MASTER_CARGO_DATA",
  },
};

export const fetcherMasterCargo = async (cacheKey) => {
  // Extract query parameters from cacheKey
  const urlParts = cacheKey.split("?");
  const baseUrl = "/v1/transporter/settings/master-cargo-data";
  const queryParams = urlParts.length > 1 ? urlParts[1] : "";
  const url = queryParams ? `${baseUrl}?${queryParams}` : baseUrl;

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
