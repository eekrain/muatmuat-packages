import useSWR from "swr";

import { fetcherMock, fetcherMuatrans } from "@/lib/axios";

const isMockUploadFile = true;
export const fetcherDropdownVehicle = async (url, { arg }) => {
  if (isMockUploadFile) {
    const result = await fetcherMock.get(`/api/${url}`, arg ?? null);
    return result.data;
  }
  const result = await fetcherMuatrans.get(url, arg);
  return result.data;
};

export const useGetDriversPreview = (url) => {
  return useSWR(url ? `driversDrafts-${url}` : null, () =>
    fetcherDropdownVehicle(`${url}`, { arg: null })
  );
};
