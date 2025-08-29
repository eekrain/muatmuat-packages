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

// Helper function to add hours to a date
const addHours = (date, hours) => {
  const newDate = new Date(date);
  newDate.setHours(newDate.getHours() + hours);
  return `${newDate.toISOString().slice(0, 19)}Z`;
};

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Data berhasil diambil",
    },
    Data: {
      orders: Array.from({ length: 10 }).map((_, i) => {
        const orderCode = `MT20240100${String(i + 1).padStart(2, "0")}`;
        const cancelledAt = getRandomDate(
          new Date(2024, 0, 15, 10, 30, 0),
          new Date()
        );
        const orderType = i % 2 === 0 ? "INSTANT" : "SCHEDULED";
        const loadTimeStart = getRandomDate(
          new Date(2024, 0, 15, 8, 0, 0),
          new Date(2024, 0, 15, 16, 0, 0)
        );
        const loadTimeEnd = addHours(
          new Date(loadTimeStart),
          Math.floor(Math.random() * 8) + 1
        ); // 1 to 8 hours later
        const truckTypeNames = [
          "Colt Diesel Engkel",
          "Tractor Head 4x2 dan Medium Semi Trailer 20ft ",
          "Wingbox",
        ];
        const truckCarriers = [
          "Box",
          "Skeletal Container Jumbo 45 ft  (3 As)",
          "Lossbak",
        ];
        const truckTypeName =
          truckTypeNames[Math.floor(Math.random() * truckTypeNames.length)];
        const truckCarrier =
          truckCarriers[Math.floor(Math.random() * truckCarriers.length)];
        const unit = Math.floor(Math.random() * 20) + 1; // 1 to 20
        const cargo = `${Math.floor(Math.random() * 5000) + 100} kg`; // 100 to 5100 kg
        const requestCount = Math.floor(Math.random() * 5) + 1; // 1 to 5

        return {
          id: `uuid-${i + 1}`,
          orderCode,
          cancelledAt,
          orderType,
          loadTimeStart,
          loadTimeEnd,
          pickupLocations: [
            {
              fullAddress: "Jl. Sudirman No. 1",
              district: "Menteng",
              city: "Jakarta Pusat",
            },
          ],
          dropoffLocations: [
            {
              fullAddress: "Jl. Thamrin No. 2",
              district: "Tanah Abang",
              city: "Jakarta Pusat",
            },
          ],
          truckTypeName,
          truckHead: "Cdd",
          truckCarrier,
          unit,
          cargo,
          requestCount,
          hasMultipleLocations: true,
          shipper: {
            companyName: "PT Maju Jaya",
            fullName: "John Doe",
          },
        };
      }),
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 10,
        itemsPerPage: 10,
        hasNextPage: true,
        hasPreviousPage: false,
      },
      totalCount: 95,
      filters: {
        isSearchActive: false,
        isDateFilterActive: false,
        appliedKeyword: null,
        appliedDateRange: null,
        appliedSort: "cancelledAt",
        appliedOrder: "desc",
      },
    },
    Type: "CANCELED_ORDERS_LIST",
  },
};

// Fetcher function for cancelled orders
export const getCancelledOrders = async (url) => {
  let result;
  if (useMockData) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    result = mockAPIResult;
  } else {
    result = await fetcherMuatrans.get(url);
  }
  return {
    orders: result?.data?.Data?.orders || [],
    pagination: result?.data?.Data?.pagination || {},
    totalCount: result?.data?.Data?.totalCount || 0,
    filters: result?.data?.Data?.filters || {},
  };
};

// SWR hook for cancelled orders
export const useGetCancelledOrders = (queryString) =>
  useSWR(`v1/cs/canceled-orders?${queryString}`, getCancelledOrders);
