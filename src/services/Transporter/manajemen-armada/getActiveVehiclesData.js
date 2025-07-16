import useSWR from "swr";

// import { fetcherMuatrans } from "@/lib/axios";

const apiResultActiveVehicles = {
  data: {
    Message: {
      Code: 200,
      Text: "Daftar armada aktif berhasil diambil",
    },
    Data: {
      vehicles: [
        {
          id: "550e8400-e29b-41d4-a716-446655440011",
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
          assignedDriver: {
            id: "550e8400-e29b-41d4-a716-446655440012",
            fullName: "John Doe",
            whatsappNumber: "081234567890",
          },
          status: "ACTIVE",
          warningDocumentExpired: true,
          pendingUpdateDriver: true,
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440022",
          photoUrl: "https://picsum.photos/300/300",
          licensePlate: "B 5678 DEF",
          truckType: {
            id: "550e8400-e29b-41d4-a716-446655440000",
            name: "Truk Sedang",
          },
          carrierType: {
            id: "550e8400-e29b-41d4-a716-446655440001",
            name: "Flatbed",
          },
          vehicleBrand: {
            id: "550e8400-e29b-41d4-a716-446655440002",
            name: "Mitsubishi",
          },
          vehicleType: {
            id: "550e8400-e29b-41d4-a716-446655440003",
            name: "Mitsubishi Canter",
          },
          assignedDriver: {
            id: "550e8400-e29b-41d4-a716-446655440013",
            fullName: "Jane Smith",
            whatsappNumber: "081234567891",
          },
          status: "ACTIVE",
          warningDocumentExpired: false,
          pendingUpdateDriver: false,
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440033",
          photoUrl: "https://picsum.photos/300/300",
          licensePlate: "B 9012 GHI",
          truckType: {
            id: "550e8400-e29b-41d4-a716-446655440000",
            name: "Truk Kecil",
          },
          carrierType: {
            id: "550e8400-e29b-41d4-a716-446655440001",
            name: "Pick Up",
          },
          vehicleBrand: {
            id: "550e8400-e29b-41d4-a716-446655440002",
            name: "Isuzu",
          },
          vehicleType: {
            id: "550e8400-e29b-41d4-a716-446655440003",
            name: "Isuzu Elf",
          },
          assignedDriver: {
            id: "550e8400-e29b-41d4-a716-446655440014",
            fullName: "Bob Johnson",
            whatsappNumber: "081234567892",
          },
          status: "ACTIVE",
          warningDocumentExpired: false,
          pendingUpdateDriver: true,
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        totalItems: 25,
        totalPages: 3,
      },
      summary: {
        totalActive: 25,
        onDuty: 8,
        waitingLoadingTime: 5,
        readyToReceiveOrder: 12,
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
        status: [
          { id: "ACTIVE", value: "Aktif" },
          { id: "INACTIVE", value: "Tidak Aktif" },
          { id: "MAINTENANCE", value: "Maintenance" },
        ],
      },
    },
    Type: "ACTIVE_VEHICLES_LIST",
  },
};

export const fetcherActiveVehicles = async (cacheKey) => {
  // const result = await fetcherMuatrans.get(`v1/transporter/vehicles/active`);
  // return result?.data?.Data || {};

  const result = apiResultActiveVehicles;
  return result.data.Data;
};

export const useGetActiveVehiclesData = (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const cacheKey = `active-vehicles${queryParams ? `?${queryParams}` : ""}`;

  return useSWR(cacheKey, fetcherActiveVehicles);
};
