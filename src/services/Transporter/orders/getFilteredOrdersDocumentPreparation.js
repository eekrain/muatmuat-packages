import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Document preparation orders retrieved successfully",
    },
    Data: {
      orders: [
        {
          orderId: "ORD-2025-001238",
          orderNumber: "MTO240122005",
          customerName: "PT Dokumen Express",
          route: "Makassar - Manado",
          scheduledDate: "2025-01-27T13:30:00Z",
          cargoType: "Documents",
          status: "document_preparation",
          createdAt: "2025-01-22T18:00:00Z",
          estimatedEarning: 800000,
        },
      ],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 1,
        itemsPerPage: 10,
      },
      filterActive: "document_preparation",
    },
    Type: "FILTERED_ORDERS_LIST",
  },
};

// Flag to control mock data usage
const useMockData = true; // Toggled between true/false for testing

// Fetcher function for document preparation orders
export const getFilteredOrdersDocumentPreparation = async (params = {}) => {
  console.log("🚀 Fetching document preparation orders...", params);

  if (useMockData) {
    console.log("📋 Using mock data for document preparation orders");
    return mockAPIResult;
  }

  const { page = 1, limit = 10, search = "" } = params;

  const queryParams = new URLSearchParams();
  if (page) queryParams.append("page", page.toString());
  if (limit) queryParams.append("limit", limit.toString());
  if (search && search.length >= 3) queryParams.append("search", search);

  const url = `/v1/transporter/orders/document-preparation${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  console.log("🌐 Making API call to:", url);
  const response = await fetcherMuatrans.get(url);
  console.log("✅ API Response:", response);
  return response;
};

// SWR hook for document preparation orders
export const useGetFilteredOrdersDocumentPreparation = (params = {}) => {
  const { page = 1, limit = 10, search = "" } = params;

  const { data, error, isLoading, mutate } = useSWR(
    `filtered-orders-document-preparation-${page}-${limit}-${search}`,
    () => getFilteredOrdersDocumentPreparation(params),
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
