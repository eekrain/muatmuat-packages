import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

export const mockRevenueReportList = {
  data: {
    Message: {
      Code: 200,
      Text: "Revenue report list retrieved successfully",
    },
    Data: {
      reports: [
        {
          id: "550e8400-e29b-41d4-a716-446655440001",
          orderCode: "MT2025010001",
          invoiceNumber: "INV-2025-003",
          source: "ORDER_REVENUE",
          sourceName: "Pendapatan Pesanan",
          status: "DISBURSED",
          statusName: "Sudah Dicairkan",
          revenueAmount: 2500000,
          revenueFormatted: "Rp2.500.000",
          undisbursedAmount: 0,
          undisbursedFormatted: "Rp0",
          createdAt: "2025-01-15T10:30:00.000Z",
          updatedAt: "2025-01-16T14:20:00.000Z",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440002",
          orderCode: "MT2025010002",
          invoiceNumber: "INV-2025-002",
          source: "ADDITIONAL_FEE",
          sourceName: "Tambahan Biaya",
          status: "PARTIALLY_DISBURSED",
          statusName: "Dicairkan Sebagian",
          revenueAmount: 1750000,
          revenueFormatted: "Rp1.750.000",
          undisbursedAmount: 750000,
          undisbursedFormatted: "Rp750.000",
          createdAt: "2025-01-14T09:15:00.000Z",
          updatedAt: "2025-01-15T16:45:00.000Z",
        },
      ],
      pagination: {
        currentPage: 1,
        totalPages: 5,
        totalItems: 48,
        itemsPerPage: 10,
        hasNext: true,
        hasPrevious: false,
      },
    },
    Type: "TRANSPORTER_REVENUE_REPORTS",
  },
};

export const getRevenueReportList = async (params) => {
  let result;

  if (useMockData) {
    result = mockRevenueReportList;
  } else {
    result = await fetcherMuatrans.get(`/v1/transporter/revenue/list`, {
      params,
    });
  }

  return {
    data: result?.data?.Data || {},
    raw: result,
  };
};

export const useGetRevenueReportList = (params) => {
  const { data, error, isLoading } = useSWR(
    params?.transporter_id ? [`getRevenueReportList`, params] : null,
    () => getRevenueReportList(params)
  );

  return {
    data: data?.data || {},
    raw: data?.raw,
    isLoading,
    isError: !!error,
  };
};
