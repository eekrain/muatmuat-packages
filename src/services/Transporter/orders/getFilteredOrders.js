import useSWR from "swr";

// Mock API result for development/testing
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

// Mock API result for empty state
export const mockAPIResultEmpty = {
  data: {
    Message: {
      Code: 200,
      Text: "No waiting confirmation orders found",
    },
    Data: {
      orders: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: 10,
      },
      filterActive: "waiting_confirmation",
      emptyState: {
        illustration: "magnifying_glass",
        message: "Data Tidak Ditemukan, Mohon coba hapus beberapa filter.",
        showIllustration: true,
      },
    },
    Type: "FILTERED_ORDERS_EMPTY",
  },
};

// Flag to control mock data usage
const useMockData = false; // Changed to false for real API

// Fetcher function for filtered orders
export const getFilteredOrders = async (params = {}) => {
  console.log("🚀 Fetching filtered orders...", params);
  console.log("📋 Using mock data for filtered orders");

  // Return mock data for now
  return mockAPIResult;
};

// SWR hook for filtered orders
export const useGetFilteredOrders = (params = {}) => {
  const { page = 1, limit = 10, search = "" } = params;

  const { data, error, isLoading, mutate } = useSWR(
    `filtered-orders-waiting-confirmation-${page}-${limit}-${search}`,
    () => getFilteredOrders(params),
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
