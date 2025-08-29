import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Completed orders retrieved successfully",
    },
    Data: {
      orders: [
        {
          orderId: "ORD-2025-001240",
          orderNumber: "MTO240122007",
          customerName: "PT Selesai Jaya",
          route: "Yogyakarta - Solo",
          scheduledDate: "2025-01-29T16:00:00Z",
          cargoType: "General Cargo",
          status: "completed",
          createdAt: "2025-01-22T20:00:00Z",
          estimatedEarning: 2000000,
        },
      ],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 1,
        itemsPerPage: 10,
      },
      filterActive: "completed",
    },
    Type: "FILTERED_ORDERS_LIST",
  },
};

// Flag to control mock data usage
const useMockData = true; // Toggled between true/false for testing

// Fetcher function for completed orders
export const getFilteredOrdersCompleted = async (params = {}) => {
  console.log("🚀 Fetching completed orders...", params);

  if (useMockData) {
    console.log("📋 Using mock data for completed orders");
    return mockAPIResult;
  }

  const { page = 1, limit = 10, search = "" } = params;

  const queryParams = new URLSearchParams();
  if (page) queryParams.append("page", page.toString());
  if (limit) queryParams.append("limit", limit.toString());
  if (search && search.length >= 3) queryParams.append("search", search);

  const url = `/v1/transporter/orders/completed${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  console.log("🌐 Making API call to:", url);
  const response = await fetcherMuatrans.get(url);
  console.log("✅ API Response:", response);
  return response;
};

// SWR hook for completed orders
export const useGetFilteredOrdersCompleted = (params = {}) => {
  const { page = 1, limit = 10, search = "" } = params;

  const { data, error, isLoading, mutate } = useSWR(
    `filtered-orders-completed-${page}-${limit}-${search}`,
    () => getFilteredOrdersCompleted(params),
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
