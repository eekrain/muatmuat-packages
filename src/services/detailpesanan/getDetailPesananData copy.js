import { add } from "date-fns";
import useSWR from "swr";

import {
  FleetSearchStatusEnum,
  PaymentStatusEnum,
} from "@/lib/constants/detailpesanan/detailpesanan.enum";
import {
  normalizeDetailPesananFleetSearchDetail,
  normalizeDetailPesananOrderDetail,
} from "@/lib/normalizers/detailpesanan";

const apiFleetResultSearchStatus = {
  orderId: "550e8400-e29b-41d4-a716-446655440090",
  // Kalo mau coba bisa ganti ke FOUND atau SEARCHING
  // Ini akan menentukan tampilan di web
  fleetSearchStatus: FleetSearchStatusEnum.SEARCHING,
  searchStartedAt: "2025-05-21T12:30:00+07:00",
  searchDurationMinutes: 15,
  maxSearchDurationMinutes: 30,
  shouldShowPopup: true,
  popupSettings: {
    intervalMinutes: 5,
    lastShownAt: "2025-05-21T12:35:00+07:00",
    nextShowAt: "2025-05-21T12:40:00+07:00",
  },
  confirmationRequired: true,
};

const locations = [
  {
    locationType: "PICKUP",
    sequence: 1,
    fullAddress:
      "Jl. Diponegoro No. 45, Gunungsari, Kecamatan Gubeng, Surabaya",
    detailAddress: "Depan Toko Bunga Gunungsari",
    latitude: -7.2621277,
    longitude: 112.732285,
    district: "Gubeng",
    districtId: 101,
    city: "Surabaya",
    cityId: 357,
    province: "Jawa Timur",
    provinceId: 15,
    postalCode: "60281",
    picName: "Agus Raharjo",
    picPhoneNumber: "081234567001",
  },
  {
    locationType: "PICKUP",
    sequence: 2,
    fullAddress:
      "Jl. Darmo Permai I Blok B No.12, Darmo, Kecamatan Wonokromo, Surabaya",
    detailAddress: "Ruko Darmo Permai I",
    latitude: -7.268437819882224,
    longitude: 112.71189655905856,
    district: "Wonokromo",
    districtId: 102,
    city: "Surabaya",
    cityId: 357,
    province: "Jawa Timur",
    provinceId: 15,
    postalCode: "60245",
    picName: "Siti Nurhaliza",
    picPhoneNumber: "081234567892",
  },
  {
    locationType: "DROPOFF",
    sequence: 1,
    fullAddress:
      "Jl. A. Yani No.288, Lidah Kulon, Kecamatan Lakarsantri, Surabaya",
    detailAddress: "Samping Mini Market",
    latitude: -7.2944778591070145,
    longitude: 112.74362515536576,
    district: "Lakarsantri",
    districtId: 103,
    city: "Surabaya",
    cityId: 357,
    province: "Jawa Timur",
    provinceId: 15,
    postalCode: "60214",
    picName: "Rian Santoso",
    picPhoneNumber: "081234567873",
  },
  {
    locationType: "DROPOFF",
    sequence: 2,
    fullAddress:
      "Jl. Raya Kupang Indah No.55, Kupang Krajan, Kecamatan Sambikerep, Surabaya",
    detailAddress: "Belakang Stasiun Kupang",
    latitude: -7.282647557095082,
    longitude: 112.77852171161224,
    district: "Sambikerep",
    districtId: 104,
    city: "Surabaya",
    cityId: 357,
    province: "Jawa Timur",
    provinceId: 15,
    postalCode: "60216",
    picName: "Dewi Lestari",
    picPhoneNumber: "081234567854",
  },
];

