import { fetcherMuatransCS } from "@/lib/fetcherBasicAuth";

const useMockData = true;

const apiResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Fleet vehicles retrieved successfully",
    },
    Data: {
      vehicles: [
        {
          vehicleId: "vehicle-uuid-1",
          licensePlate: "B 1234 XYZ",
          orderStatus: "IN_PROGRESS",
          transporter: {
            id: "uuid-1",
            name: "PT. Siba Surya",
            phone: "021-1234-5678",
          },
          driver: {
            name: "John Doe",
            status: {
              mainStatus: "LOADING",
              subStatus: "MENUJU_KE_LOKASI_MUAT",
              statusName: "Menuju ke Lokasi Muat 1",
            },
          },
          sosStatus: {
            hasSos: true,
            sosId: "sos-uuid-1",
          },
        },
        {
          vehicleId: "vehicle-uuid-2",
          licensePlate: "L5678DEF",
          orderStatus: "IN_PROGRESS",
          transporter: {
            id: "uuid-2",
            name: "PT. Eka Sari Transport",
            phone: "021-9876-5432",
          },
          driver: {
            name: "Siti Rahayu",
            status: {
              mainStatus: "LOADING",
              subStatus: "TIBA_DI_LOKASI_BONGKAR",
              statusName: "Sedang Muat di Lokasi 1",
            },
          },
          sosStatus: {
            hasSos: false,
            sosId: null,
          },
        },
        {
          vehicleId: "vehicle-uuid-3",
          licensePlate: "D9012GHI",
          orderStatus: "IN_PROGRESS",
          transporter: {
            id: "uuid-3",
            name: "PT. Citra Van Titipan Kilat",
            phone: "021-2222-3333",
          },
          driver: {
            name: "Ahmad Fauzi",
            status: {
              mainStatus: "UNLOADING",
              subStatus: "MENUJU_KE_LOKASI_BONGKAR",
              statusName: "Menuju ke Lokasi Bongkar 1",
            },
          },
          sosStatus: {
            hasSos: false,
            sosId: null,
          },
        },
        {
          vehicleId: "vehicle-uuid-4",
          licensePlate: "B5678ABC",
          orderStatus: "IN_PROGRESS",
          transporter: {
            id: "uuid-4",
            name: "PT. Bintang Logistics",
            phone: "021-4444-5555",
          },
          driver: {
            name: "Budi Santoso",
            status: {
              mainStatus: "UNLOADING",
              subStatus: "SEDANG_BONGKAR",
              statusName: "Sedang Bongkar di Lokasi 1",
            },
          },
          sosStatus: {
            hasSos: false,
            sosId: null,
          },
        },
        {
          vehicleId: "vehicle-uuid-5",
          licensePlate: "L9876ZYX",
          orderStatus: "IN_PROGRESS",
          transporter: {
            id: "uuid-5",
            name: "PT. Armada Citra Trans",
            phone: "021-6666-7777",
          },
          driver: {
            name: "Andi Wijaya",
            status: {
              mainStatus: "UNLOADING",
              subStatus: "ANTRI_DI_LOKASI_BONGKAR",
              statusName: "Antri di Lokasi Bongkar",
            },
          },
          sosStatus: {
            hasSos: false,
            sosId: null,
          },
        },
        {
          vehicleId: "vehicle-uuid-6",
          licensePlate: "D4321KLM",
          orderStatus: "IN_PROGRESS",
          transporter: {
            id: "uuid-6",
            name: "PT. Nusantara Ekspres Cargo",
            phone: "021-8888-9999",
          },
          driver: {
            name: "Rizky Pratama",
            status: {
              mainStatus: "UNLOADING",
              subStatus: "TIBA_DI_LOKASI_BONGKAR",
              statusName: "Tiba di Lokasi Bongkar",
            },
          },
          sosStatus: {
            hasSos: false,
            sosId: null,
          },
        },
        {
          vehicleId: "vehicle-uuid-7",
          licensePlate: "B7890PQR",
          orderStatus: "IN_PROGRESS",
          transporter: {
            id: "uuid-7",
            name: "PT. Samudera Raya Transport",
            phone: "021-1111-2222",
          },
          driver: {
            name: "Dedi Kurniawan",
            status: {
              mainStatus: "LOADING",
              subStatus: "ANTRI_DI_LOKASI_MUAT",
              statusName: "Antri di Lokasi Muat",
            },
          },
          sosStatus: {
            hasSos: false,
            sosId: null,
          },
        },
        {
          vehicleId: "vehicle-uuid-8",
          licensePlate: "L3456STU",
          orderStatus: "IN_PROGRESS",
          transporter: {
            id: "uuid-8",
            name: "PT. Mitra Jaya Transport",
            phone: "021-3333-4444",
          },
          driver: {
            name: "Hendra Wijaya",
            status: {
              mainStatus: "LOADING",
              subStatus: "TIBA_DI_LOKASI_MUAT",
              statusName: "Tiba di Lokasi Muat",
            },
          },
          sosStatus: {
            hasSos: true,
            sosId: null,
          },
        },
      ],
    },
    Type: "FLEET_VEHICLES_LIST",
  },
};

export const getOrderFleetVehicles = async (orderId) => {
  if (useMockData) {
    const result = apiResult;
    return result.data.Data;
  }

  const result = await fetcherMuatransCS.get(
    `v1/cs/orders/${orderId}/fleet-vehicles`
  );
  return result?.data?.Data || {};
};
