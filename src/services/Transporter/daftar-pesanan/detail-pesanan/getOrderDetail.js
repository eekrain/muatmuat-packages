import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";

const useMockData = true;

const otherStatus = [
  {
    status: OrderStatusEnum.UNLOADING,
    count: 1,
    description: "Status tidak diketahui",
  },
  {
    status: OrderStatusEnum.LOADING,
    count: 1,
    description: "Status tidak diketahui",
  },
];

const mockApiResult = {
  Message: {
    Code: 200,
    Text: "OK",
  },
  Data: {
    orderId: "dcdaf886-56d6-4d84-89d6-a21ec18d0bc1",
    orderCode: "MT25AA004",
    invoiceNumber: "INV/MT25AA004",
    orderStatus: "NEED_RESPONSE_CHANGE",
    // orderStatus: "CONFIRMED_ORDER",
    // orderStatus: "CANCELLED_TRANSPORTER",
    // orderStatus: "SCHEDULED_FLEET",
    // orderStatus: "WAITING_PAYMENT_2",
    orderStatusUnit: 1,
    truckCount: 2,
    orderType: "SCHEDULED",
    loadTimeStart: "2025-07-20T10:46:00.000Z",
    // loadTimeEnd: null,
    loadTimeEnd: "2025-07-20T13:46:00.000Z",
    estimatedDistance: 178,
    isHalalLogistics: true,
    hasSOSAlert: false,
    vehicle: {
      truckTypeId: "62a0f025-3143-4f84-99d3-a1c5ac1b8658",
      truckTypeName: "Medium Truk 4 x 2 (Rigid)",
      vehicleImage: "https://picsum.photos/200",
    },
    locations: [
      {
        id: "ee06f46c-fd1d-4e6e-810c-2a1d4eda7391",
        type: "PICKUP",
        sequence: 1,
        // fullAddress:
        //   "Galaxy Mall 2, Mulyorejo, Surabaya, Jawa Timur, Indonesia",
        fullAddress: "Kota Surabaya, Kec. Tegalsari",
        detailAddress:
          "Berikut temuan QC dalam Ronda RC untuk platform Web Desktop dan Responsive",
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
          name: "popo",
          phoneNumber: "081974012740",
        },
      },
      // {
      //   id: "ee06f46c-fd1d-4e6e-810c-2a1d4eda7391",
      //   type: "PICKUP",
      //   sequence: 1,
      //   fullAddress:
      //     "Graha Aero, Jl. Kedungdoro 88, Kedungdoro, Kec Tegalsari, Kota Surabaya, Jawa Timur 60261",
      //   detailAddress:
      //     "Berikut temuan QC dalam Ronda RC untuk platform Web Desktop dan Responsive",
      //   coordinates: {
      //     latitude: -7.2741549,
      //     longitude: 112.7820621,
      //   },
      //   administrativeArea: {
      //     district: "Mulyorejo",
      //     city: "Kota Surabaya",
      //     province: "Jawa Timur",
      //     postalCode: "60115",
      //   },
      //   qrScan: {
      //     status: "NOT_SCANNED",
      //     token: null,
      //     expiryTime: null,
      //   },
      //   isActive: true,
      //   pic: {
      //     name: "Popol",
      //     phoneNumber: "08197203572035",
      //   },
      // },
      {
        id: "1e70ee97-04b5-4ee8-beea-963dffd0c126",
        type: "DROPOFF",
        sequence: 1,
        // fullAddress:
        //   "Ciputra World Surabaya, Jalan Mayjen Sungkono, Gunung Sari, Surabaya, Jawa Timur, Indonesia",
        fullAddress: "Kab. Pasuruan, Kec. Klojen",
        detailAddress:
          "Berikut temuan QC dalam Ronda RC untuk platform Web Desktop dan Responsive",
        coordinates: {
          latitude: -7.2925952,
          longitude: 112.7200837,
        },
        administrativeArea: {
          district: "Gambir",
          city: "Kota Jakarta Pusat",
          province: "Dki Jakarta",
          postalCode: "10160",
        },
        qrScan: {
          status: "NOT_SCANNED",
          token: null,
          expiryTime: null,
        },
        isActive: true,
        pic: {
          name: "pupu",
          phoneNumber: "08172094790124",
        },
      },
      // {
      //   id: "1e70ee97-04b5-4ee8-beea-963dffd0c126",
      //   type: "DROPOFF",
      //   sequence: 1,
      //   fullAddress:
      //     "Jl. Ambengan No.51, Pacar Keling, Kec. Genteng, Surabaya, Jawa Timur 60272",
      //   detailAddress:
      //     "Berikut temuan QC dalam Ronda RC untuk platform Web Desktop dan Responsive",
      //   coordinates: {
      //     latitude: -7.2925952,
      //     longitude: 112.7200837,
      //   },
      //   administrativeArea: {
      //     district: "Gambir",
      //     city: "Kota Jakarta Pusat",
      //     province: "Dki Jakarta",
      //     postalCode: "10160",
      //   },
      //   qrScan: {
      //     status: "NOT_SCANNED",
      //     token: null,
      //     expiryTime: null,
      //   },
      //   isActive: true,
      //   pic: {
      //     name: "Kupa",
      //     phoneNumber: "081720949375034",
      //   },
      // },
      // {
      //   id: "ee06f46c-fd1d-4e6e-810c-2a1d4eda7391",
      //   type: "PICKUP",
      //   sequence: 1,
      //   fullAddress: "Jalan Dinoyo No. 111, Kec. Tegalsari, Kota Surabaya",
      //   detailAddress: "",
      //   coordinates: {
      //     latitude: -7.2741549,
      //     longitude: 112.7820621,
      //   },
      //   administrativeArea: {
      //     district: "Mulyorejo",
      //     city: "Kota Surabaya",
      //     province: "Jawa Timur",
      //     postalCode: "60115",
      //   },
      //   qrScan: {
      //     status: "NOT_SCANNED",
      //     token: null,
      //     expiryTime: null,
      //   },
      //   isActive: true,
      //   pic: {
      //     name: "popo",
      //     phoneNumber: "081974012740",
      //   },
      // },
      // {
      //   id: "023149a5-db7e-4c4f-bd66-7664f27e37cf",
      //   type: "PICKUP",
      //   sequence: 2,
      //   fullAddress: "Jl. Wonorejo II/88, Kec. Wonorejo, Kota Surabaya",
      //   detailAddress: "",
      //   coordinates: {
      //     latitude: -7.267499000000001,
      //     longitude: 112.7700864,
      //   },
      //   administrativeArea: {
      //     district: "Gubeng",
      //     city: "Kota Surabaya",
      //     province: "Jawa Timur",
      //     postalCode: "60285",
      //   },
      //   qrScan: {
      //     status: "NOT_SCANNED",
      //     token: null,
      //     expiryTime: null,
      //   },
      //   isActive: true,
      //   pic: {
      //     name: "pipi",
      //     phoneNumber: "081247091724",
      //   },
      // },
      // {
      //   id: "023149a5-db7e-4c4f-bd66-7664f27e37cf",
      //   type: "PICKUP",
      //   sequence: 3,
      //   fullAddress: "Jl. Raya Sedati Agung No.23, Kec. Sedati, Kota Surabaya",
      //   detailAddress: "",
      //   coordinates: {
      //     latitude: -7.267499000000001,
      //     longitude: 112.7700864,
      //   },
      //   administrativeArea: {
      //     district: "Gubeng",
      //     city: "Kota Surabaya",
      //     province: "Jawa Timur",
      //     postalCode: "60285",
      //   },
      //   qrScan: {
      //     status: "NOT_SCANNED",
      //     token: null,
      //     expiryTime: null,
      //   },
      //   isActive: true,
      //   pic: {
      //     name: "pipi",
      //     phoneNumber: "081247091724",
      //   },
      // },
      {
        id: "023149a5-db7e-4c4f-bd66-7664f27e37cf",
        type: "PICKUP1",
        sequence: 1,
        fullAddress: "Kota Surabaya, Kec. Wonorejo",
        detailAddress: "",
        coordinates: {
          latitude: -7.267499000000001,
          longitude: 112.7700864,
        },
        administrativeArea: {
          district: "Gubeng",
          city: "Kota Surabaya",
          province: "Jawa Timur",
          postalCode: "60285",
        },
        qrScan: {
          status: "NOT_SCANNED",
          token: null,
          expiryTime: null,
        },
        isActive: true,
        pic: {
          name: "pipi",
          phoneNumber: "081247091724",
        },
      },
      {
        id: "023149a5-db7e-4c4f-bd66-7664f27e37cf",
        type: "PICKUP1",
        sequence: 2,
        fullAddress: "Kab. Sidoarjo, Kec. Sedati",
        detailAddress: "",
        coordinates: {
          latitude: -7.267499000000001,
          longitude: 112.7700864,
        },
        administrativeArea: {
          district: "Gubeng",
          city: "Kota Surabaya",
          province: "Jawa Timur",
          postalCode: "60285",
        },
        qrScan: {
          status: "NOT_SCANNED",
          token: null,
          expiryTime: null,
        },
        isActive: true,
        pic: {
          name: "pipi",
          phoneNumber: "081247091724",
        },
      },
      {
        id: "1e70ee97-04b5-4ee8-beea-963dffd0c126",
        type: "DROPOFF1",
        sequence: 1,
        fullAddress: "Kab. Pasuruan, Kec. Klojen",
        detailAddress: "",
        coordinates: {
          latitude: -7.2925952,
          longitude: 112.7200837,
        },
        administrativeArea: {
          district: "Gambir",
          city: "Kota Jakarta Pusat",
          province: "Dki Jakarta",
          postalCode: "10160",
        },
        qrScan: {
          status: "NOT_SCANNED",
          token: null,
          expiryTime: null,
        },
        isActive: true,
        pic: {
          name: "pupu",
          phoneNumber: "08172094790124",
        },
      },
      {
        id: "1e70ee97-04b5-4ee8-beea-963dffd0c126",
        type: "DROPOFF1",
        sequence: 2,
        fullAddress: "Kab. Malang, Kec. Blimbing",
        detailAddress: "",
        coordinates: {
          latitude: -7.2925952,
          longitude: 112.7200837,
        },
        administrativeArea: {
          district: "Gambir",
          city: "Kota Jakarta Pusat",
          province: "Dki Jakarta",
          postalCode: "10160",
        },
        qrScan: {
          status: "NOT_SCANNED",
          token: null,
          expiryTime: null,
        },
        isActive: true,
        pic: {
          name: "pupu",
          phoneNumber: "08172094790124",
        },
      },
      // {
      //   id: "1e70ee97-04b5-4ee8-beea-963dffd0c126",
      //   type: "DROPOFF",
      //   sequence: 2,
      //   fullAddress: "Jalan Raden Intan Kav. 14, Kec. Blimbing, Malang ",
      //   detailAddress: "",
      //   coordinates: {
      //     latitude: -7.2925952,
      //     longitude: 112.7200837,
      //   },
      //   administrativeArea: {
      //     district: "Gambir",
      //     city: "Kota Jakarta Pusat",
      //     province: "Dki Jakarta",
      //     postalCode: "10160",
      //   },
      //   qrScan: {
      //     status: "NOT_SCANNED",
      //     token: null,
      //     expiryTime: null,
      //   },
      //   isActive: true,
      //   pic: {
      //     name: "pupu",
      //     phoneNumber: "08172094790124",
      //   },
      // },
      // {
      //   id: "1e70ee97-04b5-4ee8-beea-963dffd0c126",
      //   type: "DROPOFF",
      //   sequence: 3,
      //   fullAddress: "Jl. Tadulako No.16, Kec. Bunta, Kab. Banggai",
      //   detailAddress: "",
      //   coordinates: {
      //     latitude: -7.2925952,
      //     longitude: 112.7200837,
      //   },
      //   administrativeArea: {
      //     district: "Gambir",
      //     city: "Kota Jakarta Pusat",
      //     province: "Dki Jakarta",
      //     postalCode: "10160",
      //   },
      //   qrScan: {
      //     status: "NOT_SCANNED",
      //     token: null,
      //     expiryTime: null,
      //   },
      //   isActive: true,
      //   pic: {
      //     name: "pupu",
      //     phoneNumber: "08172094790124",
      //   },
      // },
      // {
      //   id: "1e70ee97-04b5-4ee8-beea-963dffd0c126",
      //   type: "DROPOFF",
      //   sequence: 4,
      //   fullAddress:
      //     "Jl. Poros Lagadi - Tondasi, Kec. Tiworo Kepulauan, Kab. Muna Barat, ",
      //   detailAddress: "",
      //   coordinates: {
      //     latitude: -7.2925952,
      //     longitude: 112.7200837,
      //   },
      //   administrativeArea: {
      //     district: "Gambir",
      //     city: "Kota Jakarta Pusat",
      //     province: "Dki Jakarta",
      //     postalCode: "10160",
      //   },
      //   qrScan: {
      //     status: "NOT_SCANNED",
      //     token: null,
      //     expiryTime: null,
      //   },
      //   isActive: true,
      //   pic: {
      //     name: "pupu",
      //     phoneNumber: "08172094790124",
      //   },
      // },
      // {
      //   id: "1e70ee97-04b5-4ee8-beea-963dffd0c126",
      //   type: "DROPOFF",
      //   sequence: 5,
      //   fullAddress:
      //     "Jl. Tumapel No. 38 Singosari, Kec. Singosari, Kab. Malang",
      //   detailAddress: "",
      //   coordinates: {
      //     latitude: -7.2925952,
      //     longitude: 112.7200837,
      //   },
      //   administrativeArea: {
      //     district: "Gambir",
      //     city: "Kota Jakarta Pusat",
      //     province: "Dki Jakarta",
      //     postalCode: "10160",
      //   },
      //   qrScan: {
      //     status: "NOT_SCANNED",
      //     token: null,
      //     expiryTime: null,
      //   },
      //   isActive: true,
      //   pic: {
      //     name: "pupu",
      //     phoneNumber: "08172094790124",
      //   },
      // },
      // {
      //   id: "1e70ee97-04b5-4ee8-beea-963dffd0c126",
      //   type: "DROPOFF",
      //   sequence: 6,
      //   fullAddress:
      //     "Jl. Tumapel No. 38 Singosari, Kec. Singosari, Kab. Malang",
      //   detailAddress: "",
      //   coordinates: {
      //     latitude: -7.2925952,
      //     longitude: 112.7200837,
      //   },
      //   administrativeArea: {
      //     district: "Gambir",
      //     city: "Kota Jakarta Pusat",
      //     province: "Dki Jakarta",
      //     postalCode: "10160",
      //   },
      //   qrScan: {
      //     status: "NOT_SCANNED",
      //     token: null,
      //     expiryTime: null,
      //   },
      //   isActive: true,
      //   pic: {
      //     name: "pupu",
      //     phoneNumber: "08172094790124",
      //   },
      // },
      // {
      //   id: "1e70ee97-04b5-4ee8-beea-963dffd0c126",
      //   type: "DROPOFF",
      //   sequence: 1,
      //   fullAddress:
      //     "Jl. Terusan Kawi No.16 Bareng, Kec. Klojen, Kab. Pasuruan",
      //   detailAddress: "",
      //   coordinates: {
      //     latitude: -7.2925952,
      //     longitude: 112.7200837,
      //   },
      //   administrativeArea: {
      //     district: "Gambir",
      //     city: "Kota Jakarta Pusat",
      //     province: "Dki Jakarta",
      //     postalCode: "10160",
      //   },
      //   qrScan: {
      //     status: "NOT_SCANNED",
      //     token: null,
      //     expiryTime: null,
      //   },
      //   isActive: true,
      //   pic: {
      //     name: "pupu",
      //     phoneNumber: "08172094790124",
      //   },
      // },
    ],
    cargo: [
      {
        id: "1085a673-4f31-4a66-ada6-79e5e61fe434",
        name: "Furniture Kayu",
        weight: 1,
        weightUnit: "ton",
        length: 1,
        width: 1,
        height: 1,
        dimensionUnit: "m",
        cargoTypeName: "Cargo Type",
        cargoCategoryName: "Cargo Category",
      },
      // {
      //   id: "74b7ef5c-9732-47c0-9ea7-f327b65028d7",
      //   name: "Elektronik Rumah Tangga",
      //   weight: 2,
      //   weightUnit: "ton",
      //   length: 1,
      //   width: 1,
      //   height: 1,
      //   dimensionUnit: "m",
      //   cargoTypeName: "Cargo Type",
      //   cargoCategoryName: "Cargo Category",
      // },
      // {
      //   id: "29e7018f-b331-4d7e-818d-3bf39ea8ddf2",
      //   name: "Peralatan dan Kebutuhan Kantor",
      //   weight: 3,
      //   weightUnit: "ton",
      //   length: 1,
      //   width: 1,
      //   height: 1,
      //   dimensionUnit: "m",
      //   cargoTypeName: "Cargo Type",
      //   cargoCategoryName: "Cargo Category",
      // },
    ],
    cargoDescription:
      "Berikut temuan QC dalam Ronda RC untuk platform Web Desktop dan Responsive , mohon dapat difix.",
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
      // {
      //   id: "9bd5938f-8445-40ca-84b4-4939a5491256",
      //   photoUrl:
      //     "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1752810489324.webp",
      //   thumbnailUrl:
      //     "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1752810489324.webp",
      //   fullSizeUrl:
      //     "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1752810489324.webp",
      //   photoType: "MAIN_PHOTO",
      //   description: null,
      //   metadata: {
      //     fileSize: 2048576,
      //     format: "JPEG",
      //     dimensions: {
      //       width: 1920,
      //       height: 1080,
      //     },
      //     uploadedAt: "2025-07-18T03:48:41.962Z",
      //     uploadedBy: "transporter",
      //   },
      //   sequence: 2,
      // },
      // {
      //   id: "9bd5938f-8445-40ca-84b4-4939a5491256",
      //   photoUrl:
      //     "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1752810489324.webp",
      //   thumbnailUrl:
      //     "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1752810489324.webp",
      //   fullSizeUrl:
      //     "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1752810489324.webp",
      //   photoType: "MAIN_PHOTO",
      //   description: null,
      //   metadata: {
      //     fileSize: 2048576,
      //     format: "JPEG",
      //     dimensions: {
      //       width: 1920,
      //       height: 1080,
      //     },
      //     uploadedAt: "2025-07-18T03:48:41.962Z",
      //     uploadedBy: "transporter",
      //   },
      //   sequence: 3,
      // },
      // {
      //   id: "9bd5938f-8445-40ca-84b4-4939a5491256",
      //   photoUrl:
      //     "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1752810489324.webp",
      //   thumbnailUrl:
      //     "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1752810489324.webp",
      //   fullSizeUrl:
      //     "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1752810489324.webp",
      //   photoType: "MAIN_PHOTO",
      //   description: null,
      //   metadata: {
      //     fileSize: 2048576,
      //     format: "JPEG",
      //     dimensions: {
      //       width: 1920,
      //       height: 1080,
      //     },
      //     uploadedAt: "2025-07-18T03:48:41.962Z",
      //     uploadedBy: "transporter",
      //   },
      //   sequence: 4,
      // },
    ],
    additionalServices: [
      {
        id: "0f678054-8459-4a36-8b1d-662e8de7580c",
        serviceName: "Kirim Berkas",
      },
      {
        id: "a0f1778f-0ee2-4ec1-8be8-3e7737832fe2",
        serviceName: "Bantuan Tambahan",
      },
    ],
    incomeSummary: {
      totalPrice: 800000,
      transportFee: 800000,
      additionalServiceFee: 100000,
      taxAmount: 100000,
      totalRouteChange: 100000,
    },
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
