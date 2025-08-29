import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";
import { fetcherMuatransCS } from "@/lib/fetcherBasicAuth";

const useMockData = false;
const useMuatransFetcher = true; // true: use fetcherMuatrans, false: use fetcherMuatransCS (basic auth)
// Mock API result for development/testing
export const mockAPIResult = {
  Message: {
    Code: 200,
    Text: "OK",
  },
  Data: {
    orderStatusCounts: {
      menungguKonfirmasi: 21,
      pesananTerkonfirmasi: 12,
      armadaDijadwalkan: 5,
      prosesMuat: 30,
      prosesBongkar: 12,
      dokumenSedangDisiapkan: 0,
      prosesPengirimanDokumen: 3,
      pesananSelesai: 5,
    },
    needAttention: {
      perluResponsePerubahan: 0,
      perluKonfirmasiSiap: 12,
      perluAssignArmada: 12,
      laporanSOS: 3,
      ulasanBaru: 12,
    },
    transporterRating: {
      averageRating: 4.2,
      totalRatings: 1567,
      formattedRating: "4,2/5",
    },
    metadata: {
      lastUpdated: "2025-08-22T03:11:27.058Z",
      nextRefresh: "2025-08-22T03:16:27.058Z",
      dataSource: "real-time",
      cacheStatus: "fresh",
    },
  },
  Type: "/v1/cs/dashboard/data/orders",
};

// Mock API result for SOS data
export const mockSOSAPIResult = {
  Message: {
    Code: 200,
    Text: "Dashboard data retrieved successfully",
  },
  Data: {
    laporanSOS: 3,
    metadata: {
      lastUpdated: "2025-08-02T10:15:30+07:00",
      nextRefresh: "2025-08-02T10:20:30+07:00",
      dataSource: "real-time",
      cacheStatus: "miss",
    },
  },
  Type: "DASHBOARD_DATA",
};

// Mock API result for ratings data
export const mockRatingsAPIResult = {
  Message: {
    Code: 200,
    Text: "Dashboard data retrieved successfully",
  },
  Data: {
    ulasanBaru: 12,
    transporterRating: {
      averageRating: 4.2,
      totalRatings: 1567,
      formattedRating: "4,2/5",
    },
    metadata: {
      lastUpdated: "2025-08-02T10:15:30+07:00",
      nextRefresh: "2025-08-02T10:20:30+07:00",
      dataSource: "real-time",
      cacheStatus: "miss",
    },
  },
  Type: "DASHBOARD_DATA",
};

/**
 * Fetches CS dashboard data including order status counts and attention items
 * @returns {Promise} API response with dashboard data
 */
export const getDashboardData = async () => {
  let result;
  if (useMockData) {
    result = mockAPIResult;
  } else {
    if (useMuatransFetcher) {
      result = await fetcherMuatrans.get("/v1/cs/dashboard/data/orders");
    } else {
      result = await fetcherMuatransCS.get("/v1/cs/dashboard/data/orders");
    }
  }
  const data = result.data.Data;
  return data;
};

/**
 * Fetches CS dashboard SOS data
 * @param {object} params - Query parameters
 * @param {boolean} params.refresh - Force refresh cache bypass
 * @param {string} params.timezone - Timezone for date calculations
 * @returns {Promise} API response with SOS data
 */
