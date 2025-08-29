import useSWRMutation from "swr/mutation";

import { fetcherMuatrans } from "@/lib/axios";

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Password updated successfully",
    },
    Data: {
      lastPasswordChangeAt: "2025-08-05T10:35:00Z",
      passwordChangeCount: 3,
      sessionInvalidated: true,
      passwordHistoryId: "550e8400-e29b-41d4-a716-446655440090",
      redirectUrl: "/login",
      passwordStrength: "STRONG",
    },
    Type: "UPDATE_PASSWORD",
  },
};

// Fetcher function for updating password
export const updatePassword = async (url, { arg }) => {
  return fetcherMuatrans.put(url, arg);
};

// SWR mutation hook for updating password
export const useUpdatePassword = () =>
  useSWRMutation("/v1/transporter/auth/password", (url, { arg }) =>
    fetcherMuatrans.put(url, arg)
  );
