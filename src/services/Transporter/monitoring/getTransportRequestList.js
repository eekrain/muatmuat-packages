import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const isMockTransportRequestList = true;

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
          orderType: "SCHEDULED",
          orderStatus: "PREPARE_FLEET",
          isNew: true,
          isHalalLogistics: false,
          isSaved: false,
          loadTimeStart: "2025-01-10T09:00:00+07:00",
          loadTimeEnd: "2025-01-10T11:00:00+07:00",
          estimatedDistance: 121,
          totalPrice: 800000.0,
          truckCount: 3,
          truckTypeName: "Colt Diesel Engkel",
          carrierName: "Box",
          hasOverload: true,
          hasAdditionalService: true,
          pickupLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440011",
              sequence: 1,
              fullAddress:
                "Kab. Ogan Komering Ulu, Kec. Kedaton Peninjauan Raya",
              city: "Ogan Komering Ulu",
              province: "Sumatera Selatan",
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
              name: "Besi Baja",
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
            text: "Terjadwal",
            color: "blue",
            daysFromNow: 7,
          },
          loadTimeText: "Muat Hari Ini",
          loadDateTime: "10 Jan 2025 09:00 WIB s/d 11:00 WIB",
          potentialEarnings: "Rp800.000",
          overloadPotential: "Potensi Overload",
          createdAt: "2025-08-05T08:00:00+07:00",
          newRequestDuration: "2 jam yang lalu",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440002",
          orderCode: "MT25A002B",
          orderType: "INSTANT",
          orderStatus: "PREPARE_FLEET",
          isNew: true,
          isHalalLogistics: false,
          isSaved: false,
          loadTimeStart: "2025-08-06T10:00:00+07:00",
          loadTimeEnd: "2025-08-06T12:00:00+07:00",
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
            text: "Instan",
            color: "green",
            daysFromNow: 1,
          },
          loadTimeText: "Muat Besok",
          loadDateTime: "06 Agu 2025 10:00 WIB s/d 12:00 WIB",
          potentialEarnings: "Rp650.000",
          createdAt: "2025-08-05T07:30:00+07:00",
          newRequestDuration: "30 menit yang lalu",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440003",
          orderCode: "MT25A003C",
          orderType: "SCHEDULED",
          orderStatus: "PREPARE_FLEET",
          isNew: true,
          isHalalLogistics: true,
          isSaved: false,
          loadTimeStart: "2025-08-08T14:00:00+07:00",
          loadTimeEnd: "2025-08-08T16:00:00+07:00",
          estimatedDistance: 75,
          totalPrice: 550000.0,
          truckCount: 1,
          truckTypeName: "Pick Up",
          carrierName: "Terbuka",
          hasOverload: false,
          hasAdditionalService: true,
          pickupLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440031",
              sequence: 1,
              fullAddress: "Kota Surabaya, Kec. Gubeng",
              city: "Surabaya",
              province: "Jawa Timur",
            },
          ],
          dropoffLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440032",
              sequence: 1,
              fullAddress: "Kota Malang, Kec. Klojen",
              city: "Malang",
              province: "Jawa Timur",
            },
          ],
          cargos: [
            {
              id: "550e8400-e29b-41d4-a716-446655440033",
              name: "Produk Halal",
              weight: 800,
              weightUnit: "kg",
              sequence: 1,
            },
          ],
          additionalServices: [
            {
              id: "550e8400-e29b-41d4-a716-446655440034",
              serviceName: "Asuransi Barang",
            },
          ],
          photos: [],
          timeLabel: {
            text: "Terjadwal",
            color: "blue",
            daysFromNow: 3,
          },
          loadTimeText: "Muat 3 Hari Lagi",
          loadDateTime: "08 Agu 2025 14:00 WIB s/d 16:00 WIB",
          potentialEarnings: "Rp550.000",
          createdAt: "2025-08-05T06:15:00+07:00",
          newRequestDuration: "1 jam yang lalu",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440004",
          orderCode: "MT25A004D",
          orderType: "SCHEDULED",
          orderStatus: "PREPARE_FLEET",
          isNew: true,
          isHalalLogistics: false,
          isSaved: true,
          loadTimeStart: "2025-08-12T08:00:00+07:00",
          loadTimeEnd: "2025-08-12T10:00:00+07:00",
          estimatedDistance: 45,
          totalPrice: 400000.0,
          truckCount: 1,
          truckTypeName: "Pick Up",
          carrierName: "Terbuka",
          hasOverload: false,
          hasAdditionalService: false,
          pickupLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440041",
              sequence: 1,
              fullAddress: "Kota Jakarta, Kec. Menteng",
              city: "Jakarta",
              province: "DKI Jakarta",
            },
          ],
          dropoffLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440042",
              sequence: 1,
              fullAddress: "Kota Depok, Kec. Pancoran Mas",
              city: "Depok",
              province: "Jawa Barat",
            },
          ],
          cargos: [
            {
              id: "550e8400-e29b-41d4-a716-446655440043",
              name: "Furniture",
              weight: 500,
              weightUnit: "kg",
              sequence: 1,
            },
          ],
          additionalServices: [],
          photos: [],
          timeLabel: {
            text: "Terjadwal",
            color: "blue",
            daysFromNow: 7,
          },
          loadTimeText: "Muat 7 Hari Lagi",
          loadDateTime: "12 Agu 2025 08:00 WIB s/d 10:00 WIB",
          potentialEarnings: "Rp400.000",
          createdAt: "2025-08-05T05:00:00+07:00",
          newRequestDuration: "7 jam yang lalu",
        },
      ],
      newRequestsCount: {
        total: 3,
        display: "3",
        hasAnimation: true,
      },
      tabCounts: {
        tersedia: 4,
        halal_logistik: 1,
        disimpan: 1,
      },
      userStatus: {
        isSuspended: false,
        driverDelegationEnabled: false,
        isHalalCertified: true,
      },
    },
    Type: "GET_TRANSPORT_REQUEST_LIST",
  },
};

export const fetcherTransportRequestList = async (params = {}) => {
  if (isMockTransportRequestList) {
    // Simulate filtering, searching, and sorting
    const result = { ...apiResultTransportRequestList };

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
      result.data.Data.requests = result.data.Data.requests.filter(
        (req) => req.isSaved === params.isSaved
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

    // Update tab counts based on filtered results
    const filteredRequests = result.data.Data.requests;
    result.data.Data.tabCounts = {
      tersedia: filteredRequests.length,
      halal_logistik: filteredRequests.filter((req) => req.isHalalLogistics)
        .length,
      disimpan: filteredRequests.filter((req) => req.isSaved).length,
    };

    // Update new requests count
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
