import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Confirmed orders retrieved successfully",
    },
    Data: {
      orders: [
        {
          orderId: "ORD-2025-001234",
          orderNumber: "MTO240122001",
          customerName: "PT Maju Jaya",
          route: "Jakarta - Surabaya",
          scheduledDate: "2025-01-23T08:00:00Z",
          cargoType: "General Cargo",
          status: "confirmed",
          createdAt: "2025-01-22T14:30:00Z",
          estimatedEarning: 2500000,
        },
      ],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 1,
        itemsPerPage: 10,
      },
      filterActive: "confirmed",
    },
    Type: "FILTERED_ORDERS_LIST",
  },
};

// Flag to control mock data usage
const useMockData = true; // Toggled between true/false for testing

// Fetcher function for confirmed orders
export const getFilteredOrdersConfirmed = async (params = {}) => {
  console.log("🚀 Fetching confirmed orders...", params);

  if (useMockData) {
    console.log("📋 Using mock data for confirmed orders");
    return mockAPIResult;
  }

  const { page = 1, limit = 10, search = "" } = params;

  const queryParams = new URLSearchParams();
  if (page) queryParams.append("page", page.toString());
  if (limit) queryParams.append("limit", limit.toString());
  if (search && search.length >= 3) queryParams.append("search", search);

  const url = `/v1/transporter/orders/confirmed${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  console.log("🌐 Making API call to:", url);
  const response = await fetcherMuatrans.get(url);
  console.log("✅ API Response:", response);
  return response;
};

// SWR hook for confirmed orders
export const useGetFilteredOrdersConfirmed = (params = {}) => {
  const { page = 1, limit = 10, search = "" } = params;

  const { data, error, isLoading, mutate } = useSWR(
    `filtered-orders-confirmed-${page}-${limit}-${search}`,
    () => getFilteredOrdersConfirmed(params),
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
