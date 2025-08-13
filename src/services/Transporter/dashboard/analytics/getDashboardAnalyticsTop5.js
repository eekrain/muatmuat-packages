import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// --- Configuration ---
// Set to true to use mock data, false for actual API calls.
const useMockData = false;

// --- Mock Data ---

// Mock data for a successful response for the "drivers" category.
export const mockAPIResultDrivers = {
  data: {
    Message: {
      Code: 200,
      Text: "Top 5 drivers retrieved successfully",
    },
    Data: {
      category: "drivers",
      hasData: true,
      items: [
        {
          rank: 1,
          driverID: "uuid-driver-1",
          driverName: "Ahmad Wijaya",
          profileImage: "https://picsum.photos/200/300",
          completedDeliveries: 45,
          rating: 4.8,
        },
        {
          rank: 2,
          driverID: "uuid-driver-2",
          driverName: "Budi Santoso",
          profileImage: "https://picsum.photos/200/300",
          completedDeliveries: 42,
          rating: 4.7,
        },
        {
          rank: 3,
          driverID: "uuid-driver-3",
          driverName: "Citra Lestari",
          profileImage: "https://picsum.photos/200/300",
          completedDeliveries: 38,
          rating: 4.9,
        },
        {
          rank: 4,
          driverID: "uuid-driver-4",
          driverName: "Dewi Anggraini",
          profileImage: "https://picsum.photos/200/300",
          completedDeliveries: 35,
          rating: 4.6,
        },
        {
          rank: 5,
          driverID: "uuid-driver-5",
          driverName: "Eko Prasetyo",
          profileImage: "https://picsum.photos/200/300",
          completedDeliveries: 33,
          rating: 4.5,
        },
      ],
    },
    Type: "TOP5_DRIVERS",
  },
};

// Mock data for a successful response for the "truck-types" category.
export const mockAPIResultTruckTypes = {
  data: {
    Message: {
      Code: 200,
      Text: "Top 5 truck types retrieved successfully",
    },
    Data: {
      category: "truck-types",
      hasData: true,
      items: [
        {
          rank: 1,
          truckTypeID: "uuid-truck-type-1",
          truckTypeName: "Truk Fuso Box",
          carrierTypeName: "Box",
          truckImage: "https://storage.muatrans.com/trucks/fuso-box.jpg",
          usageCount: 125,
        },
        {
          rank: 2,
          truckTypeID: "uuid-truck-type-2",
          truckTypeName: "Tronton Wing Box",
          carrierTypeName: "Wing Box",
          truckImage: "https://storage.muatrans.com/trucks/tronton-wingbox.jpg",
          usageCount: 110,
        },
        {
          rank: 3,
          truckTypeID: "uuid-truck-type-3",
          truckTypeName: "Pick-up Bak",
          carrierTypeName: "Bak",
          truckImage: "https://storage.muatrans.com/trucks/pickup-bak.jpg",
          usageCount: 95,
        },
        {
          rank: 4,
          truckTypeID: "uuid-truck-type-4",
          truckTypeName: "CDD Long",
          carrierTypeName: "Box",
          truckImage: "https://storage.muatrans.com/trucks/cdd-long.jpg",
          usageCount: 80,
        },
        {
          rank: 5,
          truckTypeID: "uuid-truck-type-5",
          truckTypeName: "Container 20 Feet",
          carrierTypeName: "Container",
          truckImage: "https://storage.muatrans.com/trucks/container-20.jpg",
          usageCount: 70,
        },
      ],
    },
    Type: "TOP5_TRUCK_TYPES",
  },
};

// Mock data for a successful response for the "loading-areas" category.
export const mockAPIResultLoadingAreas = {
  data: {
    Message: {
      Code: 200,
      Text: "Top 5 loading areas retrieved successfully",
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
        {
          rank: 2,
          city: "Surabaya",
          province: "Jawa Timur",
          usageCount: 75,
        },
        {
          rank: 3,
          city: "Bandung",
          province: "Jawa Barat",
          usageCount: 68,
        },
        {
          rank: 4,
          city: "Semarang",
          province: "Jawa Tengah",
          usageCount: 62,
        },
        {
          rank: 5,
          city: "Medan",
          province: "Sumatera Utara",
          usageCount: 55,
        },
      ],
    },
    Type: "TOP5_LOADING_AREAS",
  },
};

// Mock data for a successful response for the "unloading-areas" category.
export const mockAPIResultUnloadingAreas = {
  data: {
    Message: {
      Code: 200,
      Text: "Top 5 unloading areas retrieved successfully",
    },
    Data: {
      category: "unloading-areas",
      hasData: true,
      items: [
        {
          rank: 1,
          city: "Bekasi",
          province: "Jawa Barat",
          usageCount: 95,
        },
        {
          rank: 2,
          city: "Tangerang",
          province: "Banten",
          usageCount: 88,
        },
        {
          rank: 3,
          city: "Sidoarjo",
          province: "Jawa Timur",
          usageCount: 72,
        },
        {
          rank: 4,
          city: "Depok",
          province: "Jawa Barat",
          usageCount: 65,
        },
        {
          rank: 5,
          city: "Palembang",
          province: "Sumatera Selatan",
          usageCount: 58,
        },
      ],
    },
    Type: "TOP5_UNLOADING_AREAS",
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
      category: "drivers",
      hasData: false,
      items: [],
    },
    Type: "TOP5_DRIVERS",
  },
};

/**
 * Fetcher function for the Top 5 analytics data.
 * @param {Array} cacheKey - The SWR cache key, containing the URL and query parameters.
 * @returns {Object} The data portion of the API response.
 */
export const fetcherDashboardAnalyticsTop5 = async (cacheKey) => {
  const [url, params] = cacheKey;

  if (useMockData) {
    // Simulate API response based on the category parameter
    switch (params.category) {
      case "drivers":
        return mockAPIResultDrivers.data.Data;
      case "truck-types":
        return mockAPIResultTruckTypes.data.Data;
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
    console.error("Error fetching dashboard top 5 analytics:", error);
    return { hasData: false, items: [] }; // Ensure the hook receives an object even on error
  }
};

/**
 * SWR hook to fetch Top 5 analytics data for the dashboard.
 * @param {Object} params - The query parameters for the API request (e.g., { category: 'drivers', period: 'month' }).
 * @returns {Object} An object containing the fetched data, loading state, and error state.
 */
export const useGetDashboardAnalyticsTop5 = (params = {}) => {
  // SWR uses the cacheKey to uniquely identify and cache requests.
  // By including the params object, SWR will automatically re-fetch when the params change.
  const cacheKey = ["/v1/dashboard/analytics/top5", params];

  const { data, error, isLoading } = useSWR(
    // Only fetch if a category is provided
    params.category ? cacheKey : null,
    fetcherDashboardAnalyticsTop5,
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
