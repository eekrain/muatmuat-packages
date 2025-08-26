import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false;

export const mockWithdrawalDetail = {
  success: {
    data: {
      Message: {
        Code: 200,
        Text: "Withdrawal detail retrieved successfully",
      },
      Data: {
        withdrawal: {
          id: "550e8400-e29b-41d4-a716-446655440002",
          withdrawalDate: "2024-10-04T08:00:00Z",
          amount: 1247490.0,
          status: "COMPLETED",
          bankAccount: {
            bankCode: "BCA",
            bankName: "Bank Central Asia",
            accountNumber: "1234567890",
            accountHolderName: "DAFFA TOLDO",
            logoUrl: "/icons/payment/va_bca.svg",
          },
        },
        invoices: [
          {
            id: 1,
            orderCode: "MT001",
            invoiceNumber: "INV/20240120/MPM/00001",
            source: "DetailPencairanDanaPage.sourceOrderRevenue", // Pendapatan Pesanan
            amount: 220000.0,
            orderDate: "2025-01-20T10:00:00Z",
          },
          {
            id: 2,
            orderCode: "MT002",
            invoiceNumber: "INV/20240120/MPM/00002",
            source: "DetailPencairanDanaPage.sourceOrderRevenue", // Pendapatan Pesanan
            amount: 210000.0,
            orderDate: "2025-01-21T10:00:00Z",
          },
          {
            id: 3,
            orderCode: "MT003",
            invoiceNumber: "INV/20240120/MPM/00003",
            source: "DetailPencairanDanaPage.sourceRevenueAdjustment", // Penyesuaian Pendapatan
            amount: 300000.0,
            orderDate: "2025-01-22T10:00:00Z",
          },
          {
            id: 4,
            orderCode: "MT004",
            invoiceNumber: "COM/20240120/MPM/00004",
            source: "DetailPencairanDanaPage.sourceRevenueAdjustment", // Penyesuaian Pendapatan
            amount: 300000.0,
            orderDate: "2025-01-23T10:00:00Z",
          },
        ],
        summary: {
          totalInvoices: 4,
          totalAmount: 1500000.0,
          grossIncome: 1040600.0,
          adminFee: 40600.0,
          dpp: 109450.0,
          ppn: 109450.0,
          pph: 109450.0,
          netAmount: 1247490.0,
        },
      },
      Type: "WITHDRAWAL_DETAIL",
    },
  },
  error: {
    data: {
      Message: {
        Code: 404,
        Text: "Withdrawal not found",
      },
      Data: {
        withdrawalId: "550e8400-e29b-41d4-a716-446655440999",
      },
      Type: "WITHDRAWAL_DETAIL_ERROR",
    },
  },
};

export const getWithdrawalDetail = async (id, simulateError = false) => {
  let result;

  if (useMockData) {
    result = simulateError
      ? { ...mockWithdrawalDetail.error }
      : { ...mockWithdrawalDetail.success };
  } else {
    try {
      result = await fetcherMuatrans.get(`/v1/transporter/withdrawals/${id}`);
    } catch (error) {
      return {
        success: false,
        data: error?.response?.data || null,
      };
    }
  }

  return {
    success: result?.data?.Message?.Code === 200,
    data: result?.data || {},
  };
};

export const useGetWithdrawalDetail = (id) => {
  const { data, error, isLoading } = useSWR(
    id ? ["getWithdrawalDetail", id] : null,
    () => getWithdrawalDetail(id)
  );

  return {
    withdrawal: data?.data?.Data?.withdrawal || null,
    invoices: data?.data?.Data?.invoices || [],
    summary: data?.data?.Data?.summary || null,
    raw: data?.data,
    isLoading,
    isError: !!error,
  };
};
