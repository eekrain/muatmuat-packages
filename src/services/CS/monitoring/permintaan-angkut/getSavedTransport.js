// Mock data and fetcher for Get Saved Transporters
import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const IS_MOCK = true;

const apiResultSavedTransporters = {
  Message: {
    Code: 200,
    Text: "Successfully retrieved saved transporters",
  },
  Data: {
    transporters: [
      {
        id: "saved-uuid-1",
        companyName: "PT Transporter ABC",
        logo: "https://cdn.example.com/logo.jpg",
        savedAt: "2024-12-15T10:00:00Z",
        lastUsed: "2025-01-10T15:30:00Z",
        usageStats: {
          totalAssignments: 15,
          successfulOrders: 14,
          canceledOrders: 1,
          avgRating: 4.7,
        },
        currentStatus: {
          isActive: true,
          activityStatus: "ACTIVE",
          lastActivity: "2025-01-15T14:30:00Z",
          availableFleet: 5,
        },
        fleet: {
          totalUnits: 8,
          activeUnits: 6,
          inactiveUnits: 2,
        },
        tags: ["reliable", "fast-response", "halal-certified"],
        fleetDetails: [
          {
            id: "fleet-uuid-1",
            licensePlate: "L 1111 LBA",
            truckType: "Truk Fuso",
            carrierType: "Box",
            operationalStatus: "NOT_READY_FOR_ORDER",
            lastLocation: {
              distance: 10,
              latitude: -7.9467,
              longitude: 112.6154,
              lastUpdate: "2025-01-15T14:45:00Z",
              City: "DKJ Jakarta",
              District: "Kec. Kepulauan Seribu Selatan Seribu Selatan",
            },
            driver: {
              name: "Rizky Aditya Pratama",
              phone: "+628987654321",
            },
            truckImage: "/truck-placeholder.png",
          },
          {
            id: "fleet-uuid-2",
            licensePlate: "L 2222 LBA",
            truckType: "Truk Fuso",
            carrierType: "Box",
            operationalStatus: "NOT_READY_FOR_ORDER",
            lastLocation: {
              distance: 10,
              latitude: -6.2088,
              longitude: 106.8456,
              lastUpdate: "2025-01-15T14:45:00Z",
              City: "Surabaya",
              District: "Peneleh",
              address:
                "Kec. Kepulauan Seribu Selatan Seribu Selatan, DKJ Jakarta",
            },
            driver: {
              name: "Muhammad Rizky Ramadhani Pratama Setiawan Nugroho Putra Perdana Kusuma Wijayanto Saputra Toldo Sasmita",
              phone: "+628987654321",
            },
            truckImage: "/truck-placeholder.png",
          },
        ],
      },
      {
        id: "saved-uuid-2",
        companyName: "PT Transporter XYZ",
        logo: "https://cdn.example.com/logo2.jpg",
        savedAt: "2024-11-20T09:00:00Z",
        lastUsed: "2025-01-12T12:00:00Z",
        usageStats: {
          totalAssignments: 10,
          successfulOrders: 9,
          canceledOrders: 1,
          avgRating: 4.5,
        },
        currentStatus: {
          isActive: false,
          activityStatus: "INACTIVE",
          lastActivity: "2025-01-13T10:00:00Z",
          availableFleet: 2,
        },
        fleet: {
          totalUnits: 5,
          activeUnits: 2,
          inactiveUnits: 3,
        },
        tags: ["trusted", "halal-certified"],
        fleetDetails: [
          {
            id: "fleet-uuid-3",
            licensePlate: "B 3333 XYZ",
            truckType: "Truk Fuso",
            carrierType: "Box",
            operationalStatus: "READY_FOR_ORDER",
            lastLocation: {
              distance: 10,
              latitude: -7.9467,
              longitude: 112.6154,
              lastUpdate: "2025-01-15T14:45:00Z",
              City: "Surabaya",
              District: "Peneleh",
              address: "Kec. Lowokwaru, Kota Malang",
            },
            driver: {
              name: "Yudi Sutrisno",
              phone: "+628987654321",
            },
            truckImage: "/truck-placeholder.png",
          },
        ],
      },
    ],
    pagination: {
      currentPage: 1,
      totalPages: 2,
      totalItems: 18,
      hasNext: true,
      hasPrevious: false,
    },
    stats: {
      totalSaved: 18,
      activeTransporters: 15,
      inactiveTransporters: 3,
      avgSuccessRate: 0.93,
    },
  },
  Type: "SAVED_TRANSPORTERS",
};

export const fetcherSavedTransporters = async (params = {}) => {
  if (IS_MOCK) {
    // ...existing code...
    const result = JSON.parse(JSON.stringify(apiResultSavedTransporters));
    let filteredTransporters = [...result.Data.transporters];
    if (params.companyName) {
      filteredTransporters = filteredTransporters.filter(
        (t) => t.companyName === params.companyName
      );
    }
    if (params.isActive !== undefined) {
      filteredTransporters = filteredTransporters.filter(
        (t) => t.currentStatus.isActive === params.isActive
      );
    }
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredTransporters = filteredTransporters.filter((t) =>
        t.companyName.toLowerCase().includes(searchLower)
      );
    }
    return {
      ...result.Data,
      transporters: filteredTransporters,
    };
  }

  // Real API
  const { orderId, ...restParams } = params;
  const queryParams = new URLSearchParams();
  if (restParams.companyName)
    queryParams.append("companyName", restParams.companyName);
  if (restParams.isActive !== undefined)
    queryParams.append("isActive", restParams.isActive);
  if (restParams.search) queryParams.append("search", restParams.search);
  if (restParams.page) queryParams.append("page", restParams.page);
  if (restParams.limit) queryParams.append("limit", restParams.limit);

  if (!orderId) throw new Error("orderId is required for real API call");

  const queryString = queryParams.toString();
  const endpoint = queryString
    ? `/v1/cs/transport-request/${orderId}/saved?${queryString}`
    : `/v1/cs/transport-request/${orderId}/saved`;

  const result = await fetcherMuatrans.get(endpoint);
  return result?.data?.Data || {};
};

export const useGetSavedTransporters = (params = {}) => {
  const cacheKey = `saved-transporters-${JSON.stringify(params)}`;
  return useSWR(cacheKey, () => fetcherSavedTransporters(params));
};
