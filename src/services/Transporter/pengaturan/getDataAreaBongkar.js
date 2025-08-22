import useSWR from "swr";

import { kotaKabupatenSuccessResponse } from "@/app/api/v1/transporter/settings/master/kota-kabupaten/mockData";
import {
  createMasterProvinsiSuccessResponse,
  masterProvinsiData,
  provinceNameMapping,
} from "@/app/api/v1/transporter/settings/master/provinsi/mockData";
import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false; // toggle mock data

// Endpoint constants
export const URL_AREA_BONGKAR = "/v1/transporter/settings/area-bongkar";
export const URL_MASTER_PROVINCES = "/v1/provinces";
export const URL_MASTER_PROVINSI = "/v1/transporter/settings/master/provinsi";
export const URL_MASTER_KOTA_KABUPATEN =
  "/v1/transporter/settings/master/kota-kabupaten";
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
          {
            cityId: "550e8400-e29b-41d4-a716-446655440012",
            cityName: "Jakarta Utara",
            isActive: true,
            isSelected: true,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440013",
            cityName: "Jakarta Barat",
            isActive: true,
            isSelected: false,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440014",
            cityName: "Jakarta Selatan",
            isActive: true,
            isSelected: true,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440015",
            cityName: "Jakarta Timur",
            isActive: true,
            isSelected: true,
          },
        ],
      },
      {
        provinceId: "550e8400-e29b-41d4-a716-446655440002",
        provinceName: "Jawa Barat",
        areaName: "Area Jawa Barat",
        cityCount: 8,
        isAllCitiesSelected: true,
        displayText: "Jawa Barat - 8 Kota/Kab",
        cities: [
          {
            cityId: "550e8400-e29b-41d4-a716-446655440021",
            cityName: "Bandung",
            isActive: true,
            isSelected: true,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440022",
            cityName: "Bogor",
            isActive: true,
            isSelected: true,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440023",
            cityName: "Depok",
            isActive: true,
            isSelected: true,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440024",
            cityName: "Bekasi",
            isActive: true,
            isSelected: true,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440025",
            cityName: "Cimahi",
            isActive: true,
            isSelected: true,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440026",
            cityName: "Sukabumi",
            isActive: true,
            isSelected: true,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440027",
            cityName: "Cirebon",
            isActive: true,
            isSelected: true,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440028",
            cityName: "Tasikmalaya",
            isActive: true,
            isSelected: true,
          },
        ],
      },
      {
        provinceId: "550e8400-e29b-41d4-a716-446655440003",
        provinceName: "Jawa Tengah",
        areaName: "Area Jawa Tengah",
        cityCount: 6,
        isAllCitiesSelected: false,
        displayText: "Jawa Tengah - 3 Kota/Kab",
        cities: [
          {
            cityId: "550e8400-e29b-41d4-a716-446655440031",
            cityName: "Semarang",
            isActive: true,
            isSelected: true,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440032",
            cityName: "Solo",
            isActive: true,
            isSelected: false,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440033",
            cityName: "Yogyakarta",
            isActive: true,
            isSelected: true,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440034",
            cityName: "Magelang",
            isActive: true,
            isSelected: false,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440035",
            cityName: "Salatiga",
            isActive: true,
            isSelected: true,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440036",
            cityName: "Pekalongan",
            isActive: true,
            isSelected: false,
          },
        ],
      },
      {
        provinceId: "550e8400-e29b-41d4-a716-446655440004",
        provinceName: "Jawa Timur",
        areaName: "Area Jawa Timur",
        cityCount: 7,
        isAllCitiesSelected: false,
        displayText: "Jawa Timur - 4 Kota/Kab",
        cities: [
          {
            cityId: "550e8400-e29b-41d4-a716-446655440041",
            cityName: "Surabaya",
            isActive: true,
            isSelected: true,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440042",
            cityName: "Malang",
            isActive: true,
            isSelected: true,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440043",
            cityName: "Kediri",
            isActive: true,
            isSelected: false,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440044",
            cityName: "Blitar",
            isActive: true,
            isSelected: false,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440045",
            cityName: "Mojokerto",
            isActive: true,
            isSelected: true,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440046",
            cityName: "Pasuruan",
            isActive: true,
            isSelected: false,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440047",
            cityName: "Probolinggo",
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
  const searchParams = params
    ? new URLSearchParams(params)
    : new URLSearchParams();

  let result;
  if (useMockData) {
    // Mock logic for pagination
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    const mockData = { ...mockAreaBongkar };

    // Apply pagination to mock data
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedAreas = mockData.Data.unloadingAreas.slice(
      startIndex,
      endIndex
    );

    mockData.Data.unloadingAreas = paginatedAreas;
    mockData.Data.pagination = {
      currentPage: page,
      totalPages: Math.ceil(mockAreaBongkar.Data.totalProvinces / limit),
      totalItems: mockAreaBongkar.Data.totalProvinces,
      itemsPerPage: limit,
    };

    result = { data: mockData };
  } else {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    result = await fetcherMuatrans.get(`${URL_AREA_BONGKAR}${query}`);
  }

  return {
    hasData: result?.data?.Data?.hasData || false,
    provinces: result?.data?.Data?.unloadingAreas || [],
    totalProvinces: result?.data?.Data?.totalProvinces || 0,
    pagination: result?.data?.Data?.pagination || {},
    message: result?.data?.Message || {},
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
    hasData: data?.hasData || false,
    provinces: data?.provinces || [],
    totalProvinces: data?.totalProvinces || 0,
    pagination: data?.pagination || {},
    message: data?.message || {},
    raw: data?.raw,
    isLoading,
    isError: !!error,
  };
};

// Create sample data with some provinces selected for master provinsi service
const sampleSelectedProvinsi = masterProvinsiData
  .slice(0, 10)
  .map((provinsi, index) => ({
    ...provinsi,
    isSelected: [1, 4, 5, 8].includes(index), // Select BALI, DI YOGYAKARTA, DKI JAKARTA, JAWA BARAT
  }));

export const mockMasterProvinsi = createMasterProvinsiSuccessResponse(
  sampleSelectedProvinsi,
  {
    currentPage: 1,
    totalPages: 3,
    totalItems: 34,
    itemsPerPage: 10,
  },
  "search=&page=1&limit=10&excludeSelected=false"
);

// Use master kota/kabupaten data from shared mock file
export const mockMasterKotaKabupaten = kotaKabupatenSuccessResponse;

// Mock API results for development/testing
// Use master provinsi data from shared mock file
export const mockMasterProvinces = createMasterProvinsiSuccessResponse(
  masterProvinsiData,
  {
    currentPage: 1,
    totalPages: 1,
    totalItems: 34,
    itemsPerPage: 50,
  },
  "search=&page=1&limit=50&excludeSelected=false"
);

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

export const getMasterProvinsi = async (cacheKey) => {
  const params = cacheKey?.split("/")?.[1];
  const searchParams = params
    ? new URLSearchParams(params)
    : new URLSearchParams();

  let result;
  if (useMockData) {
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const excludeSelected = searchParams.get("excludeSelected") === "true";

    let filteredProvinsi = [...mockMasterProvinsi.Data.provinsi];

    // Apply search filter
    if (search) {
      filteredProvinsi = filteredProvinsi.filter((provinsi) =>
        provinsi.provinceName.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply excludeSelected filter
    if (excludeSelected) {
      filteredProvinsi = filteredProvinsi.filter(
        (provinsi) => !provinsi.isSelected
      );
    }

    // Apply pagination
    const totalItems = filteredProvinsi.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filteredProvinsi.slice(startIndex, endIndex);

    // Calculate grouping
    const grouping = {};
    filteredProvinsi.forEach((provinsi) => {
      const group = provinsi.alphabetGroup;
      grouping[group] = (grouping[group] || 0) + 1;
    });

    result = {
      data: {
        ...mockMasterProvinsi,
        Data: {
          ...mockMasterProvinsi.Data,
          provinsi: paginatedData,
          pagination: {
            currentPage: page,
            totalPages: totalPages,
            totalItems: totalItems,
            itemsPerPage: limit,
          },
          grouping: grouping,
        },
      },
    };
  } else {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    result = await fetcherMuatrans.get(`${URL_MASTER_PROVINSI}${query}`);
  }

  return {
    provinsi: result?.data?.Data?.provinsi || [],
    pagination: result?.data?.Data?.pagination || {},
    grouping: result?.data?.Data?.grouping || {},
    message: result?.data?.Message || {},
    raw: result,
  };
};

export const useGetMasterProvinsi = (params, options = { enabled: true }) => {
  const paramsString = params ? new URLSearchParams(params).toString() : "";

  // Only fetch if explicitly enabled
  const shouldFetch = options.enabled && params;

  const { data, error, isLoading } = useSWR(
    shouldFetch ? `getMasterProvinsi/${paramsString}` : null,
    getMasterProvinsi
  );

  return {
    provinsi: data?.provinsi || [],
    pagination: data?.pagination || {},
    grouping: data?.grouping || {},
    message: data?.message || {},
    raw: data?.raw,
    isLoading: shouldFetch ? isLoading : false,
    isError: !!error,
  };
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
    let filteredProvinces = mockMasterProvinces.Data.provinsi;

    if (searchTerm) {
      filteredProvinces = filteredProvinces.filter((province) =>
        province.provinceName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    result = {
      data: {
        ...mockMasterProvinces,
        Data: {
          ...mockMasterProvinces.Data,
          provinsi: filteredProvinces,
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

// Transform area bongkar data to be compatible with area muat manage structure
export const getAreaBongkarManage = async (cacheKey) => {
  const params = cacheKey?.split("/")?.[1];
  const searchParams = params
    ? new URLSearchParams(params)
    : new URLSearchParams();

  let result;
  if (useMockData) {
    const searchTerm = searchParams.get("search") || "";
    const showSelected = searchParams.get("showSelected") === "true";

    // Transform area bongkar structure to area muat manage structure
    let transformedProvinces = mockAreaBongkar.Data.unloadingAreas.map(
      (area) => ({
        id: area.provinceId,
        province: area.provinceName,
        allSelected: area.isAllCitiesSelected,
        cities: area.cities.map((city) => ({
          cityId: city.cityId,
          cityName: city.cityName,
          isSelected: city.isSelected,
        })),
        pagination: {
          defaultShow: 12,
          hasMore: area.cities.length > 12,
          totalPages: Math.ceil(area.cities.length / 12),
        },
      })
    );

    // Apply search filter
    if (searchTerm) {
      transformedProvinces = transformedProvinces
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
      transformedProvinces = transformedProvinces
        .map((province) => ({
          ...province,
          cities: province.cities.filter((city) => city.isSelected),
        }))
        .filter((province) => province.cities.length > 0);
    }

    result = {
      data: {
        Data: {
          provinces: transformedProvinces,
          totalProvinces: transformedProvinces.length,
          totalSelectedCities: transformedProvinces.reduce(
            (total, province) =>
              total + province.cities.filter((city) => city.isSelected).length,
            0
          ),
        },
      },
    };
  } else {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    result = await fetcherMuatrans.get(`${URL_AREA_BONGKAR}${query}`);

    // Transform API response to match the expected format
    const transformedProvinces =
      result?.data?.Data?.unloadingAreas?.map((area) => ({
        id: area.provinceId,
        province: area.provinceName,
        allSelected: area.isAllCitiesSelected,
        cities: area.cities.map((city) => ({
          cityId: city.cityId,
          cityName: city.cityName,
          isSelected: city.isSelected,
        })),
        pagination: {
          defaultShow: 12,
          hasMore: area.cities.length > 12,
          totalPages: Math.ceil(area.cities.length / 12),
        },
      })) || [];

    result = {
      data: {
        Data: {
          provinces: transformedProvinces,
          totalProvinces: transformedProvinces.length,
          totalSelectedCities: transformedProvinces.reduce(
            (total, province) =>
              total + province.cities.filter((city) => city.isSelected).length,
            0
          ),
        },
      },
    };
  }

  return {
    provinces: result?.data?.Data?.provinces || [],
    totalProvinces: result?.data?.Data?.totalProvinces || 0,
    totalSelectedCities: result?.data?.Data?.totalSelectedCities || 0,
    raw: result,
  };
};

export const useGetAreaBongkarManage = (
  params,
  options = { enabled: true }
) => {
  const paramsString = params ? new URLSearchParams(params).toString() : "";
  const shouldFetch = options.enabled !== false;

  const { data, error, isLoading } = useSWR(
    shouldFetch ? `getAreaBongkarManage/${paramsString}` : null,
    getAreaBongkarManage
  );
  return {
    provinces: data?.provinces || [],
    totalProvinces: data?.totalProvinces || 0,
    totalSelectedCities: data?.totalSelectedCities || 0,
    raw: data?.raw,
    isLoading: shouldFetch ? isLoading : false,
    isError: !!error,
  };
};

// Master Kota/Kabupaten Service Functions
export const getMasterKotaKabupaten = async (cacheKey) => {
  const params = cacheKey?.split("/")?.[1];
  const searchParams = params
    ? new URLSearchParams(params)
    : new URLSearchParams();

  let result;
  if (useMockData) {
    const provinceIds = searchParams.get("provinceIds") || "";
    const search = searchParams.get("search") || "";
    const selectedOnly = searchParams.get("selectedOnly") === "true";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 12;

    // Validate required parameters
    if (!provinceIds) {
      throw new Error("Parameter provinceIds wajib diisi");
    }

    let citiesData = [...mockMasterKotaKabupaten.Data.cities];

    // Filter by provinceIds
    const provinceIdArray = provinceIds
      .split(",")
      .map((id) => parseInt(id.trim()));
    citiesData = citiesData.filter((city) =>
      provinceIdArray.includes(city.provinceId)
    );

    // Filter by search if provided
    if (search) {
      citiesData = citiesData
        .map((province) => ({
          ...province,
          kota: province.kota.filter((kota) =>
            kota.cityName.toLowerCase().includes(search.toLowerCase())
          ),
        }))
        .filter((province) => province.kota.length > 0);
    }

    // Filter by selectedOnly if true
    if (selectedOnly) {
      citiesData = citiesData
        .map((province) => ({
          ...province,
          kota: province.kota.filter((kota) => kota.isSelected),
        }))
        .filter((province) => province.kota.length > 0);
    }

    // Calculate total items for pagination
    const totalItems = citiesData.reduce(
      (acc, province) => acc + province.kota.length,
      0
    );
    const totalPages = Math.ceil(totalItems / limit);

    // Handle pagination
    const paginatedCities = [];
    let currentCount = 0;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    for (const province of citiesData) {
      const kotaToAdd = [];
      for (const kota of province.kota) {
        if (currentCount >= startIndex && currentCount < endIndex) {
          kotaToAdd.push(kota);
        }
        currentCount++;
      }

      if (kotaToAdd.length > 0) {
        paginatedCities.push({
          ...province,
          kota: kotaToAdd,
        });
      }
    }

    result = {
      data: {
        ...mockMasterKotaKabupaten,
        Data: {
          ...mockMasterKotaKabupaten.Data,
          cities: paginatedCities,
          pagination: {
            currentPage: page,
            totalPages: totalPages,
            totalItems: totalItems,
            itemsPerPage: limit,
          },
        },
      },
    };
  } else {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    result = await fetcherMuatrans.get(`${URL_MASTER_KOTA_KABUPATEN}${query}`);
  }

  return {
    cities: result?.data?.Data?.cities || [],
    pagination: result?.data?.Data?.pagination || {},
    message: result?.data?.Message || {},
    raw: result,
  };
};

export const useGetMasterKotaKabupaten = (
  params,
  options = { enabled: true }
) => {
  const paramsString = params ? new URLSearchParams(params).toString() : "";

  // Only fetch if provinceIds is provided and not empty, and explicitly enabled
  const shouldFetch =
    options.enabled && params?.provinceIds && params.provinceIds !== "";

  const { data, error, isLoading } = useSWR(
    shouldFetch ? `getMasterKotaKabupaten/${paramsString}` : null,
    getMasterKotaKabupaten
  );

  return {
    cities: data?.cities || [],
    pagination: data?.pagination || {},
    message: data?.message || {},
    raw: data?.raw,
    isLoading: shouldFetch ? isLoading : false,
    isError: !!error,
  };
};

// Mock data for save area bongkar response
export const mockSaveAreaBongkarResponse = {
  Message: {
    Code: 201,
    Text: "Berhasil menyimpan area bongkar",
  },
  Data: {
    saved: true,
    totalProvinces: 0,
    totalKota: 0,
    configurationId: "550e8400-e29b-41d4-a716-446655440099",
    transporterId: "550e8400-e29b-41d4-a716-446655440088",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  Type: "SAVE_AREA_BONGKAR",
};

export const mockSaveAreaBongkarErrorResponse = {
  Message: {
    Code: 400,
    Text: "Pilih Minimal 1 Data Provinsi",
  },
  Data: {
    errors: [
      {
        field: "areaBongkar",
        message: "Minimal 1 provinsi harus dipilih",
        code: "MINIMUM_PROVINCE_REQUIRED",
      },
    ],
  },
  Type: "SAVE_AREA_BONGKAR_ERROR",
};

// Save Area Bongkar Function
export const saveAreaBongkar = async (data) => {
  const { unloadingAreas } = data;

  let result;
  if (useMockData) {
    // Mock validation
    if (
      !unloadingAreas ||
      !Array.isArray(unloadingAreas) ||
      unloadingAreas.length === 0
    ) {
      throw new Error(JSON.stringify(mockSaveAreaBongkarErrorResponse));
    }

    // Check if each province has at least one city
    for (let i = 0; i < unloadingAreas.length; i++) {
      const province = unloadingAreas[i];
      if (
        !province.cities ||
        !Array.isArray(province.cities) ||
        province.cities.length === 0
      ) {
        const errorResponse = {
          Message: {
            Code: 400,
            Text: "Pilih minimal 1 Kota/Kab pada setiap Provinsi terpilih",
          },
          Data: {
            errors: [
              {
                field: `areaBongkar[${i}].kotaKabupaten`,
                message: `Minimal 1 kota/kabupaten harus dipilih untuk provinsi ${province.provinceName || "yang dipilih"}`,
                code: "MINIMUM_CITY_PER_PROVINCE_REQUIRED",
              },
            ],
          },
          Type: "SAVE_AREA_BONGKAR_ERROR",
        };
        throw new Error(JSON.stringify(errorResponse));
      }
    }

    // Calculate totals
    const totalProvinces = unloadingAreas.length;
    const totalKota = unloadingAreas.reduce((total, province) => {
      return total + (province.cities ? province.cities.length : 0);
    }, 0);

    // Mock successful response
    result = {
      data: {
        ...mockSaveAreaBongkarResponse,
        Data: {
          ...mockSaveAreaBongkarResponse.Data,
          totalProvinces,
          totalKota,
          configurationId: `550e8400-e29b-41d4-a716-${Date.now().toString().slice(-12)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    };

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));
  } else {
    result = await fetcherMuatrans.post(URL_AREA_BONGKAR, data);
  }

  return {
    saved: result?.data?.Data?.saved || false,
    totalProvinces: result?.data?.Data?.totalProvinces || 0,
    totalKota: result?.data?.Data?.totalKota || 0,
    configurationId: result?.data?.Data?.configurationId || "",
    transporterId: result?.data?.Data?.transporterId || "",
    createdAt: result?.data?.Data?.createdAt || "",
    updatedAt: result?.data?.Data?.updatedAt || "",
    message: result?.data?.Message || {},
    raw: result,
  };
};

// Mock response for delete provinsi area bongkar
export const mockDeleteProvinsiSuccess = {
  Message: {
    Code: 200,
    Text: "Berhasil menghapus Provinsi DKI Jakarta",
  },
  Data: {
    deleted: true,
    deletedProvinsiName: "DKI Jakarta",
    remainingProvinsi: 3,
  },
  Type: "DELETE_PROVINSI_AREA_BONGKAR",
};

export const mockDeleteProvinsiError = {
  Message: {
    Code: 400,
    Text: "Kamu tidak bisa menghapus provinsi terakhir. Minimal harus ada satu provinsi terpilih",
  },
  Data: {
    errors: [
      {
        field: "provinsiId",
        message:
          "Minimal 1 provinsi harus tersisa dalam konfigurasi area bongkar",
      },
    ],
    remainingProvinsi: 1,
  },
  Type: "DELETE_PROVINSI_AREA_BONGKAR_ERROR",
};

// Delete Provinsi Area Bongkar Function
export const deleteProvinsiAreaBongkar = async (provinsiId) => {
  let result;
  if (useMockData) {
    // Mock validation - simulate last province scenario (30% chance)
    const isLastProvince = Math.random() < 0.3;

    if (isLastProvince) {
      throw new Error(JSON.stringify(mockDeleteProvinsiError));
    }

    // Mock successful delete response
    const mockProvinceNames = [
      "DKI Jakarta",
      "Jawa Barat",
      "Jawa Tengah",
      "Jawa Timur",
      "Sumatera Utara",
      "Sumatera Barat",
      "Bali",
      "Kalimantan Timur",
    ];
    const deletedProvinceName =
      mockProvinceNames[Math.floor(Math.random() * mockProvinceNames.length)];
    const remainingCount = Math.floor(Math.random() * 5) + 2; // 2-6 remaining provinces

    result = {
      data: {
        ...mockDeleteProvinsiSuccess,
        Message: {
          ...mockDeleteProvinsiSuccess.Message,
          Text: `Berhasil menghapus Provinsi ${deletedProvinceName}`,
        },
        Data: {
          ...mockDeleteProvinsiSuccess.Data,
          deletedProvinsiName: deletedProvinceName,
          remainingProvinsi: remainingCount,
        },
      },
    };

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));
  } else {
    result = await fetcherMuatrans.delete(
      `${URL_AREA_BONGKAR}/provinsi/${provinsiId}`
    );
  }

  return {
    deleted: result?.data?.Data?.deleted || false,
    deletedProvinsiName: result?.data?.Data?.deletedProvinsiName || "",
    remainingProvinsi: result?.data?.Data?.remainingProvinsi || 0,
    message: result?.data?.Message || {},
    raw: result,
  };
};

// Mock response for update area bongkar selection
export const mockUpdateAreaBongkarSelectionSuccess = {
  Message: {
    Code: 200,
    Text: "Berhasil mengupdate pilihan kota/kabupaten",
  },
  Data: {
    updated: true,
    provinsiId: "550e8400-e29b-41d4-a716-446655440001",
    provinsiName: "DKI Jakarta",
    selectedCount: 3,
    totalCount: 5,
    isAllSelected: false,
  },
  Type: "UPDATE_AREA_BONGKAR_SELECTION",
};

export const mockUpdateAreaBongkarSelectionError = {
  Message: {
    Code: 400,
    Text: "Pilih minimal 1 Kota/Kab pada Provinsi ini",
  },
  Data: {
    errors: [
      {
        field: "kotaKabupaten",
        message: "Minimal 1 kota/kabupaten harus dipilih",
      },
    ],
  },
  Type: "UPDATE_AREA_BONGKAR_SELECTION_ERROR",
};

// Update Area Bongkar Selection Function
export const updateAreaBongkarSelection = async (provinsiId, data) => {
  const { cities } = data;

  let result;
  if (useMockData) {
    // Mock validation
    if (!cities || !Array.isArray(cities)) {
      const errorResponse = {
        Message: {
          Code: 400,
          Text: "Data kota/kabupaten tidak valid",
        },
        Data: {
          errors: [
            {
              field: "cities",
              message: "cities must be an array",
            },
          ],
        },
        Type: "UPDATE_AREA_BONGKAR_SELECTION_ERROR",
      };
      throw new Error(JSON.stringify(errorResponse));
    }

    const selectedCities = cities.filter((city) => city.isSelected);
    if (selectedCities.length === 0) {
      throw new Error(JSON.stringify(mockUpdateAreaBongkarSelectionError));
    }

    // Use centralized province names mapping
    const provinceName = provinceNameMapping[provinsiId] || "Provinsi";
    const selectedCount = selectedCities.length;
    const totalCount = cities.length;
    const isAllSelected = selectedCount === totalCount;

    result = {
      data: {
        ...mockUpdateAreaBongkarSelectionSuccess,
        Data: {
          ...mockUpdateAreaBongkarSelectionSuccess.Data,
          provinsiId,
          provinsiName: provinceName,
          selectedCount,
          totalCount,
          isAllSelected,
        },
      },
    };

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));
  } else {
    result = await fetcherMuatrans.put(
      `${URL_AREA_BONGKAR}/provinsi/${provinsiId}`,
      data
    );
  }

  return {
    updated: result?.data?.Data?.updated || false,
    provinsiId: result?.data?.Data?.provinsiId || provinsiId,
    provinsiName: result?.data?.Data?.provinsiName || "",
    selectedCount: result?.data?.Data?.selectedCount || 0,
    totalCount: result?.data?.Data?.totalCount || 0,
    isAllSelected: result?.data?.Data?.isAllSelected || false,
    message: result?.data?.Message || {},
    raw: result,
  };
};
