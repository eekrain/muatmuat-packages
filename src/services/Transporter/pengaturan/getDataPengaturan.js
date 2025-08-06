import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true; // toggle mock data

// Endpoint constants
export const URL_AREA_MUAT_DATA = "/v1/area-muat/data";
export const URL_AREA_BONGKAR_DATA = "/v1/area-bongkar/data";
export const URL_TRANSPORTER_CARGO_CONFIG_STATUS =
  "/v1/transporter-cargo-config-status";
export const URL_TRANSPORTER_CARGO_CONFIG = "/v1/transporter-cargo-config";

// Mock API results for Area Muat Data (for pengaturan page)
export const mockAreaMuatData = {
  data: {
    Message: {
      Code: 200,
      Text: "Data area muat berhasil diambil",
    },
    Data: {
      totalProvinces: 15,
      provinces: [
        {
          id: "1",
          name: "Jawa Timur",
          cityCount: 38,
        },
        {
          id: "2",
          name: "Jawa Barat",
          cityCount: 27,
        },
        {
          id: "3",
          name: "Sumatera Selatan",
          cityCount: 17,
        },
        {
          id: "4",
          name: "DKI Jakarta",
          cityCount: 6,
        },
        {
          id: "5",
          name: "Jawa Tengah",
          cityCount: 35,
        },
        {
          id: "6",
          name: "Aceh",
          cityCount: 23,
        },
        {
          id: "7",
          name: "Bali",
          cityCount: 9,
        },
        {
          id: "8",
          name: "Banten",
          cityCount: 8,
        },
        {
          id: "9",
          name: "Bengkulu",
          cityCount: 10,
        },
        {
          id: "10",
          name: "DI Yogyakarta",
          cityCount: 5,
        },
        {
          id: "11",
          name: "Gorontalo",
          cityCount: 6,
        },
        {
          id: "12",
          name: "Jambi",
          cityCount: 11,
        },
        {
          id: "13",
          name: "Kalimantan Barat",
          cityCount: 14,
        },
        {
          id: "14",
          name: "Kalimantan Selatan",
          cityCount: 13,
        },
        {
          id: "15",
          name: "Kalimantan Tengah",
          cityCount: 14,
        },
      ],
    },
    Type: "GET_AREA_MUAT_DATA",
  },
};

// Mock API results for Area Bongkar Data (for pengaturan page)
export const mockAreaBongkarData = {
  data: {
    Message: {
      Code: 200,
      Text: "Data area bongkar berhasil diambil",
    },
    Data: {
      totalProvinces: 15,
      provinces: [
        {
          id: "1",
          name: "Jawa Timur",
          cityCount: 38,
        },
        {
          id: "2",
          name: "Jawa Barat",
          cityCount: 27,
        },
        {
          id: "3",
          name: "Sumatera Selatan",
          cityCount: 17,
        },
        {
          id: "4",
          name: "DKI Jakarta",
          cityCount: 6,
        },
        {
          id: "5",
          name: "Jawa Tengah",
          cityCount: 35,
        },
        {
          id: "6",
          name: "Aceh",
          cityCount: 23,
        },
        {
          id: "7",
          name: "Bali",
          cityCount: 9,
        },
        {
          id: "8",
          name: "Banten",
          cityCount: 8,
        },
        {
          id: "9",
          name: "Bengkulu",
          cityCount: 10,
        },
        {
          id: "10",
          name: "DI Yogyakarta",
          cityCount: 5,
        },
        {
          id: "11",
          name: "Gorontalo",
          cityCount: 6,
        },
        {
          id: "12",
          name: "Jambi",
          cityCount: 11,
        },
        {
          id: "13",
          name: "Kalimantan Barat",
          cityCount: 14,
        },
        {
          id: "14",
          name: "Kalimantan Selatan",
          cityCount: 13,
        },
        {
          id: "15",
          name: "Kalimantan Tengah",
          cityCount: 14,
        },
      ],
    },
    Type: "GET_AREA_BONGKAR_DATA",
  },
};

// Mock API result for Transporter Cargo Config Status
export const mockCargoStatusResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Configuration status retrieved successfully",
    },
    Data: {
      hasConfiguration: true,
      totalCargoTypes: 12,
      lastUpdated: "2024-12-10T14:30:00Z",
      status: "DATA_EXISTS",
    },
    Type: "CARGO_CONFIG_STATUS",
  },
};

// Mock API result for Transporter Cargo Config Data
export const mockCargoConfigResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Cargo configuration retrieved successfully",
    },
    Data: {
      totalCount: 12,
      cargoTypes: [
        {
          id: "550e8400-e29b-41d4-a716-446655440001",
          name: "Semen (Barang Setengah Jadi, Padat)",
          cargoTypeId: "550e8400-e29b-41d4-a716-446655440002",
          cargoTypeName: "Barang Setengah Jadi",
          cargoCategoryId: "550e8400-e29b-41d4-a716-446655440003",
          cargoCategoryName: "Padat",
          cargoNameId: "550e8400-e29b-41d4-a716-446655440004",
          cargoName: "Semen",
          isActive: true,
          createdAt: "2024-12-10T14:30:00Z",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440002",
          name: "Minyak (Barang Mentah, Cair)",
          cargoTypeId: "550e8400-e29b-41d4-a716-446655440002",
          cargoTypeName: "Barang Setengah Jadi",
          cargoCategoryId: "550e8400-e29b-41d4-a716-446655440003",
          cargoCategoryName: "Cair",
          cargoNameId: "550e8400-e29b-41d4-a716-446655440004",
          cargoName: "Semen",
          isActive: true,
          createdAt: "2024-12-10T14:30:00Z",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440003",
          name: "Semen (Barang Setengah Jadi, Padat)",
          cargoTypeId: "550e8400-e29b-41d4-a716-446655440002",
          cargoTypeName: "Barang Setengah Jadi",
          cargoCategoryId: "550e8400-e29b-41d4-a716-446655440003",
          cargoCategoryName: "Padat",
          cargoNameId: "550e8400-e29b-41d4-a716-446655440004",
          cargoName: "Semen",
          isActive: true,
          createdAt: "2024-12-10T14:30:00Z",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440004",
          name: "Semen (Barang Setengah Jadi, Padat)",
          cargoTypeId: "550e8400-e29b-41d4-a716-446655440002",
          cargoTypeName: "Barang Setengah Jadi",
          cargoCategoryId: "550e8400-e29b-41d4-a716-446655440003",
          cargoCategoryName: "Padat",
          cargoNameId: "550e8400-e29b-41d4-a716-446655440004",
          cargoName: "Semen",
          isActive: true,
          createdAt: "2024-12-10T14:30:00Z",
        },
      ],
      displayedCount: 8,
      overflowCount: 4,
      hasOverflow: true,
    },
    Type: "CARGO_CONFIG_DATA",
  },
};

