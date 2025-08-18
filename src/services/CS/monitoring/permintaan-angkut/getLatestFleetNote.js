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
        "Follow-up dengan transporter ABC terkait 5 armada nonaktif. Konfirmasi bahwa 3 armada sedang maintenance rutin, 2 armada menunggu driver replacement. Estimasi kembali aktif dalam 3-5 hari.",
      status: "active",
      attachments: [
        {
          id: "attachment_uuid",
          name: "maintenance_schedule.pdf",
          url: "https://cdn.example.com/attachments/maintenance_schedule.pdf",
          type: "application/pdf",
          size: 1024000,
          uploadedAt: "2025-01-14T16:25:00Z",
        },
      ],
      relatedEntities: {
        transporterId: "transporter-uuid-2",
        transporterName: "PT Transporter ABC",
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
        inactiveDuration: 4320,
      },
    ],
    // case transporter idle
    detailsIdle: [
      {
        orderCode: "ORDER123",
        transporterReceive: "PT Transporter ABC",
        orderBlastAt: "2025-01-12T08:00:00Z",
        orderTakenAt: "2025-01-12T08:30:00Z",
      },
      {
        orderCode: "ORDER124",
        transporterReceive: "PT Transporter ABC",
        orderBlastAt: "2025-01-13T09:00:00Z",
        orderTakenAt: "2025-01-13T09:45:00Z",
      },
    ],
    // case transporter tidak aktif
    detailInactive: {
      lastActiveAt: "2025-01-10T10:00:00Z",
      inactiveDuration: 7200,
    },
    pagination: {
      currentPage: 1,
      totalPages: 10,
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
