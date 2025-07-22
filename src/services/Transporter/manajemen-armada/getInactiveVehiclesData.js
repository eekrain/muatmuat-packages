import useSWR from "swr";

// import { fetcherMuatrans } from "@/lib/axios";

const apiResultInactiveVehicles = {
  data: {
    Message: {
      Code: 200,
      Text: "Daftar armada nonaktif berhasil diambil",
    },
    Data: {
      vehicles: [
        {
          id: "vhc-004",
          photoUrl: "/img/mock-armada/two.png",
          licensePlate: "B 9876 XYZ",
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
          assignedDriver: null,
          status: "UNPAIRED",
          warningDocumentExpired: false,
          pendingUpdateDriver: false,
        },
        {
          id: "vhc-005",
          photoUrl: "/img/mock-armada/three.png",
          licensePlate: "B 5432 LMN",
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
          assignedDriver: {
            id: "drv-004",
            fullName: "Raden Cakradana Ardhanurahman Yudhatama",
            whatsappNumber: "081234567890",
          },
          status: "INACTIVE",
          warningDocumentExpired: true,
          pendingUpdateDriver: false,
        },
        {
          id: "vhc-006",
          photoUrl: "/img/mock-armada/one.png",
          licensePlate: "B 7890 OPQ",
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
          assignedDriver: null,
          status: "INACTIVE",
          warningDocumentExpired: false,
          pendingUpdateDriver: false,
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        totalItems: 8,
        totalPages: 1,
      },
      summary: {
        totalInactive: 8,
        unpaired: 5,
        inactive: 3,
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
          { id: "UNPAIRED", value: "Belum Dipasangkan" },
          { id: "INACTIVE", value: "Nonaktif" },
        ],
      },
    },
    Type: "INACTIVE_VEHICLES_LIST",
  },
};

export const fetcherInactiveVehicles = async (cacheKey) => {
  // const result = await fetcherMuatrans.get(`v1/transporter/vehicles/inactive`);
  // return result?.data?.Data || {};

  const result = apiResultInactiveVehicles;
  return result.data.Data;
};

export const useGetInactiveVehiclesData = (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const cacheKey = `inactive-vehicles${queryParams ? `?${queryParams}` : ""}`;

  return useSWR(cacheKey, fetcherInactiveVehicles);
};
