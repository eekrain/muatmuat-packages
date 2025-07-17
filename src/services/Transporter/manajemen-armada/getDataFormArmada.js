import useSWR from "swr";

// import fetcherMuatrans from "@/lib/axios"; // Uncomment this when using real API

// Endpoint constants
export const URL_JENIS_TRUK = "/v1/master/truck-types";
export const URL_TYPE_CARRIER = "/v1/master/carrier-types";
export const URL_BRANDS_VEHICLES = "/v1/master/vehicle-brands";
export const URL_VEHICLES_TYPES = "/v1/master/vehicle-types";
export const URL_VEHICLES_EXAMPLE_PHOTO = "/v1/examples/vehicle-photos";

// Mock data fallback
const mockJenisTruk = {
  data: {
    Message: {
      Code: 200,
      Text: "Data jenis truk berhasil diambil",
    },
    Data: {
      truckTypes: [
        {
          id: "550e8400-e29b-41d4-a716-446655440000",
          name: "Truk Besar",
          icon: "url",
        },
        {
          id: "550e8400-e29b-41d3-a716-446655440000",
          name: "Truk Kecil",
          icon: "url",
        },
      ],
    },
    Type: "TRUCK_TYPES_LIST",
  },
};

const mockTypeCarrier = {
  data: {
    Message: {
      Code: 200,
      Text: "Data jenis carrier berhasil diambil",
    },
    Data: {
      carrierTypes: [
        {
          id: "550e8400-e29b-41d4-a716-446655440001",
          name: "Box",
          icon: "url",
          truckTypeId: "550e8400-e29b-41d4-a716-446655440000",
        },
      ],
    },
    Type: "CARRIER_TYPES_LIST",
  },
};

const mockBrandsVehicles = {
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
      ],
      pagination: {
        page: 1,
        limit: 10,
        totalItems: 8,
        totalPages: 1,
      },
    },
    Type: "VEHICLE_BRANDS_LIST",
  },
};

const mockVehiclesTypes = {
  data: {
    Message: {
      Code: 200,
      Text: "Data tipe kendaraan berhasil diambil",
    },
    Data: {
      vehicleTypes: [
        {
          id: "550e8400-e29b-41d4-a716-446655440003",
          name: "Hino Dutro",
          description: "Tipe kendaraan Hino Dutro",
          vehicleBrandId: "550e8400-e29b-41d4-a716-446655440002",
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        totalItems: 4,
        totalPages: 1,
      },
    },
    Type: "VEHICLE_TYPES_LIST",
  },
};

const mockVehiclesExamplePhoto = {
  data: {
    Message: {
      Code: 200,
      Text: "Contoh foto armada berhasil diambil",
    },
    Data: {
      examples: [
        {
          photoType: "FRONT",
          photoUrl: "https://cdn.muatrans.com/examples/vehicle-front.jpg",
          description: "Contoh foto armada dari depan",
        },
        {
          photoType: "BACK",
          photoUrl: "https://cdn.muatrans.com/examples/vehicle-back.jpg",
          description: "Contoh foto armada dari belakang",
        },
        {
          photoType: "LEFT",
          photoUrl: "https://cdn.muatrans.com/examples/vehicle-left.jpg",
          description: "Contoh foto armada dari kiri",
        },
        {
          photoType: "RIGHT",
          photoUrl: "https://cdn.muatrans.com/examples/vehicle-right.jpg",
          description: "Contoh foto armada dari kanan",
        },
      ],
    },
    Type: "VEHICLE_PHOTO_EXAMPLES",
  },
};

function buildQueryString(params) {
  if (!params) return "";
  const esc = encodeURIComponent;
  const query = Object.entries(params)
    .filter(([_, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${esc(k)}=${esc(v)}`)
    .join("&");
  return query ? `?${query}` : "";
}

// --- FETCHER API EXAMPLE (uncomment when API ready) ---
// export const fetcherJenisTruk = async (url) => {
//   const result = await fetcherMuatrans.get(url);
//   return result?.data;
// };
//
// export const fetcherTypeCarrier = async (url) => {
//   const result = await fetcherMuatrans.get(url);
//   return result?.data;
// };
//
// export const fetcherBrandsVehicles = async (url) => {
//   const result = await fetcherMuatrans.get(url);
//   return result?.data;
// };
//
// export const fetcherVehiclesTypes = async (url) => {
//   const result = await fetcherMuatrans.get(url);
//   return result?.data;
// };
//
// export const fetcherVehiclesExamplePhoto = async (url) => {
//   const result = await fetcherMuatrans.get(url);
//   return result?.data;
// };

const fetcher = async (url) => {
  if (url.startsWith(URL_JENIS_TRUK)) return mockJenisTruk;
  if (url.startsWith(URL_TYPE_CARRIER)) return mockTypeCarrier;
  if (url.startsWith(URL_BRANDS_VEHICLES)) return mockBrandsVehicles;
  if (url.startsWith(URL_VEHICLES_TYPES)) return mockVehiclesTypes;
  if (url.startsWith(URL_VEHICLES_EXAMPLE_PHOTO))
    return mockVehiclesExamplePhoto;
  throw new Error("Unknown endpoint");
};

export function useGetDataJenisTruk(params) {
  const endpoint = URL_JENIS_TRUK + buildQueryString(params);
  // SWR with mock fetcher (replace with fetcherJenisTruk for real API)
  // return useSWR(endpoint, fetcherJenisTruk);
  const { data, error, isLoading } = useSWR(endpoint, fetcher);
  return {
    data: data?.data?.Data?.truckTypes || [],
    raw: data,
    isLoading,
    isError: !!error,
  };
}

export function useGetDataTypeCarrier(params) {
  const endpoint = URL_TYPE_CARRIER + buildQueryString(params);
  // return useSWR(endpoint, fetcherTypeCarrier);
  const { data, error, isLoading } = useSWR(endpoint, fetcher);
  return {
    data: data?.data?.Data?.carrierTypes || [],
    raw: data,
    isLoading,
    isError: !!error,
  };
}

export function useGetBrandsVehicles(params) {
  const endpoint = URL_BRANDS_VEHICLES + buildQueryString(params);
  // return useSWR(endpoint, fetcherBrandsVehicles);
  const { data, error, isLoading } = useSWR(endpoint, fetcher);
  return {
    data: data?.data?.Data?.vehicleBrands || [],
    pagination: data?.data?.Data?.pagination,
    raw: data,
    isLoading,
    isError: !!error,
  };
}

export function useGetVehiclesTypes(params) {
  const endpoint = URL_VEHICLES_TYPES + buildQueryString(params);
  // return useSWR(endpoint, fetcherVehiclesTypes);
  const { data, error, isLoading } = useSWR(endpoint, fetcher);
  return {
    data: data?.data?.Data?.vehicleTypes || [],
    pagination: data?.data?.Data?.pagination,
    raw: data,
    isLoading,
    isError: !!error,
  };
}

export function useGetVehiclesExamplePhoto(params) {
  const endpoint = URL_VEHICLES_EXAMPLE_PHOTO + buildQueryString(params);
  // return useSWR(endpoint, fetcherVehiclesExamplePhoto);
  const { data, error, isLoading } = useSWR(endpoint, fetcher);
  return {
    data: data?.data?.Data?.examples || [],
    raw: data,
    isLoading,
    isError: !!error,
  };
}
