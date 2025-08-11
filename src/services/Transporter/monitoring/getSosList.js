import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const isMockSosList = true;

const apiResultSosList = {
  Message: {
    Code: 200,
    Text: "Active SOS list retrieved successfully",
  },
  Data: {
    sosList: [
      {
        id: "sos-uuid-1",
        orderCode: "ORD-2024-001",
        orderId: "order-uuid-1",
        status: "NEW",
        categoryName: "Kendaraan Bermasalah",
        description: "Engine overheating",
        reportedAt: "2024-04-01T10:30:00.000Z",
        driverName: "John Doe",
        driverPhone: "+6281234567890",
        licensePlate: "B 1234 XYZ",
        lastLocation: {
          address: "Jl. Sudirman, Jakarta Pusat",
          district: "Tanah Abang",
          city: "Jakarta Pusat",
        },
        fleetId: "fleet-uuid-1",
        truckType: "Truk Engkel",
        carrierType: "Bak Terbuka",
        photos: ["/img/sos-engine.jpg"],
        orderInfo: {
          pickupLocation: {
            fullAddress: "Jl. Thamrin No. 1, Jakarta Pusat",
            district: "Tanah Abang",
            city: "Jakarta Pusat",
            latitude: -6.2088,
            longitude: 106.8456,
          },
          dropoffLocation: {
            fullAddress: "Jl. Sudirman No. 5, Jakarta Selatan",
            district: "Setiabudi",
            city: "Jakarta Selatan",
            latitude: -6.2245,
            longitude: 106.8222,
          },
          orderStatus: "LOADING",
        },
      },
      {
        id: "sos-uuid-2",
        orderCode: "ORD-2024-002",
        orderId: "order-uuid-2",
        status: "ACKNOWLEDGED",
        categoryName: "Kecelakaan",
        description: "Tabrakan di tol km 12",
        reportedAt: "2024-04-01T09:15:00.000Z",
        driverName: "Jane Smith",
        driverPhone: "+628987654321",
        licensePlate: "B 5678 ABC",
        lastLocation: {
          address: "Jl. Tol Jagorawi km 12",
          district: "Cibubur",
          city: "Jakarta Timur",
        },
        fleetId: "fleet-uuid-2",
        truckType: "Truk Box",
        carrierType: "Bak Tertutup",
        photos: ["/img/sos-accident-1.jpg", "/img/sos-accident-2.jpg"],
        orderInfo: {
          pickupLocation: {
            fullAddress: "Jl. Gatot Subroto No. 12, Jakarta Selatan",
            district: "Kuningan",
            city: "Jakarta Selatan",
            latitude: -6.2256,
            longitude: 106.8234,
          },
          dropoffLocation: {
            fullAddress: "Jl. HR Rasuna Said No. 8, Jakarta Selatan",
            district: "Setiabudi",
            city: "Jakarta Selatan",
            latitude: -6.2187,
            longitude: 106.8312,
          },
          orderStatus: "ON_THE_WAY",
        },
      },
      {
        id: "sos-uuid-3",
        orderCode: "ORD-2024-003",
        orderId: "order-uuid-3",
        status: "NEW",
        categoryName: "Sopir Sakit",
        description: "Sopir pingsan saat mengemudi",
        reportedAt: "2024-04-01T11:45:00.000Z",
        driverName: "Robert Johnson",
        driverPhone: "+6281122334455",
        licensePlate: "B 9012 DEF",
        lastLocation: {
          address: "Jl. Pangeran Antasari No. 25",
          district: "Cilandak",
          city: "Jakarta Selatan",
        },
        fleetId: "fleet-uuid-3",
        truckType: "Tronton",
        carrierType: "Container",
        photos: [],
        orderInfo: {
          pickupLocation: {
            fullAddress: "Jl. Pluit Raya No. 2, Jakarta Utara",
            district: "Penjaringan",
            city: "Jakarta Utara",
            latitude: -6.1241,
            longitude: 106.7786,
          },
          dropoffLocation: {
            fullAddress: "Jl. Mangga Dua Raya, Jakarta Utara",
            district: "Ancol",
            city: "Jakarta Utara",
            latitude: -6.1352,
            longitude: 106.8134,
          },
          orderStatus: "ON_THE_WAY",
        },
      },
    ],
    pagination: {
      currentPage: 1,
      totalPages: 3,
      totalItems: 25,
      itemsPerPage: 10,
      hasNext: true,
      hasPrevious: false,
    },
  },
  Type: "SOS_LIST",
};

const apiErrorSosList = {
  Message: {
    Code: 400,
    Text: "Failed to retrieve SOS list",
  },
  Data: {
    errors: [
      {
        field: "general",
        message: "Sistem tidak dapat mengambil daftar SOS",
      },
    ],
  },
  Type: "SOS_LIST_ERROR",
};

export const useGetSosList = (params = {}) => {
  const cacheKey = ["monitoring-sos-list", params];

  return useSWR(cacheKey, () => fetcherSosList(params), {
    // Refresh every 30 seconds for real-time updates
    refreshInterval: 30000,
    // Don't revalidate on focus to prevent flickering
    revalidateOnFocus: false,
  });
};

export const fetcherSosList = async (params = {}) => {
  if (isMockSosList) {
    // Simulate filtering in mock data
    const filteredData = {
      ...apiResultSosList.Data,
      sosList: apiResultSosList.Data.sosList.filter((sos) => {
        // Filter by status if provided
        if (params.status && params.status.length > 0) {
          return params.status.includes(sos.status);
        }
        return true;
      }),
      pagination: {
        ...apiResultSosList.Data.pagination,
        totalItems: apiResultSosList.Data.sosList.length,
      },
    };

    // Simulate pagination
    if (params.page && params.pageSize) {
      const start = (params.page - 1) * params.pageSize;
      const end = start + params.pageSize;
      filteredData.sosList = filteredData.sosList.slice(start, end);
    }

    return filteredData;
  }

  try {
    const result = await fetcherMuatrans.get(
      "/v1/transporter/monitoring/sos/list",
      { params }
    );
    return result?.data || {};
  } catch (error) {
    throw error.response?.data || apiErrorSosList;
  }
};
