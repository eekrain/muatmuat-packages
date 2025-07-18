import useSWR from "swr";

// import { fetcherMuatrans } from "@/lib/axios";

const apiResultProcessVehicles = {
  data: {
    Message: {
      Code: 200,
      Text: "Daftar armada dalam proses berhasil diambil",
    },
    Data: {
      vehicles: [
        {
          id: "550e8400-e29b-41d4-a716-446655440020",
          photoUrl: "https://picsum.photos/300/300",
          licensePlate: "L 9812 KS",
          truckType: {
            id: "550e8400-e29b-41d4-a716-446655440001",
            name: "Medium Truk 6x2",
          },
          carrierType: {
            id: "550e8400-e29b-41d4-a716-446655440001",
            name: "Tangki",
          },
          vehicleBrand: {
            id: "550e8400-e29b-41d4-a716-446655440002",
            name: "Hino",
          },
          vehicleType: {
            id: "550e8400-e29b-41d4-a716-446655440003",
            name: "136 HDL 6x2",
          },
          assignedDriver: null,
          status: "DALAM_TINJAUAN",
          warningDocumentExpired: false,
          pendingUpdateDriver: false,
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440021",
          photoUrl: "https://picsum.photos/300/300",
          licensePlate: "L 8310 SH",
          truckType: {
            id: "550e8400-e29b-41d4-a716-446655440002",
            name: "Colt Diesel Double",
          },
          carrierType: {
            id: "550e8400-e29b-41d4-a716-446655440002",
            name: "Dump",
          },
          vehicleBrand: {
            id: "550e8400-e29b-41d4-a716-446655440001",
            name: "Mitsubishi Fuso",
          },
          vehicleType: {
            id: "550e8400-e29b-41d4-a716-446655440001",
            name: "Canter 74 HD",
          },
          assignedDriver: null,
          status: "VERIFIKASI_DITOLAK",
          warningDocumentExpired: false,
          pendingUpdateDriver: false,
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440022",
          photoUrl: "https://picsum.photos/300/300",
          licensePlate: "L 9812 KS",
          truckType: {
            id: "550e8400-e29b-41d4-a716-446655440001",
            name: "Medium Truk 6x2",
          },
          carrierType: {
            id: "550e8400-e29b-41d4-a716-446655440001",
            name: "Tangki",
          },
          vehicleBrand: {
            id: "550e8400-e29b-41d4-a716-446655440002",
            name: "Hino",
          },
          vehicleType: {
            id: "550e8400-e29b-41d4-a716-446655440003",
            name: "136 HDL 6x2",
          },
          assignedDriver: null,
          status: "MENUNGGU_PEMASANGAN_GPS",
          warningDocumentExpired: false,
          pendingUpdateDriver: false,
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440023",
          photoUrl: "https://picsum.photos/300/300",
          licensePlate: "L 8310 SH",
          truckType: {
            id: "550e8400-e29b-41d4-a716-446655440002",
            name: "Colt Diesel Double",
          },
          carrierType: {
            id: "550e8400-e29b-41d4-a716-446655440002",
            name: "Dump",
          },
          vehicleBrand: {
            id: "550e8400-e29b-41d4-a716-446655440001",
            name: "Mitsubishi Fuso",
          },
          vehicleType: {
            id: "550e8400-e29b-41d4-a716-446655440001",
            name: "Canter 74 HD",
          },
          assignedDriver: null,
          status: "PROSES_KALIBRASI",
          warningDocumentExpired: false,
          pendingUpdateDriver: false,
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        totalItems: 10,
        totalPages: 1,
      },
      summary: {
        totalProcess: 10,
        dalamTinjauan: 4,
        verifikasiDitolak: 2,
        menungguPemasanganGPS: 2,
        prosesKalibrasi: 2,
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
          { id: "DALAM_TINJAUAN", value: "Dalam Tinjauan" },
          { id: "VERIFIKASI_DITOLAK", value: "Verifikasi Ditolak" },
          { id: "MENUNGGU_PEMASANGAN_GPS", value: "Menunggu Pemasangan GPS" },
          { id: "PROSES_KALIBRASI", value: "Proses Kalibrasi" },
        ],
      },
    },
    Type: "PROCESS_VEHICLES_LIST",
  },
};

export const fetcherProcessVehicles = async (cacheKey) => {
  // const result = await fetcherMuatrans.get(`v1/transporter/vehicles/process`);
  // return result?.data?.Data || {};

  const result = apiResultProcessVehicles;
  return result.data.Data;
};

export const useGetProcessVehiclesData = (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const cacheKey = `process-vehicles${queryParams ? `?${queryParams}` : ""}`;

  return useSWR(cacheKey, fetcherProcessVehicles);
};
