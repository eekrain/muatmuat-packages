// Mock data and fetcher for Get Viewed Order by Transporter
import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const IS_MOCK = true;

const apiResultViewedOrder = {
  Message: {
    Code: 200,
    Text: "Successfully retrieved available transporters",
  },
  Data: {
    transporters: [
      {
        id: "transporter-uuid-1",
        companyName:
          "PT Batavia Prosperindo Angkut Teknologi Indonesia Trans Tbk",
        logo: "https://cdn.example.com/transporter_logo.jpg",
        lastViewedAt: "2025-01-15T15:00:00Z",
        fleet: {
          totalUnits: 10,
          activeUnits: 8,
          inactiveUnits: 2,
          matchingUnits: 3,
        },
        contact: {
          emergencyContact: {
            phone: "+628123456789",
            position: "Direktur",
            name: "John",
            email: "transporter@example.com",
          },
          picContacts: [
            { name: "Jane Doe", position: "Manager", phone: "+628111111111" },
            {
              name: "Bob Smith",
              position: "Supervisor",
              phone: "+628222222222",
            },
          ],
          primaryContact: {
            phone: "+628123456789",
            fullAddress: "Jl. Merdeka No. 1, Jakarta",
          },
        },
        status: {
          isActive: false,
          activityStatus: "ACTIVE",
          lastActivity: "2025-01-15T14:30:00Z",
          inactiveReason: null,
          current: 5,
          total: 7,
          inactivityStatus: "TRANSPORTER_IDLE", // [ARMADA_INACTIVE, TRANSPORTER_IDLE, TRANSPORTER_INACTIVE]
        },
        rating: {
          average: 4.5,
          totalReviews: 125,
        },
        history: {
          completedOrders: 85,
          canceledOrders: 2,
          rejectedOrders: 1,
          hasRejectedThisRequest: false,
        },
        verification: {
          status: "VERIFIED",
          isHalalCertified: false,
          halalCertificateNo: null,
          halalExpiryDate: null,
        },
        activity: [
          {
            id: "activity-uuid-1",
            createdAt: "2025-01-15T13:00:00Z",
            type: "VIEWED_ORDER",
            description: "Transporter viewed the order.",
          },
        ],
        expandedDetails: {
          fleetDetails: [
            {
              id: "fleet-uuid-1",
              licensePlate: "B 1234 XYZ",
              truckType: "Truk Fuso",
              carrierType: "Box",
              operationalStatus: "NOT_PAIRED", // READY_FOR_ORDER, ON_DUTY, WAITING_LOADING_TIME, NOT_PAIRED, INACTIVE
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
            },
            {
              id: "fleet-uuid-2",
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
        companyName:
          "PT Batavia Prosperindo Angkut Teknologi Indonesia Trans Tbk",
        logo: "https://cdn.example.com/transporter_logo.jpg",
        lastViewedAt: "2025-01-15T15:00:00Z",
        fleet: {
          totalUnits: 10,
          activeUnits: 8,
          inactiveUnits: 2,
          matchingUnits: 3,
        },
        contact: {
          emergencyContact: {
            phone: "+628123456789",
            position: "Direktur",
            name: "John",
            email: "transporter@example.com",
          },
          picContacts: [
            { name: "Jane Doe", position: "Manager", phone: "+628111111111" },
            {
              name: "Bob Smith",
              position: "Supervisor",
              phone: "+628222222222",
            },
          ],
          primaryContact: {
            phone: "+628123456789",
            fullAddress: "Jl. Merdeka No. 1, Jakarta",
          },
        },
        status: {
          isActive: true,
          activityStatus: "INACTIVE",
          lastActivity: "2025-01-15T14:30:00Z",
          inactiveReason: "Sering idle",
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
        activity: [
          {
            id: "activity-uuid-1",
            createdAt: "2025-01-15T13:00:00Z",
            type: "VIEWED_ORDER",
            description: "Transporter viewed the order.",
          },
        ],
        expandedDetails: {
          fleetDetails: [
            {
              id: "fleet-uuid-1",
              licensePlate: "B 1234 XYZ",
              truckType: "Truk Fuso",
              carrierType: "Box",
              operationalStatus: "NOT_PAIRED", // READY_FOR_ORDER, ON_DUTY, WAITING_LOADING_TIME, NOT_PAIRED, INACTIVE
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
            },
            {
              id: "fleet-uuid-2",
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
  },
  Type: "AVAILABLE_TRANSPORTERS",
};

export const fetcherViewedOrder = async (orderId, params = {}) => {
  if (IS_MOCK) {
    // ...existing code...
    const result = JSON.parse(JSON.stringify(apiResultViewedOrder));
    let filteredTransporters = [...result.Data.transporters];
    if (params.companyName) {
      filteredTransporters = filteredTransporters.filter(
        (t) => t.companyName === params.companyName
      );
    }
    if (params.isActive !== undefined) {
      filteredTransporters = filteredTransporters.filter(
        (t) => t.status.isActive === params.isActive
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
  const queryParams = new URLSearchParams();
  if (params.companyName) queryParams.append("companyName", params.companyName);
  if (params.isActive !== undefined)
    queryParams.append("isActive", params.isActive);
  if (params.search) queryParams.append("search", params.search);
  if (params.page) queryParams.append("page", params.page);
  if (params.limit) queryParams.append("limit", params.limit);

  const queryString = queryParams.toString();
  const endpoint = queryString
    ? `/v1/cs/transport-request/${orderId}/viewers?${queryString}`
    : `/v1/cs/transport-request/${orderId}/viewers`;

  const result = await fetcherMuatrans.get(endpoint);
  return result?.data?.Data || {};
};

export const useGetViewedOrder = (orderId, params = {}) => {
  const cacheKey = orderId
    ? `viewed-order-${orderId}-${JSON.stringify(params)}`
    : "viewed-order";
  return useSWR(cacheKey, () => fetcherViewedOrder(orderId, params));
};
