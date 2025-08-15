import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// Mock config for UI state testing
const IS_MOCK = true;
const MOCK_CONFIG = {
  showEmptyState: false,
  isSuspended: false,
  driverDelegationEnabled: false,
  isHalalCertified: true,
};
const apiResultTransportRequestList = {
  Message: {
    Code: 200,
    Text: "Successfully retrieved CS monitoring data",
  },
  Data: {
    requests: [
      {
        id: "uuid",
        orderCode: "MT-2025-001",
        reblast: "2",
        shipperInfo: {
          id: "uuid",
          name: "PT Shipper ABC",
          logo: "https://cdn.example.com/logo.jpg",
          createdAt: "2025-01-15T10:30:00Z",
        },
        orderType: "INSTANT",
        loadTimeStart: "2025-01-16T09:00:00Z",
        loadTimeEnd: "2025-01-16T11:00:00Z",
        timeLabels: {
          category: "MUAT_HARI_INI",
          display: "Muat Hari Ini",
          color: "green",
          countdown: "02:30:45",
        },
        locations: {
          pickupLocations: [
            {
              id: "pickup-1",
              sequence: 1,
              fullAddress: "Jl. Raya No. 1, Jakarta Selatan",
              city: "Jakarta Selatan",
              district: "Kebayoran Baru",
              latitude: -6.2607,
              longitude: 106.7816,
            },
          ],
          dropoffLocations: [
            {
              id: "dropoff-1",
              sequence: 1,
              fullAddress: "Jl. Merdeka No. 99, Bandung",
              city: "Bandung",
              district: "Sumur Bandung",
              latitude: -6.9147,
              longitude: 107.6098,
            },
          ],
          estimatedDistance: 150.5,
        },
        cargo: {
          totalWeight: 1500,
          weightUnit: "kg",
          description: "Peralatan Rumah Tangga",
          additionalItems: 7,
          items: [
            {
              name: "Peralatan Rumah Tangga",
              weight: 500,
              dimensions: {
                length: 2,
                width: 1,
                height: 0.8,
              },
              dimensionUnit: "m",
            },
          ],
        },
        pricing: {
          potentialIncome: 200000,
        },
        counters: {
          available: 25,
          viewed: 12,
          saved: 5,
        },
        vehicle: {
          truckCount: 2,
          truckType: "Fuso",
          carrierType: "Agam Tunggal Jaya",
        },
        additionalServices: [{ id: "svc-1", serviceName: "Asuransi" }],
        photos: ["https://cdn.example.com/photo1.jpg"],
        isHalalLogistics: false,
        potentialOverload: false,
      },
      {
        id: "uuid",
        orderCode: "MT-2025-001",
        reblast: "1",
        shipperInfo: {
          id: "uuid",
          name: "PT Shipper ABC",
          logo: "https://cdn.example.com/logo.jpg",
          createdAt: "2025-01-15T10:30:00Z",
        },
        orderType: "INSTANT",
        loadTimeStart: "2025-01-16T09:00:00Z",
        loadTimeEnd: "2025-01-16T11:00:00Z",
        timeLabels: {
          category: "MUAT_HARI_INI",
          display: "Muat Hari Ini",
          color: "green",
          countdown: "02:30:45",
        },
        locations: {
          pickupLocations: [
            {
              id: "pickup-1",
              sequence: 1,
              fullAddress: "Jl. Raya No. 1, Jakarta Selatan",
              city: "Jakarta Selatan",
              district: "Kebayoran Baru",
              latitude: -6.2607,
              longitude: 106.7816,
            },
          ],
          dropoffLocations: [
            {
              id: "dropoff-1",
              sequence: 1,
              fullAddress: "Jl. Merdeka No. 99, Bandung",
              city: "Bandung",
              district: "Sumur Bandung",
              latitude: -6.9147,
              longitude: 107.6098,
            },
          ],
          estimatedDistance: 150.5,
        },
        cargo: {
          totalWeight: 1500,
          weightUnit: "kg",
          description: "Peralatan Rumah Tangga",
          additionalItems: 7,
          items: [
            {
              name: "Peralatan Rumah Tangga",
              weight: 500,
              dimensions: {
                length: 2,
                width: 1,
                height: 0.8,
              },
              dimensionUnit: "m",
            },
          ],
        },
        pricing: {
          potentialIncome: 200000,
        },
        counters: {
          available: 25,
          viewed: 12,
          saved: 5,
        },
        vehicle: {
          truckCount: 2,
          truckType: "Fuso",
          carrierType: "Agam Tunggal Jaya",
        },
        additionalServices: [{ id: "svc-1", serviceName: "Asuransi" }],
        photos: ["https://cdn.example.com/photo1.jpg"],
        isHalalLogistics: false,
        potentialOverload: false,
      },
    ],
    pagination: {
      currentPage: 1,
      totalPages: 10,
      totalItems: 97,
      hasNext: true,
      hasPrevious: false,
    },
    tabCounters: {
      all: 97,
      instant: 45,
      scheduled: 42,
      halal: 10,
      hasBlinkNode: true,
    },
    newRequestsCount: {
      total: 1,
      display: "1",
      hasAnimation: true,
    },
    lastSyncTimestamp: "2025-01-15T15:00:00Z",
    userStatus: {
      isSuspended: false,
      suspensionReason: "",
      suspensionMessage: "",
      supportContactUrl: "",
      driverDelegationEnabled: false,
      delegationWarningMessage: "",
      delegationResetUrl: "",
      isHalalCertified: true,
      halalCertificationMessage: "",
      halalCertificationUrl: "",
    },
  },
  Type: "CS_REQUESTS",
};

