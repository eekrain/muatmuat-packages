import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/fetcher";

const useMockData = true;

export const mockWithdrawalList = {
  data: {
    Message: {
      Code: 200,
      Text: "Withdrawal data retrieved successfully",
    },
    Data: {
      hasData: true,
      totalCount: 1500,
      formattedCount: "1.500",
      withdrawals: [
        {
          id: "550e8400-e29b-41d4-a716-446655440001",
          withdrawalDate: "2025-01-24T10:00:00Z",
          amount: 1500000.0,
          bankAccount: {
            bankCode: "BCA",
            bankName: "Bank Central Asia",
            accountNumber: "****567890",
            logoUrl: "/assets/banks/bca-logo.png",
          },
        },
      ],
      pagination: {
        currentPage: 1,
        totalPages: 150,
        totalItems: 1500,
        hasNext: true,
        hasPrevious: false,
      },
      appliedFilters: {
        accounts: [],
        period: null,
      },
      isEmpty: false,
      emptyStateType: null,
    },
    Type: "WITHDRAWAL_LIST",
  },
};

export const getWithdrawalList = async (cacheKey) => {
  const params = cacheKey?.split("/")?.[1];
  const searchParams = params
    ? new URLSearchParams(params)
    : new URLSearchParams();

  let result;

  if (useMockData) {
    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 10;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let withdrawals = mockWithdrawalList.data.Data.withdrawals;

    if (startDate && endDate) {
      withdrawals = withdrawals.filter((w) => {
        const date = new Date(w.withdrawalDate);
        return date >= new Date(startDate) && date <= new Date(endDate);
      });
    }

    result = {
      ...mockWithdrawalList,
      data: {
        ...mockWithdrawalList.data,
        Data: {
          ...mockWithdrawalList.data.Data,
          withdrawals,
          hasData: withdrawals.length > 0,
          totalCount: withdrawals.length,
          formattedCount: withdrawals.length.toLocaleString("id-ID"),
          isEmpty: withdrawals.length === 0,
          emptyStateType:
            withdrawals.length === 0
              ? startDate && endDate
                ? "PERIOD_NO_DATA"
                : "FILTER_NO_DATA"
              : null,
          pagination: {
            ...mockWithdrawalList.data.Data.pagination,
            currentPage: Number(page),
            totalItems: withdrawals.length,
            totalPages: Math.ceil(withdrawals.length / limit),
            hasNext: withdrawals.length > limit,
            hasPrevious: Number(page) > 1,
          },
          appliedFilters: {
            accounts: searchParams.get("accounts")?.split(",") || [],
            period: startDate && endDate ? { startDate, endDate } : null,
          },
        },
      },
    };
  } else {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    result = await fetcherMuatrans.get(`/v1/transporter/withdrawals${query}`);
  }

  return {
    withdrawals: result?.data?.Data?.withdrawals || [],
    summary: {
      hasData: result?.data?.Data?.hasData,
      totalCount: result?.data?.Data?.totalCount,
      formattedCount: result?.data?.Data?.formattedCount,
    },
    pagination: result?.data?.Data?.pagination || {},
    appliedFilters: result?.data?.Data?.appliedFilters || {},
    isEmpty: result?.data?.Data?.isEmpty || false,
    emptyStateType: result?.data?.Data?.emptyStateType || null,
    raw: result,
  };
};

export const useGetWithdrawalList = (params) => {
  const paramsString = params ? new URLSearchParams(params).toString() : "";
  const { data, error, isLoading } = useSWR(
    `getWithdrawalList/${paramsString}`,
    getWithdrawalList
  );

  return {
    withdrawals: data?.withdrawals || [],
    summary: data?.summary || {},
    pagination: data?.pagination || {},
    appliedFilters: data?.appliedFilters || {},
    isEmpty: data?.isEmpty || false,
    emptyStateType: data?.emptyStateType || null,
    raw: data?.raw,
    isLoading,
    isError: !!error,
  };
};
