import useSWRMutation from "swr/mutation";

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
      recommendedTrucks: [
        {
          truckTypeId: "550e8400-e29b-41d4-a716-446655440060",
          name: "CDE Engkel",
          description: "Colt Diesel Engkel box tertutup",
          unit: 2,
          basePrice: 500000,
          maxWeight: 2000,
          weightUnit: "kg",
          dimensions: {
            length: 4.3,
            width: 1.8,
            height: 1.8,
            dimensionUnit: "m",
          },
          image: "https://picsum.photos/500/300?random=1",
          price: 1000000,
        },
        {
          truckTypeId: "550e8400-e29b-41d4-a716-446655440062",
          name: "Fuso Medium",
          description: "Fuso box tertutup, kapasitas sedang",
          unit: 1,
          basePrice: 1200000,
          maxWeight: 8000,
          weightUnit: "kg",
          dimensions: {
            length: 7.0,
            width: 2.3,
            height: 2.2,
            dimensionUnit: "m",
          },
          image: "https://picsum.photos/500/300?random=3",
          price: 3500000,
        },
        {
          truckTypeId: "550e8400-e29b-41d4-a716-446655440063",
          name: "Tronton Wingbox",
          description: "Tronton dengan wingbox, kapasitas besar",
          unit: 1,
          basePrice: 2500000,
          maxWeight: 20000,
          weightUnit: "kg",
          dimensions: {
            length: 9.5,
            width: 2.4,
            height: 2.4,
            dimensionUnit: "m",
          },
          image: "https://picsum.photos/500/300?random=4",
          price: 7000000,
        },
      ],
      nonRecommendedTrucks: [
        {
          truckTypeId: "550e8400-e29b-41d4-a716-446655440061",
          name: "CDD",
          description: "Colt Diesel Double box tertutup",
          maxWeight: 4000,
          weightUnit: "kg",
          dimensions: {
            length: 6.0,
            width: 2.0,
            height: 2.0,
            dimensionUnit: "m",
          },
          image: "https://picsum.photos/500/300?random=2",
          price: 2500000,
        },
        {
          truckTypeId: "550e8400-e29b-41d4-a716-446655440064",
          name: "Pickup Bak",
          description: "Pickup bak terbuka, cocok untuk barang ringan",
          maxWeight: 1000,
          weightUnit: "kg",
          dimensions: {
            length: 2.5,
            width: 1.6,
            height: 1.2,
            dimensionUnit: "m",
          },
          image: "https://picsum.photos/500/300?random=5",
          price: 600000,
        },
        {
          truckTypeId: "550e8400-e29b-41d4-a716-446655440065",
          name: "Trailer 20ft",
          description: "Trailer kontainer 20ft, kapasitas besar",
          maxWeight: 24000,
          weightUnit: "kg",
          dimensions: {
            length: 12.0,
            width: 2.5,
            height: 2.5,
            dimensionUnit: "m",
          },
          image: "https://picsum.photos/500/300?random=6",
          price: 9000000,
        },
      ],
      priceComponents: {
        estimatedDistance: 75.5,
        distanceUnit: "km",
      },
    },
    Type: "TRUCK_RECOMMENDATIONS",
  },
};

// Fetcher function for recommended trucks
export const getRecommendedTrucks = async (url, { arg }) => {
  let result;
  if (useMockData) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    result = mockAPIResult;
  } else {
    result = await fetcherMuatrans.post("v1/orders/trucks/recommended", arg);
  }
  return result?.data?.Data || null;
};

// SWR mutation hook
export const useGetRecommendedTrucks = () =>
  useSWRMutation("getRecommendedTrucks", getRecommendedTrucks);
