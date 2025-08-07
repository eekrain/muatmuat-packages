import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// Mock configuration for testing different states
const isMockTransportRequestList = true;

// Testing configurations - Change these values to test different states:
const MOCK_CONFIG = {
  // UI States to test:
  showEmptyState: false, // true = empty state, false = show requests
  isSuspended: false, // true = suspended account, false = normal account
  driverDelegationEnabled: true, // true = show delegation warning, false = normal account
  isHalalCertified: true, // false = show halal certification warning, true = certified

  // Quick toggle functions for easy testing:
  // 1. Empty state: showEmptyState=true, isSuspended=false, driverDelegationEnabled=false, isHalalCertified=true
  // 2. Normal state: showEmptyState=false, isSuspended=false, driverDelegationEnabled=false, isHalalCertified=true
  // 3. Suspended state: showEmptyState=false, isSuspended=true, driverDelegationEnabled=false, isHalalCertified=true
  // 4. Driver delegation: showEmptyState=false, isSuspended=false, driverDelegationEnabled=true, isHalalCertified=true
  // 5. Halal certification needed: showEmptyState=false, isSuspended=false, driverDelegationEnabled=false, isHalalCertified=false
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
          orderCode: "MT25A001A",
          orderType: "INSTANT",
          orderStatus: "PREPARE_FLEET",
          isNew: true,
          isHalalLogistics: true,
          isSaved: false,
          loadTimeStart: "2025-08-07T09:00:00+07:00",
          loadTimeEnd: "2025-08-07T11:00:00+07:00",
          estimatedDistance: 121,
          totalPrice: 1500000.0,
          truckCount: 1,
          truckTypeName: "Colt Diesel Engkel",
          carrierName: "Box",
          hasOverload: true,
          hasAdditionalService: true,
          pickupLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440011",
              sequence: 1,
              fullAddress: "Kota Surabaya, Kec. Tegalsari",
              city: "Surabaya",
              province: "Jawa Timur",
            },
          ],
          dropoffLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440012",
              sequence: 1,
              fullAddress: "Kab. Pasuruan, Kec. Klojen",
              city: "Pasuruan",
              province: "Jawa Timur",
            },
          ],
          cargos: [
            {
              id: "550e8400-e29b-41d4-a716-446655440013",
              name: "Peralatan Tangga",
              weight: 2500,
              weightUnit: "kg",
              sequence: 1,
            },
            {
              id: "550e8400-e29b-41d4-a716-44665544123",
              name: "Peralatan kocag",
              weight: 2500,
              weightUnit: "kg",
              sequence: 1,
            },
          ],
          additionalServices: [
            {
              id: "550e8400-e29b-41d4-a716-446655440014",
              serviceName: "Bantuan Tambahan, Kirim Berkas",
            },
          ],
          photos: [
            {
              id: "550e8400-e29b-41d4-a716-446655440015",
              photoUrl: "https://storage.example.com/photo1.jpg",
              photoType: "cargo",
            },
          ],
          timeLabel: {
            text: "Muat Hari Ini",
            color: "green",
            daysFromNow: 0,
          },
          loadTimeText: "Muat Hari Ini",
          loadDateTime: "07 Agu 2025 09:00 WIB s/d 11:00 WIB",
          potentialEarnings: "Rp999.999.999",
          overloadPotential: "Potensi Overload",
          createdAt: "2025-08-06T08:00:00+07:00",
          newRequestDuration: "2 menit yang lalu",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440002",
          orderCode: "MT25A002B",
          orderType: "SCHEDULED",
          orderStatus: "PREPARE_FLEET",
          isNew: true,
          isHalalLogistics: false,
          isSaved: true,
          loadTimeStart: "2025-08-22T10:00:00+07:00",
          loadTimeEnd: "2025-08-22T12:00:00+07:00",
          estimatedDistance: 85,
          totalPrice: 650000.0,
          truckCount: 2,
          truckTypeName: "Colt Diesel Double",
          carrierName: "Box",
          hasOverload: false,
          hasAdditionalService: true,
          pickupLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440021",
              sequence: 1,
              fullAddress: "Kota Surabaya, Kec. Tegalsari",
              city: "Surabaya",
              province: "Jawa Timur",
            },
          ],
          dropoffLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440022",
              sequence: 1,
              fullAddress: "Kab. Pasuruan, Kec. Klojen",
              city: "Pasuruan",
              province: "Jawa Timur",
            },
          ],
          cargos: [
            {
              id: "550e8400-e29b-41d4-a716-446655440023",
              name: "Material Bangunan",
              weight: 3000,
              weightUnit: "kg",
              sequence: 1,
            },
          ],
          additionalServices: [
            {
              id: "550e8400-e29b-41d4-a716-446655440024",
              serviceName: "Muat Besok",
            },
          ],
          photos: [],
          timeLabel: {
            text: "Muat 15 Hari Lagi",
            color: "blue",
            daysFromNow: 15,
          },
          loadTimeText: "Muat 15 Hari Lagi",
          loadDateTime: "22 Agu 2025 10:00 WIB s/d 12:00 WIB",
          potentialEarnings: "Rp650.000",
          createdAt: "2025-08-06T05:30:00+07:00",
          newRequestDuration: "3 jam yang lalu",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440007",
          orderCode: "MT25A007G",
          orderType: "INSTANT",
          orderStatus: "PREPARE_FLEET",
          isNew: false,
          isHalalLogistics: false,
          isSaved: true,
          loadTimeStart: "2025-08-07T16:30:00+07:00",
          loadTimeEnd: "2025-08-07T18:30:00+07:00",
          estimatedDistance: 32,
          totalPrice: 350000.0,
          truckCount: 1,
          truckTypeName: "Pick Up",
          carrierName: "Terbuka",
          hasOverload: false,
          hasAdditionalService: true,
          pickupLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440071",
              sequence: 1,
              fullAddress: "Kota Tangerang, Kec. Karawaci",
              city: "Tangerang",
              province: "Banten",
            },
          ],
          dropoffLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440072",
              sequence: 1,
              fullAddress: "Kota Jakarta Barat, Kec. Kebon Jeruk",
              city: "Jakarta Barat",
              province: "DKI Jakarta",
            },
          ],
          cargos: [
            {
              id: "550e8400-e29b-41d4-a716-446655440073",
              name: "Dokumen Penting",
              weight: 15,
              weightUnit: "kg",
              sequence: 1,
            },
          ],
          additionalServices: [
            {
              id: "550e8400-e29b-41d4-a716-446655440074",
              serviceName: "Pengiriman Ekspres",
            },
          ],
          photos: [],
          timeLabel: {
            text: "Instan",
            color: "green",
            daysFromNow: 0,
          },
          loadTimeText: "Muat Hari Ini",
          loadDateTime: "07 Agu 2025 16:30 WIB s/d 18:30 WIB",
          potentialEarnings: "Rp350.000",
          createdAt: "2025-08-06T10:15:00+07:00",
        },
      ],
      // newRequestsCount: {
      //   total: 18, // 2-digit counter to test blinking animation (10-99 range)
      //   display: "18",
      //   hasAnimation: true,
      // },
      // tabCounts: {
      //   tersedia: 35, // 2-digit total to test counter display and animation
      //   halal_logistik: 22, // 2-digit halal requests to test animation
      //   disimpan: 8, // Single digit saved requests
      // },
      userStatus: {
        isSuspended: MOCK_CONFIG.isSuspended,
        driverDelegationEnabled: MOCK_CONFIG.driverDelegationEnabled,
        isHalalCertified: MOCK_CONFIG.isHalalCertified,
        suspensionReason: "Akun Kamu Ditangguhkan",
        suspensionMessage: "Hubungi dukungan pelanggan untuk aktivasi kembali",
        supportContactUrl: "tel:+62-811-1234-5678",
        delegationWarningMessage:
          "Tidak dapat menerima atau menolak pesanan secara langsung",
        delegationResetUrl: "/settings/driver-delegation",
        halalCertificationMessage:
          "Tambahkan sertifikasi halal dengan menghubungi kami",
        halalCertificationUrl: "tel:+62-811-1234-5678",
      },
      showEmptyState: MOCK_CONFIG.showEmptyState,
    },
    Type: "GET_TRANSPORT_REQUEST_LIST",
  },
};

