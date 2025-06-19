import { addMinutes } from "date-fns";
import useSWR from "swr";

import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { normalizeDetailPesananOrderDetail } from "@/lib/normalizers/detailpesanan";

/**
 * Notes dari mas friday
 * /orders/{orderId}
 * data status paling atas
 * /orders/{orderId}/status-history
 * buat stepper
 * statusHistoryObject
 *
 * status driver
 * driverStatus object
 *
 */

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
  Message: {
    Code: 200,
    Text: "Order detail retrieved successfully",
  },
  Data: {
    general: {
      orderId: "550e8400-e29b-41d4-a716-446655440000",
      transporterOrderCode: "MT.25.AA.001",
      invoiceNumber: "INV/12345678",
      orderStatus: OrderStatusEnum.UNLOADING,
      orderType: "INSTANT",
      createdAt: "2024-01-01T10:00:00Z",
      updatedAt: "2024-01-01T14:30:00Z",
    },
    summary: {
      distance: 12,
      carrier: {
        carrierId: "uuid-carrier-1",
        name: "Box Container",
        image: "https://example.com/box.jpg",
      },
      truckType: {
        truckTypeId: "uuid-truck-1",
        name: "Medium Truck 4x2 Box",
        image: "https://example.com/truck.jpg",
        totalUnit: 2,
      },
      loadTimeStart: "2025-02-08T09:00:00Z",
      loadTimeEnd: "2025-02-08T12:00:00Z",
      locations: locations,
      isHalalLogistic: true,
      canReview: true,
      isEdit: true,
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
      ],
      payment: {
        paymentMethod: "va_bca",
        paymentDueDateTime: addMinutes(new Date(), 30).toISOString(),
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
        voucherDiscount: 0.0,
        adminFee: 25000.0,
        taxAmount: 125000.0,
        waitingFee: {
          totalAmount: 0.0,
          totalHours: 0,
          isChargeable: false,
        },
        overloadFee: 1000000,
      },
      additionalService: [
        {
          name: "",
          isShipping: true,
          addressInformation: {
            manlok: "sama seperti manlok",
          },
          courier: "JNE",
          courierPrice: 200000,
          insurancePrice: 10000000000000,
        },
      ],
    },
    otherInformation: {
      cargoPhotos: [
        "/img/muatan1.png",
        "/img/muatan2.png",
        "/img/muatan3.png",
        "/img/muatan4.png",
      ],
      cargoDescription:
        "tolong kirim muatan dengan hati hati, jangan sampai rusak dan hancur, terimakasih",
      numberDeliveryOrder: ["DO123456ABCD"],
    },
    changeCount: 0,
    isChangeable: true,
    isCancellable: true,
    cancellationDeadline: "2025-02-06T09:00:00Z",
    hasCancellationPenalty: false,
    drivers: [
      {
        driverId: "uuid-driver-1",
        name: "Ahmad Rahman",
        phoneNumber: "081234567891",
        profileImage: "https://example.com/driver1.jpg",
        driverStatus: "Menuju ke Lokasi Muat",
        licensePlate: "B 1234 CD",
      },
    ],
    documents: {
      doNumber: "DO123456",
      doUrl: "https://example.com/do.pdf",
    },
    businessEntity: {
      isBusinessEntity: true,
      name: "PT Sukses Makmur",
      taxId: "0123456789012345",
    },
    paymentData: {
      paymentId: "uuid-payment-123",
      method: "va_bca",
      vaNumber: "12345678901234567890",
      amount: 1500000.0,
      status: "PENDING",
      expiredAt: "2025-02-08T15:00:00Z",
    },
    config: {
      toleranceHours: 12,
      hourlyRate: 25000.0,
      alertHoursBefore: 1,
    },
    detailWaitingTime: [
      {
        driverId: "uuid",
        name: "hadi",
        licensePlate: "abc",
        startWaitingTime: "raw date",
        endWaitingTime: "raw date",
        waitingTime: 100,
        waitingFee: 100000,
      },
    ],
    detailOverload: [
      {
        driverId: "uuid",
        name: "hadi",
        licensePlate: "abc",
        weight: 2000,
        weightUnit: "ton",
        overloadFee: 100000,
      },
    ],
    alerts: [
      {
        type: "qr",
        date: "raw date",
        label: "Harap tunjukan QR Code ke pihak driver",
        info: "QR Code diperlukan agar driver dapat melanjutkan proses muat atau bongkar barang.",
      },
    ],
  },
};

const apiResultOrderStatusHistory = {
  Message: {
    Code: 200,
    Text: "Order status history retrieved successfully",
  },
  Data: {
    statusHistory: [
      {
        statusHistoryId: "550e8400-e29b-41d4-a716-446655440020",
        statusCode: "CONFIRMED",
        statusName: "Pesanan Terkonfirmasi",
      },
      {
        statusHistoryId: "550e8400-e29b-41d4-a716-446655440021",
        statusCode: "LOADING",
        statusName: "Proses Muat",
      },
      {
        statusHistoryId: "550e8400-e29b-41d4-a716-446655440021",
        statusCode: "UNLOADING",
        statusName: "Proses Bongkar",
      },
      {
        statusHistoryId: "550e8400-e29b-41d4-a716-446655440021",
        statusCode: "COMPLETED",
        statusName: "Selesai",
      },
    ],
    driverStatus: [
      {
        driverId: "550e8400-e29b-41d4-a716-446655440021",
        name: "Ahmad Rahman",
        driverPhoto: "https://picsum.photos/50",
        licensePlate: "B 1234 CD",
        statusDriver: "UNLOADING_1",
        statusTitle: "Menuju Lokasi Bongkar 1",
        stepStatus: [
          {
            statusCode: "LOADING_1",
            statusName: "Menuju Lokasi Muat 1",
          },
          {
            statusCode: "LOADING_2",
            statusName: "Menuju Lokasi Muat 2",
          },
          {
            statusCode: "UNLOADING_1",
            statusName: "Menuju Lokasi Bongkar 1",
          },
        ],
      },
    ],
  },
  Type: "ORDER_STATUS_HISTORY",
};

const apiResultPaymentData = {
  Message: {
    Code: 200,
    Text: "Order detail retrieved successfully",
  },
  Data: {
    payment: {
      paymentId: "uuid-payment-123",
      method: "va_bca",
      vaNumber: "12345678901234567890",
      amount: 1500000.0,
      status: "PENDING",
      expiredAt: addMinutes(new Date(), 30).toISOString(),
    },
  },
  Type: "PAYMENT_ORDER_DETAIL",
};

const fetcher = async (cacheKey) => {
  const orderId = cacheKey.split("/")[1];
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const [dataOrderDetail, dataOrderStatusHistory, dataPayment] =
    await Promise.all([
      apiResultOrderDetail,
      apiResultOrderStatusHistory,
      apiResultPaymentData,
    ]);

  const data = normalizeDetailPesananOrderDetail({
    dataOrderDetail: dataOrderDetail.Data,
    dataOrderStatusHistory: dataOrderStatusHistory.Data,
    dataPayment: dataPayment.Data,
  });

  return data;
};

export const useGetDetailPesananData = (orderId) =>
  useSWR(orderId ? `detailPesanan/${orderId}` : null, fetcher);
