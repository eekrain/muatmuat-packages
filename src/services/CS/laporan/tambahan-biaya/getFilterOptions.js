import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false;

const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    success: true,
    Data: {
      shippers: [
        {
          id: generateUUID(),
          name: "Prima Arifandi",
          type: "user00",
        },
        {
          id: generateUUID(),
          name: "PT Shipper Example 1",
          type: "user01",
        },
        {
          id: generateUUID(),
          name: "PT Shipper Example 2",
          type: "user02",
        },
        {
          id: generateUUID(),
          name: "PT Shipper Example 3",
          type: "user03",
        },
        {
          id: generateUUID(),
          name: "PT Shipper Example 4",
          type: "user04",
        },
        {
          id: generateUUID(),
          name: "PT Shipper Example 5",
          type: "user05",
        },
        {
          id: generateUUID(),
          name: "PT Shipper Example 6",
          type: "user06",
        },
        {
          id: generateUUID(),
          name: "PT Shipper Example 7",
          type: "user07",
        },
        {
          id: generateUUID(),
          name: "PT Shipper Example 8",
          type: "user08",
        },
        {
          id: generateUUID(),
          name: "PT Shipper Example 9",
          type: "user09",
        },
        {
          id: generateUUID(),
          name: "PT Shipper Example 10",
          type: "user10",
        },
      ],
      paymentMethods: [],
    },
  },
};

// Fetcher function for filter options
export const getFilterOptions = async (url) => {
  let result;
  if (useMockData) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    result = mockAPIResult;
  } else {
    result = await fetcherMuatrans.get(url);
  }
  return {
    shippers: result?.data?.data.shippers || [],
    paymentMethods: result?.data?.data.paymentMethods || [],
  };
};

// SWR hook for filter options
export const useGetFilterOptions = (queryString) =>
  useSWR(
    `v1/cs/additional-cost-reports/filter-options/shippers?${queryString}`,
    getFilterOptions
  );
