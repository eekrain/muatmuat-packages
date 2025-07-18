import useSWR from "swr";

// import { fetcherMuatrans } from "@/lib/axios";

const apiResultArchivedVehicles = {
  data: {
    Message: {
      Code: 200,
      Text: "Daftar armada arsip berhasil diambil",
    },
    Data: {
      hasData: true,
      vehicles: [
        {
          id: "550e8400-e29b-41d4-a716-446655440018",
          photoUrl: "https://picsum.photos/300/300",
          licensePlate: "B 1234 ABC",
          truckType: {
            id: "550e8400-e29b-41d4-a716-446655440000",
            name: "Truk Besar",
          },
          carrierType: {
            id: "550e8400-e29b-41d4-a716-446655440001",
            name: "Box",
          },
          vehicleBrand: {
            id: "550e8400-e29b-41d4-a716-446655440002",
            name: "Hino",
          },
          vehicleType: {
            id: "550e8400-e29b-41d4-a716-446655440003",
            name: "Hino Dutro",
          },
          status: "DELETED",
          warningDocumentExpired: true,
          pendingUpdateDriver: true,
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440019",
          photoUrl: "https://picsum.photos/300/300",
          licensePlate: "B 4567 RST",
          truckType: {
            id: "550e8400-e29b-41d4-a716-446655440001",
            name: "Truk Sedang",
          },
          carrierType: {
            id: "550e8400-e29b-41d4-a716-446655440002",
            name: "Pick Up",
          },
          vehicleBrand: {
            id: "550e8400-e29b-41d4-a716-446655440002",
            name: "Isuzu",
          },
          vehicleType: {
            id: "550e8400-e29b-41d4-a716-446655440002",
            name: "Isuzu Elf",
          },
          status: "DELETED",
          warningDocumentExpired: false,
          pendingUpdateDriver: false,
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440020",
          photoUrl: "https://picsum.photos/300/300",
          licensePlate: "B 8901 UVW",
          truckType: {
            id: "550e8400-e29b-41d4-a716-446655440000",
            name: "Truk Besar",
          },
          carrierType: {
            id: "550e8400-e29b-41d4-a716-446655440001",
            name: "Flatbed",
          },
          vehicleBrand: {
            id: "550e8400-e29b-41d4-a716-446655440001",
            name: "Mitsubishi",
          },
          vehicleType: {
            id: "550e8400-e29b-41d4-a716-446655440001",
            name: "Mitsubishi Canter",
          },
          status: "DELETED",
          warningDocumentExpired: false,
          pendingUpdateDriver: false,
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 1,
      },
      dataFilter: {
        truckType: [
          { id: "550e8400-e29b-41d4-a716-446655440000", value: "Truk Besar" },
          { id: "550e8400-e29b-41d4-a716-446655440001", value: "Truk Sedang" },
          { id: "550e8400-e29b-41d4-a716-446655440002", value: "Truk Kecil" },
        ],
        carrierType: [
          { id: "550e8400-e29b-41d4-a716-446655440000", value: "Box" },
          { id: "550e8400-e29b-41d4-a716-446655440001", value: "Flatbed" },
          { id: "550e8400-e29b-41d4-a716-446655440002", value: "Pick Up" },
        ],
        vehicleBrand: [
          { id: "550e8400-e29b-41d4-a716-446655440000", value: "Hino" },
          { id: "550e8400-e29b-41d4-a716-446655440001", value: "Mitsubishi" },
          { id: "550e8400-e29b-41d4-a716-446655440002", value: "Isuzu" },
        ],
        vehicleType: [
          { id: "550e8400-e29b-41d4-a716-446655440000", value: "Hino Dutro" },
          {
            id: "550e8400-e29b-41d4-a716-446655440001",
            value: "Mitsubishi Canter",
          },
          { id: "550e8400-e29b-41d4-a716-446655440002", value: "Isuzu Elf" },
        ],
        status: [{ id: "DELETED", value: "Dihapus" }],
      },
    },
    Type: "ARCHIVED_VEHICLES_LIST",
  },
};

export const fetcherArchivedVehicles = async (cacheKey) => {
  // const result = await fetcherMuatrans.get(`v1/transporter/vehicles/archived`);
  // return result?.data?.Data || {};

  const result = apiResultArchivedVehicles;
  return result.data.Data;
};

export const useGetArchivedVehiclesData = (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const cacheKey = `archived-vehicles${queryParams ? `?${queryParams}` : ""}`;

  return useSWR(cacheKey, fetcherArchivedVehicles);
};
