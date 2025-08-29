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
        id: "driver-uuid-1",
        name: "John Smith",
        license_plate: "B 1234 XYZ",
        transporter_name: "PT Transporter ABC",
        overload_locations: [
          {
            location_type: "LOKASI MUAT 1",
            overload_weight: 500,
            weight_unit: "kg",
            cost: 75000,
            loading_date: "2025-01-15T10:00:00Z",
          },
        ],
        total_cost: 75000,
      },
      {
        id: "driver-uuid-2",
        name: "Sarah Johnson",
        license_plate: "L 5678 DEF",
        transporter_name: "CV Moga Jaya Abadi",
        overload_locations: [
          {
            location_type: "LOKASI MUAT 1",
            overload_weight: 300,
            weight_unit: "kg",
            cost: 45000,
            loading_date: "2025-01-15T11:00:00Z",
          },
          {
            location_type: "LOKASI MUAT 2",
            overload_weight: 400,
            weight_unit: "kg",
            cost: 60000,
            loading_date: "2025-01-15T12:00:00Z",
          },
        ],
        total_cost: 105000,
      },
    ],
    grand_total: 180000,
  },
};

// Fetcher function
export const getOverloadDetails = async (cacheKey) => {
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
    `/v1/cs/additional-cost-reports/${reportId}/overload-details`
  );

  // Jika API response kosong atau tidak ada drivers, fallback ke mock data
  if (!result?.data?.drivers || result.data.drivers.length === 0) {
    return mockAPIResult;
  }

  return result?.data;
};

// SWR hook for GET request
export const useGetOverloadDetails = (reportId) =>
  useSWR(reportId ? `overload-details/${reportId}` : null, getOverloadDetails);
