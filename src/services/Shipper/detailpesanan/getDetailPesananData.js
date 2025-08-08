import { addMinutes } from "date-fns";
import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";
import {
  OrderStatusEnum,
  OrderTypeEnum,
} from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { normalizeDetailPesananOrderDetail } from "@/lib/normalizers/detailpesanan";

import { getAdditionalServices } from "./getAdditionalServices";
import { getCancellationHistory } from "./getCancellationHistory";
import { getOrderAlerts } from "./getOrderAlerts";
import { getOrderDriverReviews } from "./getOrderDriverReviews";
import { getOrderPaymentData } from "./getOrderPaymentData";
import { getOrderStatusHistory } from "./getOrderStatusHistory";
import { getStatusLegend } from "./getStatusLegend";

const useMockData = false; // mock detailpesanan

const orderType = OrderTypeEnum.SCHEDULED;
const orderStatus = OrderStatusEnum.CANCELED_BY_SHIPPER;
const totalUnit = 3;
const unitFleetStatus = 3;

// Menentukan bisa nggaknya buat ubah pesanan
const isChangeable = true;
// Menentukan bisa nggaknya buat batalkan pesanan
const isCancellable = true;
// Menentukan bisa nggaknya buat ngasih review
const canReview = false;

const priceCharge = {
  waitingFee: {
    totalAmount: 100000,
    totalDriver: 3,
  },
  overloadFee: {
    totalAmount: 0,
    totalWeight: 0,
    weightUnit: "kg",
  },
  adminFee: 10000,
  totalCharge: 0,
  isPaid: false,
};

const priceChange = {
  additionalCost: 550000,
  penaltyFee: 50000,
  adminFee: 10000,
  taxAmount: -6000,
  totalAdjustment: 0,
  requiresPayment: true,
};

const otherStatus = [
  // {
  //   orderStatus: OrderStatusEnum.WAITING_REPAYMENT_1,
  //   orderTitle: "Proses Muat",
  //   unitFleetStatus: 2,
  // },
  // {
  //   orderStatus: OrderStatusEnum.PREPARE_DOCUMENT,
  //   orderTitle: "Proses Muat",
  //   unitFleetStatus: 1,
  // },
];

const locations = [
  {
    locationId: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    locationType: "PICKUP",
    sequence: 1,
    fullAddress:
      "Jl. Diponegoro No. 45, Gunungsari, Kecamatan Gubeng, Surabaya",
    detailAddress: "Depan Toko Bunga Gunungsari",
    latitude: -7.2621277,
    longitude: 112.732285,
    district: "Gubeng",
    city: "Surabaya",
    province: "Jawa Timur",
    postalCode: "60281",
    picName: "Agus Raharjo",
    picPhoneNumber: "081234567001",
    scanStatus: "NOT_SCANNED",
  },
  {
    locationId: "b2c3d4e5-f6a7-8901-2345-67890abcdef0",
    locationType: "PICKUP",
    sequence: 2,
    fullAddress:
      "Jl. Darmo Permai I Blok B No.12, Darmo, Kecamatan Wonokromo, Surabaya",
    detailAddress: "Ruko Darmo Permai I",
    latitude: -7.268437819882224,
    longitude: 112.71189655905856,
    district: "Wonokromo",
    city: "Surabaya",
    province: "Jawa Timur",
    postalCode: "60245",
    picName: "Siti Nurhaliza",
    picPhoneNumber: "081234567892",
    scanStatus: "NOT_SCANNED",
  },
  {
    locationId: "c3d4e5f6-a7b8-9012-3456-7890abcdef01",
    locationType: "DROPOFF",
    sequence: 1,
    fullAddress:
      "Jl. A. Yani No.288, Lidah Kulon, Kecamatan Lakarsantri, Surabaya",
    detailAddress: "Samping Mini Market",
    latitude: -7.2944778591070145,
    longitude: 112.74362515536576,
    district: "Lakarsantri",
    city: "Surabaya",
    province: "Jawa Timur",
    postalCode: "60214",
    picName: "Rian Santoso",
    picPhoneNumber: "081234567873",
    scanStatus: "NOT_SCANNED",
  },
  {
    locationId: "d4e5f6a7-b8c9-0123-4567-890abcdef012",
    locationType: "DROPOFF",
    sequence: 2,
    fullAddress:
      "Jl. Raya Kupang Indah No.55, Kupang Krajan, Kecamatan Sambikerep, Surabaya",
    detailAddress: "Belakang Stasiun Kupang",
    latitude: -7.282647557095082,
    longitude: 112.77852171161224,
    district: "Sambikerep",
    city: "Surabaya",
    province: "Jawa Timur",
    postalCode: "60216",
    picName: "Dewi Lestari",
    picPhoneNumber: "081234567854",
    scanStatus: "NOT_SCANNED",
  },
];

