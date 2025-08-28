import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

export const mockProcessingIssueList = {
  success: true,
  data: [
    {
      id: "123e4567-e89b-12d3-a456-426614174004",
      order_id: "b2c3d4e5-f6g7-8901-2345-67890abcdef1",
      orderCode: "MT45891",
      countdown: 3600, // in seconds
      transporter: {
        id: "tr002",
        name: "PT Logistik Cepat Nusantara",
        logo: "https://api.muatrans.com/logos/tr002.png",
        phone: "031-87654321",
      },
      orderLocations: {
        pickupLocations: [
          {
            id: "ploc002",
            sequence: 1,
            latitude: -7.2575,
            longitude: 112.7521,
            district: "Tanjung Perak",
            city: "Surabaya",
          },
        ],
        dropoffLocations: [
          {
            id: "dloc002",
            sequence: 1,
            latitude: -7.9839,
            longitude: 112.6212,
            district: "Klojen",
            city: "Malang",
          },
        ],
      },
      issues: [
        {
          vehicle: {
            id: "vh004",
            plate_number: "L 5678 AB",
            driver_name: "Budi Santoso",
            location: {
              latitude: -7.2754,
              longitude: 112.7568,
              address: "Jl. Pemuda No. 31, Surabaya",
            },
            polylineEncode: "another_encoded_polyline_string",
          },
          issue_type: "POTENTIAL_DRIVER_LATE", // POTENTIAL_DRIVER_LATE, FLEET_NOT_MOVING, FLEET_NOT_READY
          status: "NEW",
          description:
            "Driver diperkirakan terlambat 30 menit dari jadwal pickup.",
          detected_at: "2025-08-27T10:05:00Z",
          processed_at: null,
          rejection_count: 0,
          contact_attempts: 1,
          last_contact_at: "2025-08-27T10:10:00Z",
          has_rejection_history: false,
        },
        {
          vehicle: {
            id: "vh005",
            plate_number: "B 1234 XYZ",
            driver_name: "Citra Lestari",
            location: {
              latitude: -6.2088,
              longitude: 106.8456,
              address: "Jl. Jenderal Sudirman Kav. 52-53, Jakarta",
            },
            polylineEncode: "yet_another_encoded_polyline_string",
          },
          issue_type: "FLEET_NOT_MOVING",
          status: "NEW",
          description: "Kendaraan terdeteksi keluar dari rute yang seharusnya.",
          detected_at: "2025-08-27T11:15:00Z",
          processed_at: null,
          rejection_count: 0,
          contact_attempts: 0,
          last_contact_at: null,
          has_rejection_history: false,
        },
        {
          vehicle: {
            id: "vh006",
            plate_number: "D 4321 EF",
            driver_name: "Agus Setiawan",
            location: {
              latitude: -6.9175,
              longitude: 107.6191,
              address: "Jl. Asia Afrika No. 1, Bandung",
            },
            polylineEncode: "one_more_encoded_polyline",
          },
          issue_type: "FLEET_NOT_READY",
          status: "IN_PROGRESS",
          description:
            "Driver berhenti di lokasi tidak terduga lebih dari 15 menit.",
          detected_at: "2025-08-27T09:30:00Z",
          processed_at: "2025-08-27T09:45:00Z",
          rejection_count: 1,
          contact_attempts: 2,
          last_contact_at: "2025-08-27T09:40:00Z",
          has_rejection_history: true,
        },
      ],
    },
    {
      id: "123e4567-e89b-12d3-a456-426614174005",
      order_id: "c3d4e5f6-g7h8-9012-3456-7890abcdef12",
      orderCode: "MT99201",
      countdown: 1500, // in seconds
      transporter: {
        id: "tr003",
        name: "CV. Angkutan Jaya",
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
            district: "Bandung Kidul",
            city: "Bandung",
          },
        ],
        dropoffLocations: [
          {
            id: "dloc003",
            sequence: 1,
            latitude: -6.711,
            longitude: 108.557,
            district: "Harjamukti",
            city: "Cirebon",
          },
        ],
      },
      issues: [
        {
          vehicle: {
            id: "vh007",
            plate_number: "P 1122 GH",
            driver_name: "Eko Prasetyo",
            location: {
              latitude: -8.169,
              longitude: 113.7031,
              address: "Jl. Gajah Mada No. 10, Jember",
            },
            polylineEncode: "new_encoded_polyline_jember",
          },
          issue_type: "FLEET_NOT_READY",
          status: "NEW",
          description:
            "Kendaraan belum siap berangkat pada waktu yang ditentukan.",
          detected_at: "2025-08-27T13:30:00Z",
          processed_at: null,
          rejection_count: 0,
          contact_attempts: 0,
          last_contact_at: null,
          has_rejection_history: false,
        },
        {
          vehicle: {
            id: "vh008",
            plate_number: "AB 8877 CD",
            driver_name: "Siti Aminah",
            location: {
              latitude: -7.7925,
              longitude: 110.3657,
              address: "Jl. Malioboro No. 52-58, Yogyakarta",
            },
            polylineEncode: "yogya_route_polyline_string",
          },
          issue_type: "FLEET_NOT_MOVING",
          status: "IN_PROGRESS",
          description:
            "Kendaraan berhenti lebih dari 20 menit tanpa alasan yang jelas.",
          detected_at: "2025-08-27T13:45:00Z",
          processed_at: "2025-08-27T13:50:00Z",
          rejection_count: 0,
          contact_attempts: 1,
          last_contact_at: "2025-08-27T13:49:00Z",
          has_rejection_history: false,
        },
        {
          vehicle: {
            id: "vh009",
            plate_number: "H 9900 JK",
            driver_name: "Rahmat Hidayat",
            location: {
              latitude: -6.9922,
              longitude: 110.4239,
              address: "Kawasan Simpang Lima, Semarang",
            },
            polylineEncode: "semarang_polyline_data_xyz",
          },
          issue_type: "POTENTIAL_DRIVER_LATE",
          status: "RESOLVED",
          description:
            "Driver terjebak macet, namun sudah menemukan rute alternatif.",
          detected_at: "2025-08-27T13:00:00Z",
          processed_at: "2025-08-27T13:15:00Z",
          rejection_count: 1,
          contact_attempts: 2,
          last_contact_at: "2025-08-27T13:12:00Z",
          has_rejection_history: true,
        },
      ],
    },
    {
      id: "123e4567-e89b-12d3-a456-426614174006",
      order_id: "d4e5f6g7-h8i9-0123-4567-890abcdef123",
      orderCode: "MT11776",
      countdown: 5000, // in seconds
      transporter: {
        id: "tr004",
        name: "PT. Samudera Indonesia Tbk",
        logo: "https://api.muatrans.com/logos/tr004.png",
        phone: "061-11223344",
      },
      orderLocations: {
        pickupLocations: [
          {
            id: "ploc004",
            sequence: 1,
            latitude: 3.755,
            longitude: 98.653,
            district: "Belawan",
            city: "Medan",
          },
          {
            id: "ploc005",
            sequence: 2,
            latitude: 3.5952,
            longitude: 98.6722,
            district: "Medan Petisah",
            city: "Medan",
          },
        ],
        dropoffLocations: [
          {
            id: "dloc004",
            sequence: 1,
            latitude: 0.5071,
            longitude: 101.4478,
            district: "Tampan",
            city: "Pekanbaru",
          },
        ],
      },
      issues: [
        {
          vehicle: {
            id: "vh010",
            plate_number: "N 4567 ML",
            driver_name: "Dewi Sartika",
            location: {
              latitude: -7.9715,
              longitude: 112.6212,
              address: "Jl. Ijen No. 25, Malang",
            },
            polylineEncode: "malang_traffic_polyline_abc",
          },
          issue_type: "POTENTIAL_DRIVER_LATE",
          status: "NEW",
          description:
            "Perkiraan keterlambatan 10 menit akibat kepadatan lalu lintas.",
          detected_at: "2025-08-27T13:40:00Z",
          processed_at: null,
          rejection_count: 0,
          contact_attempts: 0,
          last_contact_at: null,
          has_rejection_history: false,
        },
        {
          vehicle: {
            id: "vh011",
            plate_number: "L 7890 SU",
            driver_name: "Hendro Purnomo",
            location: {
              latitude: -7.2285,
              longitude: 112.7348,
              address: "Area Pelabuhan Tanjung Perak, Surabaya",
            },
            polylineEncode: "surabaya_port_route_def",
          },
          issue_type: "FLEET_NOT_READY",
          status: "CLOSED",
          description:
            "Laporan awal kendaraan belum siap, namun driver telah konfirmasi siap berangkat.",
          detected_at: "2025-08-27T08:00:00Z",
          processed_at: "2025-08-27T08:10:00Z",
          rejection_count: 0,
          contact_attempts: 1,
          last_contact_at: "2025-08-27T08:05:00Z",
          has_rejection_history: false,
        },
        {
          vehicle: {
            id: "vh012",
            plate_number: "DK 1111 AB",
            driver_name: "I Made Wirawan",
            location: {
              latitude: -8.6705,
              longitude: 115.2126,
              address: "Jl. Teuku Umar No. 120, Denpasar",
            },
            polylineEncode: "denpasar_city_polyline_ghi",
          },
          issue_type: "FLEET_NOT_MOVING",
          status: "IN_PROGRESS",
          description:
            "Kendaraan berhenti di satu titik lebih dari 30 menit, sedang dihubungi.",
          detected_at: "2025-08-27T13:50:00Z",
          processed_at: "2025-08-27T13:52:00Z",
          rejection_count: 0,
          contact_attempts: 1,
          last_contact_at: "2025-08-27T13:52:00Z",
          has_rejection_history: false,
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
