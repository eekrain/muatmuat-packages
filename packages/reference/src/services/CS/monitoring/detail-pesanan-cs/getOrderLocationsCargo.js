import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

const mockApiResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Informasi lokasi dan muatan berhasil diambil",
    },
    Data: {
      locations: {
        pickupLocations: [
          {
            locationId: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            sequence: 1,
            fullAddress:
              "Graha Aero, Jl. Kedungdoro 88, Kedungdoro, Kec Tegalsari, Kota Surabaya, Jawa Timur 60261",
            detailAddress: "Depan Toko Bunga Gunungsari",
            coordinates: {
              latitude: -7.266098,
              longitude: 112.739235,
            },
            areaInfo: {
              district: "Tegalsari",
              city: "Surabaya",
              province: "Jawa Timur",
              postalCode: "60261",
            },
            picInfo: {
              picName: "Agus Raharjo",
              picPhoneNumber: "081234567890",
            },
            scanStatus: {
              status: "SCANNED",
              scanTimestamp: "2025-08-05T10:30:00Z",
            },
          },
        ],
        deliveryLocations: [
          {
            locationId: "c3d4e5f6-g7h8-9012-3456-789012cdefgh",
            sequence: 1,
            fullAddress:
              "Jl. Ambengan No.51, Pacar Keling, Kec. Genteng, Surabaya, Jawa Timur 60272",
            detailAddress: "Depan Toko Bunga Gunungsari",
            coordinates: {
              latitude: -7.263611,
              longitude: 112.752778,
            },
            areaInfo: {
              district: "Genteng",
              city: "Surabaya",
              province: "Jawa Timur",
              postalCode: "60272",
            },
            picInfo: {
              picName: "Jajang Surahman",
              picPhoneNumber: "081234567892",
            },
            scanStatus: {
              status: "NOT_SCANNED",
              scanTimestamp: null,
            },
          },
        ],
      },
      cargo: [
        {
          cargoId: "550e8400-e29b-41d4-a716-446655440001",
          sequence: 1,
          name: "Electronics",
          isCustomName: false,
          cargoType: {
            cargoTypeId: "ct-001",
            cargoTypeName: "Electronics",
            cargoCategory: "Fragile",
          },
          weight: {
            value: 300.0,
            unit: "kg",
          },
          dimensions: {
            hasDimensions: true,
            length: 2.0,
            width: 1.0,
            height: 1.5,
            unit: "m",
          },
          photos: [
            {
              photoId: "photo-001",
              photoUrl: "https://picsum.photos/800/600?random=301",
              thumbnailUrl: "https://picsum.photos/200/150?random=301",
              description: "Electronics cargo photo 1",
              uploadedAt: "2025-08-05T09:00:00Z",
              fileSize: 1024000,
              resolution: {
                width: 800,
                height: 600,
              },
            },
          ],
        },
      ],
      summary: {
        totalWeight: 500.0,
        totalCargo: 2,
        pickupLocationCount: 2,
        deliveryLocationCount: 2,
        hasMultipleLocations: true,
        hasDimensions: true,
        hasPhotos: true,
        photoCount: 3,
      },
      additionalServices: {
        hasAdditionalServices: true,
        services: [
          {
            serviceId: "service-001",
            serviceName: "Bantuan Tambahan",
            serviceDescription: "Additional helper for loading/unloading",
            serviceFee: 50000,
          },
        ],
        documentDelivery: {
          hasDocumentDelivery: true,
          deliveryAddress: "Jalan Mayjend Soengkono 33A, Denanyar, Jombang",
          estimatedDelivery: "2025-08-07",
        },
      },
    },
    Type: "LOCATIONS_CARGO_SUCCESS",
  },
};

export const getOrderLocationsCargo = async (cacheKey) => {
  if (useMockData) {
    return mockApiResult.data.Data;
  }
  const result = await fetcherMuatrans.get(cacheKey);
  return result?.data?.Data || {};
};

export const useGetOrderLocationsCargo = (
  orderId,
  params = {},
  options = {}
) => {
  const queryParams = new URLSearchParams(params).toString();

  const cacheKey = orderId
    ? `/v1/cs/orders/${orderId}/locations-cargo${queryParams ? `?${queryParams}` : ""}`
    : null;

  return useSWR(cacheKey, getOrderLocationsCargo, options);
};
