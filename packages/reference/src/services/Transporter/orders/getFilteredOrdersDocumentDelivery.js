import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Document delivery orders retrieved successfully",
    },
    Data: {
      orders: [
        {
          orderId: "ORD-2025-001239",
          orderNumber: "MTO240122006",
          customerName: "PT Kurir Cepat",
          route: "Balikpapan - Samarinda",
          scheduledDate: "2025-01-28T15:45:00Z",
          cargoType: "Documents",
          status: "document_delivery",
          createdAt: "2025-01-22T19:30:00Z",
          estimatedEarning: 600000,
        },
      ],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 1,
        itemsPerPage: 10,
      },
      filterActive: "document_delivery",
    },
    Type: "FILTERED_ORDERS_LIST",
  },
};

// Flag to control mock data usage
const useMockData = true; // Toggled between true/false for testing

// Fetcher function for document delivery orders
export const getFilteredOrdersDocumentDelivery = async (params = {}) => {
  console.log("🚀 Fetching document delivery orders...", params);

  if (useMockData) {
    console.log("📋 Using mock data for document delivery orders");
    return mockAPIResult;
  }

  const { page = 1, limit = 10, search = "" } = params;

  const queryParams = new URLSearchParams();
  if (page) queryParams.append("page", page.toString());
  if (limit) queryParams.append("limit", limit.toString());
  if (search && search.length >= 3) queryParams.append("search", search);

  const url = `/v1/transporter/orders/document-delivery${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  console.log("🌐 Making API call to:", url);
  const response = await fetcherMuatrans.get(url);
  console.log("✅ API Response:", response);
  return response;
};

// SWR hook for document delivery orders
export const useGetFilteredOrdersDocumentDelivery = (params = {}) => {
  const { page = 1, limit = 10, search = "" } = params;

  const { data, error, isLoading, mutate } = useSWR(
    `filtered-orders-document-delivery-${page}-${limit}-${search}`,
    () => getFilteredOrdersDocumentDelivery(params),
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
