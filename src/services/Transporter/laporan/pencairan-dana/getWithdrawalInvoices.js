import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

export const mockWithdrawalInvoices = {
  success: {
    data: {
      Message: {
        Code: 200,
        Text: "Invoices retrieved successfully",
      },
      Data: {
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
            amount: 750000.0,
            orderDate: "2025-01-21T10:00:00Z",
          },
          {
            orderCode: "MT003",
            invoiceNumber: "INV003",
            amount: 250000.0,
            orderDate: "2025-01-22T10:00:00Z",
          },
        ],
      },
      Type: "WITHDRAWAL_INVOICES",
    },
  },
};

export const getWithdrawalInvoices = async (id) => {
  let result;

  if (useMockData) {
    result = { ...mockWithdrawalInvoices.success };
  } else {
    try {
      result = await fetcherMuatrans.get(
        `/v1/transporter/withdrawals/${id}/invoices`
      );
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

export const useGetWithdrawalInvoices = (id) => {
  const { data, error, isLoading } = useSWR(
    id ? ["getWithdrawalInvoices", id] : null,
    () => getWithdrawalInvoices(id)
  );

  return {
    invoices: data?.data?.Data?.invoices || [],
    raw: data?.data,
    isLoading,
    isError: !!error,
  };
};
