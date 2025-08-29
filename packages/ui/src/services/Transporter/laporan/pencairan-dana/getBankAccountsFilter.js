import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false;

export const mockBankAccounts = {
  data: {
    Message: {
      Code: 200,
      Text: "Bank accounts retrieved successfully",
    },
    Data: {
      accounts: [
        {
          id: "bca_1234567890",
          bankCode: "BCA",
          bankName: "Bank Central Asia",
          accountNumber: "****567890",
          logoUrl: "/assets/banks/bca-logo.png",
          isSelected: false,
          usageCount: 5,
        },
        {
          id: "bni_9876543210",
          bankCode: "BNI",
          bankName: "Bank Negara Indonesia",
          accountNumber: "****43210",
          logoUrl: "/assets/banks/bni-logo.png",
          isSelected: false,
          usageCount: 3,
        },
      ],
    },
    Type: "BANK_ACCOUNTS_LIST",
  },
};

export const getBankAccounts = async (cacheKey) => {
  let result;

  if (useMockData) {
    result = { ...mockBankAccounts };
  } else {
    result = await fetcherMuatrans.get(
      "/v1/transporter/withdrawals/bank-accounts"
    );
  }

  return {
    accounts: result?.data?.Data?.accounts || [],
    raw: result,
  };
};

export const useGetBankAccounts = () => {
  const { data, error, isLoading } = useSWR("getBankAccounts", getBankAccounts);

  return {
    accounts: data?.accounts || [],
    raw: data?.raw,
    isLoading,
    isError: !!error,
  };
};
