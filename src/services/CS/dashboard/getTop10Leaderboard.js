import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// --- Configuration ---
// Set to true to use mock data, false for actual API calls.
const useMockData = true;

// --- Mock Data ---

// Mock data for a successful response for the "transporters" category.
export const mockAPIResultTransporters = {
  data: {
    Message: {
      Code: 200,
      Text: "Top 10 transporters retrieved successfully",
    },
    Data: {
      category: "transporters",
      hasData: true,
      items: [
        {
          rank: 1,
          transporterID: "uuid-transporter-1",
          transporterName: "Maju Logistik",
          logo: "https://picsum.photos/200",
          completedOrders: 250,
          profit: 85000000,
          rating: 4.9,
        },
        {
          rank: 2,
          transporterID: "uuid-transporter-2",
          transporterName: "Cepat Kirim",
          logo: "https://picsum.photos/200",
          completedOrders: 241,
          profit: 82500000,
          rating: 4.8,
        },
        {
          rank: 3,
          transporterID: "uuid-transporter-3",
          transporterName: "Nusantara Express",
          logo: "https://picsum.photos/200",
          completedOrders: 235,
          profit: 79800000,
          rating: 4.8,
        },
        {
          rank: 4,
          transporterID: "uuid-transporter-4",
          transporterName: "Garuda Cargo",
          logo: "https://picsum.photos/200",
          completedOrders: 220,
          profit: 75100000,
          rating: 4.7,
        },
        {
          rank: 5,
          transporterID: "uuid-transporter-5",
          transporterName: "Andalan Logistik",
          logo: "https://picsum.photos/200",
          completedOrders: 212,
          profit: 72300000,
          rating: 4.9,
        },
        {
          rank: 6,
          transporterID: "uuid-transporter-6",
          transporterName: "Karya Bersama Trans",
          logo: "https://picsum.photos/200",
          completedOrders: 205,
          profit: 68900000,
          rating: 4.6,
        },
        {
          rank: 7,
          transporterID: "uuid-transporter-7",
          transporterName: "Jalur Sutra Kargo",
          logo: "https://picsum.photos/200",
          completedOrders: 198,
          profit: 66000000,
          rating: 4.8,
        },
        {
          rank: 8,
          transporterID: "uuid-transporter-8",
          transporterName: "Samudera Logistik",
          logo: "https://picsum.photos/200",
          completedOrders: 190,
          profit: 64500000,
          rating: 4.7,
        },
        {
          rank: 9,
          transporterID: "uuid-transporter-9",
          transporterName: "Bintang Timur Ekspedisi",
          logo: "https://picsum.photos/200",
          completedOrders: 185,
          profit: 61200000,
          rating: 4.6,
        },
        {
          rank: 10,
          transporterID: "uuid-transporter-10",
          transporterName: "Lintas Express",
          logo: "https://picsum.photos/200",
          completedOrders: 180,
          profit: 58000000,
          rating: 4.5,
        },
      ],
    },
    Type: "TOP10_TRANSPORTERS",
  },
};

// Mock data for a successful response for the "loading-areas" category.
export const mockAPIResultLoadingAreas = {
  data: {
    Message: {
      Code: 200,
      Text: "Top 10 loading areas retrieved successfully",
    },
    Data: {
      category: "loading-areas",
      hasData: true,
      items: [
        {
          rank: 1,
          city: "Jakarta Utara",
          province: "DKI Jakarta",
          usageCount: 89,
        },
        { rank: 2, city: "Surabaya", province: "Jawa Timur", usageCount: 75 },
        { rank: 3, city: "Bandung", province: "Jawa Barat", usageCount: 68 },
        { rank: 4, city: "Semarang", province: "Jawa Tengah", usageCount: 62 },
        { rank: 5, city: "Medan", province: "Sumatera Utara", usageCount: 55 },
        {
          rank: 6,
          city: "Makassar",
          province: "Sulawesi Selatan",
          usageCount: 50,
        },
        {
          rank: 7,
          city: "Balikpapan",
          province: "Kalimantan Timur",
          usageCount: 48,
        },
        { rank: 8, city: "Pekanbaru", province: "Riau", usageCount: 45 },
        { rank: 9, city: "Cikarang", province: "Jawa Barat", usageCount: 42 },
        { rank: 10, city: "Gresik", province: "Jawa Timur", usageCount: 40 },
      ],
    },
    Type: "TOP10_LOADING_AREAS",
  },
};

