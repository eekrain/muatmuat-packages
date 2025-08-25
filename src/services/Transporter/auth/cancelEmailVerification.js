import useSWRMutation from "swr/mutation";

import { fetcherMuatrans } from "@/lib/axios";

export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Email verification has been successfully cancelled.",
    },
    Data: null,
  },
};

const cancelEmailVerification = (url, { arg }) => {
  return fetcherMuatrans.post(url, arg);
};

export const useCancelEmailVerification = () => {
  return useSWRMutation(
    "/v1/transporter/email-verification/cancel",
    cancelEmailVerification
  );
};
