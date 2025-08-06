import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true; // toggle mock data

// Endpoint constants
export const URL_AREA_MUAT_DATA = "/v1/area-muat/data";
export const URL_AREA_BONGKAR_DATA = "/v1/area-bongkar/data";

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

// Mock API results for Muatan yang Dilayani
export const mockMuatanDilayaniData = {
  data: {
    Message: {
      Code: 200,
      Text: "Data muatan dilayani berhasil diambil",
    },
    Data: {
      totalMuatan: 3,
      muatanList: [
        {
          id: "1",
          name: "Semen",
        },
        {
          id: "2",
          name: "Pasir",
        },
        {
          id: "3",
          name: "Batu Bara",
        },
      ],
    },
    Type: "GET_MUATAN_DILAYANI_DATA",
  },
};

export const getAreaMuatData = async (cacheKey) => {
  const params = cacheKey?.split("/")?.[1];
  const searchParams = params
    ? new URLSearchParams(params)
    : new URLSearchParams();

  let result;
  if (useMockData) {
    // Filter mock data based on search term
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
    // Filter mock data based on search term
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

export const getMuatanDilayaniData = async (cacheKey) => {
  const params = cacheKey?.split("/")?.[1];
  const searchParams = params
    ? new URLSearchParams(params)
    : new URLSearchParams();

  let result;
  if (useMockData) {
    const searchTerm = searchParams.get("q") || "";
    let filteredMuatan = mockMuatanDilayaniData.data.Data.muatanList;

    if (searchTerm) {
      filteredMuatan = filteredMuatan.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    result = {
      ...mockMuatanDilayaniData,
      data: {
        ...mockMuatanDilayaniData.data,
        Data: {
          ...mockMuatanDilayaniData.data.Data,
          muatanList: filteredMuatan,
          totalMuatan: filteredMuatan.length,
        },
      },
    };
  } else {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    result = await fetcherMuatrans.get(`/v1/muatan-dilayani${query}`);
  }

  return {
    muatan: result?.data?.Data?.muatanList || [],
    totalMuatan: result?.data?.Data?.totalMuatan || 0,
    raw: result,
  };
};

export const useGetMuatanDilayaniData = (params) => {
  const paramsString = params ? new URLSearchParams(params).toString() : "";
  const { data, error, isLoading } = useSWR(
    `getMuatanDilayaniData/${paramsString}`,
    getMuatanDilayaniData
  );

  return {
    muatan: data?.muatan || [],
    totalMuatan: data?.totalMuatan || 0,
    raw: data?.raw,
    isLoading,
    isError: !!error,
  };
};
