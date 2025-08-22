import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const isMockOrderChangeDetail = true;

const apiResultOrderChangeDetail = {
  Message: {
    Code: 200,
    Text: "Order change details retrieved successfully",
  },
  Data: {
    orderId: "dcdaf886-56d6-4d84-89d6-a21ec18d0bc1", // [dbt_mt_order.id]
    orderCode: "MT001234", // [dbt_mt_order.orderCode]
    changeType: "LOCATION_AND_TIME", // Derived from change request
    requestedAt: "2024-04-01T07:30:00", // [dbt_mt_order_change_history.createdAt]
    originalData: {
      loadTimeStart: "2024-04-01T08:00:00", // [dbt_mt_order.loadTimeStart]
      loadTimeEnd: "2024-04-01T10:00:00", // [dbt_mt_order.loadTimeEnd]
      estimatedDistance: 25.5, // [dbt_mt_order.estimatedDistance]
      locations: [
        {
          locationType: "PICKUP", // [dbt_mt_location.locationType]
          fullAddress: "Jl. Sudirman No. 1, Karet Tengsin, Jakarta Pusat", // [dbt_mt_location.fullAddress]
          latitude: -6.1944, // [dbt_mt_location.latitude]
          longitude: 106.8229, // [dbt_mt_location.longitude]
        },
        {
          locationType: "PICKUP",
          fullAddress: "Jl. Gatot Subroto No. 38, Kuningan, Jakarta Selatan",
          latitude: -6.2297,
          longitude: 106.8265,
        },
        {
          locationType: "PICKUP",
          fullAddress: "Jl. MT Haryono No. 10, Cawang, Jakarta Timur",
          latitude: -6.2515,
          longitude: 106.8542,
        },
        {
          locationType: "PICKUP",
          fullAddress: "Jl. TB Simatupang No. 5, Cilandak, Jakarta Selatan",
          latitude: -6.2935,
          longitude: 106.7987,
        },
        {
          locationType: "PICKUP",
          fullAddress: "Jl. Raya Bogor KM 19, Kramat Jati, Jakarta Timur",
          latitude: -6.2689,
          longitude: 106.8657,
        },
        {
          locationType: "DROPOFF",
          fullAddress: "Jl. Daan Mogot No. 100, Cengkareng, Jakarta Barat",
          latitude: -6.1412,
          longitude: 106.7378,
        },
        {
          locationType: "DROPOFF",
          fullAddress: "Jl. Pluit Raya No. 25, Penjaringan, Jakarta Utara",
          latitude: -6.1176,
          longitude: 106.7896,
        },
        {
          locationType: "DROPOFF",
          fullAddress: "Jl. Kelapa Gading Boulevard, Jakarta Utara",
          latitude: -6.1571,
          longitude: 106.9106,
        },
      ],
    },
    requestedChanges: {
      loadTimeStart: "2024-04-01T09:00:00", // New requested time
      loadTimeEnd: "2024-04-01T11:00:00", // New requested time
      estimatedDistance: 32.8, // Calculated new distance
      locations: [
        {
          locationType: "PICKUP",
          fullAddress: "Jl. Sudirman No. 1, Karet Tengsin, Jakarta Pusat",
          latitude: -6.1944,
          longitude: 106.8229,
        },
        {
          locationType: "PICKUP",
          fullAddress: "Jl. Gatot Subroto No. 38, Kuningan, Jakarta Selatan",
          latitude: -6.2297,
          longitude: 106.8265,
        },
        {
          locationType: "PICKUP",
          fullAddress: "Jl. MT Haryono No. 10, Cawang, Jakarta Timur",
          latitude: -6.2515,
          longitude: 106.8542,
        },
        {
          locationType: "PICKUP",
          fullAddress: "Jl. Kemang Raya No. 15, Kemang, Jakarta Selatan", // Changed location
          latitude: -6.2622,
          longitude: 106.8133,
        },
        {
          locationType: "PICKUP",
          fullAddress: "Jl. Raya Bogor KM 19, Kramat Jati, Jakarta Timur",
          latitude: -6.2689,
          longitude: 106.8657,
        },
        {
          locationType: "DROPOFF",
          fullAddress: "Jl. Raya Bogor KM 19, Kramat Jati, Jakarta Timur",
          latitude: -6.1412,
          longitude: 106.7378,
        },
        {
          locationType: "DROPOFF",
          fullAddress: "Jl. Kelapa Gading Boulevard, Jakarta Utara",
          latitude: -6.1176,
          longitude: 106.7896,
        },
        {
          locationType: "DROPOFF",
          fullAddress: "Jl. Kelapa Gading Boulevard, Jakarta Utara",
          latitude: -6.1571,
          longitude: 106.9106,
        },
      ],
    },
    incomeAdjustment: {
      hasAdjustment: true,
      originalAmount: 1500000.0, // [dbt_mt_order.totalPrice]
      adjustedAmount: 1650000.0,
      difference: 150000.0,
      reason: "Increased distance and time adjustment",
    },
    distanceComparison: {
      originalDistance: 25.5,
      newDistance: 32.8,
      difference: 7.3,
    },
  },
  Type: "ORDER_CHANGE_DETAILS",
};

/**
 * Fetcher function for order change details
 * @param {string} cacheKey - The cache key containing the order ID
 * @returns {Promise<Object>} The order change details data
 */
export const fetcherOrderChangeDetail = async (cacheKey) => {
  // Extract orderId from cache key
  const orderId = cacheKey.split("/").pop();
  const url = `/v1/orders/${orderId}/change-details`;

  if (isMockOrderChangeDetail) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return apiResultOrderChangeDetail.Data;
  }

  const result = await fetcherMuatrans.get(url);
  return result?.data?.Data || {};
};

/**
 * Hook to get order change details
 * @param {string} orderId - The ID of the order to get change details for
 * @param {Object} options - SWR options
 * @returns {Object} SWR response with order change details
 */
export const useGetOrderChangeDetail = (orderId, options = {}) => {
  const cacheKey = orderId ? `order-change-detail/${orderId}` : null;

  return useSWR(cacheKey, fetcherOrderChangeDetail, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    ...options,
  });
};

/**
 * Helper function to format change type for display
 * @param {string} changeType - The change type from API
 * @returns {string} Formatted change type label
 */
export const getChangeTypeLabel = (changeType) => {
  const changeTypeMap = {
    LOCATION_AND_TIME: "Perubahan Lokasi & Waktu",
    TIME_ONLY: "Perubahan Waktu",
    LOCATION_ONLY: "Perubahan Lokasi",
    FLEET_COUNT: "Perubahan Jumlah Armada",
    CARGO_DETAILS: "Perubahan Detail Muatan",
    COMBINED: "Perubahan Kombinasi",
  };
  return changeTypeMap[changeType] || changeType;
};

/**
 * Helper function to format currency
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Helper function to format distance
 * @param {number} distance - The distance in km
 * @returns {string} Formatted distance string
 */
export const formatDistance = (distance) => {
  return `${distance.toFixed(1)} km`;
};
