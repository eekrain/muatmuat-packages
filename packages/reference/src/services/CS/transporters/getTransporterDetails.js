import useSWR from "swr";

import { fetcherMock, fetcherMuatrans } from "@/lib/axios";

const isMockTransporterDetails = false;

export const fetcherTransporterDetails = async (url, { arg }) => {
  if (isMockTransporterDetails) {
    const result = await fetcherMock.get(`/api/${url}`, arg ?? null);
    return result.data;
  }
  const result = await fetcherMuatrans.get(url, arg);
  return result.data;
};

export const useGetTransporterDetails = (transporterId) => {
  const url = transporterId ? `/v1/cs/transporters/${transporterId}` : null;

  return useSWR(url ? `transporterDetails-${transporterId}` : null, () =>
    fetcherTransporterDetails(url, { arg: null })
  );
};

// Hook for refreshing/mutating the transporter details data
export const useMutateTransporterDetails = (transporterId) => {
  const { mutate } = useSWR(
    transporterId ? `transporterDetails-${transporterId}` : null,
    null,
    { revalidateOnFocus: false }
  );

  return mutate;
};
