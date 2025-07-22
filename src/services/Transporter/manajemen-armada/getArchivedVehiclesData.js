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
          id: "vhc-011",
          photoUrl: "/img/mock-armada/two.png",
          licensePlate: "B 1234 ABC",
          truckType: {
            id: "tt-001",
            name: "Truk Besar",
          },
          carrierType: {
            id: "ct-001",
            name: "Box",
          },
          vehicleBrand: {
            id: "vb-001",
            name: "Hino",
          },
          vehicleType: {
            id: "vt-001",
            name: "Hino Dutro",
          },
          status: "DELETED",
          warningDocumentExpired: true,
          pendingUpdateDriver: true,
        },
        {
          id: "vhc-012",
          photoUrl: "/img/mock-armada/one.png",
          licensePlate: "B 4567 RST",
          truckType: {
            id: "tt-002",
            name: "Truk Sedang",
          },
          carrierType: {
            id: "ct-003",
            name: "Pick Up",
          },
          vehicleBrand: {
            id: "vb-003",
            name: "Isuzu",
          },
          vehicleType: {
            id: "vt-003",
            name: "Isuzu Elf",
          },
          status: "DELETED",
          warningDocumentExpired: false,
          pendingUpdateDriver: false,
        },
        {
          id: "vhc-013",
          photoUrl: "/img/mock-armada/three.png",
          licensePlate: "B 8901 UVW",
          truckType: {
            id: "tt-001",
            name: "Truk Besar",
          },
          carrierType: {
            id: "ct-002",
            name: "Flatbed",
          },
          vehicleBrand: {
            id: "vb-002",
            name: "Mitsubishi",
          },
          vehicleType: {
            id: "vt-002",
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
        totalItems: 3,
        totalPages: 1,
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