export const fetcherTransportRequestList = async (params = {}) => {
  console.log("🚀 fetcherTransportRequestList called with params:", params);

  if (isMockTransportRequestList) {
    // Simulate filtering, searching, and sorting
    // IMPORTANT: Use deep copy to avoid mutations between different filter calls
    const result = JSON.parse(JSON.stringify(apiResultTransportRequestList));

    console.log(
      "📋 Initial mock data requests count:",
      result.data.Data.requests.length
    );

    // Check if we should show empty state for testing
    if (result.data.Data.showEmptyState) {
      return {
        ...result.data.Data,
        requests: [],
        tabCounts: {
          tersedia: 0,
          halal_logistik: 0,
          disimpan: 0,
        },
        newRequestsCount: {
          total: 0,
          display: "0",
          hasAnimation: false,
        },
      };
    }

    // Calculate tab counts FIRST based on original data (before any filtering)
    const originalRequests = [...result.data.Data.requests];
    console.log(
      "📊 Calculating tabCounts from originalRequests:",
      originalRequests.length
    );
    console.log(
      "📊 Original requests data:",
      originalRequests.map((req) => ({
        id: req.id,
        orderCode: req.orderCode,
        isHalalLogistics: req.isHalalLogistics,
        isSaved: req.isSaved,
      }))
    );

    result.data.Data.tabCounts = {
      tersedia: originalRequests.length,
      halal_logistik: originalRequests.filter((req) => req.isHalalLogistics)
        .length,
      disimpan: originalRequests.filter((req) => req.isSaved).length,
    };

    console.log("📊 Calculated tabCounts:", result.data.Data.tabCounts);

    // Apply filters if provided
    if (params.orderStatus) {
      result.data.Data.requests = result.data.Data.requests.filter(
        (req) => req.orderStatus === params.orderStatus
      );
    }

    if (params.orderType) {
      result.data.Data.requests = result.data.Data.requests.filter(
        (req) => req.orderType === params.orderType
      );
    }

    if (params.isHalalLogistics !== undefined) {
      result.data.Data.requests = result.data.Data.requests.filter(
        (req) => req.isHalalLogistics === params.isHalalLogistics
      );
    }

    if (params.isSaved !== undefined) {
      console.log("🔍 Filtering by isSaved:", params.isSaved);
      console.log(
        "📋 Before filter - requests count:",
        result.data.Data.requests.length
      );
      result.data.Data.requests = result.data.Data.requests.filter(
        (req) => req.isSaved === params.isSaved
      );
      console.log(
        "📋 After filter - requests count:",
        result.data.Data.requests.length
      );
      console.log(
        "📋 Filtered requests:",
        result.data.Data.requests.map((req) => ({
          id: req.id,
          orderCode: req.orderCode,
          isSaved: req.isSaved,
        }))
      );
    }

    if (params.isNew !== undefined) {
      result.data.Data.requests = result.data.Data.requests.filter(
        (req) => req.isNew === params.isNew
      );
    }

    if (params.truckTypeName) {
      result.data.Data.requests = result.data.Data.requests.filter(
        (req) => req.truckTypeName === params.truckTypeName
      );
    }

    if (params.carrierName) {
      result.data.Data.requests = result.data.Data.requests.filter(
        (req) => req.carrierName === params.carrierName
      );
    }

    // Apply search if provided
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      result.data.Data.requests = result.data.Data.requests.filter(
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

    // Apply sorting if provided
    if (params.sortBy) {
      result.data.Data.requests.sort((a, b) => {
        let aValue = a[params.sortBy];
        let bValue = b[params.sortBy];

        // Handle date sorting
        if (
          params.sortBy === "loadTimeStart" ||
          params.sortBy === "createdAt"
        ) {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        // Handle price sorting
        if (params.sortBy === "totalPrice") {
          aValue = parseFloat(aValue);
          bValue = parseFloat(bValue);
        }

        if (params.sortOrder === "desc") {
          return aValue > bValue ? -1 : 1;
        }
        return aValue < bValue ? -1 : 1;
      });
    }

    // Update new requests count based on filtered results
    const filteredRequests = result.data.Data.requests;
    const newRequests = filteredRequests.filter((req) => req.isNew);
    result.data.Data.newRequestsCount = {
      total: newRequests.length,
      display: newRequests.length > 99 ? "99+" : newRequests.length.toString(),
      hasAnimation: newRequests.length > 0,
    };

    return result.data.Data;
  }

  // Build query parameters
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
  // Create cache key based on parameters
  const cacheKey = params
    ? `transport-request-list-${JSON.stringify(params)}`
    : "transport-request-list";

  console.log("🔑 SWR Cache Key:", cacheKey);
  console.log("🔑 Params for cache:", params);

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
