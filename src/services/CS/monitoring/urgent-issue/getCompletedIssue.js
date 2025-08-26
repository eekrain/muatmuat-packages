import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

export const mockCompletedIssueList = {
  success: true,
  data: [
    {
      id: "123e4567-e89b-12d3-a456-426614174000",
      order_id: "uuid",
      orderCode: "MT32343",
      countdown: 2000,
      transporter: {
        id: "tr001",
        name: "PT Transport Sejahtera",
        logo: "https://api.muatrans.com/logos/tr001.png",
        phone: "021-12345678",
      },
      orderLocations: {
        pickupLocations: [
          {
            id: "ploc001",
            sequence: 1,
            latitude: -6.1751,
            longitude: 106.865,
            district: "Gambir",
            city: "Jakarta Pusat",
          },
        ],
        dropoffLocations: [
          {
            id: "dloc001",
            sequence: 1,
            latitude: -6.2297,
            longitude: 106.6894,
            district: "Tangerang",
            city: "Kota Tangerang",
          },
        ],
      },
      issues: [
        {
          vehicle: {
            id: "vh001",
            plate_number: "B 1234 XYZ",
            driver_name: "Ahmad Supardi",
            location: {
              latitude: -6.2088,
              longitude: 106.8456,
              address: "Jl. Sudirman No. 1, Jakarta",
            },
            polylineEncode: "",
          },
          issue_type: "FLEET_NOT_READY", // POTENTIAL_DRIVER_LATE, FLEET_NOT_MOVING, FLEET_NOT_READY
          status: "NEW",
          description:
            "Armada B 1234 XYZ sudah harus sampai di lokasi muat dalam waktu 15 menit",
          detected_at: "2025-07-15T09:15:00Z",
          processed_at: "2025-08-15T09:15:00Z",
          completed_at: "2025-09-15T09:15:00Z",
          rejection_count: 2,
          contact_attempts: 3,
          last_contact_at: "2025-01-15T10:00:00Z",
          has_rejection_history: true,
        },
      ],
    },
    // Tambahkan data dummy lain jika perlu
  ],
  pagination: {
    total: 15,
    page: 1,
    limit: 10,
    total_pages: 2,
    has_next: true,
    has_prev: false,
  },
  meta: {
    overdue_count: 3,
    overdue_issues: ["uuid1", "uuid2", "uuid3"],
  },
};

export const getCompletedIssueList = async (cacheKey) => {
  let result;
  if (useMockData) {
    // Sort so that items with id in overdue_issues are at the top
    const overdueIds =
      (mockCompletedIssueList.meta &&
        mockCompletedIssueList.meta.overdue_issues) ||
      [];
    const sortedItems = mockCompletedIssueList.data.slice().sort((a, b) => {
      const aIsOverdue = overdueIds.includes(a.id);
      const bIsOverdue = overdueIds.includes(b.id);
      if (aIsOverdue === bIsOverdue) return 0;
      return aIsOverdue ? -1 : 1;
    });
    result = {
      ...mockCompletedIssueList,
      data: sortedItems,
    };
  } else {
    result = await fetcherMuatrans.get("/v1/cs/urgent-issues/completed");
  }
  return {
    items: result?.data || [],
    pagination: result?.pagination || {},
    meta: result?.meta || {},
    success: result?.success,
    raw: result,
  };
};

export const useGetCompletedIssueList = (params) => {
  // params tidak dipakai di mock, tapi bisa diteruskan jika API butuh
  const paramsString = params ? new URLSearchParams(params).toString() : "";
  const { data, error, isLoading } = useSWR(
    `getCompletedIssueList/${paramsString}`,
    getCompletedIssueList
  );
  return {
    items: data?.items || [],
    pagination: data?.pagination || {},
    meta: data?.meta || {},
    success: data?.success,
    raw: data?.raw,
    isLoading,
    isError: !!error,
  };
};
