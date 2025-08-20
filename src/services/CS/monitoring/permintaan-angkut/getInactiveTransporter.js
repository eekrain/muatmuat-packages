// Mock data and fetcher for Get Inactive Transporter Fleet Alert Data
import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const IS_MOCK = true;

const apiResultInactiveTransporter = {
  Message: {
    Code: 200,
    Text: "Successfully retrieved inactive fleet alert data",
  },
  Data: {
    alertSummary: {
      hasAlert: true,
      current: 8,
      total: 12,
    },
    transporters: [
      {
        id: "transporter-uuid-1",
        transporterId: "transporter-uuid-1",
        transporterName:
          "PT Batavia Prosperindo Angkut Teknologi Indonesi Trans Tbk",
        lastActivity: "2025-01-15T14:30:00Z",
        inactivityStatus: "ARMADA_INACTIVE",
      },
      {
        id: "transporter-uuid-2",
        transporterId: "transporter-uuid-2",
        transporterName: "PT Transporter ABC",
        current: 5,
        total: 7,
        lastActivity: "2025-01-12T15:30:00Z",
        inactivityStatus: "TRANSPORTER_IDLE",
      },
      {
        id: "transporter-uuid-3",
        transporterId: "transporter-uuid-3",
        transporterName: "PT Transporter XYZ",
        current: 0,
        total: 0,
        lastActivity: "2025-01-10T10:00:00Z",
        inactivityStatus: "TRANSPORTER_INACTIVE",
      },
      {
        id: "transporter-uuid-4",
        transporterId: "transporter-uuid-2",
        transporterName: "PT Transporter ABC",
        current: 5,
        total: 7,
        lastActivity: "2025-01-12T15:30:00Z",
        inactivityStatus: "TRANSPORTER_IDLE",
      },
      {
        id: "transporter-uuid-5",
        transporterId: "transporter-uuid-3",
        transporterName: "PT Transporter XYZ",
        current: 0,
        total: 0,
        lastActivity: "2025-01-10T10:00:00Z",
        inactivityStatus: "TRANSPORTER_INACTIVE",
      },
    ],
  },
  Type: "INACTIVE_FLEET_ALERT",
};

export const fetcherInactiveTransporter = async (params = {}) => {
  if (IS_MOCK) {
    // Deep clone to avoid mutation
    const result = JSON.parse(JSON.stringify(apiResultInactiveTransporter));
    let filteredTransporters = [...result.Data.transporters];

    // Example filter by transporterName
    if (params.transporterName) {
      filteredTransporters = filteredTransporters.filter(
        (t) => t.transporterName === params.transporterName
      );
    }
    // Example filter by inactivityStatus
    if (params.inactivityStatus) {
      filteredTransporters = filteredTransporters.filter(
        (t) => t.inactivityStatus === params.inactivityStatus
      );
    }
    // Example search by transporterName
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredTransporters = filteredTransporters.filter((t) =>
        t.transporterName.toLowerCase().includes(searchLower)
      );
    }

    return {
      ...result.Data,
      transporters: filteredTransporters,
    };
  }

  // Real API
  const queryParams = new URLSearchParams();
  if (params.transporterName)
    queryParams.append("transporterName", params.transporterName);
  if (params.inactivityStatus)
    queryParams.append("inactivityStatus", params.inactivityStatus);
  if (params.search) queryParams.append("search", params.search);
  if (params.page) queryParams.append("page", params.page);
  if (params.limit) queryParams.append("limit", params.limit);

  const queryString = queryParams.toString();
  const endpoint = queryString
    ? `/v1/cs/transport-request/transporter-inactive?${queryString}`
    : `/v1/cs/transport-request/transporter-inactive`;

  const result = await fetcherMuatrans.get(endpoint);
  return result?.data?.Data || {};
};

export const useGetInactiveTransporter = (params = {}) => {
  const cacheKey = `inactive-transporter-${JSON.stringify(params)}`;
  return useSWR(cacheKey, () => fetcherInactiveTransporter(params));
};
