import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true; // toggle mock data

// Endpoint constants
export const URL_AREA_BONGKAR = "/v1/transporter/area-bongkar";
export const URL_MASTER_PROVINCES = "/v1/provinces";
export const URL_AREA_MUAT_MANAGE = "/v1/area-muat/manage";

// Mock API results for development/testing
export const mockAreaBongkar = {
  Message: {
    Code: 200,
    Text: "Data area bongkar berhasil diambil",
  },
  Data: {
    hasData: true,
    totalProvinces: 4,
    unloadingAreas: [
      {
        provinceId: "550e8400-e29b-41d4-a716-446655440001",
        provinceName: "DKI Jakarta",
        areaName: "Area Jakarta Raya",
        cityCount: 5,
        isAllCitiesSelected: false,
        displayText: "DKI Jakarta - 5 Kota/Kab",
        cities: [
          {
            cityId: "550e8400-e29b-41d4-a716-446655440011",
            cityName: "Jakarta Pusat",
            isActive: true,
            isSelected: true,
          },
        ],
      },
    ],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 4,
      itemsPerPage: 10,
    },
  },
  Type: "GET_AREA_BONGKAR",
};

export const getAreaBongkarData = async (cacheKey) => {
  const params = cacheKey?.split("/")?.[1];

  let result;
  if (useMockData) {
    result = { data: mockAreaBongkar };
  } else {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    result = await fetcherMuatrans.get(`${URL_AREA_BONGKAR}${query}`);
  }

  return {
    hasData: result?.data?.Data?.hasData || false,
    provinces: result?.data?.Data?.unloadingAreas || [],
    totalProvinces: result?.data?.Data?.totalProvinces || 0,
    pagination: result?.data?.Data?.pagination || {},
    raw: result,
  };
};

export const useGetAreaBongkarData = (params) => {
  const paramsString = params ? new URLSearchParams(params).toString() : "";
  const { data, error, isLoading } = useSWR(
    `getAreaBongkarData/${paramsString}`,
    getAreaBongkarData
  );

  return {
    hasData: data?.hasData,
    provinces: data?.provinces || [],
    totalProvinces: data?.totalProvinces || 0,
    pagination: data?.pagination || {},
    raw: data?.raw,
    isLoading,
    isError: !!error,
  };
};

