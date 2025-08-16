// Mock data and fetcher for Get Available Transporters for Request
import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const IS_MOCK = true;

const apiResultAvailableTransporters = {
  Message: {
    Code: 200,
    Text: "Successfully retrieved available transporters",
  },
  Data: {
    transporters: [
      {
        id: "transporter-uuid-1",
        companyName:
          "PT Batavia Prosperindo Angkut Teknologi Indonesi Trans Tbk",
        logo: "https://cdn.example.com/transporter_logo.jpg",
        distance: 15.5,
        fleet: {
          totalUnits: 10,
          activeUnits: 8,
          inactiveUnits: 2,
          matchingUnits: 3,
        },
        contact: {
          phone: "+628123456789",
          whatsapp: "+628123456789",
          email: "transporter@example.com",
        },
        status: {
          isActive: true,
          activityStatus: "INACTIVE",
          lastActivity: "2025-01-15T14:30:00Z",
          inactiveReason: null,
        },
        rating: {
          average: 4.5,
          totalReviews: 125,
        },
        history: {
          completedOrders: 35,
          canceledOrders: 30,
          rejectedOrders: 1,
          hasRejectedThisRequest: true,
        },
        verification: {
          status: "VERIFIED",
          isHalalCertified: false,
          halalCertificateNo: null,
          halalExpiryDate: null,
        },
        expandedDetails: {
          fleetDetails: [
            {
              id: "fleet-uuid-1",
              licensePlate: "B 1234 XYZ",
              truckType: "Truk Fuso",
              carrierType: "Box",
              operationalStatus: "READY_FOR_ORDER",
              lastLocation: {
                distance: 10,
                latitude: -6.2088,
                longitude: 106.8456,
                lastUpdate: "2025-01-15T14:45:00Z",
                City: "Surabaya",
                District: "Peneleh",
              },
              driver: {
                name: "Rizky Aditya Pratama",
                phone: "+628987654321",
              },
              inactivityInfo: {
                lastActiveAt: "2025-01-15T12:00:00Z",
                inactiveDuration: 180,
                inactivityReason: "Maintenance",
              },
            },
            {
              id: "fleet-uuid-2",
              licensePlate: "B 1234 XYZ",
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
              },
              driver: {
                name: "Muhammad Rizky Ramadhani Pratama Setiawan Nugroho Putra Perdana Kusuma Wijayanto Saputra Toldo Sasmita",
                phone: "+628987654321",
              },
              inactivityInfo: {
                lastActiveAt: "2025-01-15T12:00:00Z",
                inactiveDuration: 180,
                inactivityReason: "Maintenance",
              },
            },
          ],
        },
      },
      {
        id: "transporter-uuid-2",
        companyName: "PT Transporter ABC",
        logo: "https://cdn.example.com/transporter_logo.jpg",
        distance: 15.5,
        fleet: {
          totalUnits: 10,
          activeUnits: 8,
          inactiveUnits: 2,
          matchingUnits: 3,
        },
        contact: {
          phone: "+628123456789",
          whatsapp: "+628123456789",
          email: "transporter@example.com",
        },
        status: {
          isActive: true,
          activityStatus: "INACTIVE",
          lastActivity: "2025-01-15T14:30:00Z",
          inactiveReason: null,
        },
        rating: {
          average: 4.5,
          totalReviews: 125,
        },
        history: {
          completedOrders: 25,
          canceledOrders: 10,
          rejectedOrders: 1,
          hasRejectedThisRequest: false,
        },
        verification: {
          status: "VERIFIED",
          isHalalCertified: false,
          halalCertificateNo: null,
          halalExpiryDate: null,
        },
        expandedDetails: {
          fleetDetails: [
            {
              id: "fleet-uuid-1",
              licensePlate: "B 1234 XYZ",
              truckType: "Truk Fuso",
              carrierType: "Box",
              operationalStatus: "READY_FOR_ORDER",
              lastLocation: {
                distance: 10,
                latitude: -6.2088,
                longitude: 106.8456,
                lastUpdate: "2025-01-15T14:45:00Z",
                City: "Surabaya",
                District: "Peneleh",
              },
              driver: {
                name: "Rizky Aditya Pratama",
                phone: "+628987654321",
              },
              inactivityInfo: {
                lastActiveAt: "2025-01-15T12:00:00Z",
                inactiveDuration: 180,
                inactivityReason: "Maintenance",
              },
            },
            {
              id: "fleet-uuid-2",
              licensePlate: "B 1234 XYZ",
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
              },
              driver: {
                name: "Muhammad Rizky Ramadhani Pratama Setiawan Nugroho Putra Perdana Kusuma Wijayanto Saputra Toldo Sasmita",
                phone: "+628987654321",
              },
              inactivityInfo: {
                lastActiveAt: "2025-01-15T12:00:00Z",
                inactiveDuration: 180,
                inactivityReason: "Maintenance",
              },
            },
          ],
        },
      },
      {
        id: "transporter-uuid-3",
        companyName: "PT Transporter ABC",
        logo: "https://cdn.example.com/transporter_logo.jpg",
        distance: 15.5,
        fleet: {
          totalUnits: 10,
          activeUnits: 8,
          inactiveUnits: 2,
          matchingUnits: 3,
        },
        contact: {
          phone: "+628123456789",
          whatsapp: "+628123456789",
          email: "transporter@example.com",
        },
        status: {
          isActive: true,
          activityStatus: "INACTIVE",
          lastActivity: "2025-01-15T14:30:00Z",
          inactiveReason: null,
        },
        rating: {
          average: 4.5,
          totalReviews: 125,
        },
        history: {
          completedOrders: 15,
          canceledOrders: 5,
          rejectedOrders: 1,
          hasRejectedThisRequest: false,
        },
        verification: {
          status: "VERIFIED",
          isHalalCertified: false,
          halalCertificateNo: null,
          halalExpiryDate: null,
        },
        expandedDetails: {
          fleetDetails: [
            {
              id: "fleet-uuid-1",
              licensePlate: "B 1234 XYZ",
              truckType: "Truk Fuso",
              carrierType: "Box",
              operationalStatus: "READY_FOR_ORDER",
              lastLocation: {
                distance: 10,
                latitude: -6.2088,
                longitude: 106.8456,
                lastUpdate: "2025-01-15T14:45:00Z",
                City: "Surabaya",
                District: "Peneleh",
              },
              driver: {
                name: "Rizky Aditya Pratama",
                phone: "+628987654321",
              },
              inactivityInfo: {
                lastActiveAt: "2025-01-15T12:00:00Z",
                inactiveDuration: 180,
                inactivityReason: "Maintenance",
              },
            },
            {
              id: "fleet-uuid-2",
              licensePlate: "B 1234 XYZ",
              truckType: "Truk Fuso",
              carrierType: "Box",
              operationalStatus: "NOT_READY_FOR_ORDER",
              lastLocation: {
                distance: 10,
                latitude: -6.2088,
                longitude: 106.8456,
                lastUpdate: "2025-01-15T14:45:00Z",
                City: "DKJ Jakarta",
                District: "Kec. Kepulauan Seribu Selatan Seribu Selatan",
              },
              driver: {
                name: "Muhammad Rizky Ramadhani Pratama Setiawan Nugroho Putra Perdana Kusuma Wijayanto Saputra Toldo Sasmita",
                phone: "+628987654321",
              },
              inactivityInfo: {
                lastActiveAt: "2025-01-15T12:00:00Z",
                inactiveDuration: 180,
                inactivityReason: "Maintenance",
              },
            },
          ],
        },
      },
      // Add more transporter objects as needed for testing
    ],
    pagination: {
      currentPage: 1,
      totalPages: 3,
      totalItems: 25,
      hasNext: true,
      hasPrevious: false,
    },
    searchCriteria: {
      distanceRadius: 50,
      matchingFleetTypes: ["Truk Fuso"],
      excludeRejected: true,
    },
  },
  Type: "AVAILABLE_TRANSPORTERS",
};

