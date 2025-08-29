import { fetcherMuatrans } from "@/lib/axios";

// --- Configuration ---
// Set to true to use mock data, false for actual API calls.
const useMockData = true;

// --- Mock Data ---
// Mock data for expand review based on api-kontrak.md
export const mockAPIResult = {
  data: {
    Message: { Code: 200, Text: "Review text expanded successfully" },
    Data: {
      reviewId: "REV-2025-001",
      isExpanded: true,
      fullText:
        "Driver sangat profesional dan barang sampai dengan selamat. Terima kasih atas pelayanan yang memuaskan!",
      shortText: "Driver sangat profesional dan barang…",
      actionText: "Sembunyikan",
    },
    Type: "REVIEW_TEXT_EXPANDED",
  },
};

/**
 * Service function to expand or collapse review text.
 * @param {string} reviewId - The ID of the review to expand/collapse.
 * @param {boolean} isExpanded - Whether to expand (true) or collapse (false) the review.
 * @returns {Promise<Object>} The data portion of the API response.
 */
export const expandReview = async (reviewId, isExpanded) => {
  const url = `/api/v1/transporter/alerts/new-reviews/${reviewId}/expand`;

  if (useMockData) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Return mock data with the requested state
    const mockResponse = {
      ...mockAPIResult.data.Data,
      reviewId,
      isExpanded,
      actionText: isExpanded ? "Sembunyikan" : "Lihat Selengkapnya",
    };

    return mockResponse;
  }

  try {
    // Perform the actual API call
    const result = await fetcherMuatrans.put(url, { isExpanded });
    return result?.data?.Data || {}; // Return the data or an empty object on failure
  } catch (error) {
    console.error("Error expanding/collapsing review:", error);
    throw error; // Re-throw error for component to handle
  }
};
