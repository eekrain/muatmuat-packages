import useSWRMutation from "swr/mutation";

import { fetcherMock, fetcherMuatrans } from "@/lib/axios";

const isMockCSTutorialStatus = true;

export const fetcherCSTutorialStatus = async (url, { arg }) => {
  if (isMockCSTutorialStatus) {
    const result = await fetcherMock.put(`/api/${url}`, arg ?? null);
    return result.data;
  }

  const result = await fetcherMuatrans.put(url, arg);
  return result.data;
};

export const usePutCSTutorialStatus = () => {
  const baseUrl = "/v1/cs/active-orders/tutorial/status";

  return useSWRMutation(baseUrl, (url, { arg }) => {
    return fetcherCSTutorialStatus(url, { arg });
  });
};
