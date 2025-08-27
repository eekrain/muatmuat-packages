import useSWR from "swr";

import { fetcherMock, fetcherMuatrans } from "@/lib/axios";

const isMockCSTutorialStatus = true;

export const fetcherCSTutorialStatusGet = async (url) => {
  if (isMockCSTutorialStatus) {
    const result = await fetcherMock.get(`/api/${url}`);
    return result.data;
  }

  const result = await fetcherMuatrans.get(url);
  return result.data;
};

export const useGetCSTutorialStatus = () => {
  const url = "/v1/cs/active-orders/tutorial/status";
  return useSWR(url, () => fetcherCSTutorialStatusGet(url));
};
