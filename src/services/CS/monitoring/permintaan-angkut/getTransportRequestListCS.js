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
        orderCode: "MT2025001",
        reblast: "2",
        shipperInfo: {
          id: "uuid",
          name: "PT Shipper ABC",
          logo: "https://cdn.example.com/logo.jpg",
          createdAt: "2025-08-20T14:10:00+07:00",
          address: {
            city: "Jakarta",
            district: "Kebayoran Baru",
            province: "DKI Jakarta",
          },
        },
        orderType: "INSTANT",
        loadTimeStart: "2025-08-20T09:00:00Z",
        loadTimeEnd: "2025-08-21T11:00:00Z",
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
            {
              id: "pickup-2",
              sequence: 2,
              fullAddress: "Jl. Raya No. 2, Jakarta Selatan",
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
            {
              id: "dropoff-2",
              sequence: 1,
              fullAddress: "Jl. Merdeka No. 99, Jember",
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
          description:
            "tolong kirim muatan dengan hati hati, jangan sampai rusak dan hancur, terimakasih",
          additionalItems: 7,
          items: [
            {
              name: "Peralatan Rumah Tangga",
              weight: 500,
              dimensions: { length: 2, width: 1, height: 0.8 },
              dimensionUnit: "m",
            },
            {
              name: "Elektronik",
              weight: 200,
              dimensions: { length: 1, width: 0.5, height: 0.4 },
              dimensionUnit: "m",
            },
            {
              name: "Mebel",
              weight: 300,
              dimensions: { length: 2, width: 1, height: 1 },
              dimensionUnit: "m",
            },
            {
              name: "Bahan Bangunan",
              weight: 150,
              dimensions: { length: 1.5, width: 0.7, height: 0.5 },
              dimensionUnit: "m",
            },
            {
              name: "Pakaian",
              weight: 100,
              dimensions: { length: 0.8, width: 0.5, height: 0.3 },
              dimensionUnit: "m",
            },
            {
              name: "Mainan Anak",
              weight: 80,
              dimensions: { length: 0.6, width: 0.4, height: 0.2 },
              dimensionUnit: "m",
            },
            {
              name: "Alat Dapur",
              weight: 70,
              dimensions: { length: 0.5, width: 0.3, height: 0.2 },
              dimensionUnit: "m",
            },
            {
              name: "Buku & Alat Tulis",
              weight: 100,
              dimensions: { length: 0.7, width: 0.4, height: 0.2 },
              dimensionUnit: "m",
            },
          ],
        },
        timeLabels: {
          category: "MUAT_HARI_INI",
          countdown: "99:50:45",
        },

        pricing: {
          potentialIncome: 200000000,
        },
        counters: {
          available: 25,
          viewed: 0,
          saved: 0,
        },
        vehicle: {
          truckCount: 2,
          truckType: "Tractor head 6 x 4 dan Semi Trailer",
          carrierType: "Skeletal Container Jumbo 45 ft  (3 As)",
        },

        additionalServices: [
          { id: "svc-1", serviceName: "Asuransi" },
          { id: "svc-2", serviceName: "Packing" },
          { id: "svc-3", serviceName: "Pengiriman" },
        ],
        photos: [
          "https://picsum.photos/400/300?random=1",
          "https://picsum.photos/400/300?random=2",
          "https://picsum.photos/400/300?random=3",
          "https://picsum.photos/400/300?random=4",
        ],
        isHalalLogistics: true,
        potentialOverload: true,
      },
      {
        id: "uuid2",
        orderCode: "MT2025002",
        reblast: "1",
        shipperInfo: {
          id: "uuid2",
          name: "PT Shipper ABC",
          logo: "https://cdn.example.com/logo.jpg",
          createdAt: "2025-08-20T14:10:00+07:00",
        },
        orderType: "INSTANT",
        loadTimeStart: "2025-08-21T09:00:00Z",
        loadTimeEnd: "2025-08-21T11:00:00Z",
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
              dimensions: { length: 2, width: 1, height: 0.8 },
              dimensionUnit: "m",
            },
            {
              name: "Elektronik",
              weight: 200,
              dimensions: { length: 1, width: 0.5, height: 0.4 },
              dimensionUnit: "m",
            },
            {
              name: "Mebel",
              weight: 300,
              dimensions: { length: 2, width: 1, height: 1 },
              dimensionUnit: "m",
            },
            {
              name: "Bahan Bangunan",
              weight: 150,
              dimensions: { length: 1.5, width: 0.7, height: 0.5 },
              dimensionUnit: "m",
            },
            {
              name: "Pakaian",
              weight: 100,
              dimensions: { length: 0.8, width: 0.5, height: 0.3 },
              dimensionUnit: "m",
            },
            {
              name: "Mainan Anak",
              weight: 80,
              dimensions: { length: 0.6, width: 0.4, height: 0.2 },
              dimensionUnit: "m",
            },
            {
              name: "Alat Dapur",
              weight: 70,
              dimensions: { length: 0.5, width: 0.3, height: 0.2 },
              dimensionUnit: "m",
            },
            {
              name: "Buku & Alat Tulis",
              weight: 100,
              dimensions: { length: 0.7, width: 0.4, height: 0.2 },
              dimensionUnit: "m",
            },
          ],
        },
        timeLabels: {
          category: "MUAT_HARI_INI",
          countdown: "99:50:45",
        },

        pricing: {
          potentialIncome: 200000,
        },
        counters: {
          available: 0,
          viewed: 0,
          saved: 0,
        },
        vehicle: {
          truckCount: 2,
          truckType: "Fuso",
          carrierType: "Agam Tunggal Jaya",
        },
        additionalServices: [{ id: "svc-1", serviceName: "Asuransi" }],
        photos: [
          "https://picsum.photos/400/300?random=5",
          "https://picsum.photos/400/300?random=6",
          "https://picsum.photos/400/300?random=7",
          "https://picsum.photos/400/300?random=8",
        ],
        isHalalLogistics: true,
        potentialOverload: true,
      },
      {
        id: "uuid3",
        orderCode: "MT2025002",
        reblast: "1",
        shipperInfo: {
          id: "uuid2",
          name: "PT Indra Ganteng",
          logo: "https://cdn.example.com/logo.jpg",
          createdAt: "2025-08-20T14:10:00+07:00",
        },
        orderType: "SCHEDULED",
        loadTimeStart: "2025-08-27T09:00:00Z",
        loadTimeEnd: "2025-08-27T11:00:00Z",
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
              dimensions: { length: 2, width: 1, height: 0.8 },
              dimensionUnit: "m",
            },
            {
              name: "Elektronik",
              weight: 200,
              dimensions: { length: 1, width: 0.5, height: 0.4 },
              dimensionUnit: "m",
            },
            {
              name: "Mebel",
              weight: 300,
              dimensions: { length: 2, width: 1, height: 1 },
              dimensionUnit: "m",
            },
            {
              name: "Bahan Bangunan",
              weight: 150,
              dimensions: { length: 1.5, width: 0.7, height: 0.5 },
              dimensionUnit: "m",
            },
            {
              name: "Pakaian",
              weight: 100,
              dimensions: { length: 0.8, width: 0.5, height: 0.3 },
              dimensionUnit: "m",
            },
            {
              name: "Mainan Anak",
              weight: 80,
              dimensions: { length: 0.6, width: 0.4, height: 0.2 },
              dimensionUnit: "m",
            },
            {
              name: "Alat Dapur",
              weight: 70,
              dimensions: { length: 0.5, width: 0.3, height: 0.2 },
              dimensionUnit: "m",
            },
            {
              name: "Buku & Alat Tulis",
              weight: 100,
              dimensions: { length: 0.7, width: 0.4, height: 0.2 },
              dimensionUnit: "m",
            },
          ],
        },
        timeLabels: {
          category: "MUAT_HARI_INI",
          countdown: "99:50:45",
        },

        pricing: {
          potentialIncome: 200000,
        },
        counters: {
          available: 0,
          viewed: 0,
          saved: 0,
        },
        vehicle: {
          truckCount: 2,
          truckType: "Fuso",
          carrierType: "Agam Tunggal Jaya",
        },
        additionalServices: [{ id: "svc-1", serviceName: "Asuransi" }],
        photos: [
          "https://picsum.photos/400/300?random=9",
          "https://picsum.photos/400/300?random=10",
          "https://picsum.photos/400/300?random=11",
          "https://picsum.photos/400/300?random=12",
        ],
        isHalalLogistics: true,
        potentialOverload: true,
      },
      {
        id: "uuid4",
        orderCode: "MT2025002",
        reblast: "1",
        shipperInfo: {
          id: "uuid2",
          name: "PT Indra Ganteng",
          logo: "https://cdn.example.com/logo.jpg",
          createdAt: "2025-08-20T14:10:00+07:00",
        },
        orderType: "SCHEDULED",
        loadTimeStart: "2025-08-23T09:00:00Z",
        loadTimeEnd: "2025-08-23T11:00:00Z",
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
              dimensions: { length: 2, width: 1, height: 0.8 },
              dimensionUnit: "m",
            },
            {
              name: "Elektronik",
              weight: 200,
              dimensions: { length: 1, width: 0.5, height: 0.4 },
              dimensionUnit: "m",
            },
            {
              name: "Mebel",
              weight: 300,
              dimensions: { length: 2, width: 1, height: 1 },
              dimensionUnit: "m",
            },
            {
              name: "Bahan Bangunan",
              weight: 150,
              dimensions: { length: 1.5, width: 0.7, height: 0.5 },
              dimensionUnit: "m",
            },
            {
              name: "Pakaian",
              weight: 100,
              dimensions: { length: 0.8, width: 0.5, height: 0.3 },
              dimensionUnit: "m",
            },
            {
              name: "Mainan Anak",
              weight: 80,
              dimensions: { length: 0.6, width: 0.4, height: 0.2 },
              dimensionUnit: "m",
            },
            {
              name: "Alat Dapur",
              weight: 70,
              dimensions: { length: 0.5, width: 0.3, height: 0.2 },
              dimensionUnit: "m",
            },
            {
              name: "Buku & Alat Tulis",
              weight: 100,
              dimensions: { length: 0.7, width: 0.4, height: 0.2 },
              dimensionUnit: "m",
            },
          ],
        },
        timeLabels: {
          category: "MUAT_HARI_INI",
          countdown: "99:50:45",
        },

        pricing: {
          potentialIncome: 200000,
        },
        counters: {
          available: 0,
          viewed: 0,
          saved: 0,
        },
        vehicle: {
          truckCount: 2,
          truckType: "Fuso",
          carrierType: "Agam Tunggal Jaya",
        },
        additionalServices: [{ id: "svc-1", serviceName: "Asuransi" }],
        photos: [
          "https://picsum.photos/400/300?random=9",
          "https://picsum.photos/400/300?random=10",
          "https://picsum.photos/400/300?random=11",
          "https://picsum.photos/400/300?random=12",
        ],
        isHalalLogistics: true,
        potentialOverload: true,
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
      all: 10,
      instant: 1,
      scheduled: 1,
      halal: 1,
      hasBlinkNode: true,
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
    ? `/v1/cs/transport-request?${queryString}`
    : "/v1/cs/transport-request";

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