export const getDashboardSOSData = async (params = {}) => {
  let result;
  if (useMockData) {
    result = mockSOSAPIResult;
  } else {
    const queryParams = new URLSearchParams();
    if (params.refresh) queryParams.append("refresh", params.refresh);
    if (params.timezone) queryParams.append("timezone", params.timezone);

    const url = `/v1/cs/dashboard/data/sos${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    if (useMuatransFetcher) {
      result = await fetcherMuatrans.get(url);
    } else {
      result = await fetcherMuatransCS.get(url);
    }
  }
  const data = result.data.Data;
  return data;
};

/**
 * Fetches CS dashboard ratings data
 * @param {object} params - Query parameters
 * @param {boolean} params.refresh - Force refresh cache bypass
 * @param {string} params.timezone - Timezone for date calculations
 * @returns {Promise} API response with ratings data
 */
export const getDashboardRatingsData = async (params = {}) => {
  let result;
  if (useMockData) {
    result = mockRatingsAPIResult;
  } else {
    const queryParams = new URLSearchParams();
    if (params.refresh) queryParams.append("refresh", params.refresh);
    if (params.timezone) queryParams.append("timezone", params.timezone);

    const url = `/v1/cs/dashboard/data/ratings${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    if (useMuatransFetcher) {
      result = await fetcherMuatrans.get(url);
    } else {
      result = await fetcherMuatransCS.get(url);
    }
  }
  const data = result.data.Data;
  return data;
};

/**
 * SWR hook for fetching CS dashboard data
 * @returns {object} SWR response with data, error, and loading states
 */
export const useGetDashboardData = () => {
  return useSWR("cs-dashboard-data", getDashboardData, {
    refreshInterval: 300000, // Refresh every 5 minutes
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });
};

/**
 * SWR hook for fetching CS dashboard SOS data
 * @param {object} params - Query parameters
 * @returns {object} SWR response with data, error, and loading states
 */
export const useGetDashboardSOSData = (params = {}) => {
  const cacheKey = `cs-dashboard-sos-data-${JSON.stringify(params)}`;
  return useSWR(cacheKey, () => getDashboardSOSData(params), {
    refreshInterval: 300000, // Refresh every 5 minutes
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });
};

/**
 * SWR hook for fetching CS dashboard ratings data
 * @param {object} params - Query parameters
 * @returns {object} SWR response with data, error, and loading states
 */
export const useGetDashboardRatingsData = (params = {}) => {
  const cacheKey = `cs-dashboard-ratings-data-${JSON.stringify(params)}`;
  return useSWR(cacheKey, () => getDashboardRatingsData(params), {
    refreshInterval: 300000, // Refresh every 5 minutes
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });
};

/**
 * Fetches and normalizes all CS dashboard data from multiple endpoints
 * @param {object} params - Query parameters
 * @param {boolean} params.refresh - Force refresh cache bypass
 * @param {string} params.timezone - Timezone for date calculations
 * @returns {Promise} Normalized dashboard data combining orders, SOS, and ratings
 */
export const getAllDashboardData = async (params = {}) => {
  try {
    // Fetch all data in parallel
    const [ordersData, sosData, ratingsData] = await Promise.all([
      getDashboardData(),
      getDashboardSOSData(params),
      getDashboardRatingsData(params),
    ]);

    // Normalize and combine data
    const normalizedData = {
      Message: {
        Code: 200,
        Text: "OK",
      },
      Data: {
        orderStatusCounts: ordersData.orderStatusCounts,
        needAttention: {
          perluResponsePerubahan:
            ordersData.needAttention?.perluResponsePerubahan || 0,
          perluKonfirmasiSiap:
            ordersData.needAttention?.perluKonfirmasiSiap || 0,
          perluAssignArmada: ordersData.needAttention?.perluAssignArmada || 0,
          laporanSOS: sosData.laporanSOS || 0,
          ulasanBaru: ratingsData.ulasanBaru || 0,
        },
        transporterRating: ratingsData.transporterRating || {
          averageRating: 0,
          totalRatings: 0,
          formattedRating: "0/5",
        },
        metadata: {
          lastUpdated: new Date().toISOString(),
          nextRefresh: new Date(Date.now() + 300000).toISOString(), // 5 minutes from now
          dataSource: "real-time",
          cacheStatus: "fresh",
        },
      },
      Type: "/v1/cs/dashboard/data/orders",
    };

    return normalizedData.Data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};

/**
 * SWR hook for fetching all normalized CS dashboard data
 * @param {object} params - Query parameters
 * @returns {object} SWR response with normalized data, error, and loading states
 */
export const useGetAllDashboardData = (params = {}) => {
  const cacheKey = `cs-dashboard-all-data-${JSON.stringify(params)}`;
  return useSWR(cacheKey, () => getAllDashboardData(params), {
    refreshInterval: 300000, // Refresh every 5 minutes
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });
};
