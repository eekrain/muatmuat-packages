import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMock = true;
// Mock API result for development/testing
export const mockAPIResult = {
  success: true,

  data: {
    payment_options: ["Transfer Bank", "Virtual Account", "E-Wallet", "Cash"],
  },
};

export const getPaymentOptions = async (url) => {
  let result;
  if (useMock) {
    result = mockAPIResult;
  } else {
    result = await fetcherMuatrans.get(url);
  }
  return {
    payment_options: result?.data?.payment_options || [],
  };
};

export const useGetPaymentOptions = (queryString) =>
  useSWR(
    `/v1/cs/additional-cost-reports/filter-options/payment-options?${queryString}`,
    getPaymentOptions
  );
