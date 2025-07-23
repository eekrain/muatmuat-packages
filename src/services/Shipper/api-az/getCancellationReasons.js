import useSWR from "swr";

import { fetcherMuatparts } from "@/lib/axios";

export const getCancellationReasons = async (url) => {
  const res = await fetcherMuatparts.get(url);
  const data = res.data?.Data?.reasons;
  if (!data) return [];
  return data.map((val) => ({
    value: val?.reasonId,
    label: val?.reasonName,
  }));
};

export const useGetCancellationReasons = () => {
  return useSWR("v1/orders/cancellation-reasons", getCancellationReasons);
};
