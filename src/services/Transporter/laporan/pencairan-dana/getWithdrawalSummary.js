import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

export const mockWithdrawalSummary = {
  success: {
    data: {
      Message: {
        Code: 200,
        Text: "Summary retrieved successfully",
      },
      Data: {
        summary: {
          totalInvoices: 3,
          totalAmount: 1500000.0,
          adminFee: 5000.0,
          netAmount: 1495000.0,
        },
      },
      Type: "WITHDRAWAL_SUMMARY",
    },
  },
};

export const getWithdrawalSummary = async (id) => {
  let result;

  if (useMockData) {
    result = { ...mockWithdrawalSummary.success };
  } else {
    try {
      result = await fetcherMuatrans.get(
        `/v1/transporter/withdrawals/${id}/summary`
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

export const useGetWithdrawalSummary = (id) => {
  const { data, error, isLoading } = useSWR(
    id ? ["getWithdrawalSummary", id] : null,
    () => getWithdrawalSummary(id)
  );

  return {
    summary: data?.data?.Data?.summary || null,
    raw: data?.data,
    isLoading,
    isError: !!error,
  };
};
