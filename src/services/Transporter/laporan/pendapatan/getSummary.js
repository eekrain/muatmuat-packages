import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false; // toggle mock data

// mock data
export const mockRevenueSummary = {
  data: {
    Message: {
      Code: 200,
      Text: "Summary revenue data retrieved successfully",
    },
    Data: {
      totalRevenue: {
        amount: 15750000,
        formatted: "Rp15.750.000",
        breakDown: {}, // isi sesuai obj_breakdown mock
      },
      totalUndisbursed: {
        amount: 5250000,
        formatted: "Rp5.250.000",
        breakDown: {}, // isi sesuai obj_breakdown mock
      },
      totalDisbursed: {
        amount: 10500000,
        formatted: "Rp10.500.000",
      },
      monthlyRevenue: {
        amount: 3750000,
        formatted: "Rp3.750.000",
        month: "2025-01",
        monthName: "Januari 2025",
      },
    },
    Type: "TRANSPORTER_REVENUE_SUMMARY",
  },
};

// fetcher
export const getRevenueSummary = async (transporterId) => {
  let result;
  if (useMockData) {
    result = mockRevenueSummary;
  } else {
    result = await fetcherMuatrans.get(`/v1/transporter/revenue/summary`, {
      params: { transporter_id: transporterId },
    });
  }

  return {
    data: result?.data?.Data || {},
    raw: result,
  };
};

// hook
export const useGetRevenueSummary = (transporterId) => {
  const { data, error, isLoading } = useSWR(
    transporterId ? [`getRevenueSummary`, transporterId] : null,
    () => getRevenueSummary(transporterId)
  );

  return {
    data: data?.data || {},
    raw: data?.raw,
    isLoading,
    isError: !!error,
  };
};
