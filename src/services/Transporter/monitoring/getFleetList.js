import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const isMockFleetList = true;

const apiResultFleetList = {
  Message: {
    Code: 200,
    Text: "Fleet list retrieved successfully",
  },
  Data: {
    fleets: [
      {
        fleetId: "fleet-uuid-5",
        licensePlate: "B7890JKL",
        driver: {
          driverId: "driver-uuid-5",
          name: "Robert Brown",
          phoneNumber: "+628333444555",
        },
        lastLocation: {
          latitude: -6.3972,
          longitude: 106.8249,
          address: {
            district: "Sawangan",
            city: "Depokasdfasdfs",
          },
          lastUpdate: "2025-07-25T11:30:00Z",
        },
        truckType: {
          truckTypeId: "truck-type-uuid-2",
          name: "Box",
        },
        carrierType: {
          carrierId: "carrier-uuid-2",
          name: "Bak Tertutup",
        },
        status: "ON_DUTY",
        isActive: false,
        hasSOSAlert: true,
        detailSOS: {
          sosId: "sos-uuid-2",
          sosCategory: "MECHANICAL_ISSUE",
          description: "Mesin overheating",
          reportAt: "2025-07-25T11:20:00Z",
          completedAt: "2025-07-25T11:20:00Z",
          photos: ["/img/kanan.png", "/img/kiri.png"],
          sosStatus: "NEW",
        },
        needsResponseChange: false,
        activeOrder: {
          orderId: "order-uuid-5",
          orderCode: "ORD-2025-005",
          orderStatus: "INACTIVE",
          pickupLocation: {
            district: "Jl. Merdeka No. 10",
            city: "Tangerang",
          },
          dropoffLocation: {
            district: "Jl. Sudirman No. 15",
            city: "Tangerang",
          },
        },
      },
      {
        fleetId: "fleet-uuid-90",
        licensePlate: "B7890JKL",
        driver: {
          driverId: "driver-uuid-5",
          name: "Robert Brown",
          phoneNumber: "+628333444555",
        },
        lastLocation: {
          latitude: -6.3972,
          longitude: 106.8249,
          address: {
            district: "Sawangan",
            city: "Depokasdfasdfs",
          },
          lastUpdate: "2025-07-25T11:30:00Z",
        },
        truckType: {
          truckTypeId: "truck-type-uuid-2",
          name: "Box",
        },
        carrierType: {
          carrierId: "carrier-uuid-2",
          name: "Bak Tertutup",
        },
        status: "ON_DUTY",
        isActive: false,
        hasSOSAlert: true,
        detailSOS: {
          sosId: "sos-uuid-80",
          sosCategory: null,
          description: null,
          reportAt: "2025-07-25T11:20:00Z",
          photos: ["/img/kanan.png", "/img/kiri.png"],
          sosStatus: "NEW",
        },
        needsResponseChange: false,
        activeOrder: {
          orderId: "order-uuid-5",
          orderCode: "ORD-2025-005",
          orderStatus: "INACTIVE",
          pickupLocation: {
            district: "Jl. Merdeka No. 10",
            city: "Tangerang",
          },
          dropoffLocation: {
            district: "Jl. Sudirman No. 15",
            city: "Tangerang",
          },
        },
      },
      {
        fleetId: "fleet-uuid-1",
        licensePlate: "B1234ABC",
        driver: {
          driverId: "driver-uuid-1",
          name: "John Doe",
          phoneNumber: "+628123456789",
        },
        lastLocation: {
          latitude: -6.2088,
          longitude: 106.8456,
          address: {
            district: "Gubeng",
            city: "Surabaya",
          },
          lastUpdate: "2025-07-25T10:30:00Z",
        },
        truckType: {
          truckTypeId: "truck-type-uuid-1",
          name: "Pickup",
        },
        carrierType: {
          carrierId: "carrier-uuid-1",
          name: "Bak Terbuka",
        },
        status: "ON_DUTY",
        isActive: true,
        hasSOSAlert: false,
        detailSOS: null,
        needsResponseChange: true,
        activeOrder: {
          orderId: "order-uuid-1",
          orderCode: "ORD-2025-001",
          orderStatus: "ON_THE_WAY",
          pickupLocation: {
            district: "Jl. Sudirman No. 1",
            city: "Jakarta Pusat",
          },
          dropoffLocation: {
            district: "Jl. Thamrin No. 5",
            city: "Jakarta Pusat",
          },
        },
      },
      {
        fleetId: "fleet-uuid-2",
        licensePlate: "B5678XYZ",
        driver: {
          driverId: "driver-uuid-2",
          name: "Jane Smith",
          phoneNumber: "+628987654321",
        },
        lastLocation: {
          latitude: -6.9175,
          longitude: 107.6191,
          address: {
            district: "Kiaracondong",
            city: "Bandung",
          },
          lastUpdate: "2025-07-25T11:00:00Z",
        },
        truckType: {
          truckTypeId: "truck-type-uuid-2",
          name: "Box",
        },
        carrierType: {
          carrierId: "carrier-uuid-2",
          name: "Bak Tertutup",
        },
        status: "ON_DUTY",
        isActive: true,
        hasSOSAlert: false,
        detailSOS: {
          sosId: "sos-uuid-90",
          sosCategory: "ACCIDENT",
          description: "Kecelakaan di tol km 23",
          reportAt: "2025-07-25T11:20:00Z",
          completedAt: "2025-07-25T11:20:00Z",
          photos: ["/img/kanan.png", "/img/kiri.png"],
          sosStatus: "ACKNOWLEDGE",
        },
        needsResponseChange: false,
        activeOrder: {
          orderId: "order-uuid-1",
          orderCode: "ORD-2025-001",
          orderStatus: "ON_THE_WAY",
          pickupLocation: {
            district: "Jl. Sudirman No. 1",
            city: "Jakarta Pusat",
          },
          dropoffLocation: {
            district: "Jl. Thamrin No. 5",
            city: "Jakarta Pusat",
          },
        },
      },
      {
        fleetId: "fleet-uuid-3",
        licensePlate: "B9876DEF",
        driver: {
          driverId: null,
          name: null,
          phoneNumber: null,
        },
        lastLocation: {
          latitude: -6.3025,
          longitude: 106.8951,
          address: {
            district: "Cipayung",
            city: "Jakarta Timur",
          },
          lastUpdate: "2025-07-25T09:45:00Z",
        },
        truckType: {
          truckTypeId: "truck-type-uuid-3",
          name: "Tronton",
        },
        carrierType: {
          carrierId: "carrier-uuid-3",
          name: "Container",
        },
        status: "NOT_PAIRED",
        isActive: true,
        hasSOSAlert: false,
        detailSOS: null,
        needsResponseChange: false,
        activeOrder: {
          orderId: "order-uuid-2",
          orderCode: "ORD-2025-002",
          orderStatus: "LOADING",
          pickupLocation: {
            district: "Jl. Gatot Subroto No. 12",
            city: "Jakarta Selatan",
          },
          dropoffLocation: {
            district: "Jl. HR Rasuna Said No. 8",
            city: "Jakarta Selatan",
          },
        },
      },
      {
        fleetId: "fleet-uuid-4",
        licensePlate: "B4321GHI",
        driver: {
          driverId: "driver-uuid-4",
          name: "Sarah Williams",
          phoneNumber: "+628222333444",
        },
        lastLocation: {
          latitude: -6.1753,
          longitude: 106.8266,
          address: {
            district: "Gambir",
            city: "Jakarta Pusat",
          },
          lastUpdate: "2025-07-25T10:15:00Z",
        },
        truckType: {
          truckTypeId: "truck-type-uuid-1",
          name: "Pickup",
        },
        carrierType: {
          carrierId: "carrier-uuid-1",
          name: "Bak Terbuka",
        },
        status: "WAITING_LOADING_TIME",
        isActive: true,
        hasSOSAlert: false,
        detailSOS: null,
        needsResponseChange: false,
        activeOrder: {
          orderId: "order-uuid-3",
          orderCode: "ORD-2025-003",
          orderStatus: "ON_THE_WAY",
          pickupLocation: {
            district: "Jl. MH Thamrin No. 1",
            city: "Jakarta Pusat",
          },
          dropoffLocation: {
            district: "Jl. Jend Sudirman No. 71",
            city: "Jakarta Selatan",
          },
        },
      },
      {
        fleetId: "fleet-uuid-6",
        licensePlate: "B2468MNO",
        driver: {
          driverId: "driver-uuid-6",
          name: "Linda Davis",
          phoneNumber: "+628444555666",
        },
        lastLocation: {
          latitude: -6.2618,
          longitude: 106.8106,
          address: {
            district: "Grogol",
            city: "Jakarta Barat",
          },
          lastUpdate: "2025-07-25T10:00:00Z",
        },
        truckType: {
          truckTypeId: "truck-type-uuid-4",
          name: "Engkel",
        },
        carrierType: {
          carrierId: "carrier-uuid-1",
          name: "Bak Terbuka",
        },
        status: "READY_FOR_ORDER",
        isActive: false,
        hasSOSAlert: false,
        detailSOS: null,
        needsResponseChange: false,
        activeOrder: null,
      },
      {
        fleetId: "fleet-uuid-7",
        licensePlate: "B1357PQR",
        driver: {
          driverId: "driver-uuid-7",
          name: "James Wilson",
          phoneNumber: "+628555666777",
        },
        lastLocation: {
          latitude: -6.1241,
          longitude: 106.7786,
          address: {
            district: "Penjaringan",
            city: "Jakarta Utara",
          },
          lastUpdate: "2025-07-25T09:30:00Z",
        },
        truckType: {
          truckTypeId: "truck-type-uuid-2",
          name: "Box",
        },
        carrierType: {
          carrierId: "carrier-uuid-2",
          name: "Bak Tertutup",
        },
        status: "ON_DUTY",
        isActive: true,
        hasSOSAlert: false,
        detailSOS: null,
        needsResponseChange: false,
        activeOrder: {
          orderId: "order-uuid-4",
          orderCode: "ORD-2025-004",
          orderStatus: "ON_THE_WAY",
          pickupLocation: {
            district: "Jl. Pluit Raya No. 2",
            city: "Jakarta Utara",
          },
          dropoffLocation: {
            district: "Jl. Mangga Dua Raya",
            city: "Jakarta Utara",
          },
        },
      },
      {
        fleetId: "fleet-uuid-8",
        licensePlate: "B8642STU",
        driver: {
          driverId: "driver-uuid-8",
          name: "Patricia Martinez",
          phoneNumber: "+628666777888",
        },
        lastLocation: {
          latitude: -6.5944,
          longitude: 106.7892,
          address: {
            district: "Ciledug",
            city: "Tangerang",
          },
          lastUpdate: "2025-07-25T11:45:00Z",
        },
        truckType: {
          truckTypeId: "truck-type-uuid-3",
          name: "Tronton",
        },
        carrierType: {
          carrierId: "carrier-uuid-3",
          name: "Container",
        },
        status: "INACTIVE",
        isActive: true,
        hasSOSAlert: false,
        detailSOS: {
          sosId: "sos-uuid-3",
          sosCategory: "MEDICAL",
          description: "Sopir pingsan",
          reportAt: "2025-07-25T11:40:00Z",
          completedAt: "2025-07-25T11:40:00Z",
          photos: [],
        },
        needsResponseChange: false,
        activeOrder: {
          orderId: "order-uuid-5",
          orderCode: "ORD-2025-005",
          orderStatus: "INACTIVE",
          pickupLocation: {
            district: "Jl. Merdeka No. 10",
            city: "Tangerang",
          },
          dropoffLocation: {
            district: "Jl. Sudirman No. 15",
            city: "Tangerang",
          },
        },
      },
      {
        fleetId: "uuid-fleet-id-2",
        licensePlate: "L 5678 DEF",
        driver: {
          driverId: "driver-uuid-9",
          name: "Siti Rahayu",
          phoneNumber: "+628777888999",
        },
        lastLocation: {
          latitude: -6.9175,
          longitude: 107.6191,
          address: {
            district: "Dago",
            city: "Bandung",
          },
          lastUpdate: "2024-04-01T10:25:00Z",
        },
        truckType: {
          truckTypeId: "truck-type-uuid-2",
          name: "Box",
        },
        carrierType: {
          carrierId: "carrier-uuid-2",
          name: "Bak Tertutup",
        },
        status: "READY_FOR_ORDER",
        isActive: true,
        hasSOSAlert: false,
        detailSOS: null,
        needsResponseChange: false,
        activeOrder: null,
      },
    ],
    pagination: {
      totalFleets: 10,
      currentPage: 1,
      totalPages: 3,
    },
    filter: {
      OnDuty: 9,
      ReadyForOrder: 5,
      WaitingLoadingTime: 2,
      notPaired: 3,
      inactive: 1,
      sos: 1,
      needResponse: 3,
    },
  },
  Type: "FLEET_LIST",
};

