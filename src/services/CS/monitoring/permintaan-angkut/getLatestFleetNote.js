// Mock data and fetcher for Get Latest Fleet Notes
import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const IS_MOCK = true;

const apiResultLatestFleetNote = {
  Message: {
    Code: 200,
    Text: "Successfully retrieved latest fleet notes",
  },
  Data: {
    latestNote: {
      id: "note_uuid",
      content:
        "Armada terdeteksi nonaktif terlalu banyak dalam waktu 24 jam terakhir, hubungi transporter untuk mengaktifkan armada yang tersedia agar dapat menerima permintaan.",
      status: "active",
      current: 10,
      total: 11,
      inactivityStatus: "TRANSPORTER_IDLE", // [ARMADA_INACTIVE, TRANSPORTER_IDLE, TRANSPORTER_INACTIVE]

      history: {
        reportedAt: "2025-01-15T10:00:00Z",
        notes:
          "Kondisi armada memang sedang maintenance, sehingga aplikasi driver juga tidak diaktifkan karena belum bisa bertugas juga",
        photos: [
          {
            url: "https://cdn.example.com/photos/maintenance_photo_1.jpg",
          },
          {
            url: "https://cdn.example.com/photos/maintenance_photo_2.jpg",
          },
        ],
      },
      relatedEntities: {
        transporterId: "transporter-uuid-2",
        transporterName: "PT Kaltim Jaya Makmur",
        affectedFleets: [
          {
            fleetId: "fleet-uuid-1",
            licensePlate: "B 1234 XYZ",
            lastActiveAt: "2025-01-12T10:00:00Z",
            inactiveDuration: 2880,
            inactivityReason: "Maintenance",
          },
          {
            fleetId: "fleet-uuid-2",
            licensePlate: "B 5678 ABC",
            lastActiveAt: "2025-01-10T09:00:00Z",
            inactiveDuration: 4320,
            inactivityReason: "Menunggu driver replacement",
          },
        ],
      },
    },
    // case armada tidak aktif
    details: [
      {
        licensePlate: "B 1234 XYZ",
        driverName: "Rizky Aditya Pratama",
        inactiveDate: "2025-01-12T10:00:00Z",
        inactiveDuration: 2880,
      },
      {
        licensePlate: "B 5678 ABC",
        driverName: "Muhammad Rizky Ramadhani",
        inactiveDate: "2025-01-10T09:00:00Z",
        inactiveDuration: 4380,
      },
      {
        licensePlate: "P 4321 JBR",
        driverName: "Budi Hartono",
        inactiveDate: "2025-08-15T14:30:00Z",
        inactiveDuration: 1500,
      },
      {
        licensePlate: "L 1122 SBY",
        driverName: "Siti Aminah",
        inactiveDate: "2025-08-18T08:00:00Z",
        inactiveDuration: 7200,
      },
      {
        licensePlate: "W 8877 SDA",
        driverName: "Agus Wijaya",
        inactiveDate: "2025-07-20T11:20:00Z",
        inactiveDuration: 360,
      },
      {
        licensePlate: "N 1995 MLG",
        driverName: "Dewi Lestari",
        inactiveDate: "2025-07-21T18:45:00Z",
        inactiveDuration: 9500,
      },
      {
        licensePlate: "DK 2024 DPS",
        driverName: "I Gede Made",
        inactiveDate: "2025-06-22T06:00:00Z",
        inactiveDuration: 500,
      },
      {
        licensePlate: "AE 4567 MDN",
        driverName: "Joko Susanto",
        inactiveDate: "2025-06-25T13:00:00Z",
        inactiveDuration: 12000,
      },
      {
        licensePlate: "AG 1234 KDR",
        driverName: "Irfan Maulana",
        inactiveDate: "2025-08-01T09:30:00Z",
        inactiveDuration: 250,
      },
      {
        licensePlate: "M 5555 PKS",
        driverName: "Andi Purnomo",
        inactiveDate: "2025-08-03T17:00:00Z",
        inactiveDuration: 1800,
      },
    ],
    // case transporter idle
    detailsIdle: [
      {
        orderCode: "MT25A001A",
        transporterReceive: "PT Kaltim Trans",
        orderBlastAt: "2025-05-01T12:45:00Z",
        orderTakenAt: "2025-05-01T11:45:00Z",
      },
      {
        orderCode: "MT25A002A",
        transporterReceive: "PT Siba Surya",
        orderBlastAt: "2025-05-01T08:30:00Z",
        orderTakenAt: "2025-05-01T08:30:00Z",
      },
      {
        orderCode: "MT25A003A",
        transporterReceive: "PT. Satria Antaran Prima",
        orderBlastAt: "2025-05-01T03:00:00Z",
        orderTakenAt: "2025-05-01T03:00:00Z",
      },
      {
        orderCode: "MT25A004A",
        transporterReceive: "PT Prima Trans Logistik",
        orderBlastAt: "2025-04-22T04:20:00Z",
        orderTakenAt: "2025-04-22T04:20:00Z",
      },
      {
        orderCode: "MT25A001A",
        transporterReceive: "CV Agung Sejahtera",
        orderBlastAt: "2025-04-18T15:50:00Z",
        orderTakenAt: "2025-04-18T15:50:00Z",
      },
      {
        orderCode: "MT25A010A",
        transporterReceive: "PT Daffa Trans",
        orderBlastAt: "2025-04-15T11:00:00Z",
        orderTakenAt: "2025-04-15T11:00:00Z",
      },
      {
        orderCode: "MT25A005A",
        transporterReceive: "PT Martin Abadi Makmur",
        orderBlastAt: "2025-04-09T23:45:00Z",
        orderTakenAt: "2025-04-09T23:45:00Z",
      },
      {
        orderCode: "MT25A001A",
        transporterReceive: "PT Marindo Jaya",
        orderBlastAt: "2025-04-07T07:15:00Z",
        orderTakenAt: "2025-04-07T07:15:00Z",
      },
      {
        orderCode: "MT25A020A",
        transporterReceive: "PT Masaji Prayasa Cargo",
        orderBlastAt: "2025-04-03T03:30:00Z",
        orderTakenAt: "2025-04-03T03:30:00Z",
      },
      {
        orderCode: "MT25A020A",
        transporterReceive: "PT Wahana Prestasi Logistik",
        orderBlastAt: "2025-04-01T01:00:00Z",
        orderTakenAt: "2025-04-01T01:00:00Z",
      },
    ],
    // case transporter tidak aktif
    detailInactive: {
      lastActiveAt: "2025-01-10T10:00:00Z",
      inactiveDuration: 7200,
    },
    pagination: {
      currentPage: 1,
      totalPages: 20,
      totalItems: 97,
      hasNext: true,
      hasPrevious: false,
    },
  },
  Type: "FLEET_NOTES_LATEST",
};

export const fetcherLatestFleetNote = async (id, params = {}) => {
  if (IS_MOCK) {
    // Deep clone to avoid mutation
    return JSON.parse(JSON.stringify(apiResultLatestFleetNote));
  }

  // Real API
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append("page", params.page);
  if (params.limit) queryParams.append("limit", params.limit);

  const queryString = queryParams.toString();
  const endpoint = queryString
    ? `/v1/cs/transport-request/transporter-inactive/${id}?${queryString}`
    : `/v1/cs/transport-request/transporter-inactive/${id}`;

  const result = await fetcherMuatrans.get(endpoint);
  return result?.data?.Data || {};
};

export const useGetLatestFleetNote = (id, params = {}) => {
  const cacheKey = `latest-fleet-note-${id}-${JSON.stringify(params)}`;
  return useSWR(cacheKey, () => fetcherLatestFleetNote(id, params));
};
