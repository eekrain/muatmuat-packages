import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const isMockActiveVehicles = false;

const apiResultActiveVehicles = {
  data: {
    Message: {
      Code: 200,
      Text: "Daftar armada aktif berhasil diambil",
    },
    Data: {
      vehicles: [
        {
          id: "vhc-001",
          photoUrl: "/img/mock-armada/one.png",
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
          assignedDriver: {
            id: "drv-001",
            fullName: "Raden Cakradana Ardhanurahman Yudhatama",
            whatsappNumber: "081234567890",
          },
          status: "ON_DUTY",
          warningDocumentExpired: true,
          pendingUpdateDriver: true,
        },
        {
          id: "vhc-002",
          photoUrl: "/img/mock-armada/two.png",
          licensePlate: "B 5678 DEF",
          truckType: {
            id: "tt-002",
            name: "Truk Sedang",
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
          assignedDriver: {
            id: "drv-002",
            fullName: "Sonya Putri Safira",
            whatsappNumber: "081234567891",
          },
          status: "WAITING_LOADING_TIME",
          warningDocumentExpired: false,
          pendingUpdateDriver: false,
        },
        {
          id: "vhc-003",
          photoUrl: "/img/mock-armada/three.png",
          licensePlate: "B 9012 GHI",
          truckType: {
            id: "tt-003",
            name: "Truk Kecil",
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
          assignedDriver: {
            id: "drv-003",
            fullName: "Bob Johnson",
            whatsappNumber: "081234567892",
          },
          status: "READY_FOR_ORDER",
          warningDocumentExpired: false,
          pendingUpdateDriver: true,
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        totalItems: 3,
        totalPages: 1,
      },
      summary: {
        totalActive: 25,
        onDuty: 8,
        waitingLoadingTime: 5,
        readyToReceiveOrder: 12,
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
        status: [
          { id: "ON_DUTY", value: "Bertugas" },
          { id: "WAITING_LOADING_TIME", value: "Akan Muat Hari Ini" },
          { id: "READY_FOR_ORDER", value: "Siap Menerima Order" },
        ],
      },
    },
    Type: "ACTIVE_VEHICLES_LIST",
  },
};

export const fetcherActiveVehicles = async (cacheKey) => {
  // Extract query string from cache key
  const queryString = cacheKey.includes("?") ? cacheKey.split("?")[1] : "";
  const url = queryString
    ? `v1/vehicles/active?${queryString}`
    : "v1/vehicles/active";

  if (isMockActiveVehicles) {
    const result = apiResultActiveVehicles;
    return result.data.Data;
  }

  const result = await fetcherMuatrans.get(url);
  return result?.data?.Data || {};
};

export const useGetActiveVehiclesData = (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const cacheKey = `active-vehicles${queryParams ? `?${queryParams}` : ""}`;

  return useSWR(cacheKey, fetcherActiveVehicles);
};
