import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Waiting confirmation orders retrieved successfully",
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
          status: "waiting_confirmation",
          createdAt: "2025-01-22T14:30:00Z",
          estimatedEarning: 2500000,
        },
        {
          orderId: "ORD-2025-001235",
          orderNumber: "MTO240122002",
          customerName: "PT Sukses Mandiri",
          route: "Bandung - Semarang",
          scheduledDate: "2025-01-24T10:00:00Z",
          cargoType: "Electronics",
          status: "waiting_confirmation",
          createdAt: "2025-01-22T15:45:00Z",
          estimatedEarning: 1800000,
        },
        {
          orderId: "ORD-2025-001236",
          orderNumber: "MTO240122003",
          customerName: "CV Berkah Abadi",
          route: "Surabaya - Malang",
          scheduledDate: "2025-01-25T09:30:00Z",
          cargoType: "Food & Beverages",
          status: "waiting_confirmation",
          createdAt: "2025-01-22T16:20:00Z",
          estimatedEarning: 1200000,
        },
      ],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 3,
        itemsPerPage: 10,
      },
      filterActive: "waiting_confirmation",
    },
    Type: "FILTERED_ORDERS_LIST",
  },
};

// Flag to control mock data usage
const useMockData = true; // Set to false for real API calls

// Fetcher function for filtered orders
export const getFilteredOrders = async (params = {}) => {
  console.log("🚀 Fetching filtered orders...", params);

  if (useMockData) {
    console.log("📋 Using mock data for filtered orders");
    return mockAPIResult;
  }

  const { page = 1, limit = 10, search = "" } = params;

  const queryParams = new URLSearchParams();
  if (page) queryParams.append("page", page.toString());
  if (limit) queryParams.append("limit", limit.toString());
  if (search && search.length >= 3) queryParams.append("search", search);

  // Add status parameter for waiting confirmation orders
  queryParams.append("status", "waiting_confirmation");

  const url = `/v1/transporter/orders${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  console.log("🌐 Making API call to:", url);
  const response = await fetcherMuatrans.get(url);
  console.log("✅ API Response:", response);
  return response;
};

export const useGetFilteredOrders = (params = {}) => {
  const { page = 1, limit = 10, search = "" } = params;

  const swrKey = `filtered-orders?status=waiting_confirmation&page=${page}&limit=${limit}&search=${search}`;

  const { data, error, isLoading, mutate } = useSWR(
    swrKey,
    () => getFilteredOrders(params),
    {
      refreshInterval: 300000,
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