export const useGetFleetList = (params = {}) => {
  // FIX: Menggunakan format kunci cache yang lebih stabil dan bersih.
  // Ini memastikan bahwa perubahan parameter filter akan memicu pengambilan data baru.
  const cacheKey = ["monitoring-fleet-list", JSON.stringify(params)];

  return useSWR(cacheKey, () => fetcherFleetList(params));
};

export const fetcherFleetList = async (params = {}) => {
  if (isMockFleetList) {
    // Simulate filtering in mock data
    const { truckStatus = [], orderStatus = [] } = params;

    const filteredFleets = apiResultFleetList.Data.fleets.filter((fleet) => {
      // FIX: Logika filter sekarang menangani kondisi AND antara grup filter (Status Truk & Status Pesanan)
      const truckStatusMatch =
        truckStatus.length === 0 || truckStatus.includes(fleet.status);

      // FIX: Menambahkan logika filter untuk `orderStatus` yang sebelumnya tidak ada.
      // Di frontend, ID-nya adalah 'NEEDS_RESPONSE', yang sesuai dengan properti `fleet.needsResponseChange`.
      const orderStatusMatch =
        orderStatus.length === 0 ||
        (orderStatus.includes("NEEDS_RESPONSE") && fleet.needsResponseChange);

      return truckStatusMatch && orderStatusMatch;
    });

    // FIX: Mengembalikan data yang sudah difilter dengan struktur yang sama.
    return {
      ...apiResultFleetList.Data,
      fleets: filteredFleets,
      totalFleets: filteredFleets.length, // Update total count based on filtered result
    };
  }

  // --- Implementasi untuk API Sebenarnya ---

  // FIX: Menyiapkan parameter untuk API sesuai dengan kontrak.
  // Kontrak API mengharapkan satu parameter 'filter' dengan nilai string yang dipisahkan koma.
  const apiParams = { ...params };
  const { truckStatus = [], orderStatus = [] } = apiParams;

  // Di `FilterPopoverArmada`, `orderStatus` menggunakan ID `NEEDS_RESPONSE`.
  // Sesuai `countKeyMapping`, ini akan dipetakan ke `needResponse` untuk `filterCounts`.
  // Kita perlu memastikan nilai yang dikirim ke API juga konsisten.
  // Kontrak API di bagian filter menyebut 'needConfirm'  tapi di response 'needResponse'. Kita akan gunakan 'needResponse' agar konsisten dengan response.
  const orderStatusApiValues = orderStatus.map((status) => {
    if (status === "NEEDS_RESPONSE") return "needResponse";
    return status;
  });

  const allFilters = [...truckStatus, ...orderStatusApiValues];

  if (allFilters.length > 0) {
    apiParams.filter = allFilters.join(",");
  }

  // Hapus parameter asli agar tidak dikirim ke API
  delete apiParams.truckStatus;
  delete apiParams.orderStatus;

  const result = await fetcherMuatrans.get(
    "/v1/transporter/monitoring/fleets/fleet-list",
    {
      params: apiParams,
    }
  );
  return result?.data?.Data || {};
};
