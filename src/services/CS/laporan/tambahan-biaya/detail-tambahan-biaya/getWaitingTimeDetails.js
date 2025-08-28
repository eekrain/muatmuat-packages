import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

import { isValidUUID } from "@/utils/testUUIDs";

// Flag untuk switch antara mock data dan real API
const useMockData = true;

// Mock API result sesuai dengan API contract
export const mockAPIResult = {
  success: true,
  data: {
    drivers: [
      {
        id: "driver-uuid",
        name: "Lembur Terus",
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
          {
            location_type: "Lokasi Muat 2",
            duration: "2 Jam 30 Menit",
            start_time: "2025-01-15T13:00:00Z",
            end_time: "2025-01-15T15:30:00Z",
            cost: 100000,
          },
          {
            location_type: "Lokasi Bongkar 1",
            duration: "2 Jam 30 Menit",
            start_time: "2025-01-15T17:00:00Z",
            end_time: "2025-01-15T19:30:00Z",
            cost: 100000,
          },
          {
            location_type: "Lokasi Bongkar 2",
            duration: "2 Jam 30 Menit",
            start_time: "2025-01-15T21:00:00Z",
            end_time: "2025-01-15T23:30:00Z",
            cost: 100000,
          },
        ],
        total_cost: 400000,
      },
      {
        id: "driver-uuid",
        name: "Lembur Santoso",
        license_plate: "B 1234 XYZ",
        transporter_name: "PT Transporter ABC",
        waiting_locations: [
          {
            location_type: "Lokasi Muat 1",
            duration: "2 Jam 30 Menit",
            start_time: "2025-08-19T10:00:00Z",
            end_time: "2025-08-19T12:30:00Z",
            cost: 150000,
          },
          {
            location_type: "Lokasi Muat 2",
            duration: "1 Jam 45 Menit",
            start_time: "2025-08-19T13:00:00Z",
            end_time: "2025-08-19T14:45:00Z",
            cost: 100000,
          },
          {
            location_type: "Lokasi Muat 2",
            duration: "2 Jam 30 Menit",
            start_time: "2025-01-15T13:00:00Z",
            end_time: "2025-01-15T15:30:00Z",
            cost: 100000,
          },
          {
            location_type: "Lokasi Bongkar 1",
            duration: "2 Jam 30 Menit",
            start_time: "2025-01-15T17:00:00Z",
            end_time: "2025-01-15T19:30:00Z",
            cost: 100000,
          },
          {
            location_type: "Lokasi Bongkar 2",
            duration: "2 Jam 30 Menit",
            start_time: "2025-01-15T21:00:00Z",
            end_time: "2025-01-15T23:30:00Z",
            cost: 100000,
          },
        ],
        total_cost: 400000,
      },
    ],
    grand_total: 800000,
  },
};

// Fetcher function
export const getWaitingTimeDetails = async (cacheKey) => {
  const reportId = cacheKey.split("/")[1];

  // Switch antara mock data dan real API berdasarkan flag
  if (useMockData) {
    // Simulasi delay untuk mock data
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockAPIResult;
  }

  // Validasi UUID sebelum melakukan API call
  if (!isValidUUID(reportId)) {
    console.error("Invalid UUID format:", reportId);
    // Return mock data jika UUID tidak valid
    return mockAPIResult;
  }

  // Real API call
  const result = await fetcherMuatrans.get(
    `/v1/cs/additional-cost-reports/${reportId}/waiting-time-details`
  );

  // Jika API response kosong atau tidak ada drivers, fallback ke mock data
  if (!result?.data?.drivers || result.data.drivers.length === 0) {
    return mockAPIResult;
  }

  return result?.data;
};

// SWR hook for GET request
export const useGetWaitingTimeDetails = (reportId) =>
  useSWR(
    reportId ? `waiting-time-details/${reportId}` : null,
    getWaitingTimeDetails
  );
