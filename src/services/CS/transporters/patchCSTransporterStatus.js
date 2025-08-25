import useSWRMutation from "swr/mutation";

import { fetcherMock, fetcherMuatrans } from "@/lib/axios";

// PATCH /api/v1/cs/transporters/{id}/status - Update transporter status
const isMockPatchCSTransporter = true;
const patchCSTransporterStatus = async (url, { arg }) => {
  const { id, data } = arg;
  if (isMockPatchCSTransporter) {
    const response = await fetcherMock.patch(`${url}/${id}/status`, arg);
    return response.data;
  }
  return await fetcherMuatrans.patch(`${url}/${id}/status`, data);
};

export const usePatchCSTransporterStatus = () => {
  return useSWRMutation("/v1/cs/transporters", patchCSTransporterStatus, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
};
