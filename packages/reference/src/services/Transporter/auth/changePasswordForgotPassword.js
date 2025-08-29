import useSWRMutation from "swr/mutation";

import { fetcherMuatrans } from "@/lib/axios";

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Password has been changed successfully",
    },
    Data: null,
  },
};

const changePasswordForgotPassword = async (url, { arg }) => {
  return await fetcherMuatrans.post(url, arg);
};

export const useChangePasswordForgotPassword = () => {
  return useSWRMutation(
    "/v1/transporter/auth/forgot-password/change-password",
    changePasswordForgotPassword
  );
};
