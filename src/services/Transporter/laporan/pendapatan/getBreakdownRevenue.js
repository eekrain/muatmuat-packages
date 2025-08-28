import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false;

export const mockTotalRevenueBreakdown = {
  data: {
    Message: {
      Code: 200,
      Text: "Total revenue breakdown retrieved successfully",
    },
    Data: {
      orderRevenue: {
        amount: 12500000,
        formatted: "Rp12.500.000",
        source: "ORDER_REVENUE",
      },
      adjustmentRevenue: {
        amount: 3250000,
        formatted: "Rp3.250.000",
        source: "REVENUE_ADJUSTMENT",
      },
      totalRevenue: {
        amount: 15750000,
        formatted: "Rp15.750.000",
      },
      breakdown:
        "Pendapatan Pesanan: Rp12.500.000\nPenyesuaian Pendapatan: Rp3.250.000",
    },
    Type: "TOTAL_REVENUE_BREAKDOWN",
  },
};

export const getTotalRevenueBreakdown = async (transporterId) => {
  let result;
  if (useMockData) {
    result = mockTotalRevenueBreakdown;
  } else {
    result = await fetcherMuatrans.get(
      `/v1/transporter/revenue/breakdown/total-revenue`,
      { params: { transporter_id: transporterId } }
    );
  }
  return {
    data: result?.data?.Data || {},
    raw: result,
  };
};

export const useGetTotalRevenueBreakdown = (transporterId) => {
  const { data, error, isLoading } = useSWR(
    transporterId ? [`getTotalRevenueBreakdown`, transporterId] : null,
    () => getTotalRevenueBreakdown(transporterId)
  );
  return {
    data: data?.data || {},
    raw: data?.raw,
    isLoading,
    isError: !!error,
  };
};

export const mockUndisbursedFundsBreakdown = {
  data: {
    Message: {
      Code: 200,
      Text: "Undisbursed funds breakdown retrieved successfully",
    },
    Data: {
      undisbursedBySource: [
        {
          source: "ORDER_REVENUE",
          sourceName: "Pendapatan Pesanan",
          amount: 3000000,
          formatted: "Rp3.000.000",
          status: "PENDING_DISBURSEMENT",
        },
        {
          source: "REVENUE_ADJUSTMENT",
          sourceName: "Penyesuaian Pendapatan",
          amount: 1500000,
          formatted: "Rp1.500.000",
          status: "PENDING_DISBURSEMENT",
        },
        {
          source: "ADDITIONAL_FEE",
          sourceName: "Tambahan Biaya",
          amount: 750000,
          formatted: "Rp750.000",
          status: "PARTIALLY_DISBURSED",
        },
      ],
      totalUndisbursed: {
        amount: 5250000,
        formatted: "Rp5.250.000",
      },
    },
    Type: "UNDISBURSED_FUNDS_BREAKDOWN",
  },
};

export const getUndisbursedFundsBreakdown = async (transporterId) => {
  let result;
  if (useMockData) {
    result = mockUndisbursedFundsBreakdown;
  } else {
    result = await fetcherMuatrans.get(
      `/v1/transporter/revenue/breakdown/undisbursed-funds`,
      { params: { transporter_id: transporterId } }
    );
  }
  return {
    data: result?.data?.Data || {},
    raw: result,
  };
};

export const useGetUndisbursedFundsBreakdown = (transporterId) => {
  const { data, error, isLoading } = useSWR(
    transporterId ? [`getUndisbursedFundsBreakdown`, transporterId] : null,
    () => getUndisbursedFundsBreakdown(transporterId)
  );
  return {
    data: data?.data || {},
    raw: data?.raw,
    isLoading,
    isError: !!error,
  };
};
