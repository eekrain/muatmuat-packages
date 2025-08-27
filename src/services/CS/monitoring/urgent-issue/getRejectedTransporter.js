import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

export const mockRejectedTransporterList = {
  success: true,
  data: [
    {
      id: "tr001",
      name: "PT Transport Sejahtera",
      logo: "https://api.muatrans.com/logos/tr001.png",
      rejected_at: "2025-01-15T09:45:00Z",
      rejection_reason: "Armada tidak tersedia",
      status: {
        isActive: true,
        activityStatus: "ACTIVE",
        lastActivity: "2025-01-15T14:30:00Z",
        inactiveReason: null,
        current: 20,
        total: 40,
        inactivityStatus: "TRANSPORTER_IDLE", // [ARMADA_INACTIVE, TRANSPORTER_IDLE, TRANSPORTER_INACTIVE]
      },

      vehicle_count: {
        matching: 3,
        active: 1,
        inactive: 2,
      },
      can_expand: true,
    },
    {
      id: "tr002",
      name: "PT Angkutan Amanah",
      logo: "https://api.muatrans.com/logos/tr002.png",
      rejected_at: "2025-02-10T11:30:00Z",
      rejection_reason: "Driver tidak siap",
      status: {
        isActive: true,
        activityStatus: "ACTIVE",
        lastActivity: "2025-01-15T14:30:00Z",
        inactiveReason: null,
        current: 20,
        total: 40,
        inactivityStatus: "ARMADA_INACTIVE", // [ARMADA_INACTIVE, TRANSPORTER_IDLE, TRANSPORTER_INACTIVE]
      },
      vehicle_count: {
        matching: 2,
        active: 0,
        inactive: 2,
      },
      can_expand: false,
    },
    {
      id: "tr003",
      name: "CV Cepat Kirim",
      logo: "https://api.muatrans.com/logos/tr003.png",
      rejected_at: "2025-03-05T08:20:00Z",
      rejection_reason: "Kendaraan rusak",
      status: {
        isActive: true,
        activityStatus: "ACTIVE",
        lastActivity: "2025-01-15T14:30:00Z",
        inactiveReason: null,
        current: 20,
        total: 40,
        inactivityStatus: "ARMADA_INACTIVE", // [ARMADA_INACTIVE, TRANSPORTER_IDLE, TRANSPORTER_INACTIVE]
      },
      vehicle_count: {
        matching: 1,
        active: 0,
        inactive: 1,
      },
      can_expand: true,
    },
  ],
  pagination: {
    total: 3,
    page: 1,
    limit: 10,
  },
};

export const getRejectedTransporterList = async (cacheKey) => {
  let result;
  if (useMockData) {
    result = mockRejectedTransporterList;
  } else {
    // cacheKey format: getRejectedTransporterList/{issue_id}
    const issueId = cacheKey.split("/")[1] || "";
    result = await fetcherMuatrans.get(
      `/v1/cs/urgent-issues/${issueId}/rejected-transporters`
    );
  }
  return {
    items: result?.data || [],
    pagination: result?.pagination || {},
    success: result?.success,
    raw: result,
  };
};

export const useGetRejectedTransporterList = (issueId) => {
  const cacheKey = `getRejectedTransporterList/${issueId || ""}`;
  const { data, error, isLoading } = useSWR(
    cacheKey,
    getRejectedTransporterList
  );
  return {
    items: data?.items || [],
    pagination: data?.pagination || {},
    success: data?.success,
    raw: data?.raw,
    isLoading,
    isError: !!error,
  };
};
