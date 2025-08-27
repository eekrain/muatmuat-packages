import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

// Mock API result for development/testing
export const mockAPIResult = {
  success: true,
  data: {
    drivers: [
      {
        id: "driver-uuid",
        name: "Noel Alexandre",
        license_plate: "B 1234 XYZ",
        transporter_name: "PT Transporter ABC",
        waiting_locations: [
          {
            location_type: "Lokasi Muat 1",
            duration: "2 Jam 30 Menit",
            start_time: "2025-01-15T08:00:00Z",
            end_time: "2025-01-15T10:30:00Z",
            cost: 100000,
          },
        ],
        total_cost: 100000,
      },
    ],
    grand_total: 100000,
  },
};

// Fetcher function for waiting time details
export const getWaitingTimeDetails = async (id) => {
  let result;
  if (useMockData) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    result = mockAPIResult;
  } else {
    result = await fetcherMuatrans.get(
      `/v1/cs/additional-cost-reports/${id}/waiting-time-details`
    );
  }
  return {
    drivers: result?.data?.drivers || [],
    grandTotal: result?.data?.grand_total || 0,
  };
};

// SWR hook for waiting time details
export const useGetWaitingTimeDetails = (id) =>
  useSWR(
    id ? `/v1/cs/additional-cost-reports/${id}/waiting-time-details` : null,
    () => getWaitingTimeDetails(id)
  );
