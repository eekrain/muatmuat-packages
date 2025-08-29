import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false;

// Mock API result for development/testing
export const mockAPIResult = {
  success: true,
  data: {
    isFirstTimer: false,
    reports: [
      {
        id: "0fd6cd9d-f170-4e27-ae03-28b612beaaa3",
        order_id: "0fd6cd9d-f170-4e27-ae03-28b612beaaa3",
        order_code: "MT25AA673",
        order_status: "WAITING_REPAYMENT_1",
        orderType: "INSTANT",
        shipper: {
          id: 3422,
          name: "aaa satu",
          type: "user02",
          phone: "123123123001",
        },
        transporter: [
          {
            id: "0681f5a7-daf0-4581-b593-9d017c2cfd85",
            name: "SARI AGUNG",
            fleet_count: 1,
            phone: "081331994242",
            location: "N/A",
          },
        ],
        additional_cost_amount: 19300,
        bill_date: "2025-08-22T10:17:38.873Z",
        days_unpaid: 5,
        pickup_locations: [
          "Jalan Dharmahusada, Pacar Kembang, Surabaya, Jawa Timur, Indonesia",
        ],
        delivery_locations: [
          "Bulak Kali Tinjang I, Bulak, Surabaya, Jawa Timur, Indonesia",
        ],
        has_multiple_locations: false,
        last_contacted_by: null,
        last_contacted_at: null,
        total_contacts: 0,
      },
    ],
    statusCount: {
      active: 1,
      completed: 22,
    },
    pagination: {
      current_page: 1,
      total_pages: 1,
      total_items: 1,
      items_per_page: 10,
      has_next: false,
      has_prev: false,
    },
  },
  message: "Active additional cost reports retrieved successfully",
};
// Fetcher function for additional cost reports
export const getAdditionalCostReports = async (url) => {
  let result;
  if (useMockData) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    result = mockAPIResult;
  } else {
    result = await fetcherMuatrans.get(url);
  }
  return {
    reports: result?.data?.data.reports || [],
    pagination: result?.data?.data.pagination || {},
    statusCount: result?.data?.data.statusCount || {},
  };
};

// SWR hook for additional cost reports
export const useGetAdditionalCostReports = (queryString, activeTab) =>
  useSWR(
    `v1/cs/additional-cost-reports/${activeTab}?${queryString}`,
    getAdditionalCostReports
  );
