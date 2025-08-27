import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Account status retrieved successfully",
    },
    Data: {
      accountStatus: "suspended", // active, suspended, banned
      isSuspended: true,
      suspendedAt: "2025-01-20T09:00:00Z",
      suspensionReason: "Pelanggaran kebijakan layanan",
      suspensionMessage:
        "Akun kamu ditangguhkan, hubungi dukungan pelanggan untuk aktivitas kembali",
      contactSupport: {
        whatsapp: "+6281234567890",
        linkText: "disini",
        hoverColor: "#c53030",
      },
      canAppeal: true,
      appealDeadline: "2025-02-19T23:59:59Z",
    },
    Type: "ACCOUNT_STATUS_SUSPENDED",
  },
};

// Flag to control mock data usage
const useMockData = false; // Changed to true for testing

// Fetcher function for account status
export const getAccountStatus = async () => {
  if (useMockData) {
    return mockAPIResult;
  }

  const response = await fetcherMuatrans.get("/v1/transporter/account/status");
  return response;
};

// SWR hook for account status
export const useGetAccountStatus = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "account-status",
    getAccountStatus,
    {
      refreshInterval: 60000, // 1 minute auto-refresh
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