// Mock API results for development/testing
export const mockMasterProvinces = {
  data: {
    Message: {
      Code: 200,
      Text: "Master provinsi berhasil diambil",
    },
    Data: {
      totalProvinces: 34,
      availableProvinces: 34,
      excludedCount: 0,
      provinces: [
        {
          provinceId: "550e8400-e29b-41d4-a716-446655440001",
          provinceName: "Aceh",
          provinceCode: "11",
          isSelected: false,
          cityCount: 23,
          sortOrder: "A",
        },
        {
          provinceId: "550e8400-e29b-41d4-a716-446655440002",
          provinceName: "Bali",
          provinceCode: "51",
          isSelected: false,
          cityCount: 9,
          sortOrder: "B",
        },
        {
          provinceId: "550e8400-e29b-41d4-a716-446655440003",
          provinceName: "Banten",
          provinceCode: "36",
          isSelected: false,
          cityCount: 8,
          sortOrder: "B",
        },
        {
          provinceId: "550e8400-e29b-41d4-a716-446655440004",
          provinceName: "Bengkulu",
          provinceCode: "17",
          isSelected: false,
          cityCount: 10,
          sortOrder: "B",
        },
        {
          provinceId: "550e8400-e29b-41d4-a716-446655440005",
          provinceName: "DI Yogyakarta",
          provinceCode: "34",
          isSelected: false,
          cityCount: 5,
          sortOrder: "D",
        },
        {
          provinceId: "550e8400-e29b-41d4-a716-446655440006",
          provinceName: "DKI Jakarta",
          provinceCode: "31",
          isSelected: false,
          cityCount: 6,
          sortOrder: "D",
        },
        {
          provinceId: "550e8400-e29b-41d4-a716-446655440007",
          provinceName: "Gorontalo",
          provinceCode: "75",
          isSelected: false,
          cityCount: 6,
          sortOrder: "G",
        },
        {
          provinceId: "550e8400-e29b-41d4-a716-446655440008",
          provinceName: "Jambi",
          provinceCode: "15",
          isSelected: false,
          cityCount: 11,
          sortOrder: "J",
        },
        {
          provinceId: "550e8400-e29b-41d4-a716-446655440009",
          provinceName: "Jawa Barat",
          provinceCode: "32",
          isSelected: false,
          cityCount: 27,
          sortOrder: "J",
        },
        {
          provinceId: "550e8400-e29b-41d4-a716-446655440010",
          provinceName: "Jawa Tengah",
          provinceCode: "33",
          isSelected: false,
          cityCount: 35,
          sortOrder: "J",
        },
        {
          provinceId: "550e8400-e29b-41d4-a716-446655440011",
          provinceName: "Jawa Timur",
          provinceCode: "35",
          isSelected: false,
          cityCount: 38,
          sortOrder: "J",
        },
        {
          provinceId: "550e8400-e29b-41d4-a716-446655440012",
          provinceName: "Kalimantan Barat",
          provinceCode: "61",
          isSelected: false,
          cityCount: 14,
          sortOrder: "K",
        },
        {
          provinceId: "550e8400-e29b-41d4-a716-446655440013",
          provinceName: "Kalimantan Selatan",
          provinceCode: "63",
          isSelected: false,
          cityCount: 13,
          sortOrder: "K",
        },
        {
          provinceId: "550e8400-e29b-41d4-a716-446655440014",
          provinceName: "Kalimantan Tengah",
          provinceCode: "62",
          isSelected: false,
          cityCount: 14,
          sortOrder: "K",
        },
        {
          provinceId: "550e8400-e29b-41d4-a716-446655440015",
          provinceName: "Kalimantan Timur",
          provinceCode: "64",
          isSelected: false,
          cityCount: 10,
          sortOrder: "K",
        },
        {
          provinceId: "550e8400-e29b-41d4-a716-446655440016",
          provinceName: "Kalimantan Utara",
          provinceCode: "65",
          isSelected: false,
          cityCount: 5,
          sortOrder: "K",
        },
        {
          provinceId: "550e8400-e29b-41d4-a716-446655440017",
          provinceName: "Kepulauan Bangka Belitung",
          provinceCode: "19",
          isSelected: false,
          cityCount: 7,
          sortOrder: "K",
        },
        {
          provinceId: "550e8400-e29b-41d4-a716-446655440018",
          provinceName: "Kepulauan Riau",
          provinceCode: "21",
          isSelected: false,
          cityCount: 7,
          sortOrder: "K",
        },
        {
          provinceId: "550e8400-e29b-41d4-a716-446655440019",
          provinceName: "Lampung",
          provinceCode: "18",
          isSelected: false,
          cityCount: 15,
          sortOrder: "L",
        },
        {
          provinceId: "550e8400-e29b-41d4-a716-446655440020",
          provinceName: "Maluku",
          provinceCode: "81",
          isSelected: false,
          cityCount: 11,
          sortOrder: "M",
        },
        {
          provinceId: "550e8400-e29b-41d4-a716-446655440021",
          provinceName: "Maluku Utara",
          provinceCode: "82",
          isSelected: false,
          cityCount: 10,
          sortOrder: "M",
        },
        {
          provinceId: "550e8400-e29b-41d4-a716-446655440022",
          provinceName: "Nusa Tenggara Barat",
          provinceCode: "52",
          isSelected: false,
          cityCount: 10,
          sortOrder: "N",
        },
        {
          provinceId: "550e8400-e29b-41d4-a716-446655440023",
          provinceName: "Nusa Tenggara Timur",
          provinceCode: "53",
          isSelected: false,
          cityCount: 22,
          sortOrder: "N",
        },
        {
          provinceId: "550e8400-e29b-41d4-a716-446655440024",
          provinceName: "Papua",
          provinceCode: "94",
          isSelected: false,
          cityCount: 29,
          sortOrder: "P",
        },
        {
          provinceId: "550e8400-e29b-41d4-a716-446655440025",
          provinceName: "Papua Barat",
          provinceCode: "91",
          isSelected: false,
          cityCount: 13,
          sortOrder: "P",
        },
        {
          provinceId: "550e8400-e29b-41d4-a716-446655440026",
          provinceName: "Riau",
          provinceCode: "14",
          isSelected: false,
          cityCount: 12,
          sortOrder: "R",
        },
        {
          provinceId: "550e8400-e29b-41d4-a716-446655440027",
          provinceName: "Sulawesi Barat",
          provinceCode: "76",
          isSelected: false,
          cityCount: 6,
          sortOrder: "S",
        },
        {
          provinceId: "550e8400-e29b-41d4-a716-446655440028",
          provinceName: "Sulawesi Selatan",
          provinceCode: "73",
          isSelected: false,
          cityCount: 24,
          sortOrder: "S",
        },
        {
          provinceId: "550e8400-e29b-41d4-a716-446655440029",
          provinceName: "Sulawesi Tengah",
          provinceCode: "72",
          isSelected: false,
          cityCount: 13,
          sortOrder: "S",
        },
        {
          provinceId: "550e8400-e29b-41d4-a716-446655440030",
          provinceName: "Sulawesi Tenggara",
          provinceCode: "74",
          isSelected: false,
          cityCount: 17,
          sortOrder: "S",
        },
        {
          provinceId: "550e8400-e29b-41d4-a716-446655440031",
          provinceName: "Sulawesi Utara",
          provinceCode: "71",
          isSelected: false,
          cityCount: 15,
          sortOrder: "S",
        },
        {
          provinceId: "550e8400-e29b-41d4-a716-446655440032",
          provinceName: "Sumatera Barat",
          provinceCode: "13",
          isSelected: false,
          cityCount: 19,
          sortOrder: "S",
        },
        {
          provinceId: "550e8400-e29b-41d4-a716-446655440033",
          provinceName: "Sumatera Selatan",
          provinceCode: "16",
          isSelected: false,
          cityCount: 17,
          sortOrder: "S",
        },
        {
          provinceId: "550e8400-e29b-41d4-a716-446655440034",
          provinceName: "Sumatera Utara",
          provinceCode: "12",
          isSelected: false,
          cityCount: 33,
          sortOrder: "S",
        },
      ],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false,
      },
      query: {
        searchTerm: "",
        totalResults: 34,
        hasResults: true,
      },
    },
    Type: "GET_MASTER_PROVINCES",
  },
};

