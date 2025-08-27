import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

export const mockCompletedIssueList = {
  success: true,
  data: [
    {
      id: "123e4567-e89b-12d3-a456-426614174000",
      order_id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
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
            id: "vh013",
            plate_number: "P 2025 JBR",
            driver_name: "Slamet Riyadi",
            location: {
              latitude: -8.1585,
              longitude: 113.7212,
              address: "Jl. Kalimantan, Kampus Tegal Boto, Jember",
            },
            polylineEncode: "jember_local_route_1",
          },
          issue_type: "FLEET_NOT_READY",
          status: "NEW",
          description:
            "Driver melaporkan ada kendala ban dan belum siap berangkat sesuai jadwal.",
          detected_at: "2025-08-26T13:00:00Z",
          processed_at: "2025-08-27T13:02:00Z",
          completed_at: "2025-08-28T13:15:00Z",
          rejection_count: 0,
          contact_attempts: 0,
          last_contact_at: null,
          has_rejection_history: false,
        },
        {
          vehicle: {
            id: "vh014",
            plate_number: "N 5555 PRB",
            driver_name: "Wati Susanti",
            location: {
              latitude: -7.7533,
              longitude: 113.2165,
              address: "Jl. Raya Panglima Sudirman, Probolinggo",
            },
            polylineEncode: "probolinggo_pantura_route",
          },
          issue_type: "FLEET_NOT_MOVING",
          status: "IN_PROGRESS",
          description:
            "Kendaraan terpantau berhenti lebih dari 20 menit di lokasi yang tidak seharusnya.",
          detected_at: "2025-08-26T13:00:00Z",
          processed_at: "2025-08-27T13:02:00Z",
          completed_at: "2025-08-28T13:15:00Z",
          rejection_count: 0,
          contact_attempts: 1,
          last_contact_at: "2025-08-27T14:00:00Z",
          has_rejection_history: false,
        },
        {
          vehicle: {
            id: "vh015",
            plate_number: "P 7788 BWI",
            driver_name: "Budi Cahyono",
            location: {
              latitude: -8.2151,
              longitude: 113.9989,
              address: "Jalur Gumitir, Silo, Jember",
            },
            polylineEncode: "jember_banyuwangi_gumitir",
          },
          issue_type: "POTENTIAL_DRIVER_LATE",
          status: "RESOLVED",
          description:
            "Prediksi terlambat 45 menit karena lalu lintas padat di Gumitir, driver sudah konfirmasi.",
          detected_at: "2025-08-27T12:30:00Z",
          processed_at: "2025-08-27T12:35:00Z",
          completed_at: "2025-08-27T12:45:00Z",
          rejection_count: 1,
          contact_attempts: 2,
          last_contact_at: "2025-08-27T12:34:00Z",
          has_rejection_history: true,
        },
      ],
    },
    {
      id: "8c7b6a5d-4f3e-2d1c-b0a9-87654321fedc",
      order_id: "f9e8d7c6-b5a4-3210-fedc-ba9876543210",
      orderCode: "indra",
      countdown: 3600,
      transporter: {
        id: "tr002",
        name: "CV. Logistik Prima",
        logo: "https://api.muatrans.com/logos/tr002.png",
        phone: "031-87654321",
      },
      orderLocations: {
        pickupLocations: [
          {
            id: "ploc002",
            sequence: 1,
            latitude: -7.3392,
            longitude: 112.742,
            district: "Waru",
            city: "Sidoarjo",
          },
        ],
        dropoffLocations: [
          {
            id: "dloc002",
            sequence: 1,
            latitude: -7.903,
            longitude: 112.6582,
            district: "Singosari",
            city: "Malang",
          },
        ],
      },
      issues: [
        {
          vehicle: {
            id: "vh016",
            plate_number: "BK 1234 IND",
            driver_name: "Maruli Siregar",
            location: {
              latitude: 3.1895,
              longitude: 98.5082,
              address: "Jl. Jamin Ginting, Sibolangit, Deli Serdang",
            },
            polylineEncode: "berastagi_medan_route_xyz",
          },
          issue_type: "POTENTIAL_DRIVER_LATE",
          status: "NEW",
          description:
            "Potensi terlambat karena cuaca buruk dan jalan licin di area Sibolangit.",
          detected_at: "2025-08-26T13:00:00Z",
          processed_at: "2025-08-27T13:02:00Z",
          completed_at: "2025-08-28T13:15:00Z",
          rejection_count: 0,
          contact_attempts: 0,
          last_contact_at: null,
          has_rejection_history: false,
        },
        {
          vehicle: {
            id: "vh017",
            plate_number: "DD 5678 RAA",
            driver_name: "Daeng Situju",
            location: {
              latitude: -5.1354,
              longitude: 119.4238,
              address: "Kawasan Industri Makassar (KIMA), Makassar",
            },
            polylineEncode: "makassar_kima_depot_123",
          },
          issue_type: "FLEET_NOT_READY",
          status: "CLOSED",
          description:
            "Kendaraan dilaporkan mengalami masalah kelistrikan minor, sudah teratasi oleh driver.",
          detected_at: "2025-08-27T09:00:00Z",
          processed_at: "2025-08-27T09:05:00Z",
          completed_at: "2025-08-27T09:30:00Z",
          rejection_count: 0,
          contact_attempts: 1,
          last_contact_at: "2025-08-27T09:04:00Z",
          has_rejection_history: false,
        },
        {
          vehicle: {
            id: "vh018",
            plate_number: "BG 9988 PLG",
            driver_name: "Yusuf Karta",
            location: {
              latitude: -2.9909,
              longitude: 104.7573,
              address: "Dekat Jembatan Ampera, Seberang Ulu I, Palembang",
            },
            polylineEncode: "palembang_ampera_traffic_456",
          },
          issue_type: "FLEET_NOT_MOVING",
          status: "IN_PROGRESS",
          description:
            "Driver berhenti untuk istirahat, melebihi alokasi waktu yang ditentukan.",
          detected_at: "2025-08-27T09:00:00Z",
          processed_at: "2025-08-27T09:05:00Z",
          completed_at: "2025-08-27T09:30:00Z",
          rejection_count: 1,
          contact_attempts: 2,
          last_contact_at: "2025-08-27T14:05:00Z",
          has_rejection_history: true,
        },
      ],
    },
    {
      id: "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
      order_id: "d6c5b4a3-f2e1-a987-c654-d3b2a1f0e9d8",
      orderCode: "MT99102",
      countdown: 1500,
      transporter: {
        id: "tr003",
        name: "Ekspedisi Cepat Jawa",
        logo: "https://api.muatrans.com/logos/tr003.png",
        phone: "022-98765432",
      },
      orderLocations: {
        pickupLocations: [
          {
            id: "ploc003",
            sequence: 1,
            latitude: -6.9408,
            longitude: 107.7107,
            district: "Gedebage",
            city: "Bandung",
          },
        ],
        dropoffLocations: [
          {
            id: "dloc003",
            sequence: 1,
            latitude: -6.746,
            longitude: 108.5483,
            district: "Harjamukti",
            city: "Cirebon",
          },
        ],
      },
      issues: [
        {
          vehicle: {
            id: "vh019",
            plate_number: "P 6789 AMB",
            driver_name: "Pak Tarno",
            location: {
              latitude: -8.3441,
              longitude: 113.6085,
              address: "Alun-alun Ambulu, Jember",
            },
            polylineEncode: "jember_ambulu_local_route",
          },
          issue_type: "FLEET_NOT_READY",
          status: "NEW",
          description:
            "Driver belum memberikan konfirmasi kesiapan muat, jadwal sudah lewat 5 menit.",
          detected_at: "2025-08-27T09:00:00Z",
          processed_at: "2025-08-27T09:05:00Z",
          completed_at: "2025-08-27T09:30:00Z",
          rejection_count: 0,
          contact_attempts: 0,
          last_contact_at: null,
          has_rejection_history: false,
        },
        {
          vehicle: {
            id: "vh020",
            plate_number: "P 1122 KST",
            driver_name: "Bu Sumiati",
            location: {
              latitude: -8.1177,
              longitude: 113.8182,
              address: "Depan Stasiun Kalisat, Jember",
            },
            polylineEncode: "jember_kalisat_station_route",
          },
          issue_type: "FLEET_NOT_MOVING",
          status: "IN_PROGRESS",
          description:
            "Kendaraan berhenti tidak wajar di pinggir jalan, sedang dalam proses verifikasi oleh tim.",
          detected_at: "2025-08-27T09:00:00Z",
          processed_at: "2025-08-27T09:05:00Z",
          completed_at: "2025-08-27T09:30:00Z",
          rejection_count: 0,
          contact_attempts: 1,
          last_contact_at: "2025-08-27T14:10:00Z",
          has_rejection_history: false,
        },
        {
          vehicle: {
            id: "vh021",
            plate_number: "P 3344 TGL",
            driver_name: "Cak Mamat",
            location: {
              latitude: -8.1581,
              longitude: 113.4549,
              address: "Perlintasan Kereta Api Tanggul, Jember",
            },
            polylineEncode: "jember_tanggul_crossing_route",
          },
          issue_type: "POTENTIAL_DRIVER_LATE",
          status: "RESOLVED",
          description:
            "Terjebak palang kereta api, potensi telat 15 menit. Situasi sudah normal kembali.",
          detected_at: "2025-08-27T09:00:00Z",
          processed_at: "2025-08-27T09:05:00Z",
          completed_at: "2025-08-27T09:30:00Z",
          rejection_count: 0,
          contact_attempts: 1,
          last_contact_at: "2025-08-27T13:01:00Z",
          has_rejection_history: false,
        },
      ],
    },
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
