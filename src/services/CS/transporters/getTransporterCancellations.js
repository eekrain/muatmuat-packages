import useSWR from "swr";

import { fetcherMock, fetcherMuatrans } from "@/lib/axios";

const isMockTransporterCancellations = true;

export const fetcherTransporterCancellations = async (url, { arg }) => {
  if (isMockTransporterCancellations) {
    const result = await fetcherMock.get(`/api/${url}`, arg ?? null);
    return result.data;
  }
  const result = await fetcherMuatrans.get(url, arg);
  return result.data;
};

export const useGetTransporterCancellations = (transporterId) => {
  const url = transporterId
    ? `/v1/cs/transporters/${transporterId}/cancellations`
    : null;

  return useSWR(url ? `transporterCancellations-${transporterId}` : null, () =>
    fetcherTransporterCancellations(url, { arg: null })
  );
};

// Enhanced hook with query parameters (for filtering and pagination)
export const useGetTransporterCancellationsWithParams = (
  transporterId,
  params = {}
) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    status = "",
    startDate = "",
    endDate = "",
    orderType = "",
  } = params;

  // Build query string
  const queryParams = new URLSearchParams();
  if (page) queryParams.append("page", page.toString());
  if (limit) queryParams.append("limit", limit.toString());
  if (search) queryParams.append("search", search);
  if (status) queryParams.append("status", status);
  if (startDate) queryParams.append("startDate", startDate);
  if (endDate) queryParams.append("endDate", endDate);
  if (orderType) queryParams.append("orderType", orderType);

  const queryString = queryParams.toString();
  const url = transporterId
    ? `/v1/cs/transporters/${transporterId}/cancellations${queryString ? `?${queryString}` : ""}`
    : null;

  // Create a unique key for SWR that includes all parameters
  const swrKey = url
    ? `transporterCancellations-${transporterId}-${JSON.stringify(params)}`
    : null;

  return useSWR(swrKey, () =>
    fetcherTransporterCancellations(url, { arg: null })
  );
};

// Hook for refreshing/mutating the cancellations data
export const useMutateTransporterCancellations = (transporterId) => {
  const { mutate } = useSWR(
    transporterId ? `transporterCancellations-${transporterId}` : null,
    null,
    { revalidateOnFocus: false }
  );

  return mutate;
};