// Mock API results for Area Muat Management
export const mockAreaMuatManage = {
  data: {
    Message: {
      Code: 200,
      Text: "Data area muat untuk manajemen berhasil diambil",
    },
    Data: {
      transporterID: "550e8400-e29b-41d4-a716-446655440001",
      totalProvinces: 4,
      totalSelectedCities: 23,
      hasUnsavedChanges: false,
      provinces: [
        {
          id: "550e8400-e29b-41d4-a716-446655440011",
          transporterID: "550e8400-e29b-41d4-a716-446655440001",
          areaName: "Jawa Timur",
          city: "Surabaya, Malang, Kediri, Blitar",
          province: "Jawa Timur",
          totalCities: 38,
          selectedCityCount: 4,
          allSelected: false,
          partialSelected: true,
          expanded: true,
          canDelete: true,
          isActive: true,
          cities: [
            {
              cityId: "550e8400-e29b-41d4-a716-446655440201",
              cityName: "Kab. Kepulauan Siau Tagulandang Biaro",
              cityType: "KABUPATEN",
              isSelected: true,
              visible: true,
            },
            {
              cityId: "550e8400-e29b-41d4-a716-446655440202",
              cityName: "Kab. Kepulauan Siau Tagulandang Biaro",
              cityType: "KABUPATEN",
              isSelected: false,
              visible: true,
            },
            {
              cityId: "550e8400-e29b-41d4-a716-446655440203",
              cityName: "Kab. Banyuwangi",
              cityType: "KABUPATEN",
              isSelected: false,
              visible: true,
            },
            {
              cityId: "550e8400-e29b-41d4-a716-446655440204",
              cityName: "Kab. Banyuwangi",
              cityType: "KABUPATEN",
              isSelected: false,
              visible: true,
            },
            {
              cityId: "550e8400-e29b-41d4-a716-446655440205",
              cityName: "Kab. Blitar",
              cityType: "KABUPATEN",
              isSelected: false,
              visible: true,
            },
            {
              cityId: "550e8400-e29b-41d4-a716-446655440206",
              cityName: "Kab. Blitar",
              cityType: "KABUPATEN",
              isSelected: false,
              visible: true,
            },
            {
              cityId: "550e8400-e29b-41d4-a716-446655440207",
              cityName: "Kab. Blitar",
              cityType: "KABUPATEN",
              isSelected: false,
              visible: true,
            },
            {
              cityId: "550e8400-e29b-41d4-a716-446655440208",
              cityName: "Kab. Blitar",
              cityType: "KABUPATEN",
              isSelected: false,
              visible: true,
            },
            {
              cityId: "550e8400-e29b-41d4-a716-446655440209",
              cityName: "Kab. Madiun",
              cityType: "KABUPATEN",
              isSelected: false,
              visible: true,
            },
            {
              cityId: "550e8400-e29b-41d4-a716-446655440210",
              cityName: "Kab. Madiun",
              cityType: "KABUPATEN",
              isSelected: false,
              visible: true,
            },
            {
              cityId: "550e8400-e29b-41d4-a716-446655440211",
              cityName: "Kab. Madiun",
              cityType: "KABUPATEN",
              isSelected: false,
              visible: true,
            },
            {
              cityId: "550e8400-e29b-41d4-a716-446655440212",
              cityName: "Kab. Madiun",
              cityType: "KABUPATEN",
              isSelected: false,
              visible: true,
            },
          ],
          pagination: {
            defaultShow: 12,
            hasMore: true,
            totalPages: 4,
          },
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440009",
          transporterID: "550e8400-e29b-41d4-a716-446655440001",
          areaName: "Jawa Barat",
          city: "Bandung, Bekasi, Bogor",
          province: "Jawa Barat",
          totalCities: 27,
          selectedCityCount: 3,
          allSelected: false,
          partialSelected: true,
          expanded: false,
          canDelete: true,
          isActive: true,
          cities: [
            {
              cityId: "550e8400-e29b-41d4-a716-446655440301",
              cityName: "Kota Bandung",
              cityType: "KOTA",
              isSelected: true,
              visible: true,
            },
            {
              cityId: "550e8400-e29b-41d4-a716-446655440302",
              cityName: "Kota Bekasi",
              cityType: "KOTA",
              isSelected: true,
              visible: true,
            },
            {
              cityId: "550e8400-e29b-41d4-a716-446655440303",
              cityName: "Kota Bogor",
              cityType: "KOTA",
              isSelected: true,
              visible: true,
            },
          ],
          pagination: {
            defaultShow: 12,
            hasMore: true,
            totalPages: 3,
          },
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440033",
          transporterID: "550e8400-e29b-41d4-a716-446655440001",
          areaName: "Sumatera Selatan",
          city: "Palembang, Prabumulih",
          province: "Sumatera Selatan",
          totalCities: 17,
          selectedCityCount: 2,
          allSelected: false,
          partialSelected: true,
          expanded: false,
          canDelete: true,
          isActive: true,
          cities: [
            {
              cityId: "550e8400-e29b-41d4-a716-446655440401",
              cityName: "Kota Palembang",
              cityType: "KOTA",
              isSelected: true,
              visible: true,
            },
            {
              cityId: "550e8400-e29b-41d4-a716-446655440402",
              cityName: "Kota Prabumulih",
              cityType: "KOTA",
              isSelected: true,
              visible: true,
            },
          ],
          pagination: {
            defaultShow: 12,
            hasMore: true,
            totalPages: 2,
          },
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440006",
          transporterID: "550e8400-e29b-41d4-a716-446655440001",
          areaName: "DKI Jakarta",
          city: "Jakarta Pusat, Jakarta Barat, Jakarta Timur",
          province: "DKI Jakarta",
          totalCities: 6,
          selectedCityCount: 3,
          allSelected: false,
          partialSelected: true,
          expanded: false,
          canDelete: true,
          isActive: true,
          cities: [
            {
              cityId: "550e8400-e29b-41d4-a716-446655440501",
              cityName: "Jakarta Pusat",
              cityType: "KOTA",
              isSelected: true,
              visible: true,
            },
            {
              cityId: "550e8400-e29b-41d4-a716-446655440502",
              cityName: "Jakarta Barat",
              cityType: "KOTA",
              isSelected: true,
              visible: true,
            },
            {
              cityId: "550e8400-e29b-41d4-a716-446655440503",
              cityName: "Jakarta Timur",
              cityType: "KOTA",
              isSelected: true,
              visible: true,
            },
          ],
          pagination: {
            defaultShow: 12,
            hasMore: false,
            totalPages: 1,
          },
        },
      ],
      navigation: {
        showScrollNavigation: true,
        canScrollLeft: false,
        canScrollRight: true,
      },
      query: {
        searchTerm: "",
        showSelectedOnly: false,
        totalResults: 4,
        hasResults: true,
      },
    },
    Type: "GET_AREA_MANAGE",
  },
};

