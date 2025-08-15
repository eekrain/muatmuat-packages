// Mock data and fetcher for Get Saved Transporters
import useSWR from "swr";

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
              address: "Kec. Lowokwaru, Kota Malang",
              latitude: -7.9467,
              longitude: 112.6154,
              lastUpdate: "2025-01-15T14:45:00Z",
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
              address:
                "Kec. Kepulauan Seribu Selatan Seribu Selatan, DKJ Jakarta",
              latitude: -6.2088,
              longitude: 106.8456,
              lastUpdate: "2025-01-15T14:45:00Z",
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
              address: "Kec. Lowokwaru, Kota Malang",
              latitude: -7.9467,
              longitude: 112.6154,
              lastUpdate: "2025-01-15T14:45:00Z",
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
    // Deep clone to avoid mutation
    const result = JSON.parse(JSON.stringify(apiResultSavedTransporters));
    let filteredTransporters = [...result.Data.transporters];

    // Example filter by companyName
    if (params.companyName) {
      filteredTransporters = filteredTransporters.filter(
        (t) => t.companyName === params.companyName
      );
    }
    // Example filter by isActive
    if (params.isActive !== undefined) {
      filteredTransporters = filteredTransporters.filter(
        (t) => t.currentStatus.isActive === params.isActive
      );
    }
    // Example search by companyName
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
  // Implement real API call here if needed
  return {};
};

export const useGetSavedTransporters = (params = {}) => {
  const cacheKey = `saved-transporters-${JSON.stringify(params)}`;
  return useSWR(cacheKey, () => fetcherSavedTransporters(params));
};
