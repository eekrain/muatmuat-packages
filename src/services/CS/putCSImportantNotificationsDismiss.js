import useSWRMutation from "swr/mutation";

import { fetcherMock, fetcherMuatrans } from "@/lib/axios";

const isMockCSImportantNotificationsDismiss = true;

export const fetcherCSImportantNotificationsDismiss = async (url, { arg }) => {
  if (isMockCSImportantNotificationsDismiss) {
    // When mocking, call the local API route under /api
    const result = await fetcherMock.put(`/api${url}`, arg ?? null);
    return result.data;
  }
  const result = await fetcherMuatrans.put(url, arg);
  return result.data;
};

export const usePutCSImportantNotificationsDismiss = (notificationId) => {
  const baseUrl = notificationId
    ? `/v1/cs/active-orders/important-notifications/${notificationId}/dismiss`
    : "/v1/cs/active-orders/important-notifications/dismiss";

  return useSWRMutation(baseUrl, (url, { arg }) =>
    fetcherCSImportantNotificationsDismiss(url, { arg })
  );
};
