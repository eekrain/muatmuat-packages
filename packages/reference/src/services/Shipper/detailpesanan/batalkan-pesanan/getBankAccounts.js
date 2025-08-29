import useSWR from "swr";

import { fetcherMuatparts } from "@/lib/axios";

export const getBankAccounts = async (url) => {
  const res = await fetcherMuatparts.get(url);
  return res.data?.Data?.accounts || [];
  // return [];
};

export const useGetBankAccounts = () => {
  return useSWR("v1/muatparts/bankAccount", getBankAccounts);
};