const apiResultFleetSearchDetail = {
  orderId: "550e8400-e29b-41d4-a716-446655440090",
  orderCode: "MT25AA001",
  encryptedCode: "A1B",
  orderStatus: "SEARCHING_FLEET",
  fleetSearchStatus: "SEARCHING",
  orderType: "INSTANT",
  summary: {
    loadTimeStart: "2025-05-22T09:00:00+07:00",
    loadTimeEnd: "2025-05-22T14:00:00+07:00",
    estimatedDistance: 75.5,
    estimatedDistanceUnit: "km",
    estimatedTime: 60,
    isHalalLogistics: true,
    truckCount: 1,
  },
  locations: locations,
  cargos: [
    {
      cargoId: "550e8400-e29b-41d4-a716-446655440040",
      name: "Perlengkapan Rumah Tangga",
      weight: 1000,
      weightUnit: "kg",
      length: 50,
      width: 10,
      height: 5,
      dimensionUnit: "m",
      sequence: 1,
    },
    {
      cargoId: "550e8400-e29b-41d4-a716-446655440041",
      name: "Peralatan dan Kebutuhan Kantor",
      weight: 120,
      weightUnit: "kg",
      length: 20,
      width: 8,
      height: 5,
      dimensionUnit: "m",
      sequence: 2,
    },
    {
      cargoId: "550e8400-e29b-41d4-a716-446655440042",
      name: "Elektronik dan Aksesoris",
      weight: 100,
      weightUnit: "kg",
      length: 20,
      width: 8,
      height: 5,
      dimensionUnit: "m",
      sequence: 3,
    },
    {
      cargoId: "550e8400-e29b-41d4-a716-446655440043",
      name: "Alat Kebersihan dan Higienitas",
      weight: 100,
      weightUnit: "kg",
      length: 20,
      width: 8,
      height: 5,
    },
  ],
  cargoPhotos: [
    {
      photoId: "550e8400-e29b-41d4-a716-446655440050",
      photoUrl: "/img/muatan1.png",
      photoType: "MAIN_PHOTO",
      photoSequence: 1,
    },
    {
      photoId: "550e8400-e29b-41d4-a716-446655440051",
      photoUrl: "/img/muatan2.png",
      photoSequence: 2,
    },
    {
      photoId: "550e8400-e29b-41d4-a716-446655440052",
      photoUrl: "/img/muatan3.png",
      photoSequence: 3,
    },
    {
      photoId: "550e8400-e29b-41d4-a716-446655440053",
      photoUrl: "/img/muatan4.png",
      photoSequence: 4,
    },
  ],
  vehicle: {
    carrierId: "550e8400-e29b-41d4-a716-446655440051",
    carrierName: "Box",
    truckTypeId: "550e8400-e29b-41d4-a716-446655440052",
    truckTypeName: "CDE Engkel",
    headTruckId: "550e8400-e29b-41d4-a716-446655440053",
    headTruckName: "Medium Truck 4x2",
    carrierTruckId: "550e8400-e29b-41d4-a716-446655440054",
    carrierTruckName: "Box Tertutup",
    maxWeight: 2000,
    weightUnit: "kg",
    dimensions: {
      length: 4.3,
      width: 1.8,
      height: 1.8,
      dimensionUnit: "m",
    },
  },
  additionalServices: [
    {
      serviceId: "550e8400-e29b-41d4-a716-446655440055",
      name: "Kirim Bukti Fisik Penerimaan Barang",
      price: 25000,
      documentShipping: {
        recipientName: "John Doe",
        recipientPhone: "08123456789",
        destinationAddress: "Jl. Contoh No. 123, Surabaya",
        shippingOption: "SiCepat HALU",
        shippingCost: 25000,
      },
    },
  ],
  paymentMethod: "va_bca",
  paymentDueDateTime: "2025-02-08T15:00:00Z",
  pricing: {
    transportFee: 1500000,
    insuranceFee: 20000,
    additionalServiceFee: 25000,
    voucherDiscount: 0,
    adminFee: 10000,
    taxAmount: 161000,
    totalPrice: 1716000,
  },
  searchInfo: {
    searchStartedAt: "2025-05-21T12:30:00+07:00",
    searchDurationMinutes: 15,
    maxSearchDurationMinutes: 30,
    canBeCancelled: true,
    cancellationDeadline: "2025-05-21T13:00:00+07:00",
  },
  deliveryOrderNumbers: ["DO123456", "DO123457"],
};