export const fetcherTransportRequestList = async (params = {}) => {
  if (IS_MOCK) {
    // Deep clone to avoid mutation
    const result = JSON.parse(JSON.stringify(apiResultTransportRequestList));
    let filteredRequests = [...result.Data.requests];

    if (params.orderStatus) {
      filteredRequests = filteredRequests.filter(
        (req) => req.orderStatus === params.orderStatus
      );
    }
    if (params.orderType) {
      filteredRequests = filteredRequests.filter(
        (req) => req.orderType === params.orderType
      );
    }
    if (params.isHalalLogistics !== undefined) {
      filteredRequests = filteredRequests.filter(
        (req) => req.isHalalLogistics === params.isHalalLogistics
      );
    }
    if (params.isSaved !== undefined) {
      filteredRequests = filteredRequests.filter(
        (req) => req.isSaved === params.isSaved
      );
    }
    if (params.isNew !== undefined) {
      filteredRequests = filteredRequests.filter(
        (req) => req.isNew === params.isNew
      );
    }
    if (params.truckTypeName) {
      filteredRequests = filteredRequests.filter(
        (req) => req.truckTypeName === params.truckTypeName
      );
    }
    if (params.carrierName) {
      filteredRequests = filteredRequests.filter(
        (req) => req.carrierName === params.carrierName
      );
    }
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredRequests = filteredRequests.filter(
        (req) =>
          req.orderCode.toLowerCase().includes(searchLower) ||
          req.truckTypeName.toLowerCase().includes(searchLower) ||
          req.carrierName.toLowerCase().includes(searchLower) ||
          req.pickupLocations.some(
            (loc) =>
              loc.fullAddress.toLowerCase().includes(searchLower) ||
              loc.city.toLowerCase().includes(searchLower) ||
              loc.province.toLowerCase().includes(searchLower)
          ) ||
          req.dropoffLocations.some(
            (loc) =>
              loc.fullAddress.toLowerCase().includes(searchLower) ||
              loc.city.toLowerCase().includes(searchLower) ||
              loc.province.toLowerCase().includes(searchLower)
          ) ||
          req.cargos.some((cargo) =>
            cargo.name.toLowerCase().includes(searchLower)
          )
      );
    }
    if (params.sortBy) {
      filteredRequests.sort((a, b) => {
        let aValue = a[params.sortBy];
        let bValue = b[params.sortBy];
        if (
          params.sortBy === "loadTimeStart" ||
          params.sortBy === "createdAt"
        ) {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }
        if (params.sortBy === "totalPrice") {
          aValue = parseFloat(aValue);
          bValue = parseFloat(bValue);
        }
        if (params.sortOrder === "desc") return aValue > bValue ? -1 : 1;
        return aValue < bValue ? -1 : 1;
      });
    }

    // Return data with filtered requests
    return {
      ...result.Data,
      requests: filteredRequests,
    };
  }

  // API real
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append("page", params.page);
  if (params.limit) queryParams.append("limit", params.limit);
  if (params.orderStatus) queryParams.append("orderStatus", params.orderStatus);
  if (params.orderType) queryParams.append("orderType", params.orderType);
  if (params.isHalalLogistics !== undefined)
    queryParams.append("isHalalLogistics", params.isHalalLogistics);
  if (params.isSaved !== undefined)
    queryParams.append("isSaved", params.isSaved);
  if (params.isNew !== undefined) queryParams.append("isNew", params.isNew);
  if (params.truckTypeName)
    queryParams.append("truckTypeName", params.truckTypeName);
  if (params.carrierName) queryParams.append("carrierName", params.carrierName);
  if (params.search) queryParams.append("search", params.search);
  if (params.sortBy) queryParams.append("sortBy", params.sortBy);
  if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
  if (params.dateFrom) queryParams.append("dateFrom", params.dateFrom);
  if (params.dateTo) queryParams.append("dateTo", params.dateTo);

  const queryString = queryParams.toString();
  const endpoint = queryString
    ? `/v1/cs-requests?${queryString}`
    : "/v1/cs-requests";

  const result = await fetcherMuatrans.get(endpoint);
  return result?.data?.Data || {};
};

export const useGetTransportRequestList = (params = {}) => {
  const cacheKey = params
    ? `cs-request-list-${JSON.stringify(params)}`
    : "cs-request-list";
  return useSWR(cacheKey, () => fetcherTransportRequestList(params));
};

// Specialized hooks for common use cases
export const useGetAvailableTransportRequests = () => {
  return useGetTransportRequestList({ orderStatus: "PREPARE_FLEET" });
};

export const useGetHalalLogisticsRequests = () => {
  return useGetTransportRequestList({ isHalalLogistics: true });
};

export const useGetSavedTransportRequests = () => {
  return useGetTransportRequestList({ isSaved: true });
};

export const useGetNewTransportRequests = () => {
  return useGetTransportRequestList({ isNew: true });
};

export const useGetInstantTransportRequests = () => {
  return useGetTransportRequestList({ orderType: "INSTANT" });
};

export const useGetScheduledTransportRequests = () => {
  return useGetTransportRequestList({ orderType: "SCHEDULED" });
};
