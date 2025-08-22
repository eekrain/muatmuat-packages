import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

import { URL_AREA_BONGKAR } from "./getDataAreaBongkar";

const useMockData = false; // toggle mock data

// Mock API results for search area bongkar
export const mockSearchAreaBongkarSuccess = {
  Message: {
    Code: 200,
    Text: "Hasil pencarian area bongkar ditemukan",
  },
  Data: {
    keyword: "jakarta",
    found: true,
    unloadingAreas: [
      {
        provinceId: "550e8400-e29b-41d4-a716-446655440001",
        provinceName: "DKI Jakarta",
        areaName: "Area Jakarta Raya",
        cityCount: 5,
        isAllCitiesSelected: false,
        displayText: "DKI Jakarta - 5 Kota/Kab",
        highlightedName: "DKI <mark>Jakarta</mark>",
      },
      {
        provinceId: "550e8400-e29b-41d4-a716-446655440002",
        provinceName: "Jawa Barat",
        areaName: "Area Jawa Barat",
        cityCount: 8,
        isAllCitiesSelected: true,
        displayText: "Jawa Barat - 8 Kota/Kab",
        highlightedName: "Jawa Barat",
      },
      {
        provinceId: "550e8400-e29b-41d4-a716-446655440003",
        provinceName: "Jawa Tengah",
        areaName: "Area Jawa Tengah",
        cityCount: 6,
        isAllCitiesSelected: false,
        displayText: "Jawa Tengah - 3 Kota/Kab",
        highlightedName: "Jawa Tengah",
      },
      {
        provinceId: "550e8400-e29b-41d4-a716-446655440004",
        provinceName: "Jawa Timur",
        areaName: "Area Jawa Timur",
        cityCount: 7,
        isAllCitiesSelected: false,
        displayText: "Jawa Timur - 4 Kota/Kab",
        highlightedName: "Jawa Timur",
      },
      {
        provinceId: "550e8400-e29b-41d4-a716-446655440005",
        provinceName: "Bali",
        areaName: "Area Bali",
        cityCount: 9,
        isAllCitiesSelected: true,
        displayText: "Bali - 9 Kota/Kab",
        highlightedName: "Bali",
      },
      {
        provinceId: "550e8400-e29b-41d4-a716-446655440006",
        provinceName: "Sumatera Utara",
        areaName: "Area Sumatera Utara",
        cityCount: 12,
        isAllCitiesSelected: false,
        displayText: "Sumatera Utara - 7 Kota/Kab",
        highlightedName: "Sumatera Utara",
      },
      {
        provinceId: "550e8400-e29b-41d4-a716-446655440007",
        provinceName: "Kalimantan Timur",
        areaName: "Area Kalimantan Timur",
        cityCount: 10,
        isAllCitiesSelected: false,
        displayText: "Kalimantan Timur - 5 Kota/Kab",
        highlightedName: "Kalimantan Timur",
      },
    ],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 7,
      itemsPerPage: 10,
    },
  },
  Type: "SEARCH_AREA_BONGKAR",
};

export const mockSearchAreaBongkarNoData = {
  Message: {
    Code: 404,
    Text: "Keyword Tidak Ditemukan",
  },
  Data: {
    keyword: "xyz",
    found: false,
    unloadingAreas: [],
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      itemsPerPage: 10,
    },
  },
  Type: "SEARCH_AREA_BONGKAR_ERROR",
};

export const mockSearchAreaBongkarError = {
  Message: {
    Code: 400,
    Text: "Parameter q wajib diisi",
  },
  Data: {
    errors: [
      {
        field: "q",
        message: "Parameter q tidak boleh kosong",
        code: "Q_REQUIRED",
      },
    ],
  },
  Type: "SEARCH_AREA_BONGKAR_ERROR",
};