const apiResultOrderDetail = {
  orderId: "550e8400-e29b-41d4-a716-446655440000",
  orderCode: "MT25AA001",
  transporterOrderCode: "MT.25.AA.001",
  encryptedCode: "A1B",
  invoiceNumber: "INV/MT25AA001",
  loadTimeStart: "2025-02-08T09:00:00Z",
  loadTimeEnd: "2025-02-08T12:00:00Z",
  orderType: "INSTANT",
  orderStatus: "PENDING_PAYMENT",
  paymentMethod: "va_bca",
  paymentDueDateTime: "2025-02-08T15:00:00Z",
  totalPrice: 1500000.0,
  transportFee: 1200000.0,
  insuranceFee: 50000.0,
  additionalServiceFee: 100000.0,
  voucherDiscount: 0.0,
  adminFee: 25000.0,
  taxAmount: 125000.0,
  cargoDescription: "Elektronik dan peralatan kantor",
  estimatedDistance: 250.5,
  estimatedTime: 120,
  isHalalLogistics: true,
  truckCount: 3,
  changeCount: 0,
  isChangeable: true,
  isCancellable: true,
  cancellationDeadline: "2025-02-06T09:00:00Z",
  hasCancellationPenalty: false,
  carrier: {
    carrierId: "550e8400-e29b-41d4-a716-446655440051",
    name: "Box",
    image: "https://example.com/box.jpg",
  },
  truckType: {
    truckTypeId: "550e8400-e29b-41d4-a716-446655440052",
    name: "CDE Engkel",
    maxWeight: 8000.0,
    weightUnit: "kg",
    length: 6.0,
    width: 2.3,
    height: 2.4,
    dimensionUnit: "m",
    image: "https://example.com/truck.jpg",
  },
  drivers: [
    {
      driverId: "uuid-driver-1",
      name: "Ahmad Rahman",
      phoneNumber: "081234567891",
      profileImage: "https://example.com/driver1.jpg",
      driverStatus: "AVAILABLE",
      licensePlate: "B 1234 CD",
    },
  ],
  locations: locations,
  cargo: [
    {
      cargoId: "550e8400-e29b-41d4-a716-446655440004",
      cargoTypeName: "Elektronik",
      cargoCategoryName: "Peralatan",
      name: "Perlengkapan Rumah Tangga",
      weight: 1000,
      weightUnit: "kg",
      dimensions: {
        length: 50,
        width: 10,
        height: 5,
        unit: "m",
      },
      sequence: 1,
    },
    {
      cargoId: "550e8400-e29b-41d4-a716-446655440041",
      cargoTypeName: "Elektronik",
      cargoCategoryName: "Peralatan",
      name: "Peralatan dan Kebutuhan Kantor",
      weight: 120,
      weightUnit: "kg",
      dimensions: {
        length: 20,
        width: 8,
        height: 5,
        unit: "m",
      },
      sequence: 2,
    },
    {
      cargoId: "550e8400-e29b-41d4-a716-446655440042",
      cargoTypeName: "Elektronik",
      cargoCategoryName: "Aksesoris",
      name: "Elektronik dan Aksesoris",
      weight: 100,
      weightUnit: "kg",
      dimensions: {
        length: 20,
        width: 8,
        height: 5,
        unit: "m",
      },
      sequence: 3,
    },
    {
      cargoId: "550e8400-e29b-41d4-a716-446655440043",
      cargoTypeName: "Elektronik",
      cargoCategoryName: "Aksesoris",
      name: "Alat Kebersihan dan Higienitas",
      weight: 100,
      weightUnit: "kg",
      dimensions: {
        length: 20,
        width: 8,
        height: 5,
        unit: "m",
      },
      sequence: 4,
    },
  ],
  qrCode: {
    isGenerated: true,
    currentLocation: "LOADING_1",
    expiryTime: "2024-01-01T15:00:00Z",
    status: "BELUM_SCAN_DI_LOKASI_MUAT_1",
  },
  waitingFee: {
    totalAmount: 0.0,
    totalHours: 0,
    isChargeable: false,
  },
  tracking: {
    lastLatitude: -6.2088,
    lastLongitude: 106.8456,
    lastLocationUpdate: "2024-01-01T14:30:00Z",
    estimatedArrival: "2024-01-01T16:00:00Z",
  },
  documents: [
    {
      doNumber: "DO123456",
      doUrl: "https://example.com/do.pdf",
    },
  ],
  createdAt: "2024-01-01T10:00:00Z",
  updatedAt: "2024-01-01T14:30:00Z",
};