export const getAreaMuatData = async (cacheKey) => {
  const params = cacheKey?.split("/")?.[1];
  const searchParams = params
    ? new URLSearchParams(params)
    : new URLSearchParams();

  let result;
  if (useMockData) {
    const searchTerm = searchParams.get("q") || "";
    let filteredProvinces = mockAreaMuatData.data.Data.provinces;

    if (searchTerm) {
      filteredProvinces = filteredProvinces.filter((province) =>
        province.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    result = {
      ...mockAreaMuatData,
      data: {
        ...mockAreaMuatData.data,
        Data: {
          ...mockAreaMuatData.data.Data,
          provinces: filteredProvinces,
          totalProvinces: filteredProvinces.length,
        },
      },
    };
  } else {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    result = await fetcherMuatrans.get(`${URL_AREA_MUAT_DATA}${query}`);
  }

  return {
    provinces: result?.data?.Data?.provinces || [],
    totalProvinces: result?.data?.Data?.totalProvinces || 0,
    raw: result,
  };
};

export const getAreaBongkarData = async (cacheKey) => {
  const params = cacheKey?.split("/")?.[1];
  const searchParams = params
    ? new URLSearchParams(params)
    : new URLSearchParams();

  let result;
  if (useMockData) {
    const searchTerm = searchParams.get("q") || "";
    let filteredProvinces = mockAreaBongkarData.data.Data.provinces;

    if (searchTerm) {
      filteredProvinces = filteredProvinces.filter((province) =>
        province.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    result = {
      ...mockAreaBongkarData,
      data: {
        ...mockAreaBongkarData.data,
        Data: {
          ...mockAreaBongkarData.data.Data,
          provinces: filteredProvinces,
          totalProvinces: filteredProvinces.length,
        },
      },
    };
  } else {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    result = await fetcherMuatrans.get(`${URL_AREA_BONGKAR_DATA}${query}`);
  }

  return {
    provinces: result?.data?.Data?.provinces || [],
    totalProvinces: result?.data?.Data?.totalProvinces || 0,
    raw: result,
  };
};

export const getTransporterCargoStatus = async (cacheKey) => {
  const id = cacheKey?.split("/")?.[1];
  let result;

  if (useMockData) {
    result = mockCargoStatusResult;
  } else {
    result = await fetcherMuatrans.get(
      `${URL_TRANSPORTER_CARGO_CONFIG_STATUS}/${id}`
    );
  }

  return result?.data?.Data || {};
};

export const getTransporterCargoConfig = async (cacheKey) => {
  const parts = cacheKey.split("?");
  const id = parts[0].split("/")[1];
  const query = parts[1] ? `?${parts[1]}` : "";

  let result;
  if (useMockData) {
    result = mockCargoConfigResult;
  } else {
    result = await fetcherMuatrans.get(
      `${URL_TRANSPORTER_CARGO_CONFIG}/${id}${query}`
    );
  }

  return result?.data?.Data || {};
};

export const useGetAreaMuatData = (params) => {
  const paramsString = params ? new URLSearchParams(params).toString() : "";
  const { data, error, isLoading } = useSWR(
    `getAreaMuatData/${paramsString}`,
    getAreaMuatData
  );
  return {
    provinces: data?.provinces || [],
    totalProvinces: data?.totalProvinces || 0,
    raw: data?.raw,
    isLoading,
    isError: !!error,
  };
};

export const useGetAreaBongkarData = (params) => {
  const paramsString = params ? new URLSearchParams(params).toString() : "";
  const { data, error, isLoading } = useSWR(
    `getAreaBongkarData/${paramsString}`,
    getAreaBongkarData
  );
  return {
    provinces: data?.provinces || [],
    totalProvinces: data?.totalProvinces || 0,
    raw: data?.raw,
    isLoading,
    isError: !!error,
  };
};

export const useGetTransporterCargoStatus = (id, options = {}) => {
  const cacheKey = id ? `getTransporterCargoStatus/${id}` : null;
  return useSWR(cacheKey, getTransporterCargoStatus, options);
};

export const useGetTransporterCargoConfig = (id, params = {}, options = {}) => {
  // Construct the query parameters string.
  const queryParams = new URLSearchParams(params).toString();

  // Conditionally create the cache key. If 'id' is falsy, the key will be null.
  // SWR will not start a request if the key is null.
  const cacheKey = id
    ? `getTransporterCargoConfig/${id}${queryParams ? `?${queryParams}` : ""}`
    : null;

  // Call useSWR unconditionally, respecting the Rules of Hooks.
  return useSWR(cacheKey, getTransporterCargoConfig, options);
};
