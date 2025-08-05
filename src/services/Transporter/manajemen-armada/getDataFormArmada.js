import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true; // toggle mock data

// Endpoint constants
export const URL_JENIS_TRUK = "/v1/master/truck-types";
export const URL_TYPE_CARRIER = "/v1/master/carrier-types";
export const URL_BRANDS_VEHICLES = "/v1/master/vehicle-brands";
export const URL_VEHICLES_TYPES = "/v1/master/vehicle-types";
export const URL_VEHICLES_EXAMPLE_PHOTO = "/v1/examples/vehicle-photos";
export const URL_VEHICLES_DOCUMENT_EXAMPLE = "/v1/examples/vehicle-documents";

// Mock API results for development/testing
export const mockJenisTruk = {
  data: {
    Message: {
      Code: 200,
      Text: "Data jenis truk berhasil diambil",
    },
    Data: {
      truckTypes: [
        {
          id: "550e8400-e29b-41d4-a716-446655440000",
          name: "Colt Diesel Double",
          icon: "/img/mock-add-armada/truck/colt.png",
        },
        {
          id: "550e8400-e29b-41d3-a716-446655440000",
          name: "Tractor Head 4x2",
          icon: "/img/mock-add-armada/truck/tractor.png",
        },
      ],
    },
    Type: "TRUCK_TYPES_LIST",
  },
};

export const mockTypeCarrier = {
  data: {
    Message: {
      Code: 200,
      Text: "Data jenis carrier berhasil diambil",
    },
    Data: {
      carrierTypes: [
        // Carriers for Colt Diesel Double (550e8400-e29b-41d4-a716-446655440000)
        {
          id: "550e8400-e29b-41d4-a716-446655440001",
          name: "Box",
          icon: "/img/mock-add-armada/carrier/box.png",
          truckTypeId: "550e8400-e29b-41d4-a716-446655440000",
        },
        {
          id: "550e8400-e29b-41d3-a716-446655440001",
          name: "Flatbed",
          icon: "/img/mock-add-armada/carrier/flatbed.png",
          truckTypeId: "550e8400-e29b-41d4-a716-446655440000",
        },
        // Carriers for Tractor Head 4x2 (550e8400-e29b-41d3-a716-446655440000)
        {
          id: "550e8400-e29b-41d4-a716-446655440002",
          name: "Container",
          icon: "/img/mock-add-armada/carrier/container.png",
          truckTypeId: "550e8400-e29b-41d3-a716-446655440000",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440003",
          name: "Low Bed",
          icon: "/img/mock-add-armada/carrier/lowbed.png",
          truckTypeId: "550e8400-e29b-41d3-a716-446655440000",
        },
      ],
    },
    Type: "CARRIER_TYPES_LIST",
  },
};