// All available provinces for mock search
const mockAllProvinces = [
  {
    provinceId: "550e8400-e29b-41d4-a716-446655440001",
    provinceName: "DKI Jakarta",
    areaName: "Area Jakarta Raya",
    cityCount: 5,
    isAllCitiesSelected: false,
    displayText: "DKI Jakarta - 5 Kota/Kab",
  },
  {
    provinceId: "550e8400-e29b-41d4-a716-446655440002",
    provinceName: "Jawa Barat",
    areaName: "Area Jawa Barat",
    cityCount: 8,
    isAllCitiesSelected: true,
    displayText: "Jawa Barat - 8 Kota/Kab",
  },
  {
    provinceId: "550e8400-e29b-41d4-a716-446655440003",
    provinceName: "Jawa Tengah",
    areaName: "Area Jawa Tengah",
    cityCount: 6,
    isAllCitiesSelected: false,
    displayText: "Jawa Tengah - 3 Kota/Kab",
  },
  {
    provinceId: "550e8400-e29b-41d4-a716-446655440004",
    provinceName: "Jawa Timur",
    areaName: "Area Jawa Timur",
    cityCount: 7,
    isAllCitiesSelected: false,
    displayText: "Jawa Timur - 4 Kota/Kab",
  },
  {
    provinceId: "550e8400-e29b-41d4-a716-446655440005",
    provinceName: "Bali",
    areaName: "Area Bali",
    cityCount: 9,
    isAllCitiesSelected: true,
    displayText: "Bali - 9 Kota/Kab",
  },
  {
    provinceId: "550e8400-e29b-41d4-a716-446655440006",
    provinceName: "Sumatera Utara",
    areaName: "Area Sumatera Utara",
    cityCount: 12,
    isAllCitiesSelected: false,
    displayText: "Sumatera Utara - 7 Kota/Kab",
  },
  {
    provinceId: "550e8400-e29b-41d4-a716-446655440007",
    provinceName: "Sumatera Barat",
    areaName: "Area Sumatera Barat",
    cityCount: 8,
    isAllCitiesSelected: false,
    displayText: "Sumatera Barat - 4 Kota/Kab",
  },
  {
    provinceId: "550e8400-e29b-41d4-a716-446655440008",
    provinceName: "Kalimantan Timur",
    areaName: "Area Kalimantan Timur",
    cityCount: 10,
    isAllCitiesSelected: false,
    displayText: "Kalimantan Timur - 5 Kota/Kab",
  },
  {
    provinceId: "550e8400-e29b-41d4-a716-446655440009",
    provinceName: "Kalimantan Barat",
    areaName: "Area Kalimantan Barat",
    cityCount: 11,
    isAllCitiesSelected: true,
    displayText: "Kalimantan Barat - 11 Kota/Kab",
  },
  {
    provinceId: "550e8400-e29b-41d4-a716-446655440010",
    provinceName: "Sulawesi Utara",
    areaName: "Area Sulawesi Utara",
    cityCount: 7,
    isAllCitiesSelected: false,
    displayText: "Sulawesi Utara - 3 Kota/Kab",
  },
];

export const searchAreaBongkar = async (cacheKey) => {
  const params = cacheKey?.split("/")?.[1];
  const searchParams = params
    ? new URLSearchParams(params)
    : new URLSearchParams();

  const q = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 10;

  let result;
  if (useMockData) {
    // Validate required q parameter
    if (!q.trim()) {
      throw new Error(JSON.stringify(mockSearchAreaBongkarError));
    }

    // Filter provinces based on q parameter
    let searchResults = mockAllProvinces.filter(
      (province) =>
        province.provinceName.toLowerCase().includes(q.toLowerCase()) ||
        province.areaName.toLowerCase().includes(q.toLowerCase())
    );

    // Add highlighting to matching provinces
    searchResults = searchResults.map((province) => ({
      ...province,
      highlightedName: province.provinceName.replace(
        new RegExp(q, "gi"),
        `<mark>$&</mark>`
      ),
    }));

    // Handle pagination
    const totalItems = searchResults.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = searchResults.slice(startIndex, endIndex);

    if (paginatedResults.length === 0) {
      result = {
        data: {
          ...mockSearchAreaBongkarNoData,
          Data: {
            ...mockSearchAreaBongkarNoData.Data,
            keyword: q,
            pagination: {
              currentPage: page,
              totalPages: 0,
              totalItems: 0,
              itemsPerPage: limit,
            },
          },
        },
      };
    } else {
      result = {
        data: {
          ...mockSearchAreaBongkarSuccess,
          Data: {
            ...mockSearchAreaBongkarSuccess.Data,
            keyword: q,
            found: true,
            unloadingAreas: paginatedResults,
            pagination: {
              currentPage: page,
              totalPages: totalPages,
              totalItems: totalItems,
              itemsPerPage: limit,
            },
          },
        },
      };
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));
  } else {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    result = await fetcherMuatrans.get(`${URL_AREA_BONGKAR}${query}`);
  }

  return {
    keyword: result?.data?.Data?.keyword || result?.data?.Data?.q || "",
    found: result?.data?.Data?.found || false,
    unloadingAreas: result?.data?.Data?.unloadingAreas || [],
    pagination: result?.data?.Data?.pagination || {},
    message: result?.data?.Message || {},
    raw: result,
  };
};

export const useSearchAreaBongkar = (params) => {
  const paramsString = params ? new URLSearchParams(params).toString() : "";

  // Only fetch if q parameter is provided and not empty
  const shouldFetch = params?.q && params.q.trim().length > 0;

  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? `searchAreaBongkar/${paramsString}` : null,
    searchAreaBongkar
  );

  return {
    keyword: data?.keyword || "",
    found: data?.found || false,
    unloadingAreas: data?.unloadingAreas || [],
    pagination: data?.pagination || {},
    message: data?.message || {},
    raw: data?.raw,
    isLoading: shouldFetch ? isLoading : false,
    isError: !!error,
    mutate,
  };
};