export const fetcherAvailableTransporters = async (requestId, params = {}) => {
  if (IS_MOCK) {
    // Deep clone to avoid mutation
    const result = JSON.parse(JSON.stringify(apiResultAvailableTransporters));
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
        (t) => t.status.isActive === params.isActive
      );
    }
    // Example filter by matchingUnits
    if (params.matchingUnits !== undefined) {
      filteredTransporters = filteredTransporters.filter(
        (t) => t.fleet.matchingUnits === params.matchingUnits
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
  const queryParams = new URLSearchParams();
  if (params.companyName) queryParams.append("companyName", params.companyName);
  if (params.isActive !== undefined)
    queryParams.append("isActive", params.isActive);
  if (params.matchingUnits !== undefined)
    queryParams.append("matchingUnits", params.matchingUnits);
  if (params.search) queryParams.append("search", params.search);
  if (params.page) queryParams.append("page", params.page);
  if (params.limit) queryParams.append("limit", params.limit);

  const queryString = queryParams.toString();
  const endpoint = queryString
    ? `/v1/cs/transport-request/${requestId}/transporters?${queryString}`
    : `/v1/cs/transport-request/${requestId}/transporters`;

  const result = await fetcherMuatrans.get(endpoint);
  return result?.data?.Data || {};
};

export const useGetAvailableTransporters = (requestId, params = {}) => {
  const cacheKey = requestId
    ? `available-transporters-${requestId}-${JSON.stringify(params)}`
    : "available-transporters";
  return useSWR(cacheKey, () =>
    fetcherAvailableTransporters(requestId, params)
  );
};
