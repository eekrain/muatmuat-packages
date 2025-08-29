import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const isMockFleetList = false;

const apiResultFleetList = {
  Message: {
    Code: 200,
    Text: "OK",
  },
  Data: {
    fleets: [
      {
        fleetId: "420aed87-8033-4958-8545-79d5c73c5dd5",
        licensePlate: "B 1234 ABC",
        driver: {
          driverId: "51e64187-d4cb-4065-9776-7e1224fc6b35",
          name: "Test Driver",
          phoneNumber: "085737777777",
        },
        lastLocation: {
          latitude: null,
          longitude: null,
          address: {
            district: null,
            city: null,
          },
          lastUpdate: null,
        },
        truckType: {
          truckTypeId: "550e8400-e29b-41d4-a716-446655440202",
          name: "Colt Diesel Double",
        },
        carrierType: {
          carrierId: "550e8400-e29b-41d4-a716-446655440001",
          name: "Bak Terbuka",
        },
        status: "ON_DUTY",
        isActive: true,
        hasSOSAlert: true,
        detailSOS: {
          sosId: "aee39b71-9329-4521-a411-f6ebb5fd107e",
          sosCategory: null,
          description: null,
          reportAt: "2025-08-11T05:09:14.746Z",
          completedAt: null,
          photos: [],
          sosStatus: "NEW",
        },
        needsResponseChange: false,
        activeOrder: {
          orderId: "332a5aff-4b3a-428e-af6f-b01c38e27685",
          orderCode: "MT25AA592",
          orderStatus: "WAITING_PAYMENT_1",
          pickupLocation: [
            {
              sequence: 1,
              district:
                "Jalan Genteng Kali, Alun-alun Contong, Surabaya, Jawa Timur, Indonesia",
              city: "Surabaya",
              latitude: -7.2560251,
              longitude: 112.7395399,
            },
          ],
          dropoffLocation: [
            {
              sequence: 1,
              district:
                "Rungkut Asri Barat, Rungkut Kidul, Surabaya, Jawa Timur, Indonesia",
              city: "Kota Surabaya",
              latitude: -7.3283,
              longitude: 112.7706771,
            },
          ],
        },
      },
      {
        fleetId: "4085d6b2-be92-4e22-92ee-3b3fb8e13c11",
        licensePlate: "B 1464 ABD",
        driver: {
          driverId: "37f98c1b-a3fc-4b80-b882-db2a29928df2",
          name: "Driver Fajri",
          phoneNumber: "082290380510",
        },
        lastLocation: {
          latitude: null,
          longitude: null,
          address: {
            district: null,
            city: null,
          },
          lastUpdate: null,
        },
        truckType: {
          truckTypeId: "550e8400-e29b-41d4-a716-446655440202",
          name: "Colt Diesel Double",
        },
        carrierType: {
          carrierId: "550e8400-e29b-41d4-a716-446655440001",
          name: "Bak Terbuka",
        },
        status: "READY_FOR_ORDER",
        isActive: true,
        hasSOSAlert: true,
        detailSOS: {
          sosId: "d1de953d-08e6-449e-9577-a650db97ff1b",
          sosCategory: null,
          description: "Kendaraan habis bensin",
          reportAt: "2025-08-21T07:15:20.806Z",
          completedAt: null,
          photos: [
            "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1755156491161.webp",
          ],
          sosStatus: "NEW",
        },
        needsResponseChange: false,
        activeOrder: {
          orderId: "dcb8feba-68a2-4eda-8080-0e629931c87e",
          orderCode: "MT25AA007",
          orderStatus: "WAITING_PAYMENT_1",
          pickupLocation: [
            {
              sequence: 2,
              district:
                "Surabaya North Quay, Perak Utara, Surabaya, Jawa Timur, Indonesia",
              city: "Kota Surabaya",
              latitude: -7.1970895,
              longitude: 112.7323027,
            },
            {
              sequence: 1,
              district:
                "Surabaya Zoo, Jalan Setail, Darmo, Surabaya, Jawa Timur, Indonesia",
              city: "Kota Surabaya",
              latitude: -7.2959546,
              longitude: 112.7366094,
            },
          ],
          dropoffLocation: [
            {
              sequence: 3,
              district:
                "Jalan Semarang Indah, Tawangmas, Kota Semarang, Jawa Tengah, Indonesia",
              city: "Kota Semarang",
              latitude: -6.9656648,
              longitude: 110.3960998,
            },
            {
              sequence: 4,
              district:
                "Semarang-Batang Toll Road, Wonosari, Kota Semarang, Jawa Tengah, Indonesia",
              city: "Kota Semarang",
              latitude: -6.9726688,
              longitude: 110.3089555,
            },
          ],
        },
      },
      {
        fleetId: "45be2b3e-fa6f-45f0-902d-56de90d212e2",
        licensePlate: "B 1235 ABC",
        driver: {
          driverId: "569ff94f-af56-4510-bad0-2f552f9f1b9d",
          name: "John Doe Driver",
          phoneNumber: "081234567890",
        },
        lastLocation: {
          latitude: -7.545862,
          longitude: 112.2359131,
          address: {
            district: null,
            city: null,
          },
          lastUpdate: null,
        },
        truckType: {
          truckTypeId: "550e8400-e29b-41d4-a716-446655440202",
          name: "Colt Diesel Double",
        },
        carrierType: {
          carrierId: "550e8400-e29b-41d4-a716-446655440001",
          name: "Bak Terbuka",
        },
        status: "READY_FOR_ORDER",
        isActive: true,
        hasSOSAlert: false,
        detailSOS: null,
        needsResponseChange: false,
        activeOrder: {
          orderId: "ddea3ee1-3eee-473d-abdd-906049dddf58",
          orderCode: "MT25AA594",
          orderStatus: "LOADING",
          pickupLocation: [
            {
              sequence: 2,
              district:
                "PT. Osowilangun Indah, Payan, Pabean, Kabupaten Sidoarjo, Jawa Timur, Indonesia",
              city: "Kab. Sidoarjo",
              latitude: -7.3648974,
              longitude: 112.7610365,
            },
            {
              sequence: 1,
              district:
                "Surabaya North Quay, Perak Utara, Surabaya, Jawa Timur, Indonesia",
              city: "Kota Surabaya",
              latitude: -7.1970895,
              longitude: 112.7323027,
            },
          ],
          dropoffLocation: [
            {
              sequence: 1,
              district:
                "Bandulan Gang V, Bandulan, Kota Malang, Jawa Timur, Indonesia",
              city: "Kota Malang",
              latitude: -7.9841098,
              longitude: 112.6078563,
            },
          ],
        },
      },
      {
        fleetId: "5b831478-6757-40da-810c-31ccc11f29e6",
        licensePlate: "B 1111 FMI",
        driver: {
          driverId: "6cbcf331-c2b8-4784-b549-8e435e3dc92e",
          name: "Backend Driver 4",
          phoneNumber: "085363845494",
        },
        lastLocation: {
          latitude: null,
          longitude: null,
          address: {
            district: null,
            city: null,
          },
          lastUpdate: null,
        },
        truckType: {
          truckTypeId: "550e8400-e29b-41d4-a716-446655440202",
          name: "Colt Diesel Double",
        },
        carrierType: {
          carrierId: "550e8400-e29b-41d4-a716-446655440001",
          name: "Bak Terbuka",
        },
        status: "ON_DUTY",
        isActive: true,
        hasSOSAlert: false,
        detailSOS: null,
        needsResponseChange: false,
        activeOrder: null,
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
          latitude: null,
          longitude: null,
          address: {
            district: null,
            city: null,
          },
          lastUpdate: null,
        },
        truckType: {
          truckTypeId: "550e8400-e29b-41d4-a716-446655440202",
          name: "Colt Diesel Double",
        },
        carrierType: {
          carrierId: "550e8400-e29b-41d4-a716-446655440001",
          name: "Bak Terbuka",
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
      totalFleets: 15,
      currentPage: 1,
      totalPages: 1,
    },
    filter: {
      OnDuty: 4,
      ReadyForOrder: 10,
      WaitingLoadingTime: 0,
      notPaired: 1,
      inactive: 0,
      sos: 5,
      needResponse: 0,
    },
  },
  Type: "/v1/transporter/monitoring/fleets/list?page=1&limit=50&sort=asc&filter=",
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
    "/v1/transporter/monitoring/fleets/list",
    {
      params: apiParams,
    }
  );
  return result?.data?.Data || {};
};
