import useSWR from "swr";

import { fetcherMuatparts } from "@/lib/axios";

export const getAvailableBankOptions = async (url) => {
  const res = await fetcherMuatparts.get(url);
  const data = res.data?.Data;
  if (!data) return [];
  return data.map((val) => ({
    value: val?.id,
    label: val?.value,
  }));
};

export const useGetAvailableBankOptions = () => {
  return useSWR("v1/muatparts/banks", getAvailableBankOptions);
};
