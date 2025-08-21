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
  data: {
    Message: {
      Code: 200,
      Text: "Transport requests retrieved successfully",
    },
    Data: {
      requests: [
        {
          id: "550e8400-e29b-41d4-a716-446655440001",
          orderCode: "MT-2025-001",
          orderType: "INSTANT",
          orderStatus: "PREPARE_FLEET",
          isNew: true,
          isHalalLogistics: true,
          isSaved: false,
          isTaken: false,
          loadTimeStart: "2025-01-15T09:00:00+07:00",
          loadTimeEnd: "2025-01-15T11:00:00+07:00",
          estimatedDistance: 25.5,
          totalPrice: 1500000.0,
          truckCount: 1,
          truckTypeName: "Fuso 6 Roda",
          carrierName: "Box",
          hasOverload: true,
          hasAdditionalService: true,
          pickupLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440011",
              locationType: "PICKUP",
              sequence: 1,
              fullAddress:
                "Kab. Ogan Komering Ulu, Kec. Kedaton Peninjauan Raya",
              detailAddress: "Gedung A Lantai 5",
              latitude: -6.2088,
              longitude: 106.8456,
              district: "Kedaton Peninjauan Raya",
              city: "Ogan Komering Ulu",
              province: "Sumatera Selatan",
              postalCode: "32361",
              picName: "John Doe",
              picPhoneNumber: "081234567890",
            },
            {
              id: "550e8400-e29b-41d4-a716-446655440012",
              locationType: "PICKUP",
              sequence: 2,
              fullAddress:
                "Kab. Kepulauan Siau Tagulandang Biaro, Kec. Tagulandang Selatan Selatan",
              detailAddress: "Warehouse A",
              latitude: -6.21,
              longitude: 106.85,
              district: "Tagulandang Selatan Selatan",
              city: "Kepulauan Siau Tagulandang Biaro",
              province: "Sulawesi Utara",
              postalCode: "32362",
              picName: "Jane Doe",
              picPhoneNumber: "081234567891",
            },
          ],
          dropoffLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440013",
              locationType: "DROPOFF",
              sequence: 1,
              fullAddress: "Kab. Pasuruan, Kec. Klojen",
              detailAddress: "Warehouse B",
              latitude: -6.921,
              longitude: 107.604,
              district: "Klojen",
              city: "Pasuruan",
              province: "Jawa Timur",
              postalCode: "40112",
              picName: "Jane Smith",
              picPhoneNumber: "081234567891",
            },
            {
              id: "550e8400-e29b-41d4-a716-446655440014",
              locationType: "DROPOFF",
              sequence: 2,
              fullAddress: "Kab. Malang, Kec. Singosari",
              detailAddress: "Warehouse C",
              latitude: -7.889,
              longitude: 112.666,
              district: "Singosari",
              city: "Malang",
              province: "Jawa Timur",
              postalCode: "65153",
              picName: "Bob Wilson",
              picPhoneNumber: "081234567892",
            },
          ],
          cargos: [
            {
              id: "550e8400-e29b-41d4-a716-446655440013",
              name: "Besi Baja",
              weight: 1000.0,
              weightUnit: "kg",
              sequence: 1,
            },
            {
              id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              name: "Semen Sak",
              weight: 2500.0,
              weightUnit: "kg",
              sequence: 2,
            },
            {
              id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
              name: "Pipa PVC",
              weight: 500.5,
              weightUnit: "kg",
              sequence: 3,
            },
            {
              id: "123e4567-e89b-12d3-a456-426614174000",
              name: "Pasir",
              weight: 5000.0,
              weightUnit: "kg",
              sequence: 4,
            },
            {
              id: "987e6543-e21b-21d3-b456-426614174001",
              name: "Keramik Lantai",
              weight: 1250.0,
              weightUnit: "kg",
              sequence: 5,
            },
            {
              id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
              name: "Cat Tembok",
              weight: 350.75,
              weightUnit: "kg",
              sequence: 6,
            },
            {
              id: "fedcba98-7654-3210-fedc-ba9876543210",
              name: "Kayu Balok",
              weight: 1800.0,
              weightUnit: "kg",
              sequence: 7,
            },
            {
              id: "00112233-4455-6677-8899-aabbccddeeff",
              name: "Genteng",
              weight: 2200.0,
              weightUnit: "kg",
              sequence: 8,
            },
          ],
          additionalServices: [
            {
              id: "550e8400-e29b-41d4-a716-446655440014",
              serviceName: "Kirim Berkas",
            },
          ],
          photos: [
            {
              photoUrl: "https://picsum.photos/400/300?random=1",
            },
            {
              photoUrl: "https://picsum.photos/400/300?random=2",
            },
            {
              photoUrl: "https://picsum.photos/400/300?random=3",
            },
            {
              photoUrl: "https://picsum.photos/400/300?random=4",
            },
          ],
          createdAt: "2025-01-15T08:00:00+07:00",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440002",
          orderCode: "MT-2025-001",
          orderType: "INSTANT",
          orderStatus: "PREPARE_FLEET",
          isNew: true,
          isHalalLogistics: true,
          isSaved: false,
          isTaken: true,
          loadTimeStart: "2025-01-15T09:00:00+07:00",
          loadTimeEnd: "2025-01-15T11:00:00+07:00",
          estimatedDistance: 25.5,
          totalPrice: 1500000.0,
          truckCount: 1,
          truckTypeName: "Fuso 6 Roda",
          carrierName: "Box",
          hasOverload: false,
          hasAdditionalService: true,
          pickupLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440011",
              locationType: "PICKUP",
              sequence: 1,
              fullAddress:
                "Kab. Ogan Komering Ulu, Kec. Kedaton Peninjauan Raya",
              detailAddress: "Gedung A Lantai 5",
              latitude: -6.2088,
              longitude: 106.8456,
              district: "Kedaton Peninjauan Raya",
              city: "Ogan Komering Ulu",
              province: "Sumatera Selatan",
              postalCode: "32361",
              picName: "John Doe",
              picPhoneNumber: "081234567890",
            },
            {
              id: "550e8400-e29b-41d4-a716-446655440012",
              locationType: "PICKUP",
              sequence: 2,
              fullAddress:
                "Kab. Kepulauan Siau Tagulandang Biaro, Kec. Tagulandang Selatan Selatan",
              detailAddress: "Warehouse A",
              latitude: -6.21,
              longitude: 106.85,
              district: "Tagulandang Selatan Selatan",
              city: "Kepulauan Siau Tagulandang Biaro",
              province: "Sulawesi Utara",
              postalCode: "32362",
              picName: "Jane Doe",
              picPhoneNumber: "081234567891",
            },
          ],
          dropoffLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440013",
              locationType: "DROPOFF",
              sequence: 1,
              fullAddress: "Kab. Pasuruan, Kec. Klojen",
              detailAddress: "Warehouse B",
              latitude: -6.921,
              longitude: 107.604,
              district: "Klojen",
              city: "Pasuruan",
              province: "Jawa Timur",
              postalCode: "40112",
              picName: "Jane Smith",
              picPhoneNumber: "081234567891",
            },
            {
              id: "550e8400-e29b-41d4-a716-446655440014",
              locationType: "DROPOFF",
              sequence: 2,
              fullAddress: "Kab. Malang, Kec. Singosari",
              detailAddress: "Warehouse C",
              latitude: -7.889,
              longitude: 112.666,
              district: "Singosari",
              city: "Malang",
              province: "Jawa Timur",
              postalCode: "65153",
              picName: "Bob Wilson",
              picPhoneNumber: "081234567892",
            },
          ],
          cargos: [
            {
              id: "550e8400-e29b-41d4-a716-446655440013",
              name: "Besi Baja",
              weight: 1000.0,
              weightUnit: "kg",
              sequence: 1,
            },
            {
              id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              name: "Semen Sak",
              weight: 2500.0,
              weightUnit: "kg",
              sequence: 2,
            },
            {
              id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
              name: "Pipa PVC",
              weight: 500.5,
              weightUnit: "kg",
              sequence: 3,
            },
            {
              id: "123e4567-e89b-12d3-a456-426614174000",
              name: "Pasir",
              weight: 5000.0,
              weightUnit: "kg",
              sequence: 4,
            },
            {
              id: "987e6543-e21b-21d3-b456-426614174001",
              name: "Keramik Lantai",
              weight: 1250.0,
              weightUnit: "kg",
              sequence: 5,
            },
            {
              id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
              name: "Cat Tembok",
              weight: 350.75,
              weightUnit: "kg",
              sequence: 6,
            },
            {
              id: "fedcba98-7654-3210-fedc-ba9876543210",
              name: "Kayu Balok",
              weight: 1800.0,
              weightUnit: "kg",
              sequence: 7,
            },
            {
              id: "00112233-4455-6677-8899-aabbccddeeff",
              name: "Genteng",
              weight: 2200.0,
              weightUnit: "kg",
              sequence: 8,
            },
          ],
          additionalServices: [
            {
              id: "550e8400-e29b-41d4-a716-446655440014",
              serviceName: "Kirim Berkas",
            },
          ],
          photos: [
            {
              photoUrl: "https://picsum.photos/400/300?random=1",
            },
            {
              photoUrl: "https://picsum.photos/400/300?random=2",
            },
            {
              photoUrl: "https://picsum.photos/400/300?random=3",
            },
            {
              photoUrl: "https://picsum.photos/400/300?random=4",
            },
          ],
          createdAt: "2025-01-15T08:00:00+07:00",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440003",
          orderCode: "MT-2025-001",
          orderType: "SCHEDULED",
          orderStatus: "PREPARE_FLEET",
          isNew: false,
          isHalalLogistics: true,
          isSaved: false,
          isTaken: false,
          loadTimeStart: "2025-01-21T09:00:00+07:00",
          loadTimeEnd: "2025-01-21T11:00:00+07:00",
          estimatedDistance: 25.5,
          totalPrice: 1500000.0,
          truckCount: 1,
          truckTypeName: "Fuso 6 Roda",
          carrierName: "Box",
          hasOverload: false,
          hasAdditionalService: true,
          pickupLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440011",
              locationType: "PICKUP",
              sequence: 1,
              fullAddress:
                "Kab. Ogan Komering Ulu, Kec. Kedaton Peninjauan Raya",
              detailAddress: "Gedung A Lantai 5",
              latitude: -6.2088,
              longitude: 106.8456,
              district: "Kedaton Peninjauan Raya",
              city: "Ogan Komering Ulu",
              province: "Sumatera Selatan",
              postalCode: "32361",
              picName: "John Doe",
              picPhoneNumber: "081234567890",
            },
            {
              id: "550e8400-e29b-41d4-a716-446655440012",
              locationType: "PICKUP",
              sequence: 2,
              fullAddress:
                "Kab. Kepulauan Siau Tagulandang Biaro, Kec. Tagulandang Selatan Selatan",
              detailAddress: "Warehouse A",
              latitude: -6.21,
              longitude: 106.85,
              district: "Tagulandang Selatan Selatan",
              city: "Kepulauan Siau Tagulandang Biaro",
              province: "Sulawesi Utara",
              postalCode: "32362",
              picName: "Jane Doe",
              picPhoneNumber: "081234567891",
            },
          ],
          dropoffLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440013",
              locationType: "DROPOFF",
              sequence: 1,
              fullAddress: "Kab. Pasuruan, Kec. Klojen",
              detailAddress: "Warehouse B",
              latitude: -6.921,
              longitude: 107.604,
              district: "Klojen",
              city: "Pasuruan",
              province: "Jawa Timur",
              postalCode: "40112",
              picName: "Jane Smith",
              picPhoneNumber: "081234567891",
            },
            {
              id: "550e8400-e29b-41d4-a716-446655440014",
              locationType: "DROPOFF",
              sequence: 2,
              fullAddress: "Kab. Malang, Kec. Singosari",
              detailAddress: "Warehouse C",
              latitude: -7.889,
              longitude: 112.666,
              district: "Singosari",
              city: "Malang",
              province: "Jawa Timur",
              postalCode: "65153",
              picName: "Bob Wilson",
              picPhoneNumber: "081234567892",
            },
          ],
          cargos: [
            {
              id: "550e8400-e29b-41d4-a716-446655440013",
              name: "Besi Baja",
              weight: 1000.0,
              weightUnit: "kg",
              sequence: 1,
            },
            {
              id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              name: "Semen Sak",
              weight: 2500.0,
              weightUnit: "kg",
              sequence: 2,
            },
            {
              id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
              name: "Pipa PVC",
              weight: 500.5,
              weightUnit: "kg",
              sequence: 3,
            },
            {
              id: "123e4567-e89b-12d3-a456-426614174000",
              name: "Pasir",
              weight: 5000.0,
              weightUnit: "kg",
              sequence: 4,
            },
            {
              id: "987e6543-e21b-21d3-b456-426614174001",
              name: "Keramik Lantai",
              weight: 1250.0,
              weightUnit: "kg",
              sequence: 5,
            },
            {
              id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
              name: "Cat Tembok",
              weight: 350.75,
              weightUnit: "kg",
              sequence: 6,
            },
            {
              id: "fedcba98-7654-3210-fedc-ba9876543210",
              name: "Kayu Balok",
              weight: 1800.0,
              weightUnit: "kg",
              sequence: 7,
            },
            {
              id: "00112233-4455-6677-8899-aabbccddeeff",
              name: "Genteng",
              weight: 2200.0,
              weightUnit: "kg",
              sequence: 8,
            },
          ],
          additionalServices: [
            {
              id: "550e8400-e29b-41d4-a716-446655440014",
              serviceName: "Kirim Berkas",
            },
          ],
          photos: [
            {
              photoUrl: "https://picsum.photos/400/300?random=1",
            },
            {
              photoUrl: "https://picsum.photos/400/300?random=2",
            },
            {
              photoUrl: "https://picsum.photos/400/300?random=3",
            },
            {
              photoUrl: "https://picsum.photos/400/300?random=4",
            },
          ],
          createdAt: "2025-01-15T08:00:00+07:00",
        },
      ],
      tabCounts: {
        tersedia: 10,
        halal_logistik: 3,
        disimpan: 2,
      },
      userStatus: {
        isSuspended: false,
        driverDelegationEnabled: false,
        isHalalCertified: true,
      },
      pagination: {
        totalFleets: 25,
        currentPage: 1,
        totalPages: 3,
      },
    },
    Type: "GET_TRANSPORT_REQUEST_LIST",
  },
};

export const fetcherTransportRequestList = async (params = {}) => {
  if (IS_MOCK) {
    const result = JSON.parse(JSON.stringify(apiResultTransportRequestList));

    if (result.data.Data.showEmptyState) {
      return result.data.Data;
    }

    // Simpan semua request original dan inject isSuspended from userStatus
    const userStatus = result.data.Data.userStatus || {};
    const originalRequests = result.data.Data.requests.map((req) => ({
      ...req,
      isSuspended: userStatus.isSuspended,
    }));

    // Hitung tabCounts sekali di awal
    const tabCounts = result.data.Data.tabCounts || {
      tersedia: 0,
      halal_logistik: 0,
      disimpan: 0,
    };

    // Lanjut filter untuk tampilan saja
    let filteredRequests = [...originalRequests];

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

    // Hitung request baru dari filtered data
    const newRequests = filteredRequests.filter((req) => req.isNew);
    const newRequestsCount = {
      total: newRequests.length,
      display: newRequests.length > 99 ? "99+" : newRequests.length.toString(),
      hasAnimation: newRequests.length > 0,
    };

    // Return data
    return {
      ...result.data.Data,
      requests: filteredRequests,
      tabCounts,
      newRequestsCount,
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
