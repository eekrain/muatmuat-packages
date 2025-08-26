import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

// Helper function to generate a random date within a range
const getRandomDate = (start, end) => {
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return `${date.toISOString().slice(0, 19)}Z`;
};

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    success: true,
    Data: {
      contact_history: [
        {
          id: `log-uuid-1`,
          cs_name: `CS Prima Arifandi`,
          contacted_at: getRandomDate(
            new Date(2025, 0, 21, 9, 0, 0),
            new Date()
          ),
          contact_sequence: 18,
          contact_method: "email",
        },
        {
          id: `log-uuid-2`,
          cs_name: `CS Prima Arifandi`,
          contacted_at: getRandomDate(
            new Date(2025, 0, 21, 9, 0, 0),
            new Date()
          ),
          contact_sequence: 13,
          contact_method: "phone",
        },
      ],
      //   contact_history: Array.from({ length: 10 }).map((_, i) => ({
      //     id: `log-uuid-${i + 1}`,
      //     cs_name: `CS John Doe ${i + 1}`,
      //     contacted_at: getRandomDate(new Date(2025, 0, 21, 9, 0, 0), new Date()),
      //     contact_sequence: 20 - i,
      //     contact_method: i % 2 === 0 ? "phone" : "email",
      //   })),
      pagination: {
        current_page: 1,
        total_pages: 2,
        total_items: 15,
        items_per_page: 10,
      },
    },
  },
};

// Fetcher function for additional cost report detail
export const getContactHistory = async (url) => {
  let result;
  if (useMockData) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    result = mockAPIResult;
  } else {
    result = await fetcherMuatrans.get(url);
  }
  return {
    contactHistory: result?.data?.Data?.contact_history || [],
    pagination: result?.data?.Data.pagination || {},
  };
};

// SWR hook for additional cost report detail
export const useGetContactHistory = (id) =>
  useSWR(
    `/v1/cs/additional-cost-reports/${id}/contact-history`,
    getContactHistory
  );
