import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false;

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      code: 200,
      text: "Success",
    },
    Data: {
      recommendedCarriers: [
        {
          carrierId: 1,
          name: "Box",
          image: "https://picsum.photos/500/300?random=1",
          type: "recommended",
        },
        {
          carrierId: 2,
          name: "Bak Terbuka",
          image: "https://picsum.photos/500/300?random=2",
          type: "recommended",
        },
        {
          carrierId: 3,
          name: "Flat Bed",
          image: "https://picsum.photos/500/300?random=3",
          type: "recommended",
        },
        {
          carrierId: 4,
          name: "Wingbox",
          image: "https://picsum.photos/500/300?random=4",
          type: "recommended",
        },
      ],
      nonRecommendedCarriers: [
        {
          carrierId: 5,
          name: "Reefer",
          image: "https://picsum.photos/500/300?random=5",
          type: "not-recommended",
        },
        {
          carrierId: 6,
          name: "Tangki",
          image: "https://picsum.photos/500/300?random=6",
          type: "not-recommended",
        },
        {
          carrierId: 7,
          name: "Towing",
          image: "https://picsum.photos/500/300?random=7",
          type: "not-recommended",
        },
      ],
    },
    Type: "CARRIER_RECOMMENDATIONS",
  },
};

// Fetcher function for recommended carriers
export const getRecommendedCarriers = async (cacheKey) => {
  const cargoCategoryId = cacheKey.split("/")[1];
  let result;
  if (useMockData) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    result = mockAPIResult;
  } else {
    result = await fetcherMuatrans.get(
      `v1/orders/carriers/recommended?cargoCategoryId=${cargoCategoryId}`
    );
  }

  return result?.data?.Data || null;
};
// SWR mutation hook
export const useGetRecommendedCarriers = (cargoCategoryId) =>
  useSWR(
    cargoCategoryId ? `getRecommendedCarriers/${cargoCategoryId}` : null,
    getRecommendedCarriers
  );
