import useSWRMutation from "swr/mutation";

import { fetcherMuatrans } from "@/lib/axios";

const postDocumentReceived = (url) => {
  return fetcherMuatrans.post(url);
};

export const usePostDocumentReceived = (orderId) => {
  const {
    trigger: triggerPostDocumentReceived,
    isMutating: isMutatingPostDocumentReceived,
    error: errorPostDocumentReceived,
  } = useSWRMutation(
    `/v1/orders/${orderId}/document-received`,
    postDocumentReceived
  );

  return {
    triggerPostDocumentReceived,
    isMutatingPostDocumentReceived,
    errorPostDocumentReceived,
  };
};
