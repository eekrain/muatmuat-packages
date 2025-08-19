import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

export const mockBankLogo = {
  success: {
    data: {
      Message: {
        Code: 200,
        Text: "Bank logo retrieved successfully",
      },
      Data: {
        logoUrl: "/assets/banks/bca-logo.png",
        bankName: "Bank Central Asia",
        bankCode: "BCA",
      },
      Type: "BANK_LOGO",
    },
  },
};

export const getBankLogo = async (bankCode) => {
  let result;

  if (useMockData) {
    result = { ...mockBankLogo.success };
  } else {
    try {
      result = await fetcherMuatrans.get(
        `/v1/transporter/banks/logos/${bankCode}`
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

export const useGetBankLogo = (bankCode) => {
  const { data, error, isLoading } = useSWR(
    bankCode ? ["getBankLogo", bankCode] : null,
    () => getBankLogo(bankCode)
  );

  return {
    logo: data?.data?.Data || null,
    raw: data?.data,
    isLoading,
    isError: !!error,
  };
};
