import useSWR from "swr";

import { fetcherMuatrans, fetcherMuatransMock } from "@/lib/axios";

const isMockUploadFile = true;
export const fetcherDropdownVehicle = async (url, { arg }) => {
  if (isMockUploadFile) {
    const result = await fetcherMuatransMock.get(`/api/${url}`, arg ?? null);
    return result.data;
  }
  const result = await fetcherMuatrans.get(url, arg);
  return result.data;
};

export const useGetMasterVehicleTypes = (url) => {
  return useSWR(url ? `masterVehicle-${url}` : null, () =>
    fetcherDropdownVehicle(url, { arg: null })
  );
};
