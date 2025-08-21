import useSWRMutation from "swr/mutation";

import { fetcherMuatrans } from "@/lib/axios";

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "OK",
    },
    Data: {
      id: "75be429d-16dc-478a-992b-16c8df1c781b",
      companyName: "PT Backend Sejahterah",
      isActive: true,
      status: "ACTIVE",
      updatedAt: "2025-08-20T17:13:41.266Z",
    },
    Type: "/v1/cs/transporters/75be429d-16dc-478a-992b-16c8df1c781b/status",
  },
};

// Fetcher function for updating transporter status
export const updateTransporterStatus = async (url, { arg }) => {
  return fetcherMuatrans.patch(url, arg);
};

// SWR mutation hook for updating transporter status
export const useUpdateTransporterStatus = () =>
  useSWRMutation("update-transporter-status", (key, { arg }) => {
    const { transporterId, ...data } = arg;
    return fetcherMuatrans.patch(
      `/v1/cs/transporters/${transporterId}/status`,
      data
    );
  });
