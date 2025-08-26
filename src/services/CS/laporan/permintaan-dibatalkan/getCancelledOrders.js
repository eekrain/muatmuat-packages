import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false;

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Data berhasil diambil",
    },
    Data: {
      orders: [
        {
          id: "uuid",
          orderCode: "MT2024010001",
          cancelledAt: "2024-01-15T10:30:00Z",
          orderType: "INSTANT",
          loadTimeStart: "2024-01-15T08:00:00Z",
          loadTimeEnd: "2024-01-15T12:00:00Z",
          pickupLocations: [
            {
              fullAddress: "Jl. Sudirman No. 1",
              district: "Menteng",
              city: "Jakarta Pusat",
            },
          ],
          dropoffLocations: [
            {
              fullAddress: "Jl. Thamrin No. 2",
              district: "Tanah Abang",
              city: "Jakarta Pusat",
            },
          ],
          truckTypeName: "Pickup",
          truckHead: "Cdd",
          truckCarrier: "Box",
          unit: 10,
          cargo: "1000 kg",
          requestCount: 2,
          hasMultipleLocations: true,
          shipper: {
            companyName: "PT Maju Jaya",
            fullName: "John Doe",
          },
        },
        {
          id: "uuid",
          orderCode: "MT2024010001",
          cancelledAt: "2024-01-15T10:30:00Z",
          orderType: "INSTANT",
          loadTimeStart: "2024-01-15T08:00:00Z",
          loadTimeEnd: "2024-01-15T12:00:00Z",
          pickupLocations: [
            {
              fullAddress: "Jl. Sudirman No. 1",
              district: "Menteng",
              city: "Jakarta Pusat",
            },
          ],
          dropoffLocations: [
            {
              fullAddress: "Jl. Thamrin No. 2",
              district: "Tanah Abang",
              city: "Jakarta Pusat",
            },
          ],
          truckTypeName: "Pickup",
          truckHead: "Cdd",
          truckCarrier: "Box",
          unit: 10,
          cargo: "1000 kg",
          requestCount: 2,
          hasMultipleLocations: true,
          shipper: {
            companyName: "PT Maju Jaya",
            fullName: "John Doe",
          },
        },
        {
          id: "uuid",
          orderCode: "MT2024010001",
          cancelledAt: "2024-01-15T10:30:00Z",
          orderType: "INSTANT",
          loadTimeStart: "2024-01-15T08:00:00Z",
          loadTimeEnd: "2024-01-15T12:00:00Z",
          pickupLocations: [
            {
              fullAddress: "Jl. Sudirman No. 1",
              district: "Menteng",
              city: "Jakarta Pusat",
            },
          ],
          dropoffLocations: [
            {
              fullAddress: "Jl. Thamrin No. 2",
              district: "Tanah Abang",
              city: "Jakarta Pusat",
            },
          ],
          truckTypeName: "Pickup",
          truckHead: "Cdd",
          truckCarrier: "Box",
          unit: 10,
          cargo: "1000 kg",
          requestCount: 2,
          hasMultipleLocations: true,
          shipper: {
            companyName: "PT Maju Jaya",
            fullName: "John Doe",
          },
        },
        {
          id: "uuid",
          orderCode: "MT2024010001",
          cancelledAt: "2024-01-15T10:30:00Z",
          orderType: "INSTANT",
          loadTimeStart: "2024-01-15T08:00:00Z",
          loadTimeEnd: "2024-01-15T12:00:00Z",
          pickupLocations: [
            {
              fullAddress: "Jl. Sudirman No. 1",
              district: "Menteng",
              city: "Jakarta Pusat",
            },
          ],
          dropoffLocations: [
            {
              fullAddress: "Jl. Thamrin No. 2",
              district: "Tanah Abang",
              city: "Jakarta Pusat",
            },
          ],
          truckTypeName: "Pickup",
          truckHead: "Cdd",
          truckCarrier: "Box",
          unit: 10,
          cargo: "1000 kg",
          requestCount: 2,
          hasMultipleLocations: true,
          shipper: {
            companyName: "PT Maju Jaya",
            fullName: "John Doe",
          },
        },
        {
          id: "uuid",
          orderCode: "MT2024010001",
          cancelledAt: "2024-01-15T10:30:00Z",
          orderType: "INSTANT",
          loadTimeStart: "2024-01-15T08:00:00Z",
          loadTimeEnd: "2024-01-15T12:00:00Z",
          pickupLocations: [
            {
              fullAddress: "Jl. Sudirman No. 1",
              district: "Menteng",
              city: "Jakarta Pusat",
            },
          ],
          dropoffLocations: [
            {
              fullAddress: "Jl. Thamrin No. 2",
              district: "Tanah Abang",
              city: "Jakarta Pusat",
            },
          ],
          truckTypeName: "Pickup",
          truckHead: "Cdd",
          truckCarrier: "Box",
          unit: 10,
          cargo: "1000 kg",
          requestCount: 2,
          hasMultipleLocations: true,
          shipper: {
            companyName: "PT Maju Jaya",
            fullName: "John Doe",
          },
        },
        {
          id: "uuid",
          orderCode: "MT2024010001",
          cancelledAt: "2024-01-15T10:30:00Z",
          orderType: "INSTANT",
          loadTimeStart: "2024-01-15T08:00:00Z",
          loadTimeEnd: "2024-01-15T12:00:00Z",
          pickupLocations: [
            {
              fullAddress: "Jl. Sudirman No. 1",
              district: "Menteng",
              city: "Jakarta Pusat",
            },
          ],
          dropoffLocations: [
            {
              fullAddress: "Jl. Thamrin No. 2",
              district: "Tanah Abang",
              city: "Jakarta Pusat",
            },
          ],
          truckTypeName: "Pickup",
          truckHead: "Cdd",
          truckCarrier: "Box",
          unit: 10,
          cargo: "1000 kg",
          requestCount: 2,
          hasMultipleLocations: true,
          shipper: {
            companyName: "PT Maju Jaya",
            fullName: "John Doe",
          },
        },
        {
          id: "uuid",
          orderCode: "MT2024010001",
          cancelledAt: "2024-01-15T10:30:00Z",
          orderType: "INSTANT",
          loadTimeStart: "2024-01-15T08:00:00Z",
          loadTimeEnd: "2024-01-15T12:00:00Z",
          pickupLocations: [
            {
              fullAddress: "Jl. Sudirman No. 1",
              district: "Menteng",
              city: "Jakarta Pusat",
            },
          ],
          dropoffLocations: [
            {
              fullAddress: "Jl. Thamrin No. 2",
              district: "Tanah Abang",
              city: "Jakarta Pusat",
            },
          ],
          truckTypeName: "Pickup",
          truckHead: "Cdd",
          truckCarrier: "Box",
          unit: 10,
          cargo: "1000 kg",
          requestCount: 2,
          hasMultipleLocations: true,
          shipper: {
            companyName: "PT Maju Jaya",
            fullName: "John Doe",
          },
        },
        {
          id: "uuid",
          orderCode: "MT2024010001",
          cancelledAt: "2024-01-15T10:30:00Z",
          orderType: "INSTANT",
          loadTimeStart: "2024-01-15T08:00:00Z",
          loadTimeEnd: "2024-01-15T12:00:00Z",
          pickupLocations: [
            {
              fullAddress: "Jl. Sudirman No. 1",
              district: "Menteng",
              city: "Jakarta Pusat",
            },
          ],
          dropoffLocations: [
            {
              fullAddress: "Jl. Thamrin No. 2",
              district: "Tanah Abang",
              city: "Jakarta Pusat",
            },
          ],
          truckTypeName: "Pickup",
          truckHead: "Cdd",
          truckCarrier: "Box",
          unit: 10,
          cargo: "1000 kg",
          requestCount: 2,
          hasMultipleLocations: true,
          shipper: {
            companyName: "PT Maju Jaya",
            fullName: "John Doe",
          },
        },
        {
          id: "uuid",
          orderCode: "MT2024010001",
          cancelledAt: "2024-01-15T10:30:00Z",
          orderType: "INSTANT",
          loadTimeStart: "2024-01-15T08:00:00Z",
          loadTimeEnd: "2024-01-15T12:00:00Z",
          pickupLocations: [
            {
              fullAddress: "Jl. Sudirman No. 1",
              district: "Menteng",
              city: "Jakarta Pusat",
            },
          ],
          dropoffLocations: [
            {
              fullAddress: "Jl. Thamrin No. 2",
              district: "Tanah Abang",
              city: "Jakarta Pusat",
            },
          ],
          truckTypeName: "Pickup",
          truckHead: "Cdd",
          truckCarrier: "Box",
          unit: 10,
          cargo: "1000 kg",
          requestCount: 2,
          hasMultipleLocations: true,
          shipper: {
            companyName: "PT Maju Jaya",
            fullName: "John Doe",
          },
        },
        {
          id: "uuid",
          orderCode: "MT2024010001",
          cancelledAt: "2024-01-15T10:30:00Z",
          orderType: "INSTANT",
          loadTimeStart: "2024-01-15T08:00:00Z",
          loadTimeEnd: "2024-01-15T12:00:00Z",
          pickupLocations: [
            {
              fullAddress: "Jl. Sudirman No. 1",
              district: "Menteng",
              city: "Jakarta Pusat",
            },
          ],
          dropoffLocations: [
            {
              fullAddress: "Jl. Thamrin No. 2",
              district: "Tanah Abang",
              city: "Jakarta Pusat",
            },
          ],
          truckTypeName: "Pickup",
          truckHead: "Cdd",
          truckCarrier: "Box",
          unit: 10,
          cargo: "1000 kg",
          requestCount: 2,
          hasMultipleLocations: true,
          shipper: {
            companyName: "PT Maju Jaya",
            fullName: "John Doe",
          },
        },
      ],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 10,
        itemsPerPage: 10,
        hasNextPage: true,
        hasPreviousPage: false,
      },
      totalCount: 95,
      filters: {
        isSearchActive: false,
        isDateFilterActive: false,
        appliedKeyword: null,
        appliedDateRange: null,
        appliedSort: "cancelledAt",
        appliedOrder: "desc",
      },
    },
    Type: "CANCELED_ORDERS_LIST",
  },
};

// Fetcher function for cancelled orders
export const getCancelledOrders = async (url) => {
  let result;
  if (useMockData) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    result = mockAPIResult;
  } else {
    result = await fetcherMuatrans.get(url);
  }
  return {
    orders: result?.data?.Data?.orders || [],
    pagination: result?.data?.Data?.pagination || {},
    totalCount: result?.data?.Data?.totalCount || 0,
    filters: result?.data?.Data?.filters || {},
  };
};

// SWR hook for cancelled orders
export const useGetCancelledOrders = (queryString) =>
  useSWR(`v1/cs/canceled-orders?${queryString}`, getCancelledOrders);
