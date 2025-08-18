import useSWR from "swr";

import { fetcherMock, fetcherMuatrans } from "@/lib/axios";

const isMockUploadFile = false;
export const fetcherDropdownVehicle = async (url, { arg }) => {
  if (isMockUploadFile) {
    const result = await fetcherMock.get(`/api/${url}`, arg ?? null);
    return result.data;
  }
  const result = await fetcherMuatrans.get(url, arg);
  return result.data;
};

export const useGetFleetsDrafts = (url) => {
  return useSWR(url ? `fleetsDrafts-${url}` : null, () =>
    fetcherDropdownVehicle(url, { arg: null })
  );
};