export const mockBrandsVehicles = {
  data: {
    Message: {
      Code: 200,
      Text: "Data merek kendaraan berhasil diambil",
    },
    Data: {
      vehicleBrands: [
        {
          id: "550e8400-e29b-41d4-a716-446655440002",
          name: "Hino",
          description: "Merek kendaraan Hino",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440006",
          name: "Mitsubishi Fuso",
          description: "Merek kendaraan Mitsubishi Fuso",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440007",
          name: "Isuzu",
          description: "Merek kendaraan Isuzu",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440012",
          name: "Toyota",
          description: "Merek kendaraan Toyota",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440013",
          name: "Daihatsu",
          description: "Merek kendaraan Daihatsu",
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        totalItems: 5,
        totalPages: 1,
      },
    },
    Type: "VEHICLE_BRANDS_LIST",
  },
};

export const mockVehiclesTypes = {
  data: {
    Message: {
      Code: 200,
      Text: "Data tipe kendaraan berhasil diambil",
    },
    Data: {
      vehicleTypes: [
        // Types for Hino (550e8400-e29b-41d4-a716-446655440002)
        {
          id: "550e8400-e29b-41d4-a716-446655440003",
          name: "Hino Dutro",
          description: "Tipe kendaraan Hino Dutro",
          vehicleBrandId: "550e8400-e29b-41d4-a716-446655440002",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440004",
          name: "Hino Ranger",
          description: "Tipe kendaraan Hino Ranger",
          vehicleBrandId: "550e8400-e29b-41d4-a716-446655440002",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440005",
          name: "Hino 500 Series",
          description: "Tipe kendaraan Hino 500 Series",
          vehicleBrandId: "550e8400-e29b-41d4-a716-446655440002",
        },
        // Types for Mitsubishi Fuso (550e8400-e29b-41d4-a716-446655440006)
        {
          id: "550e8400-e29b-41d4-a716-446655440008",
          name: "Canter",
          description: "Tipe kendaraan Mitsubishi Canter",
          vehicleBrandId: "550e8400-e29b-41d4-a716-446655440006",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440009",
          name: "Fighter",
          description: "Tipe kendaraan Mitsubishi Fighter",
          vehicleBrandId: "550e8400-e29b-41d4-a716-446655440006",
        },
        // Types for Isuzu (550e8400-e29b-41d4-a716-446655440007)
        {
          id: "550e8400-e29b-41d4-a716-446655440010",
          name: "Elf",
          description: "Tipe kendaraan Isuzu Elf",
          vehicleBrandId: "550e8400-e29b-41d4-a716-446655440007",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440011",
          name: "Giga",
          description: "Tipe kendaraan Isuzu Giga",
          vehicleBrandId: "550e8400-e29b-41d4-a716-446655440007",
        },
        // Types for Toyota (550e8400-e29b-41d4-a716-446655440012)
        {
          id: "550e8400-e29b-41d4-a716-446655440014",
          name: "Dyna",
          description: "Tipe kendaraan Toyota Dyna",
          vehicleBrandId: "550e8400-e29b-41d4-a716-446655440012",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440015",
          name: "Hiace",
          description: "Tipe kendaraan Toyota Hiace",
          vehicleBrandId: "550e8400-e29b-41d4-a716-446655440012",
        },
        // Types for Daihatsu (550e8400-e29b-41d4-a716-446655440013)
        {
          id: "550e8400-e29b-41d4-a716-446655440016",
          name: "Gran Max",
          description: "Tipe kendaraan Daihatsu Gran Max",
          vehicleBrandId: "550e8400-e29b-41d4-a716-446655440013",
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        totalItems: 10,
        totalPages: 1,
      },
    },
    Type: "VEHICLE_TYPES_LIST",
  },
};

export const mockVehiclesExamplePhoto = {
  data: {
    Message: {
      Code: 200,
      Text: "Contoh foto armada berhasil diambil",
    },
    Data: {
      examples: [
        {
          photoType: "FRONT",
          photoUrl: "/img/depan.png",
          description: "Contoh foto armada dari depan",
        },
        {
          photoType: "BACK",
          photoUrl: "/img/belakang.png",
          description: "Contoh foto armada dari belakang",
        },
        {
          photoType: "LEFT",
          photoUrl: "/img/kiri.png",
          description: "Contoh foto armada dari kiri",
        },
        {
          photoType: "RIGHT",
          photoUrl: "/img/kanan.png",
          description: "Contoh foto armada dari kanan",
        },
      ],
    },
    Type: "VEHICLE_PHOTO_EXAMPLES",
  },
};

export const mockVehiclesDocumentExample = {
  data: {
    Message: {
      Code: 200,
      Text: "Contoh dokumen armada berhasil diambil",
    },
    Data: {
      examples: [
        {
          documentType: "STNK",
          documentUrl: "https://cdn.muatrans.com/examples/stnk-example.pdf",
          description: "Contoh dokumen STNK kendaraan",
        },
        {
          documentType: "VEHICLE_TAX",
          documentUrl: "https://cdn.muatrans.com/examples/tax-example.pdf",
          description: "Contoh dokumen pajak kendaraan",
        },
        {
          documentType: "KIR",
          documentUrl: "https://cdn.muatrans.com/examples/kir-example.pdf",
          description: "Contoh dokumen KIR kendaraan",
        },
      ],
    },
    Type: "VEHICLE_DOCUMENT_EXAMPLES",
  },
};

export const getDataJenisTruk = async (cacheKey) => {
  const params = cacheKey?.split("/")?.[1];

  let result;
  if (useMockData) {
    result = mockJenisTruk;
  } else {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    result = await fetcherMuatrans.get(`${URL_JENIS_TRUK}${query}`);
  }

  return result?.data?.Data?.truckTypes || [];
};

export const getDataTypeCarrier = async (cacheKey) => {
  const params = cacheKey?.split("/")?.[1];
  const searchParams = params
    ? new URLSearchParams(params)
    : new URLSearchParams();
  const truckTypeId = searchParams.get("truckTypeId");

  // Don't fetch if truckTypeId is not provided
  if (!truckTypeId) {
    return [];
  }

  let result;
  if (useMockData) {
    // Filter mock data based on truckTypeId
    const filteredCarriers = mockTypeCarrier.data.Data.carrierTypes.filter(
      (carrier) => carrier.truckTypeId === truckTypeId
    );
    result = {
      ...mockTypeCarrier,
      data: {
        ...mockTypeCarrier.data,
        Data: {
          ...mockTypeCarrier.data.Data,
          carrierTypes: filteredCarriers,
        },
      },
    };
  } else {
    const query = `?${searchParams.toString()}`;
    result = await fetcherMuatrans.get(`${URL_TYPE_CARRIER}${query}`);
  }

  return result?.data?.Data?.carrierTypes || [];
};

export const getBrandsVehicles = async (cacheKey) => {
  const params = cacheKey?.split("/")?.[1];
  const searchParams = params
    ? new URLSearchParams(params)
    : new URLSearchParams();
  const searchTerm = searchParams.get("search") || "";

  let result;
  if (useMockData) {
    // Filter mock data based on search term
    let filteredBrands = mockBrandsVehicles.data.Data.vehicleBrands;

    if (searchTerm) {
      filteredBrands = filteredBrands.filter((brand) =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    result = {
      ...mockBrandsVehicles,
      data: {
        ...mockBrandsVehicles.data,
        Data: {
          ...mockBrandsVehicles.data.Data,
          vehicleBrands: filteredBrands,
          pagination: {
            ...mockBrandsVehicles.data.Data.pagination,
            totalItems: filteredBrands.length,
          },
        },
      },
    };
  } else {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    result = await fetcherMuatrans.get(`${URL_BRANDS_VEHICLES}${query}`);
  }

  return {
    data: result?.data?.Data?.vehicleBrands || [],
    pagination: result?.data?.Data?.pagination,
    raw: result,
  };
};

export const getVehiclesTypes = async (cacheKey) => {
  const params = cacheKey?.split("/")?.[1];
  const searchParams = params
    ? new URLSearchParams(params)
    : new URLSearchParams();
  const vehicleBrandId = searchParams.get("vehicleBrandId");
  const searchTerm = searchParams.get("search") || "";

  // Don't fetch if vehicleBrandId is not provided
  if (!vehicleBrandId) {
    return {
      data: [],
      pagination: null,
      raw: null,
    };
  }

  let result;
  if (useMockData) {
    // Filter mock data based on vehicleBrandId and search term
    let filteredTypes = mockVehiclesTypes.data.Data.vehicleTypes.filter(
      (type) => type.vehicleBrandId === vehicleBrandId
    );

    if (searchTerm) {
      filteredTypes = filteredTypes.filter((type) =>
        type.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    result = {
      ...mockVehiclesTypes,
      data: {
        ...mockVehiclesTypes.data,
        Data: {
          ...mockVehiclesTypes.data.Data,
          vehicleTypes: filteredTypes,
          pagination: {
            ...mockVehiclesTypes.data.Data.pagination,
            totalItems: filteredTypes.length,
          },
        },
      },
    };
  } else {
    const query = `?${searchParams.toString()}`;
    result = await fetcherMuatrans.get(`${URL_VEHICLES_TYPES}${query}`);
  }

  return {
    data: result?.data?.Data?.vehicleTypes || [],
    pagination: result?.data?.Data?.pagination,
    raw: result,
  };
};

export const getVehiclesExamplePhoto = async (cacheKey) => {
  const params = cacheKey?.split("/")?.[1];

  let result;
  if (useMockData) {
    result = mockVehiclesExamplePhoto;
  } else {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    result = await fetcherMuatrans.get(`${URL_VEHICLES_EXAMPLE_PHOTO}${query}`);
  }

  return result?.data?.Data?.examples || [];
};

export const getVehiclesDocumentExample = async (cacheKey) => {
  const params = cacheKey?.split("/")?.[1];

  let result;
  if (useMockData) {
    result = mockVehiclesDocumentExample;
  } else {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    result = await fetcherMuatrans.get(
      `${URL_VEHICLES_DOCUMENT_EXAMPLE}${query}`
    );
  }

  return result?.data?.Data?.examples || [];
};

export const useGetDataJenisTruk = (params) => {
  const paramsString = params ? new URLSearchParams(params).toString() : "";
  const { data, error, isLoading } = useSWR(
    `getDataJenisTruk/${paramsString}`,
    getDataJenisTruk
  );
  return {
    data: data || [],
    isLoading,
    isError: !!error,
  };
};

export const useGetDataTypeCarrier = (params) => {
  const paramsString = params ? new URLSearchParams(params).toString() : "";
  const truckTypeId = params?.truckTypeId;

  // Only fetch when truckTypeId is provided
  const { data, error, isLoading } = useSWR(
    truckTypeId ? `getDataTypeCarrier/${paramsString}` : null,
    getDataTypeCarrier
  );
  return {
    data: data || [],
    isLoading,
    isError: !!error,
  };
};

export const useGetBrandsVehicles = (params) => {
  const paramsString = params ? new URLSearchParams(params).toString() : "";
  const { data, error, isLoading } = useSWR(
    `getBrandsVehicles/${paramsString}`,
    getBrandsVehicles
  );
  return {
    data: data?.data || [],
    pagination: data?.pagination,
    raw: data?.raw,
    isLoading,
    isError: !!error,
  };
};

export const useGetVehiclesTypes = (params) => {
  const paramsString = params ? new URLSearchParams(params).toString() : "";
  const vehicleBrandId = params?.vehicleBrandId;

  // Only fetch when vehicleBrandId is provided
  const { data, error, isLoading } = useSWR(
    vehicleBrandId ? `getVehiclesTypes/${paramsString}` : null,
    getVehiclesTypes
  );
  return {
    data: data?.data || [],
    pagination: data?.pagination,
    raw: data?.raw,
    isLoading,
    isError: !!error,
  };
};

export const useGetVehiclesExamplePhoto = (params) => {
  const paramsString = params ? new URLSearchParams(params).toString() : "";
  const { data, error, isLoading } = useSWR(
    `getVehiclesExamplePhoto/${paramsString}`,
    getVehiclesExamplePhoto
  );
  return {
    data: data || [],
    isLoading,
    isError: !!error,
  };
};

export const useGetVehiclesDocumentExample = (params) => {
  const paramsString = params ? new URLSearchParams(params).toString() : "";
  const { data, error, isLoading } = useSWR(
    `getVehiclesDocumentExample/${paramsString}`,
    getVehiclesDocumentExample
  );
  return {
    data: data || [],
    isLoading,
    isError: !!error,
  };
};

// Mock API result for postNewVehicle
export const mockPostNewVehicleResult = {
  Message: {
    Code: 201,
    Text: "Armada berhasil ditambahkan",
  },
  Data: {
    vehicleId: "550e8400-e29b-41d4-a716-446655440099",
    status: "PENDING_APPROVAL",
    createdAt: new Date().toISOString(),
  },
  Type: "NEW_VEHICLE_CREATED",
};

/**
 * Menyimpan data armada baru ke database.
 * @param {Object} data - Data armada baru sesuai spesifikasi API.
 * @param {string} token - JWT token untuk autentikasi (Bearer).
 * @returns {Promise<Object>} Response dari API.
 */
export async function postNewVehicle(data, token) {
  if (useMockData) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return mockPostNewVehicleResult;
  }

  const res = await fetch("/v1/vehicles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}
