import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Scheduled orders retrieved successfully",
    },
    Data: {
      orders: [
        {
          orderId: "ORD-2025-001235",
          orderNumber: "MTO240122002",
          customerName: "PT Sukses Mandiri",
          route: "Bandung - Semarang",
          scheduledDate: "2025-01-24T10:00:00Z",
          cargoType: "Electronics",
          status: "scheduled",
          createdAt: "2025-01-22T15:45:00Z",
          estimatedEarning: 1800000,
        },
      ],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 1,
        itemsPerPage: 10,
      },
      filterActive: "scheduled",
    },
    Type: "FILTERED_ORDERS_LIST",
  },
};

// Flag to control mock data usage
const useMockData = true; // Toggled between true/false for testing

// Fetcher function for scheduled orders
export const getFilteredOrdersScheduled = async (params = {}) => {
  console.log("🚀 Fetching scheduled orders...", params);

  if (useMockData) {
    console.log("📋 Using mock data for scheduled orders");
    return mockAPIResult;
  }

  const { page = 1, limit = 10, search = "" } = params;

  const queryParams = new URLSearchParams();
  if (page) queryParams.append("page", page.toString());
  if (limit) queryParams.append("limit", limit.toString());
  if (search && search.length >= 3) queryParams.append("search", search);

  const url = `/v1/transporter/orders/scheduled${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  console.log("🌐 Making API call to:", url);
  const response = await fetcherMuatrans.get(url);
  console.log("✅ API Response:", response);
  return response;
};

// SWR hook for scheduled orders
export const useGetFilteredOrdersScheduled = (params = {}) => {
  const { page = 1, limit = 10, search = "" } = params;

  const { data, error, isLoading, mutate } = useSWR(
    `filtered-orders-scheduled-${page}-${limit}-${search}`,
    () => getFilteredOrdersScheduled(params),
    {
      refreshInterval: 300000, // 5 minutes auto-refresh
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  return {
    data: data?.data?.Data,
    message: data?.data?.Message,
    type: data?.data?.Type,
    isLoading,
    isError: error,
    mutate,
  };
};
