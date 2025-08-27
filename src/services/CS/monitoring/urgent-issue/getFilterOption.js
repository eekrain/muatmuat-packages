import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

export const mockFilterOption = {
  success: true,
  data: {
    issue_types: [
      {
        type: "POTENTIAL_DRIVER_LATE", // POTENTIAL_DRIVER_LATE, FLEET_NOT_MOVING, FLEET_NOT_READY
        label: "Potensi Driver Terlambat Muat",
        count: 8,
      },
      {
        type: "FLEET_NOT_MOVING",
        label: "Armada Tidak Bergerak Menuju Lokasi",
        count: 5,
      },
      {
        type: "FLEET_NOT_READY",
        label: "Armada Tidak Siap Untuk Muat",
        count: 2,
      },
    ],
    historyPeriods: [
      {
        startDate: "2025-07-01",
        endDate: "2025-07-31",
      },
      {
        startDate: "2025-08-01",
        endDate: "2025-08-25",
      },
    ],
    transporters: [
      { id: "tr001", name: "PT Transport Sejahtera" },
      { id: "tr002", name: "CV Cepat Kirim" },
      { id: "tr003", name: "PT Angkutan Amanah" },
    ],
  },
};

export const getFilterOption = async () => {
  let result;
  if (useMockData) {
    result = mockFilterOption;
  } else {
    result = await fetcherMuatrans.get("/v1/cs/urgent-issues/filter-options");
  }
  return {
    data: result?.data || {},
    success: result?.success,
    raw: result,
  };
};

export const useGetFilterOption = () => {
  const { data, error, isLoading } = useSWR("getFilterOption", getFilterOption);
  return {
    data: data?.data || {},
    success: data?.success,
    raw: data?.raw,
    isLoading,
    isError: !!error,
  };
};
