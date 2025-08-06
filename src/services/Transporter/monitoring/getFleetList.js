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
        activeOrder: null,
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
        status: "ON_DELIVERY",
        isActive: true,
        hasSOSAlert: true,
        detailSOS: {
          sosId: "sos-uuid-1",
          sosCategory: "ACCIDENT",
          description: "Kecelakaan di tol km 23",
          reportAt: "2025-07-25T10:45:00Z",
          photos: ["https://example.com/photo1.jpg"],
        },
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
        fleetId: "fleet-uuid-3",
        licensePlate: "B9876DEF",
        driver: {
          driverId: "driver-uuid-3",
          name: "Michael Johnson",
          phoneNumber: "+628111222333",
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
        status: "WAITING_LOADING_TIME",
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
        status: "ON_DELIVERY",
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
            city: "Depok",
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
        status: "READY_FOR_ORDER",
        isActive: true,
        hasSOSAlert: true,
        detailSOS: {
          sosId: "sos-uuid-2",
          sosCategory: "MECHANICAL_ISSUE",
          description: "Mesin overheating",
          reportAt: "2025-07-25T11:20:00Z",
          photos: [
            "https://example.com/photo2.jpg",
            "https://example.com/photo3.jpg",
          ],
        },
        needsResponseChange: true,
        activeOrder: null,
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
        status: "OFFLINE",
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
        status: "ON_DELIVERY",
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
        status: "EMERGENCY",
        isActive: true,
        hasSOSAlert: true,
        detailSOS: {
          sosId: "sos-uuid-3",
          sosCategory: "MEDICAL",
          description: "Sopir pingsan",
          reportAt: "2025-07-25T11:40:00Z",
          photos: [],
        },
        needsResponseChange: true,
        activeOrder: {
          orderId: "order-uuid-5",
          orderCode: "ORD-2025-005",
          orderStatus: "ON_THE_WAY",
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
    ],
    pagination: {
      totalFleets: 25,
      currentPage: 1,
      totalPages: 3,
    },
    filter: {
      OnDuty: 15,
      ReadyForOrder: 5,
      WaitingLoadingTime: 2,
      notPaired: 3,
      inactive: 1,
      sos: 2,
      needResponse: 3,
    },
  },
  Type: "FLEET_LIST",
};

export const fetcherFleetList = async () => {
  if (isMockFleetList) {
    return apiResultFleetList.Data;
  }

  const result = await fetcherMuatrans.get("/v1/fleet-list");
  return result?.data?.Data || {};
};

export const useGetFleetList = () => {
  const cacheKey = "monitoring-fleet-list";

  return useSWR(cacheKey, fetcherFleetList);
};
