import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false;

export const mockRevenueReportDetailWithHistory = {
  data: {
    Message: {
      Code: 200,
      Text: "Revenue report detail retrieved successfully",
    },
    Data: {
      reportInfo: {
        id: "550e8400-e29b-41d4-a716-446655440001",
        orderCode: "MT2025010001",
        invoiceNumber: "INV-2025-001",
        source: "ORDER_REVENUE",
        sourceName: "Pendapatan Pesanan",
        status: "PARTIALLY_DISBURSED",
        statusName: "Dicairkan Sebagian",
        statusBadge: {
          color: "warning",
          text: "Dicairkan Sebagian",
        },
      },
      revenueDetails: {
        initialRevenue: { amount: 2500000, formatted: "Rp2.500.000" },
        totalDisbursed: { amount: 1750000, formatted: "Rp1.750.000" },
        remainingUndisbursed: { amount: 750000, formatted: "Rp750.000" },
      },
      disbursementHistory: [
        {
          sequence: 1,
          disbursementDate: "2025-01-16T09:30:00.000Z",
          disbursementDateFormatted: "16 Jan 2025",
          disbursedAmount: 1000000,
          disbursedFormatted: "Rp1.000.000",
          remainingAfter: 1500000,
          remainingAfterFormatted: "Rp1.500.000",
          method: "BANK_TRANSFER",
          methodName: "Transfer Bank",
          reference: "TRF-2025-001-001",
        },
        {
          sequence: 2,
          disbursementDate: "2025-01-18T14:15:00.000Z",
          disbursementDateFormatted: "18 Jan 2025",
          disbursedAmount: 750000,
          disbursedFormatted: "Rp750.000",
          remainingAfter: 750000,
          remainingAfterFormatted: "Rp750.000",
          method: "BANK_TRANSFER",
          methodName: "Transfer Bank",
          reference: "TRF-2025-001-002",
        },
      ],
      orderDetails: {
        orderCode: "MT2025010001",
        createdAt: "2025-01-15T10:30:00.000Z",
        createdAtFormatted: "15 Jan 2025",
        transporterInfo: {
          transporterId: "transporter-123",
          companyName: "PT Contoh Transporter",
        },
      },
      breadcrumb: {
        items: [
          { label: "Laporan Pendapatan", url: "/transporter/revenue-reports" },
          { label: "Detail Pendapatan", url: null, active: true },
        ],
      },
    },
    Type: "TRANSPORTER_REVENUE_DETAIL",
  },
};

export const mockRevenueReportDetailNoDisbursement = {
  data: {
    Message: {
      Code: 200,
      Text: "Revenue report detail retrieved successfully",
    },
    Data: {
      reportInfo: {
        id: "550e8400-e29b-41d4-a716-446655440003",
        orderCode: "MT2025010003",
        invoiceNumber: "INV-2025-003",
        source: "REVENUE_ADJUSTMENT",
        sourceName: "Penyesuaian Pendapatan",
        status: "PENDING_DISBURSEMENT",
        statusName: "Belum Dicairkan",
        statusBadge: {
          color: "error",
          text: "Belum Dicairkan",
        },
      },
      revenueDetails: {
        initialRevenue: { amount: 1250000, formatted: "Rp1.250.000" },
        totalDisbursed: { amount: 0, formatted: "Rp0" },
        remainingUndisbursed: { amount: 1250000, formatted: "Rp1.250.000" },
      },
      disbursementHistory: [],
      disbursementStatus: {
        isEmpty: true,
        emptyMessage: "Belum Dicairkan",
        emptySubtitle: "Dana dari sumber pendapatan ini belum dicairkan",
      },
      orderDetails: {
        orderCode: "MT2025010003",
        createdAt: "2025-01-13T11:45:00.000Z",
        createdAtFormatted: "13 Jan 2025",
        transporterInfo: {
          transporterId: "transporter-456",
          companyName: "PT Transporter Dummy",
        },
      },
      breadcrumb: {
        items: [
          { label: "Laporan Pendapatan", url: "/transporter/revenue-reports" },
          { label: "Detail Pendapatan", url: null, active: true },
        ],
      },
    },
    Type: "TRANSPORTER_REVENUE_DETAIL",
  },
};

export const getRevenueReportDetailById = async (id, params) => {
  let result;

  if (useMockData) {
    result = mockRevenueReportDetailWithHistory;
    //   result = mockRevenueReportDetailNoDisbursement;
  } else {
    result = await fetcherMuatrans.get(`/v1/transporter/revenue/${id}/detail`, {
      params,
    });
  }

  console.log("Revenue report detail fetched:", result);
  return {
    data: result?.data?.Data || {},
    raw: result,
  };
};

export const useGetRevenueReportDetailById = (id, params) => {
  const { data, error, isLoading } = useSWR(
    id && params?.transporter_id ? `getRevenueReportDetailById/${id}` : null,
    () => getRevenueReportDetailById(id, params)
  );

  return {
    data: data?.data || {},
    raw: data?.raw,
    isLoading,
    isError: !!error,
  };
};
