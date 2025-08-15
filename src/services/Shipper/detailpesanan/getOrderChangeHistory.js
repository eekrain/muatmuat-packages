import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true; // mock detailpesanan

// GET /base_url/v1/orders/{orderId}/change-history
const apiResultOrderChangeHistory = {
  data: {
    Message: {
      Code: 200,
      Text: "Orders count by status retrieved successfully",
    },
    Data: {
      pickupLocations: [
        {
          locationId: "string",
          locationType: "PICKUP",
          sequence: 1,
          fullAddress: "Jl. Sudirman No. 123, Jakarta Pusat",
          detailAddress: "Gedung ABC Lantai 5",
          latitude: -6.2088,
          longitude: 106.8456,
          district: "Tanah Abang",
          city: "Jakarta Pusat",
          province: "DKI Jakarta",
          postalCode: "10270",
          picName: "Budi Santoso",
          picPhoneNumber: "081234567890",
        },
      ],
      dropoffLocations: [
        {
          locationId: "string",
          locationType: "DROPOFF",
          sequence: 1,
          fullAddress: "Jl. Gatot Subroto No. 456, Jakarta Selatan",
          detailAddress: "Lobby Utama",
          latitude: -6.25,
          longitude: 106.83,
          district: "Setiabudi",
          city: "Jakarta Pusat",
          province: "DKI Jakarta",
          postalCode: "12930",
          picName: "Sari Dewi",
          picPhoneNumber: "081234567891",
        },
      ],
      schedule: {
        loadTimeStart: "2024-01-15T08:00:00Z",
        loadTimeEnd: "2024-01-15T15:00:00Z",
      },
    },
    Type: "ORDERS_CHANGE_HISTORY",
  },
};

export const getOrderChangeHistory = async (cacheKey) => {
  const orderId = cacheKey.split("/")[1];

  let result;
  if (useMockData) {
    result = apiResultOrderChangeHistory;
  } else {
    result = await fetcherMuatrans.get(`v1/orders/${orderId}/change-history`);
  }

  return result?.data?.Data || null;
};

export const useGetOrderChangeHistory = (orderId) =>
  useSWR(`order-change-history/${orderId}`, getOrderChangeHistory);