export const getMasterProvinces = async (cacheKey) => {
  const params = cacheKey?.split("/")?.[1];
  const searchParams = params
    ? new URLSearchParams(params)
    : new URLSearchParams();

  let result;
  if (useMockData) {
    // Filter mock data based on search term
    const searchTerm = searchParams.get("q") || "";
    let filteredProvinces = mockMasterProvinces.data.Data.provinces;

    if (searchTerm) {
      filteredProvinces = filteredProvinces.filter((province) =>
        province.provinceName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    result = {
      ...mockMasterProvinces,
      data: {
        ...mockMasterProvinces.data,
        Data: {
          ...mockMasterProvinces.data.Data,
          provinces: filteredProvinces,
          query: {
            searchTerm,
            totalResults: filteredProvinces.length,
            hasResults: filteredProvinces.length > 0,
          },
        },
      },
    };
  } else {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    result = await fetcherMuatrans.get(`${URL_MASTER_PROVINCES}${query}`);
  }

  return {
    provinces: result?.data?.Data?.provinces || [],
    totalProvinces: result?.data?.Data?.totalProvinces || 0,
    availableProvinces: result?.data?.Data?.availableProvinces || 0,
    excludedCount: result?.data?.Data?.excludedCount || 0,
    pagination: result?.data?.Data?.pagination,
    query: result?.data?.Data?.query,
    message: result?.data?.Data?.message,
    raw: result,
  };
};

export const getAreaMuatManage = async (cacheKey) => {
  const params = cacheKey?.split("/")?.[1];
  const searchParams = params
    ? new URLSearchParams(params)
    : new URLSearchParams();

  let result;
  if (useMockData) {
    // Filter mock data based on search term and showSelected
    const searchTerm = searchParams.get("search") || "";
    const showSelected = searchParams.get("showSelected") === "true";
    const expandAll = searchParams.get("expandAll") === "true";

    let filteredProvinces = mockAreaMuatManage.data.Data.provinces;

    // Apply search filter
    if (searchTerm) {
      filteredProvinces = filteredProvinces
        .map((province) => ({
          ...province,
          cities: province.cities.filter((city) =>
            city.cityName.toLowerCase().includes(searchTerm.toLowerCase())
          ),
        }))
        .filter((province) => province.cities.length > 0);
    }

    // Apply show selected filter
    if (showSelected) {
      filteredProvinces = filteredProvinces
        .map((province) => ({
          ...province,
          cities: province.cities.filter((city) => city.isSelected),
        }))
        .filter((province) => province.cities.length > 0);
    }

    // Apply expand all
    if (expandAll) {
      filteredProvinces = filteredProvinces.map((province) => ({
        ...province,
        expanded: true,
      }));
    }

    result = {
      ...mockAreaMuatManage,
      data: {
        ...mockAreaMuatManage.data,
        Data: {
          ...mockAreaMuatManage.data.Data,
          provinces: filteredProvinces,
          query: {
            searchTerm,
            showSelectedOnly: showSelected,
            totalResults: filteredProvinces.length,
            hasResults: filteredProvinces.length > 0,
          },
        },
      },
    };
  } else {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    result = await fetcherMuatrans.get(`${URL_AREA_MUAT_MANAGE}${query}`);
  }

  return {
    transporterID: result?.data?.Data?.transporterID || "",
    totalProvinces: result?.data?.Data?.totalProvinces || 0,
    totalSelectedCities: result?.data?.Data?.totalSelectedCities || 0,
    hasUnsavedChanges: result?.data?.Data?.hasUnsavedChanges || false,
    provinces: result?.data?.Data?.provinces || [],
    navigation: result?.data?.Data?.navigation || {},
    query: result?.data?.Data?.query || {},
    raw: result,
  };
};

export const useGetAreaMuatManage = (params) => {
  const paramsString = params ? new URLSearchParams(params).toString() : "";
  const { data, error, isLoading } = useSWR(
    `getAreaMuatManage/${paramsString}`,
    getAreaMuatManage
  );
  return {
    transporterID: data?.transporterID || "",
    totalProvinces: data?.totalProvinces || 0,
    totalSelectedCities: data?.totalSelectedCities || 0,
    hasUnsavedChanges: data?.hasUnsavedChanges || false,
    provinces: data?.provinces || [],
    navigation: data?.navigation || {},
    query: data?.query || {},
    raw: data?.raw,
    isLoading,
    isError: !!error,
  };
};