const apiResultOrderDetail = {
  data: {
    Message: {
      Code: 200,
      Text: "Order detail retrieved successfully",
    },
    Data: {
      isChangeable,
      isCancellable,
      canReview,
      cancellationDeadline: "2025-06-24T15:00:00.000Z",
      hasCancellationPenalty: false,
      general: {
        orderType,
        orderStatus,
        unitFleetStatus,
        orderId: "550e8400-e29b-41d4-a716-446655440000",
        transporterOrderCode: "MT.25.AA.001",
        invoiceNumber: "INV/12345678",
        orderTitle: "Proses Muat",
        createdAt: "2024-01-01T10:00:00Z",
        updatedAt: "2024-01-01T14:30:00Z",
      },
      summary: {
        truckType: {
          totalUnit,
          truckTypeId: "f483709a-de4c-4541-b29e-6f4d9a912331",
          name: "Cold Diesel Double",
          image: "https://picsum.photos/300/300",
        },
        distance: 4.9,
        carrier: {
          carrierId: "f483709a-de4c-4541-b29e-6f4d9a912331",
          name: "Box",
          image: "https://picsum.photos/300/300",
        },
        loadTimeStart: "2025-02-08T09:00:00Z",
        loadTimeEnd: "2025-02-08T12:00:00Z",
        locations: locations,
        isHalalLogistic: true,
        isEdit: false,
        cargo: [
          {
            cargoId: "550e8400-e29b-41d4-a716-446655440004",
            cargoTypeName: "Elektronik",
            cargoCategoryName: "Peralatan",
            name: "Electronics",
            weight: 500.0,
            weightUnit: "kg",
            dimensions: {
              length: 2.0,
              width: 1.0,
              height: 1.5,
              unit: "m",
            },
            sequence: 1,
          },

          {
            cargoId: "550e8400-e29b-41d4-a716-446655440005",
            cargoTypeName: "Elektronik",
            cargoCategoryName: "Peralatan",
            name: "Alat Rumah Tangga",
            weight: 500.0,
            weightUnit: "kg",
            dimensions: {
              length: 2.0,
              width: 1.0,
              height: 1.5,
              unit: "m",
            },
            sequence: 1,
          },

          {
            cargoId: "550e8400-e29b-41d4-a716-446655440006",
            cargoTypeName: "Elektronik",
            cargoCategoryName: "Peralatan",
            name: "Furniture",
            weight: 500.0,
            weightUnit: "kg",
            dimensions: {
              length: 2.0,
              width: 1.0,
              height: 1.5,
              unit: "m",
            },
            sequence: 1,
          },
        ],
        payment: {
          paymentMethod: "BCA Virtual Account",
          paymentDueDateTime: addMinutes(new Date(), 90).toISOString(),
          paymentLogo:
            "https://azlogistik.s3.ap-southeast-3.amazonaws.com/dev/file-1736740281046.webp",
        },
        price: {
          totalPrice: 1500000.0,
          transportFee: 1200000.0,
          insuranceFee: 50000.0,
          additionalServiceFee: [
            {
              name: "",
              price: 100000,
            },
          ],
          voucherDiscount: 150000,
          adminFee: 25000.0,
          taxAmount: 125000.0,
          waitingFee: {
            totalAmount: 0.0,
            totalHours: 0,
            isChargeable: false,
          },
          overloadFee: 100000,
        },
        priceChange,
        priceCharge,
      },

      otherInformation: {
        cargoPhotos: [
          "https://azlogistik.s3.ap-southeast-3.amazonaws.com/dev/file-1736911995414.webp",
          "https://azlogistik.s3.ap-southeast-3.amazonaws.com/dev/file-1738636779700.webp",
        ],
        cargoDescription: "ALAT BERAT SEMUA",
        numberDeliveryOrder: ["DO123456", "DO123457"],
      },
      changeCount: 0,
      drivers: [],
      documents: {
        doNumber: "",
        doUrl: "",
      },
      businessEntity: {
        isBusinessEntity: true,
        name: "PT Sari Agung",
        taxId: "123456789012345",
      },
      config: {
        toleranceHours: 12,
        hourlyRate: 0,
      },
      pendingChanges: {
        hasPendingChanges: false,
      },

      otherStatus,
    },
    Type: "/v1/orders/550e8400-e29b-41d4-a716-446655440000",
  },
};

export const getOrderDetail = async (cacheKey) => {
  const orderId = cacheKey.split("/")[1];

  let result;

  if (useMockData) {
    result = apiResultOrderDetail;
  } else {
    result = await fetcherMuatrans.get(`v1/orders/${orderId}`);
  }

  return result?.data?.Data;
};

export const useGetOrderDetail = (orderId) =>
  useSWR(`order-detail/${orderId}`, getOrderDetail);

const getDetailPesananData = async (cacheKey) => {
  // const orderId = cacheKey.split("/")[1];

  try {
    const [
      dataOrderDetail,
      dataOrderStatusHistory,
      dataPayment,
      dataAdditionalServices,
      dataAlerts,
      dataCancellationHistory,
      dataLegendStatus,
      dataReview,
    ] = await Promise.all([
      getOrderDetail(cacheKey),
      getOrderStatusHistory(cacheKey),
      getOrderPaymentData(cacheKey),
      getAdditionalServices(cacheKey),
      getOrderAlerts(cacheKey),
      getCancellationHistory(cacheKey),
      getStatusLegend(cacheKey),
      getOrderDriverReviews(cacheKey),
    ]);

    const data = normalizeDetailPesananOrderDetail({
      dataOrderDetail,
      dataOrderStatusHistory,
      dataPayment,
      dataAlerts,
      dataAdditionalServices,
      dataCancellationHistory,
      dataLegendStatus,
      dataReview,
    });

    return data;
  } catch (error) {
    // Log the error for debugging purposes
    // eslint-disable-next-line no-console
    console.error("Error fetching detail pesanan data:", error);

    // IMPORTANT: Re-throw the error so SWR can catch it
    // and populate its `error` state.
    throw error;
  }
};

export const useGetDetailPesananData = (orderId) =>
  useSWR(`detailPesanan/${orderId}`, getDetailPesananData);
