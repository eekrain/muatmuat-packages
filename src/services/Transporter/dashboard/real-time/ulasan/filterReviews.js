import { fetcherMuatrans } from "@/lib/axios";

// --- Configuration ---
// Set to true to use mock data, false for actual API calls.
const useMockData = false;

// --- Mock Data ---
// Mock data for filtered reviews based on api-kontrak.md
export const mockAPIResult = {
  data: {
    Message: { Code: 200, Text: "Filter applied successfully" },
    Data: {
      reviews: [
        {
          id: "rv_001",
          orderNumber: "ORD-2025-001",
          driverName: "Ahmad Santoso",
          rating: 5,
          reviewText: "Driver sangat profesional dan tepat waktu",
          reviewDate: "2025-01-15T10:30:00Z",
          shipperName: "PT. Logistik Prima",
        },
        {
          id: "rv_002",
          orderNumber: "ORD-2025-002",
          driverName: "Budi Hartono",
          rating: 4,
          reviewText: "Pelayanan baik, pengiriman aman",
          reviewDate: "2025-01-20T14:15:00Z",
          shipperName: "CV. Mandiri Jaya",
        },
      ],
      filterState: {
        filtersActive: true,
        appliedFilters: [
          {
            type: "rating",
            values: [4, 5],
            label: "Rating 4, 5",
            removable: true,
          },
        ],
        clearAllFilters: {
          visible: true,
          text: "Hapus Semua Filter",
        },
      },
    },
    Type: "NEW_REVIEWS_FILTER_FOUND",
  },
};

/**
 * Filter reviews based on provided filters.
 * @param {Object} filters - The filters to apply
 * @param {Array<number>} filters.rating - Array of selected ratings (1-5)
 * @param {string} filters.period - Period filter (today, week, month, custom)
 * @param {string} filters.dateFrom - Start date (YYYY-MM-DD) for custom period
 * @param {string} filters.dateTo - End date (YYYY-MM-DD) for custom period
 * @returns {Promise<Object>} The filtered reviews data
 */
export const filterReviews = async (filters) => {
  const url = "/api/v1/transporter/alerts/new-reviews/filter";

  if (useMockData) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Return mock data based on filters
    const mockResult = { ...mockAPIResult };

    // Update applied filters in mock data based on actual filters provided
    const appliedFilters = [];

    if (filters.rating && filters.rating.length > 0) {
      appliedFilters.push({
        type: "rating",
        values: filters.rating,
        label:
          filters.rating.length === 1
            ? `Rating ${filters.rating[0]}`
            : `Rating ${filters.rating.sort().join(", ")}`,
        removable: true,
      });
    }

    if (filters.period && filters.period !== "all") {
      let periodLabel = "";
      switch (filters.period) {
        case "today":
          periodLabel = "Hari Ini";
          break;
        case "week":
          periodLabel = "Minggu Ini";
          break;
        case "month":
          periodLabel = "Bulan Ini";
          break;
        case "custom":
          if (filters.dateFrom && filters.dateTo) {
            const startDate = new Date(filters.dateFrom);
            const endDate = new Date(filters.dateTo);
            periodLabel = `${startDate.toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "short",
            })} - ${endDate.toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}`;
          }
          break;
      }

      if (periodLabel) {
        appliedFilters.push({
          type: "period",
          value: filters.period,
          label: periodLabel,
          removable: true,
        });
      }
    }

    mockResult.data.Data.filterState = {
      filtersActive: appliedFilters.length > 0,
      appliedFilters: appliedFilters,
      clearAllFilters: {
        visible: appliedFilters.length > 0,
        text: "Hapus Semua Filter",
      },
    };

    return mockResult.data.Data;
  }

  try {
    // Validate filters before sending
    if (!filters || typeof filters !== "object") {
      throw new Error("Invalid filters object");
    }

    // Validate rating filter
    if (filters.rating && !Array.isArray(filters.rating)) {
      throw new Error("Rating filter must be an array");
    }

    if (
      filters.rating &&
      filters.rating.some((r) => typeof r !== "number" || r < 1 || r > 5)
    ) {
      throw new Error("Rating values must be numbers between 1 and 5");
    }

    // Validate period filter
    const validPeriods = ["today", "week", "month", "custom"];
    if (filters.period && !validPeriods.includes(filters.period)) {
      throw new Error("Invalid period value");
    }

    // Validate date range for custom period
    if (filters.period === "custom" && (!filters.dateFrom || !filters.dateTo)) {
      throw new Error("dateFrom and dateTo are required when period is custom");
    }

    // Perform the actual API call
    const result = await fetcherMuatrans.post(url, { filters });
    return result?.data?.Data || {};
  } catch (error) {
    console.error("Error filtering reviews:", error);
    throw error; // Re-throw error for caller to handle
  }
};
