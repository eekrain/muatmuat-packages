import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

const mockApiResult = {
  Message: {
    Code: 200,
    Text: "Order detail retrieved successfully",
  },
  Data: {
    orderId: "uuid",
    orderCode: "MT25A002A",
    invoiceNumber: "INV-2025-001",
    orderStatus: "ARMADA_DIJADWALKAN",
    orderStatusUnit: 1,
    orderType: "SCHEDULED",
    loadTimeStart: "2025-03-15T18:00:00Z",
    loadTimeEnd: "2025-03-15T19:00:00Z",
    estimatedDistance: 178.5,
    isHalalLogistics: true,
    truckCount: 1,
    hasSOSAlert: true,
    vehicle: {
      truckTypeId: "uuid",
      truckTypeName: "Colt Diesel Engkel - Box",
      vehicleImage: "https://example.com/truck.jpg",
    },
    locations: [
      {
        id: "uuid",
        type: "PICKUP",
        sequence: 1,
        fullAddress: "Jl. Sudirman No. 123, Jakarta",
        detailAddress: "Jl. Sudirman No. 123, Jakarta",
        city: "Jakarta",
        province: "DKI Jakarta",
        latitude: -6.2,
        longitude: 106.816666,
        picName: "Jane Doe",
        picPhoneNumber: "081234567891",
      },
    ],
    cargo: [
      {
        id: "uuid",
        name: "Besi Baja",
        weight: 1000.0,
        weightUnit: "kg",
        length: 1.0,
        width: 2.0,
        height: 5.0,
        dimensionUnit: "m",
        cargoTypeName: "Besi",
        cargoCategoryName: "Logam",
      },
    ],
    cargoDescription: "",
    photos: [
      {
        id: "uuid",
        photoUrl: "https://example.com/photo1.jpg",
      },
    ],
    additionalServices: [
      {
        id: "uuid",
        serviceName: "Kirim Berkas",
      },
    ],
    incomeSummary: {
      totalPrice: 900000.0,
      transportFee: 800000.0,
      additionalServiceFee: 150000.0,
      taxAmount: 50000.0,
    },
    otherStatus: [
      {
        orderStatus: "ARMADA_DIJADWALKAN",
        orderStatusUnit: 1,
      },
    ],
  },
  Type: "ORDER_DETAIL",
};

export const fetcherOrderDetail = async (cacheKey) => {
  if (useMockData) {
    return mockApiResult.Data;
  }
  const result = await fetcherMuatrans.get(cacheKey);
  return result?.data?.Data || {};
};

export const useGetOrderDetail = (orderId, params = {}, options = {}) => {
  const queryParams = new URLSearchParams(params).toString();

  const cacheKey = orderId
    ? `/v1/transporter/orders/${orderId}/detail-summary${
        queryParams ? `?${queryParams}` : ""
      }`
    : null;

  return useSWR(cacheKey, fetcherOrderDetail, options);
};