const apiResultPaymentStatus = {
  paymentId: "uuid-payment-123",
  orderId: "uuid-order-123",
  status: PaymentStatusEnum.PENDING,
  amount: 1500000.0,
  paidAt: add(new Date(), { hours: 1 }).toISOString(),
  paymentMethod: "va_bca",
  vaNumber: "12345678901234567890",
  transactionId: "TXN-BCA-123456789",
  bankReference: "REF-BCA-987654321",
};

const apiResultPaymentInstruction = {
  paymentId: "uuid-payment-123",
  method: "va_bca",
  vaNumber: "12345678901234567890",
  amount: 1500000.0,
  status: PaymentStatusEnum.PENDING,
  expiredAt: "2025-02-08T15:00:00Z",
  paymentInstructions: {
    atm: [
      "Masukkan kartu ATM dan PIN Anda",
      "Pilih menu Transfer",
      "Pilih Transfer ke Bank BCA",
      "Masukkan nomor Virtual Account: 12345678901234567890",
      "Masukkan nominal: Rp 1.500.000",
      "Konfirmasi transaksi",
    ],
    internetBanking: [
      "Login ke Internet Banking BCA",
      "Pilih menu Transfer Dana",
      "Pilih Transfer ke BCA Virtual Account",
      "Masukkan nomor Virtual Account: 12345678901234567890",
      "Masukkan nominal: Rp 1.500.000",
      "Konfirmasi transaksi",
    ],
    mobileBanking: [
      "Buka aplikasi BCA Mobile",
      "Pilih menu Transfer",
      "Pilih BCA Virtual Account",
      "Masukkan nomor Virtual Account: 12345678901234567890",
      "Masukkan nominal: Rp 1.500.000",
      "Konfirmasi transaksi",
    ],
    bankOffice: [
      "Datang ke kantor Bank BCA terdekat",
      "Isi slip setoran dengan nomor Virtual Account: 12345678901234567890",
      "Serahkan slip dan uang tunai sejumlah Rp 1.500.000 ke teller",
      "Simpan bukti pembayaran",
    ],
  },
};

const apiResultPaymentCountdown = {
  paymentDueDateTime: add(new Date(), { hours: 1 }).toISOString(),
  currentServerTime: new Date().toISOString(),
  remainingTimeSeconds: 16200,
  isExpired: false,
  paymentMethod: "va_bca",
  amount: 1500000.0,
};

const fetcher = async (cacheKey) => {
  const orderId = cacheKey.split("/")[1];
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // TODO: Fetch data searchStatus dari API dengan key orderId
  // Simulasi fetch data dari API
  // Ini kita fetch semua data kaya gini, gegara result API ga standard
  // Contoh di apiResultFleetSearchDetail ga ada data paymentMethod, tapi malah di apiResultOrderDetail ada
  const [
    resultFleetSearchStatus,
    resultFleetSearchDetail,
    resultOrderDetail,
    resultPaymentInstruction,
    resultPaymentCountdown,
    resultPaymentStatus,
  ] = await Promise.all([
    apiFleetResultSearchStatus,
    apiResultFleetSearchDetail,
    apiResultOrderDetail,
    apiResultPaymentInstruction,
    apiResultPaymentCountdown,
    apiResultPaymentStatus,
  ]);

  if (resultFleetSearchStatus.fleetSearchStatus === "SEARCHING") {
    const fleetSearchDetail = normalizeDetailPesananFleetSearchDetail({
      dataFleetSearchDetail: resultFleetSearchDetail,
      dataPaymentStatus: resultPaymentStatus,
      dataPaymentInstruction: resultPaymentInstruction,
    });

    return fleetSearchDetail;
  } else {
    const orderDetail = normalizeDetailPesananOrderDetail({
      dataOrderDetail: resultOrderDetail,
      dataPaymentStatus: resultPaymentStatus,
      dataPaymentCountdown: resultPaymentCountdown,
      dataFleetSearchDetail: resultFleetSearchDetail,
      dataPaymentInstruction: resultPaymentInstruction,
    });
    return orderDetail;
  }
};

export const useGetDetailPesananData = (orderId) =>
  useSWR(orderId ? `detailPesanan/${orderId}` : null, fetcher);
