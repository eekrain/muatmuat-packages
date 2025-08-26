import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

export const mockProcessingIssueList = {
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
          issue_type: "POTENTIAL_DRIVER_LATE",
          status: "NEW",
          description:
            "Armada B 1234 XYZ sudah harus sampai di lokasi muat dalam waktu 15 menit",
          detected_at: "2025-01-15T09:15:00Z",
          processed_at: null,
          rejection_count: 2,
          contact_attempts: 3,
          last_contact_at: "2025-01-15T10:00:00Z",
          has_rejection_history: true,
        },
      ],
    },
    {
      id: "d3b4c2f5-6e7g-5d8c-9f0b-2g3h4i5j6k7l",
      order_id: "uuid-003",
      orderCode: "MT69320",
      countdown: 1200,
      transporter: {
        id: "tr003",
        name: "CV Cepat Kirim",
        logo: "https://api.muatrans.com/logos/tr003.png",
        phone: "022-98765432",
      },
      orderLocations: {
        pickupLocations: [
          {
            id: "ploc003",
            sequence: 1,
            latitude: -6.9175,
            longitude: 107.6191,
            district: "Kiaracondong",
            city: "Bandung",
          },
        ],
        dropoffLocations: [
          {
            id: "dloc003",
            sequence: 1,
            latitude: -6.8906,
            longitude: 107.6041,
            district: "Sukajadi",
            city: "Bandung",
          },
          {
            id: "dloc004",
            sequence: 2,
            latitude: -6.9034,
            longitude: 107.6253,
            district: "Cibeunying",
            city: "Bandung",
          },
        ],
      },
      issues: [
        {
          vehicle: {
            id: "vh003",
            plate_number: "D 9012 DEF",
            driver_name: "Citra Lestari",
            location: {
              latitude: -6.9147,
              longitude: 107.6098,
              address: "Jl. Asia Afrika No. 10, Bandung",
            },
            polylineEncode: "",
          },
          issue_type: "FLEET_NOT_MOVING", // POTENTIAL_DRIVER_LATE, FLEET_NOT_MOVING, FLEET_NOT_READY
          status: "NEW",
          description:
            "Dokumen surat jalan untuk armada D 9012 DEF belum diunggah oleh transporter.",
          detected_at: "2025-03-10T08:00:00Z",
          processed_at: null,
          rejection_count: 0,
          contact_attempts: 0,
          last_contact_at: null,
          has_rejection_history: false,
        },
      ],
    },
    {
      id: "e4c5d3g6-7f8h-6e9d-0g1c-3h4i5j6k7l8m",
      order_id: "uuid-004",
      orderCode: "MT81457",
      countdown: 900,
      transporter: {
        id: "tr004",
        name: "PT Angkutan Amanah",
        logo: "https://api.muatrans.com/logos/tr004.png",
        phone: "024-54321987",
      },
      orderLocations: {
        pickupLocations: [
          {
            id: "ploc004",
            sequence: 1,
            latitude: -6.9667,
            longitude: 110.4381,
            district: "Banyumanik",
            city: "Semarang",
          },
        ],
        dropoffLocations: [
          {
            id: "dloc005",
            sequence: 1,
            latitude: -7.7956,
            longitude: 110.3695,
            district: "Gondomanan",
            city: "Yogyakarta",
          },
        ],
      },
      issues: [
        {
          vehicle: {
            id: "vh004",
            plate_number: "H 3456 GHI",
            driver_name: "Eko Prasetyo",
            location: {
              latitude: -7.1509,
              longitude: 110.4084,
              address: "Jl. Tol Semarang-Solo KM 22, Ungaran",
            },
            polylineEncode: "",
          },
          issue_type: "FLEET_NOT_READY",
          status: "NEW",
          description:
            "Sinyal GPS dari armada H 3456 GHI tidak terdeteksi selama lebih dari 30 menit.",
          detected_at: "2025-04-05T14:45:00Z",
          processed_at: null,
          rejection_count: 1,
          contact_attempts: 4,
          last_contact_at: "2025-04-05T15:00:00Z",
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
    overdue_issues: ["e4c5d3g6-7f8h-6e9d-0g1c-3h4i5j6k7l8m", "uuid2", "uuid3"],
  },
};

export const getProcessingIssueList = async (cacheKey) => {
  let result;
  if (useMockData) {
    // Sort so that items with id in overdue_issues are at the top
    const overdueIds =
      (mockProcessingIssueList.meta &&
        mockProcessingIssueList.meta.overdue_issues) ||
      [];
    const sortedItems = mockProcessingIssueList.data.slice().sort((a, b) => {
      const aIsOverdue = overdueIds.includes(a.id);
      const bIsOverdue = overdueIds.includes(b.id);
      if (aIsOverdue === bIsOverdue) return 0;
      return aIsOverdue ? -1 : 1;
    });
    result = {
      ...mockProcessingIssueList,
      data: sortedItems,
    };
  } else {
    result = await fetcherMuatrans.get("/v1/cs/urgent-issues/processing");
  }
  return {
    items: result?.data || [],
    pagination: result?.pagination || {},
    meta: result?.meta || {},
    success: result?.success,
    raw: result,
  };
};

export const useGetProcessingIssueList = (params) => {
  // params tidak dipakai di mock, tapi bisa diteruskan jika API butuh
  const paramsString = params ? new URLSearchParams(params).toString() : "";
  const { data, error, isLoading } = useSWR(
    `getProcessingIssueList/${paramsString}`,
    getProcessingIssueList
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
