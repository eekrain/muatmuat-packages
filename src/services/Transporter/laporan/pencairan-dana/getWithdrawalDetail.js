import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

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
          withdrawalDate: "2025-01-24T10:00:00Z",
          amount: 1500000.0,
          status: "COMPLETED",
          bankAccount: {
            bankCode: "BCA",
            bankName: "Bank Central Asia",
            accountNumber: "****567890",
            logoUrl: "/assets/banks/bca-logo.png",
          },
        },
        invoices: [
          {
            orderCode: "MT001",
            invoiceNumber: "INV001",
            amount: 500000.0,
            orderDate: "2025-01-20T10:00:00Z",
          },
          {
            orderCode: "MT002",
            invoiceNumber: "INV002",
            amount: 500000.0,
            orderDate: "2025-01-21T10:00:00Z",
          },
          {
            orderCode: "MT003",
            invoiceNumber: "INV003",
            amount: 500000.0,
            orderDate: "2025-01-22T10:00:00Z",
          },
        ],
        summary: {
          totalInvoices: 3,
          totalAmount: 1500000.0,
          adminFee: 5000.0,
          netAmount: 1495000.0,
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