// Mock data for a successful response for the "unloading-areas" category.
export const mockAPIResultUnloadingAreas = {
  data: {
    Message: {
      Code: 200,
      Text: "Top 10 unloading areas retrieved successfully",
    },
    Data: {
      category: "unloading-areas",
      hasData: true,
      items: [
        { rank: 1, city: "Bekasi", province: "Jawa Barat", usageCount: 95 },
        { rank: 2, city: "Tangerang", province: "Banten", usageCount: 88 },
        { rank: 3, city: "Sidoarjo", province: "Jawa Timur", usageCount: 72 },
        { rank: 4, city: "Depok", province: "Jawa Barat", usageCount: 65 },
        {
          rank: 5,
          city: "Palembang",
          province: "Sumatera Selatan",
          usageCount: 58,
        },
        { rank: 6, city: "Karawang", province: "Jawa Barat", usageCount: 55 },
        { rank: 7, city: "Bogor", province: "Jawa Barat", usageCount: 52 },
        { rank: 8, city: "Cilegon", province: "Banten", usageCount: 50 },
        { rank: 9, city: "Batam", province: "Kepulauan Riau", usageCount: 47 },
        { rank: 10, city: "Denpasar", province: "Bali", usageCount: 44 },
      ],
    },
    Type: "TOP10_UNLOADING_AREAS",
  },
};

// Mock data for a successful response where NO data is available.
export const mockAPIResultWithoutData = {
  data: {
    Message: {
      Code: 200,
      Text: "No data available for selected period",
    },
    Data: {
      category: "transporters",
      hasData: false,
      items: [],
    },
    Type: "TOP10_TRANSPORTERS",
  },
};

/**
 * Fetcher function for the Top 10 analytics data.
 * @param {Array} cacheKey - The SWR cache key, containing the URL and query parameters.
 * @returns {Object} The data portion of the API response.
 */
export const fetcherDashboardAnalyticsTop10 = async (cacheKey) => {
  const [url, params] = cacheKey;

  if (useMockData) {
    // Simulate API response based on the category parameter
    switch (params.category) {
      case "transporters":
        return mockAPIResultTransporters.data.Data;
      case "loading-areas":
        return mockAPIResultLoadingAreas.data.Data;
      case "unloading-areas":
        return mockAPIResultUnloadingAreas.data.Data;
      default:
        // Return no data for any other category or if testing the empty state
        return mockAPIResultWithoutData.data.Data;
    }
  }

  try {
    const result = await fetcherMuatrans.get(url, { params });
    return result?.data?.Data || { hasData: false, items: [] }; // Return data or a default empty-state object
  } catch (error) {
    console.error("Error fetching dashboard top 10 analytics:", error);
    return { hasData: false, items: [] }; // Ensure the hook receives an object even on error
  }
};

/**
 * SWR hook to fetch Top 10 analytics data for the dashboard.
 * @param {Object} params - The query parameters for the API request (e.g., { category: 'transporters', period: 'month' }).
 * @returns {Object} An object containing the fetched data, loading state, and error state.
 */
export const useGetDashboardAnalyticsTop10 = (params = {}) => {
  // SWR uses the cacheKey to uniquely identify and cache requests.
  const cacheKey = ["/v1/dashboard/analytics/top10", params];

  const { data, error, isLoading } = useSWR(
    // Only fetch if a category is provided
    params.category ? cacheKey : null,
    fetcherDashboardAnalyticsTop10,
    {
      revalidateOnFocus: false, // Optional: disable re-fetching on window focus
    }
  );

  return {
    data,
    isLoading,
    isError: error,
  };
};
