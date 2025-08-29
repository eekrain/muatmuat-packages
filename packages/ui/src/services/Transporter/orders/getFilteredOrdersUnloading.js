import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Unloading orders retrieved successfully",
    },
    Data: {
      orders: [
        {
          orderId: "ORD-2025-001237",
          orderNumber: "MTO240122004",
          customerName: "PT Logistik Indonesia",
          route: "Medan - Palembang",
          scheduledDate: "2025-01-26T11:00:00Z",
          cargoType: "Heavy Equipment",
          status: "unloading",
          createdAt: "2025-01-22T17:15:00Z",
          estimatedEarning: 3500000,
        },
      ],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 1,
        itemsPerPage: 10,
      },
      filterActive: "unloading",
    },
    Type: "FILTERED_ORDERS_LIST",
  },
};

// Flag to control mock data usage
const useMockData = true; // Toggled between true/false for testing

// Fetcher function for unloading orders
export const getFilteredOrdersUnloading = async (params = {}) => {
  console.log("🚀 Fetching unloading orders...", params);

  if (useMockData) {
    console.log("📋 Using mock data for unloading orders");
    return mockAPIResult;
  }

  const { page = 1, limit = 10, search = "" } = params;

  const queryParams = new URLSearchParams();
  if (page) queryParams.append("page", page.toString());
  if (limit) queryParams.append("limit", limit.toString());
  if (search && search.length >= 3) queryParams.append("search", search);

  const url = `/v1/transporter/orders/unloading${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  console.log("🌐 Making API call to:", url);
  const response = await fetcherMuatrans.get(url);
  console.log("✅ API Response:", response);
  return response;
};

// SWR hook for unloading orders
export const useGetFilteredOrdersUnloading = (params = {}) => {
  const { page = 1, limit = 10, search = "" } = params;

  const { data, error, isLoading, mutate } = useSWR(
    `filtered-orders-unloading-${page}-${limit}-${search}`,
    () => getFilteredOrdersUnloading(params),
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
