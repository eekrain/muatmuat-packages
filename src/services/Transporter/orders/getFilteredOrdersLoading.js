import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Loading orders retrieved successfully",
    },
    Data: {
      orders: [
        {
          orderId: "ORD-2025-001236",
          orderNumber: "MTO240122003",
          customerName: "CV Berkah Abadi",
          route: "Surabaya - Malang",
          scheduledDate: "2025-01-25T09:30:00Z",
          cargoType: "Food & Beverages",
          status: "loading",
          createdAt: "2025-01-22T16:20:00Z",
          estimatedEarning: 1200000,
        },
      ],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 1,
        itemsPerPage: 10,
      },
      filterActive: "loading",
    },
    Type: "FILTERED_ORDERS_LIST",
  },
};

// Flag to control mock data usage
const useMockData = true; // Toggled between true/false for testing

// Fetcher function for loading orders
export const getFilteredOrdersLoading = async (params = {}) => {
  console.log("🚀 Fetching loading orders...", params);

  if (useMockData) {
    console.log("📋 Using mock data for loading orders");
    return mockAPIResult;
  }

  const { page = 1, limit = 10, search = "" } = params;

  const queryParams = new URLSearchParams();
  if (page) queryParams.append("page", page.toString());
  if (limit) queryParams.append("limit", limit.toString());
  if (search && search.length >= 3) queryParams.append("search", search);

  const url = `/v1/transporter/orders/loading${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  console.log("🌐 Making API call to:", url);
  const response = await fetcherMuatrans.get(url);
  console.log("✅ API Response:", response);
  return response;
};

// SWR hook for loading orders
export const useGetFilteredOrdersLoading = (params = {}) => {
  const { page = 1, limit = 10, search = "" } = params;

  const { data, error, isLoading, mutate } = useSWR(
    `filtered-orders-loading-${page}-${limit}-${search}`,
    () => getFilteredOrdersLoading(params),
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
