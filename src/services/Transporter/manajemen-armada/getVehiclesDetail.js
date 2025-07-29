import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const isMockVehicleDetail = true;

const apiResultVehicleDetail = {
  data: {
    Message: {
      Code: 200,
      Text: "Detail armada berhasil diambil",
    },
    Data: {
      vehicle: {
        id: "550e8400-e29b-41d4-a716-446655440011",
        licensePlate: "B 1234 ABC",
        truckType: {
          id: "550e8400-e29b-41d4-a716-446655440000",
          name: "Truk Besar",
          description: "Truk dengan kapasitas besar",
        },
        carrierType: {
          id: "550e8400-e29b-41d4-a716-446655440001",
          name: "Box",
          description: "Carrier tipe box",
        },
        vehicleBrand: {
          id: "550e8400-e29b-41d4-a716-446655440002",
          name: "Hino",
          description: "Merek kendaraan Hino",
        },
        vehicleType: {
          id: "550e8400-e29b-41d4-a716-446655440003",
          name: "Hino Dutro",
          description: "Tipe kendaraan Hino Dutro",
        },
        registrationYear: 2020,
        carrierLength: 6.5,
        carrierWidth: 2.5,
        carrierHeight: 2.8,
        carrierDimensionUnit: "m",
        chassisNumber: "JH4KA8260MC123456",
        stnkExpiryDate: "2025-12-31",
        kirNumber: "KIR123456",
        kirExpiryDate: "2025-12-31",
        status: "ACTIVE",
        rejectReason:
          "Alasan verifikasi ditolak : Nomor plat tidak sesuai dengan foto plat dan foto STNK. kamu dapat memperbaiki data armada kamu agar dapat kami verifikasi kembali.",
        gpsInstallationEstimateStartDate: "2025-11-31",
        gpsInstallationEstimateEndDate: "2025-12-31",
        assignedDriver: {
          id: "550e8400-e29b-41d4-a716-446655440012",
          fullName: "John Doe",
          whatsappNumber: "081234567890",
          assignedAt: "2024-01-20T10:30:00Z",
        },
        photos: [
          {
            id: "img-1",
            photoType: "FRONT",
            photoName: "FRONT.jpg",
            photoUrl: "https://picsum.photos/200/300",
          },
          {
            id: "img-2",
            photoType: "BACK",
            photoName: "BACK.jpg",
            photoUrl: "https://picsum.photos/200/300",
          },
          {
            id: "img-3",
            photoType: "RIGHT",
            photoName: "RIGHT.jpg",
            photoUrl: "https://picsum.photos/200/300",
          },
          {
            id: "img-4",
            photoType: "LEFT",
            photoName: "LEFT.jpg",
            photoUrl: "https://picsum.photos/200/300",
          },
        ],
        documents: [
          {
            id: "550e8400-e29b-41d4-a716-446655440008",
            documentType: "STNK",
            documentName: "STNK.pdf",
            documentUrl:
              "https://cdn.muatrans.com/vehicles/documents/550e8400-e29b-41d4-a716-446655440008.pdf",
          },
          {
            id: "550e8400-e29b-41d4-a716-446655440009",
            documentType: "KIR",
            documentName: "KIR.pdf",
            documentUrl:
              "https://cdn.muatrans.com/vehicles/documents/550e8400-e29b-41d4-a716-446655440009.pdf",
          },
          {
            id: "550e8400-e29b-41d4-a716-4466554400010",
            documentType: "VEHICLE_TAX",
            documentName: "VEHICLE_TAX.pdf",
            documentUrl:
              "https://cdn.muatrans.com/vehicles/documents/550e8400-e29b-41d4-a716-4466554400010.pdf",
          },
        ],
      },
    },
    Type: "VEHICLE_DETAILS",
  },
};

export const fetcherVehicleDetail = async (cacheKey) => {
  // Extract vehicle ID from cache key
  const vehicleId = cacheKey.split("/")[1]?.split("?")[0];

  if (isMockVehicleDetail) {
    const result = apiResultVehicleDetail;
    return result.data.Data;
  }

  const result = await fetcherMuatrans.get(`v1/vehicles/${vehicleId}`);
  return result?.data?.Data || {};
};

export const useGetVehicleDetail = (vehicleId, params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  // The cache key should be unique to the vehicle ID to prevent caching conflicts
  const cacheKey = `vehicle-detail/${vehicleId}${queryParams ? `?${queryParams}` : ""}`;

  return useSWR(cacheKey, fetcherVehicleDetail);
};
