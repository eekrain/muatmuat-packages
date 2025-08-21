import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";
import { ORDER_STATUS } from "@/utils/Transporter/orderStatus";

const useMockData = true;

const otherStatus = [];

const mockApiResult = {
  Message: {
    Code: 200,
    Text: "OK",
  },
  Data: {
    orderId: "dcdaf886-56d6-4d84-89d6-a21ec18d0bc1",
    orderCode: "MT25A002A",
    invoiceNumber: "INV/MT25A002A",
    // orderStatus: ORDER_STATUS.NEED_CHANGE_RESPONSE,
    // orderStatus: "CONFIRMED_ORDER",
    // orderStatus: "CANCELLED_TRANSPORTER",
    // orderStatus: "SCHEDULED_FLEET",
    // orderStatus: "WAITING_PAYMENT_2",
    // orderStatus: ORDER_STATUS.DOCUMENT_PREPARATION,
    // orderStatus: ORDER_STATUS.COMPLETED,
    // orderStatus: ORDER_STATUS.LOADING,
    // orderStatus: ORDER_STATUS.CANCELLED_BY_TRANSPORTER,
    orderStatus: ORDER_STATUS.LOADING,
    orderStatusUnit: 1,
    truckCount: 1,
    orderType: "SCHEDULED",
    loadTimeStart: "2024-10-03T18:00:00.000Z",
    loadTimeEnd: "2024-10-04T08:00:00.000Z",
    estimatedDistance: 178,
    isHalalLogistics: true,
    hasSOSAlert: true,
    hasResponseDraft: true,
    isCancellable: true,
    vehicle: {
      truckTypeId: "62a0f025-3143-4f84-99d3-a1c5ac1b8658",
      truckTypeName: "Colt Diesel Engkel",
      vehicleImage: "https://picsum.photos/200",
    },
    locations: [
      {
        id: "ee06f46c-fd1d-4e6e-810c-2a1d4eda7391",
        type: "PICKUP",
        sequence: 1,
        fullAddress:
          "Graha Aero, Jl. Kedungdoro 88, Kedungdoro, Kec Tegalsari, Kota Surabaya, Jawa Timur 60261",
        detailAddress: "Rumah dengan pagar hitam",
        coordinates: {
          latitude: -7.2741549,
          longitude: 112.7820621,
        },
        administrativeArea: {
          district: "Mulyorejo",
          city: "Kota Surabaya",
          province: "Jawa Timur",
          postalCode: "60115",
        },
        qrScan: {
          status: "NOT_SCANNED",
          token: null,
          expiryTime: null,
        },
        isActive: true,
        pic: {
          name: "Abe Maulana",
          phoneNumber: "081974012740",
        },
      },
      {
        id: "1e70ee97-04b5-4ee8-beea-963dffd0c126",
        type: "DROPOFF",
        sequence: 1,
        fullAddress:
          "Jalan Perusahaan Raya No.46, Banjararum, Singosari, Malang, Jawa Timur, 65153, Indonesia",
        detailAddress: "Gedung Smoore",
        coordinates: {
          latitude: -7.2925952,
          longitude: 112.7200837,
        },
        administrativeArea: {
          district: "Banjararum",
          city: "Malang",
          province: "Jawa Timur",
          postalCode: "65153",
        },
        qrScan: {
          status: "NOT_SCANNED",
          token: null,
          expiryTime: null,
        },
        isActive: true,
        pic: {
          name: "Julio",
          phoneNumber: "08172094790124",
        },
      },
    ],
    cargo: [
      {
        id: "1085a673-4f31-4a66-ada6-79e5e61fe434",
        name: "Besi Baja",
        weight: 1000,
        weightUnit: "kg",
        length: 1,
        width: 2,
        height: 5,
        dimensionUnit: "cm",
        cargoTypeName: "Cargo Type",
        cargoCategoryName: "Cargo Category",
      },
      {
        id: "74b7ef5c-9732-47c0-9ea7-f327b65028d7",
        name: "Batu Bata",
        weight: 1000,
        weightUnit: "kg",
        length: 1,
        width: 2,
        height: 5,
        dimensionUnit: "cm",
        cargoTypeName: "Cargo Type",
        cargoCategoryName: "Cargo Category",
      },
      {
        id: "29e7018f-b331-4d7e-818d-3bf39ea8ddf2",
        name: "Karet Mentah",
        weight: 500,
        weightUnit: "kg",
        length: 1,
        width: 2,
        height: 5,
        dimensionUnit: "cm",
        cargoTypeName: "Cargo Type",
        cargoCategoryName: "Cargo Category",
      },
    ],
    cargoDescription:
      "tolong kirim muatan dengan hati hati, jangan sampai rusak dan hancur, terimakasih",
    photos: [
      {
        id: "9bd5938f-8445-40ca-84b4-4939a5491256",
        photoUrl:
          "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1752810489324.webp",
        thumbnailUrl:
          "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1752810489324.webp",
        fullSizeUrl:
          "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1752810489324.webp",
        photoType: "MAIN_PHOTO",
        description: null,
        metadata: {
          fileSize: 2048576,
          format: "JPEG",
          dimensions: {
            width: 1920,
            height: 1080,
          },
          uploadedAt: "2025-07-18T03:48:41.962Z",
          uploadedBy: "transporter",
        },
        sequence: 1,
      },
      {
        id: "9bd5938f-8445-40ca-84b4-4939a5491257",
        photoUrl:
          "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1752810489324.webp",
        thumbnailUrl:
          "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1752810489324.webp",
        fullSizeUrl:
          "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1752810489324.webp",
        photoType: "MAIN_PHOTO",
        description: null,
        metadata: {
          fileSize: 2048576,
          format: "JPEG",
          dimensions: {
            width: 1920,
            height: 1080,
          },
          uploadedAt: "2025-07-18T03:48:41.962Z",
          uploadedBy: "transporter",
        },
        sequence: 2,
      },
      {
        id: "9bd5938f-8445-40ca-84b4-4939a5491258",
        photoUrl:
          "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1752810489324.webp",
        thumbnailUrl:
          "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1752810489324.webp",
        fullSizeUrl:
          "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1752810489324.webp",
        photoType: "MAIN_PHOTO",
        description: null,
        metadata: {
          fileSize: 2048576,
          format: "JPEG",
          dimensions: {
            width: 1920,
            height: 1080,
          },
          uploadedAt: "2025-07-18T03:48:41.962Z",
          uploadedBy: "transporter",
        },
        sequence: 3,
      },
      {
        id: "9bd5938f-8445-40ca-84b4-4939a5491259",
        photoUrl:
          "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1752810489324.webp",
        thumbnailUrl:
          "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1752810489324.webp",
        fullSizeUrl:
          "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1752810489324.webp",
        photoType: "MAIN_PHOTO",
        description: null,
        metadata: {
          fileSize: 2048576,
          format: "JPEG",
          dimensions: {
            width: 1920,
            height: 1080,
          },
          uploadedAt: "2025-07-18T03:48:41.962Z",
          uploadedBy: "transporter",
        },
        sequence: 4,
      },
    ],
    deliveryOrders: ["DO-20241023-001", "DO-20241023-002"],
    additionalServices: [
      // {
      //   id: "0f678054-8459-4a36-8b1d-662e8de7580c",
      //   serviceName: "Kirim Berkas",
      // },
      // {
      //   id: "a0f1778f-0ee2-4ec1-8be8-3e7737832fe2",
      //   serviceName: "Bantuan Tambahan",
      // },
    ],
    incomeSummary: {
      totalPrice: 800000,
      transportFee: 800000,
      additionalServiceFee: 100000,
      taxAmount: 100000,
      totalRouteChange: 100000,
    },
    fleet: [
      {
        id: "fleet-001",
        plateNumber: "AE 1111 LBA",
        driverName: "Noel Galagher",
        driverAvatar: "/img/avatar.png",
        vehicleImage: "/img/truck.png",
        hasSOSAlert: true,
        status: "ACTIVE",
        currentStep: 1, // Proses Muat step
        orderStatus: "LOADING", // Status dari order
      },
    ],
    otherStatus,
  },
  Type: "/v1/transporter/orders/dcdaf886-56d6-4d84-89d6-a21ec18d0bc1/detail-summary",
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
