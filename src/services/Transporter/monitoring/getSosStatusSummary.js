import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const isMockSosStatusSummary = true;

const apiResultSosStatusSummary = {
  Message: {
    Code: 200,
    Text: "SOS status summary retrieved successfully",
  },
  Data: {
    active: 10, // COUNT FROM [dbt_mt_sos.status] = 'NEW' OR 'ACKNOWLEDGED'
    history: 100, // COUNT FROM [dbt_mt_sos.status] = 'COMPLETED'
  },
  Type: "SOS_STATUS_SUMMARY",
};

const apiErrorSosStatusSummary = {
  Message: {
    Code: 400,
    Text: "Failed to retrieve SOS status",
  },
  Data: {
    errors: [
      {
        field: "general",
        message: "Sistem tidak dapat mengambil status SOS",
      },
    ],
  },
  Type: "SOS_STATUS_SUMMARY_ERROR",
};

export const useGetSosStatusSummary = () => {
  const cacheKey = "monitoring-sos-status-summary";

  return useSWR(cacheKey, fetcherSosStatusSummary, {
    // Refresh every 30 seconds for real-time updates
    refreshInterval: 30000,
    // Don't revalidate on focus to prevent flickering
    revalidateOnFocus: false,
  });
};

export const fetcherSosStatusSummary = async () => {
  if (isMockSosStatusSummary) {
    // Simulate random active SOS counts between 0-15 for demo purposes
    const mockData = {
      ...apiResultSosStatusSummary,
    };

    return mockData;
  }

  try {
    const result = await fetcherMuatrans.get(
      "/v1/transporter/monitoring/sos/status-summary"
    );
    return result?.data || {};
  } catch (error) {
    throw error.response?.data || apiErrorSosStatusSummary;
  }
};
