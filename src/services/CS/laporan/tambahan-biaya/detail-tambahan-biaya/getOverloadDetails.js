import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    success: true,
    Data: {
      drivers: [
        {
          id: "driver-uuid",
          name: "Driver Name",
          license_plate: "B 1234 XYZ",
          transporter_name: "PT Transporter ABC",
          overload_locations: [
            {
              location_type: "Lokasi Muat 1",
              overload_weight: 1000,
              weight_unit: "kg",
              cost: 50000,
              loading_date: "2025-01-15T10:00:00Z",
            },
            {
              location_type: "Lokasi Muat 2",
              overload_weight: 1000,
              weight_unit: "kg",
              cost: 50000,
              loading_date: "2025-01-15T10:00:00Z",
            },
          ],
          total_cost: 100000,
        },
        {
          id: "driver-uuid",
          name: "Noel Alexandre",
          license_plate: "L 1234 CAM",
          transporter_name: " CV Moga Jaya Abadi",
          overload_locations: [
            {
              location_type: "Lokasi Muat 1",
              overload_weight: 1000,
              weight_unit: "kg",
              cost: 50000,
              loading_date: "2025-01-15T10:00:00Z",
            },
            {
              location_type: "Lokasi Muat 2",
              overload_weight: 1000,
              weight_unit: "kg",
              cost: 50000,
              loading_date: "2025-01-15T10:00:00Z",
            },
          ],
          total_cost: 100000,
        },
      ],
      grand_total: 200000,
    },
  },
};

// Fetcher function for overload details
export const getOverloadDetails = async (url) => {
  let result;
  if (useMockData) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    result = mockAPIResult;
  } else {
    result = await fetcherMuatrans.get(url);
  }
  return {
    drivers: result?.data?.Data.drivers || [],
    grandTotal: result?.data?.Data.grand_total || 0,
  };
};

// SWR hook for overload details
export const useGetOverloadDetails = (id) =>
  useSWR(
    `/v1/cs/additional-cost-reports/${id}/overload-details`,
    getOverloadDetails
  );
