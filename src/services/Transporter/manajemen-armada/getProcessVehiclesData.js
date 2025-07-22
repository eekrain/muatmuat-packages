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
          id: "vhc-007",
          photoUrl: "/img/mock-armada/three.png",
          licensePlate: "L 9812 KS",
          truckType: {
            id: "tt-002",
            name: "Medium Truk 6x2",
          },
          carrierType: {
            id: "ct-004",
            name: "Tangki",
          },
          vehicleBrand: {
            id: "vb-001",
            name: "Hino",
          },
          vehicleType: {
            id: "vt-004",
            name: "136 HDL 6x2",
          },
          assignedDriver: null,
          status: "DALAM_TINJAUAN",
          warningDocumentExpired: false,
          pendingUpdateDriver: false,
        },
        {
          id: "vhc-008",
          photoUrl: "/img/mock-armada/one.png",
          licensePlate: "L 8310 SH",
          truckType: {
            id: "tt-003",
            name: "Colt Diesel Double",
          },
          carrierType: {
            id: "ct-005",
            name: "Dump",
          },
          vehicleBrand: {
            id: "vb-002",
            name: "Mitsubishi Fuso",
          },
          vehicleType: {
            id: "vt-005",
            name: "Canter 74 HD",
          },
          assignedDriver: null,
          status: "VERIFIKASI_DITOLAK",
          warningDocumentExpired: false,
          pendingUpdateDriver: false,
        },
        {
          id: "vhc-009",
          photoUrl: "/img/mock-armada/two.png",
          licensePlate: "L 9812 KS",
          truckType: {
            id: "tt-002",
            name: "Medium Truk 6x2",
          },
          carrierType: {
            id: "ct-004",
            name: "Tangki",
          },
          vehicleBrand: {
            id: "vb-001",
            name: "Hino",
          },
          vehicleType: {
            id: "vt-004",
            name: "136 HDL 6x2",
          },
          assignedDriver: null,
          status: "MENUNGGU_PEMASANGAN_GPS",
          warningDocumentExpired: false,
          pendingUpdateDriver: false,
        },
        {
          id: "vhc-010",
          photoUrl: "/img/mock-armada/three.png",
          licensePlate: "L 8310 SH",
          truckType: {
            id: "tt-003",
            name: "Colt Diesel Double",
          },
          carrierType: {
            id: "ct-005",
            name: "Dump",
          },
          vehicleBrand: {
            id: "vb-002",
            name: "Mitsubishi Fuso",
          },
          vehicleType: {
            id: "vt-005",
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
          { id: "tt-001", value: "Truk Besar" },
          { id: "tt-002", value: "Truk Sedang" },
          { id: "tt-003", value: "Truk Kecil" },
        ],
        carrierType: [
          { id: "ct-001", value: "Box" },
          { id: "ct-002", value: "Flatbed" },
          { id: "ct-003", value: "Pick Up" },
          { id: "ct-004", value: "Tangki" },
          { id: "ct-005", value: "Dump" },
        ],
        vehicleBrand: [
          { id: "vb-001", value: "Hino" },
          { id: "vb-002", value: "Mitsubishi" },
          { id: "vb-003", value: "Isuzu" },
        ],
        vehicleType: [
          { id: "vt-001", value: "Hino Dutro" },
          { id: "vt-002", value: "Mitsubishi Canter" },
          { id: "vt-003", value: "Isuzu Elf" },
          { id: "vt-004", value: "136 HDL 6x2" },
          { id: "vt-005", value: "Canter 74 HD" },
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
