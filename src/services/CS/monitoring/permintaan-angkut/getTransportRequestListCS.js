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
        id: "uuid-1",
        orderCode: "MT-2025-001",
        shipperInfo: {
          id: "shipper-1",
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
        pickupLocations: [
          {
            fullAddress: "Jl. Raya No. 1, Jakarta Selatan",
            city: "Jakarta Selatan",
            province: "DKI Jakarta",
          },
        ],
        dropoffLocations: [
          {
            fullAddress: "Jl. Merdeka No. 99, Bandung",
            city: "Bandung",
            province: "Jawa Barat",
          },
        ],
        estimatedDistance: 150.5,
        cargos: [
          {
            name: "Peralatan Rumah Tangga",
            weight: 1500,
            weightUnit: "kg",
            dimensions: "200x100x80 cm",
          },
        ],
        totalPrice: 2500000,
        transportFee: 2000000,
        isHalalLogistics: false,
        hasOverload: false,
        requestAttempt: 1,
        lastViewedAt: "2025-01-15T14:20:00Z",
        lastSavedAt: "2025-01-15T13:45:00Z",
        isSaved: false,
        isNew: true,
        truckTypeName: "Fuso",
        carrierName: "Agam Tunggal Jaya",
        truckCount: 2,
        loadDateTime: "16 Jan 2025 09:00 WIB s/d 11:00 WIB",
        potentialEarnings: "Rp2.500.000",
        orderStatus: "PREPARE_FLEET",
      },
    ],
    pagination: {
      currentPage: 1,
      totalPages: 10,
      totalItems: 97,
      hasNext: true,
      hasPrevious: false,
    },
    tabCounts: {
      tersedia: 97,
      halal_logistik: 10,
      disimpan: 5,
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
    ? `v1/transport-requests?${queryString}`
    : "v1/transport-requests";

  const result = await fetcherMuatrans.get(endpoint);
  return result?.data?.Data || {};
};

export const useGetTransportRequestList = (params = {}) => {
  const cacheKey = params
    ? `transport-request-list-${JSON.stringify(params)}`
    : "transport-request-list";
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
