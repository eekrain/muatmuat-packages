import useSWRMutation from "swr/mutation";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false; // toggle mock data

// Mock API result for development/testing
export const mockCreateOrderResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Order created successfully",
    },
    Data: {
      orderId: "550e8400-e29b-41d4-a716-446655440001",
      orderNumber: "ORD-2024-001",
      status: "PENDING_PAYMENT",
      totalAmount: 1195300,
      paymentExpiryTime: "2024-12-31T23:59:59Z",
      paymentUrl:
        "https://payment.muatmuat.com/pay/550e8400-e29b-41d4-a716-446655440001",
      estimatedPickupTime: "2024-01-15T08:00:00Z",
      estimatedDeliveryTime: "2024-01-15T18:00:00Z",
      carrier: {
        carrierId: "carrier-001",
        name: "PT. Logistik Indonesia",
        phone: "+6281234567890",
        email: "info@logistikindonesia.com",
      },
      truck: {
        truckTypeId: "truck-001",
        name: "Box - Colt Diesel Engkel",
        capacity: "3.5 ton",
        dimension: "4.2 x 2.1 x 2.1 m",
      },
      locations: [
        {
          locationId: "loc-001",
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
        },
        {
          locationId: "loc-002",
          locationType: "DROPOFF",
          sequence: 2,
          fullAddress: "Jl. Ahmad Yani No. 123, Gubeng, Surabaya",
          detailAddress: "Gedung Perkantoran Lantai 3",
          latitude: -7.2605519,
          longitude: 112.774403,
          district: "Gubeng",
          city: "Surabaya",
          province: "Jawa Timur",
          postalCode: "60281",
          picName: "Budi Santoso",
          picPhoneNumber: "081234567002",
        },
      ],
      cargo: {
        description: "Barang elektronik dan dokumen penting",
        photos: [
          "https://example.com/photo1.jpg",
          "https://example.com/photo2.jpg",
        ],
        items: [
          {
            namaMuatan: { label: "Elektronik", value: "electronics" },
            beratMuatan: { berat: 500, unit: "kg" },
          },
          {
            namaMuatan: { label: "Dokumen", value: "documents" },
            beratMuatan: { berat: 50, unit: "kg" },
          },
        ],
      },
      businessEntity: {
        isBusinessEntity: false,
        name: "",
        taxId: "",
      },
      paymentMethod: {
        id: "payment-001",
        name: "Transfer Bank BCA",
        icon: "/icons/payment/bca.svg",
      },
      voucher: {
        id: "voucher-001",
        code: "DISKON50K",
        discountAmount: 50000,
      },
      costBreakdown: {
        baseAmount: 950000,
        insuranceFee: 10000,
        additionalServices: 135000,
        adminFee: 10000,
        taxAmount: 0,
        voucherDiscount: 50000,
        totalAmount: 1195300,
      },
    },
    Type: "ORDER_CREATION",
  },
};

/**
 * Create order service
 * API: POST /v1/orders
 */
export const createOrder = async (url, { arg }) => {
  let result;

  if (useMockData) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    result = mockCreateOrderResult;
  } else {
    result = await fetcherMuatrans.post(url, arg);
  }

  return result;
};

/**
 * Hook untuk membuat order
 * @param {string} orderId - Optional order ID for updates
 * @returns {Object} - SWR mutation object
 */
export const useCreateOrder = (orderId = null) => {
  const url = orderId ? `/v1/orders/${orderId}` : "/v1/orders";
  return useSWRMutation(url, createOrder);
};

/**
 * Helper function untuk memformat data order sebelum dikirim ke API
 * @param {Object} formData - Data dari form
 * @param {Object} selectedCarrier - Data carrier yang dipilih
 * @param {Object} selectedTruck - Data truck yang dipilih
 * @param {Object} selectedPaymentMethod - Data payment method yang dipilih
 * @param {Object} selectedVoucher - Data voucher yang dipilih (optional)
 * @returns {Object} - Formatted data untuk API
 */
export const formatOrderData = ({
  formData,
  selectedCarrier,
  selectedTruck,
  selectedPaymentMethod,
  selectedVoucher = null,
}) => {
  const {
    loadTimeStart,
    loadTimeEnd,
    showRangeOption,
    lokasiMuat,
    lokasiBongkar,
    informasiMuatan,
    cargoPhotos,
    cargoDescription,
    truckCount,
    businessEntity,
  } = formData;

  // Format locations
  const locations = [];

  // Add pickup locations
  lokasiMuat.forEach((lokasi, index) => {
    if (lokasi?.dataLokasi) {
      locations.push({
        locationType: "PICKUP",
        sequence: index + 1,
        fullAddress: lokasi.dataLokasi.location.fullAddress,
        detailAddress: lokasi.dataLokasi.location.detailAddress,
        latitude: lokasi.dataLokasi.location.latitude,
        longitude: lokasi.dataLokasi.location.longitude,
        district: lokasi.dataLokasi.location.district,
        city: lokasi.dataLokasi.location.city,
        province: lokasi.dataLokasi.location.province,
        postalCode: lokasi.dataLokasi.location.postalCode,
        picName: lokasi.dataLokasi.picName,
        picPhoneNumber: lokasi.dataLokasi.picPhoneNumber,
      });
    }
  });

  // Add dropoff locations
  lokasiBongkar.forEach((lokasi, index) => {
    if (lokasi?.dataLokasi) {
      locations.push({
        locationType: "DROPOFF",
        sequence: locations.length + index + 1,
        fullAddress: lokasi.dataLokasi.location.fullAddress,
        detailAddress: lokasi.dataLokasi.location.detailAddress,
        latitude: lokasi.dataLokasi.location.latitude,
        longitude: lokasi.dataLokasi.location.longitude,
        district: lokasi.dataLokasi.location.district,
        city: lokasi.dataLokasi.location.city,
        province: lokasi.dataLokasi.location.province,
        postalCode: lokasi.dataLokasi.location.postalCode,
        picName: lokasi.dataLokasi.picName,
        picPhoneNumber: lokasi.dataLokasi.picPhoneNumber,
      });
    }
  });

  // Format cargo items
  const cargoItems = informasiMuatan.map((item) => ({
    namaMuatan: item.namaMuatan,
    beratMuatan: item.beratMuatan,
  }));

  // Filter uploaded photos
  const uploadedPhotos = cargoPhotos.filter((photo) => photo !== null);

  return {
    // Basic order info
    carrierId: selectedCarrier?.carrierId,
    truckTypeId: selectedTruck?.truckTypeId,
    truckCount,

    // Time information - loadTimeStart and loadTimeEnd are already ISO strings
    loadTimeStart: loadTimeStart || null,
    loadTimeEnd: showRangeOption ? loadTimeEnd || null : null,
    showRangeOption,

    // Location information
    locations,

    // Cargo information
    cargo: {
      description: cargoDescription,
      photos: uploadedPhotos,
      items: cargoItems,
    },

    // Business entity information
    businessEntity: {
      isBusinessEntity: businessEntity.isBusinessEntity,
      name: businessEntity.name || "",
      taxId: businessEntity.taxId || "",
    },

    // Payment information
    paymentMethodId: selectedPaymentMethod?.id,

    // Voucher information (optional)
    voucherId: selectedVoucher?.id || null,

    // Additional services (hardcoded for now based on UI)
    additionalServices: [
      {
        name: "Kirim Bukti Fisik Penerimaan Barang",
        price: 35000,
        isSelected: true,
      },
      {
        name: "Bantuan Tambahan",
        price: 100000,
        isSelected: true,
      },
    ],
  };
};
