import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";
import { ORDER_STATUS } from "@/utils/Transporter/orderStatus";
import { TRACKING_STATUS } from "@/utils/Transporter/trackingStatus";

const useMockData = true;

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
    // orderStatus: "CANCELLED_BY_TRANSPORTER_2",
    orderStatus: "SCHEDULED_FLEET",
    // orderStatus: "WAITING_PAYMENT_2",
    // orderStatus: ORDER_STATUS.DOCUMENT_PREPARATION,
    // orderStatus: ORDER_STATUS.COMPLETED,
    // orderStatus: ORDER_STATUS.LOADING,
    // orderStatus: ORDER_STATUS.CANCELLED_BY_TRANSPORTER,
    // orderStatus: "WAITING_PAYMENT_2", // Status dengan angka untuk testing
    // orderStatus: "UNKNOWN_STATUS_3", // Status yang tidak ada di enum untuk testing
    // orderStatus: "CUSTOM_LOADING_1", // Status custom untuk testing
    // orderStatus: ORDER_STATUS.NEED_ASSIGN_FLEET, // Status untuk trigger Assign Armada button
    // orderStatus : ORDER_STATUS.CHANGE_FLEET,
    orderStatusUnit: 1, // Unit untuk testing
    orderType: "SCHEDULED",
    loadTimeStart: "2024-10-03T18:00:00.000Z",
    loadTimeEnd: "2024-10-04T08:00:00.000Z",
    estimatedDistance: 178,
    truckCount: 1,
    hasSOSAlert: true,
    hasResponseDraft: false,
    isCancellable: true, // Pastikan bisa dibatalkan
    isHalalLogistics: true,
    vehicle: {
      truckTypeId: "62a0f025-3143-4f84-99d3-a1c5ac1b8658",
      truckTypeName: "Colt Diesel Engkel",
      carrierName: "Box",
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
        city: "Kota Surabaya",
        province: "Jawa Timur",
        latitude: -7.2741549,
        longitude: 112.7820621,
        picName: "Abe Maulana",
        picPhoneNumber: "081974012740",
      },
      {
        id: "ee06f46c-fd1d-4e6e-810c-2a1d4eda7392",
        type: "DROPOFF",
        sequence: 1,
        fullAddress:
          "Graha Aero, Jl. Kedungdoro 88, Kedungdoro, Kec Tegalsari, Kota Surabaya, Jawa Timur 60261",
        detailAddress: "Rumah dengan pagar hitam",
        city: "Kota Surabaya",
        province: "Jawa Timur",
        latitude: -7.2741549,
        longitude: 112.7820621,
        picName: "Abe Maulana",
        picPhoneNumber: "081974012740",
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
      "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1752810489324.webp",
      "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1752810489324.webp",
    ],
    deliveryOrders: ["DO-20241023-001", "DO-20241023-002"],
    additionalServices: [
      {
        id: "0f678054-8459-4a36-8b1d-662e8de7580c",
        serviceName: "Kirim Berkas",
      },
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
    fleets: [
      {
        id: "fleet-001",
        licensePlate: "AE 1111 LBA",
        vehicleImage: "/img/truck.png",
        truckType: "Colt Diesel Engkel - Box",
        driver: {
          id: "uuid",
          name: "John Doe",
          phoneNumber: "081234567890",
          profileImage: "https://example.com/driver1.jpg",
        },
        hasSOSAlert: true,
        currentStatus: TRACKING_STATUS.LOADING,
        milestones: [
          {
            status: TRACKING_STATUS.SCHEDULED,
            statusName: "Armada Dijadwalkan",
            completed: true,
          },
          {
            status: TRACKING_STATUS.LOADING,
            statusName: "Proses Muat",
            completed: true,
          },
          {
            status: TRACKING_STATUS.UNLOADING,
            statusName: "Proses Bongkar",
            completed: false,
          },
          {
            status: TRACKING_STATUS.DOCUMENT_PREPARATION,
            statusName: "Dokumen Sedang Disiapkan",
            completed: false,
          },
          {
            status: TRACKING_STATUS.DOCUMENT_DELIVERY,
            statusName: "Proses Pengiriman Dokumen",
            completed: false,
          },
          {
            status: TRACKING_STATUS.COMPLETED,
            statusName: "Selesai",
            completed: false,
          },
        ],
        // Data untuk armada pengganti (jika ada)
        replacementFleet: null,
        // Data untuk driver pengganti (jika ada)
        replacementDriver: null,
        // Status perubahan armada
        fleetChangeStatus: null, // "PENDING", "APPROVED", "REJECTED", "COMPLETED"
      },
      {
        id: "fleet-002",
        licensePlate: "AE 2222 LBA",
        vehicleImage: "/img/truck.png",
        truckType: "Colt Diesel Engkel - Box",
        driver: {
          id: "uuid-2",
          name: "Jane Smith",
          phoneNumber: "081234567891",
          profileImage: "https://example.com/driver2.jpg",
        },
        hasSOSAlert: false,
        currentStatus: "CUSTOM_MENUJU_KE_LOKASI_BONGKAR_2", // Status custom untuk testing
        milestones: [
          {
            status: TRACKING_STATUS.SCHEDULED,
            statusName: "Armada Dijadwalkan",
            completed: true,
          },
          {
            status: TRACKING_STATUS.LOADING,
            statusName: "Proses Muat",
            completed: true,
          },
          {
            status: TRACKING_STATUS.IN_TRANSIT, // Status dengan angka
            statusName: "Menuju ke Lokasi Bongkar",
            completed: true,
          },
          {
            status: TRACKING_STATUS.UNLOADING,
            statusName: "Proses Bongkar",
            completed: false,
          },
          {
            status: TRACKING_STATUS.DOCUMENT_PREPARATION,
            statusName: "Dokumen Sedang Disiapkan",
            completed: false,
          },
          {
            status: TRACKING_STATUS.DOCUMENT_DELIVERY,
            statusName: "Proses Pengiriman Dokumen",
            completed: false,
          },
          {
            status: TRACKING_STATUS.COMPLETED,
            statusName: "Selesai",
            completed: false,
          },
        ],
        // Contoh data armada pengganti
        replacementFleet: {
          id: "fleet-002-replacement",
          licensePlate: "AE 3333 LBA",
          vehicleImage: "/img/truck.png",
          truckType: "Colt Diesel Engkel - Box",
        },
        // Contoh data driver pengganti
        replacementDriver: {
          id: "uuid-3",
          name: "Bob Johnson",
          phoneNumber: "081234567892",
          profileImage: "https://example.com/driver3.jpg",
        },
        // Status perubahan armada
        fleetChangeStatus: "APPROVED", // "PENDING", "APPROVED", "REJECTED", "COMPLETED"
      },
      {
        id: "fleet-003",
        licensePlate: "AE 4444 LBA",
        vehicleImage: "/img/truck.png",
        truckType: "Colt Diesel Engkel - Box",
        driver: {
          id: "uuid-4",
          name: "Alice Brown",
          phoneNumber: "081234567893",
          profileImage: "https://example.com/driver4.jpg",
        },
        hasSOSAlert: false,
        currentStatus: TRACKING_STATUS.SCHEDULED_FLEET,
        milestones: [
          {
            status: TRACKING_STATUS.SCHEDULED,
            statusName: "Armada Dijadwalkan",
            completed: true,
          },
          {
            status: TRACKING_STATUS.LOADING,
            statusName: "Proses Muat",
            completed: false,
          },
          {
            status: TRACKING_STATUS.UNLOADING,
            statusName: "Proses Bongkar",
            completed: false,
          },
          {
            status: TRACKING_STATUS.DOCUMENT_PREPARATION,
            statusName: "Dokumen Sedang Disiapkan",
            completed: false,
          },
          {
            status: TRACKING_STATUS.DOCUMENT_DELIVERY,
            statusName: "Proses Pengiriman Dokumen",
            completed: false,
          },
          {
            status: TRACKING_STATUS.COMPLETED,
            statusName: "Selesai",
            completed: false,
          },
        ],
        // Data untuk armada pengganti (jika ada)
        replacementFleet: null,
        // Data untuk driver pengganti (jika ada)
        replacementDriver: null,
        // Status perubahan armada
        fleetChangeStatus: null,
      },
      {
        id: "fleet-004",
        licensePlate: "AE 5555 LBA",
        vehicleImage: "/img/truck.png",
        truckType: "Colt Diesel Engkel - Box",
        driver: {
          id: "uuid-5",
          name: "Jamie Vardy",
          phoneNumber: "081234567894",
          profileImage: "https://example.com/driver5.jpg",
        },
        hasSOSAlert: false,
        currentStatus: TRACKING_STATUS.MENUJU_KE_LOKASI_MUAT,
        milestones: [
          {
            status: TRACKING_STATUS.SCHEDULED,
            statusName: "Armada Dijadwalkan",
            completed: true,
          },
          {
            status: TRACKING_STATUS.LOADING,
            statusName: "Proses Muat",
            completed: true,
          },
          {
            status: TRACKING_STATUS.UNLOADING,
            statusName: "Proses Bongkar",
            completed: false,
          },
          {
            status: TRACKING_STATUS.DOCUMENT_PREPARATION,
            statusName: "Dokumen Sedang Disiapkan",
            completed: false,
          },
          {
            status: TRACKING_STATUS.DOCUMENT_DELIVERY,
            statusName: "Proses Pengiriman Dokumen",
            completed: false,
          },
          {
            status: TRACKING_STATUS.COMPLETED,
            statusName: "Selesai",
            completed: false,
          },
        ],
        // Data untuk armada pengganti (jika ada)
        replacementFleet: null,
        // Data untuk driver pengganti (jika ada)
        replacementDriver: null,
        // Status perubahan armada
        fleetChangeStatus: null,
      },
      {
        id: "fleet-005",
        licensePlate: "AE 6666 LBA",
        vehicleImage: "/img/truck.png",
        truckType: "Colt Diesel Engkel - Box",
        driver: {
          id: "uuid-6",
          name: "Crossroad",
          phoneNumber: "081234567895",
          profileImage: "https://example.com/driver6.jpg",
        },
        hasSOSAlert: false,
        currentStatus: TRACKING_STATUS.TIBA_DI_LOKASI_MUAT,
        milestones: [
          {
            status: TRACKING_STATUS.SCHEDULED,
            statusName: "Armada Dijadwalkan",
            completed: true,
          },
          {
            status: TRACKING_STATUS.LOADING,
            statusName: "Proses Muat",
            completed: true,
          },
          {
            status: TRACKING_STATUS.UNLOADING,
            statusName: "Proses Bongkar",
            completed: false,
          },
          {
            status: TRACKING_STATUS.DOCUMENT_PREPARATION,
            statusName: "Dokumen Sedang Disiapkan",
            completed: false,
          },
          {
            status: TRACKING_STATUS.DOCUMENT_DELIVERY,
            statusName: "Proses Pengiriman Dokumen",
            completed: false,
          },
          {
            status: TRACKING_STATUS.COMPLETED,
            statusName: "Selesai",
            completed: false,
          },
        ],
        // Data untuk armada pengganti (jika ada)
        replacementFleet: null,
        // Data untuk driver pengganti (jika ada)
        replacementDriver: null,
        // Status perubahan armada
        fleetChangeStatus: null,
      },
      {
        id: "fleet-007",
        licensePlate: "AE 7777 LBA",
        vehicleImage: "/img/truck.png",
        truckType: "Colt Diesel Engkel - Box",
        driver: {
          id: "uuid-7",
          name: "Syule",
          phoneNumber: "081234567896",
          profileImage: "https://example.com/driver7.jpg",
        },
        hasSOSAlert: false,
        currentStatus: TRACKING_STATUS.ANTRI_DI_LOKASI_MUAT,
        milestones: [
          {
            status: TRACKING_STATUS.SCHEDULED,
            statusName: "Armada Dijadwalkan",
            completed: true,
          },
          {
            status: TRACKING_STATUS.LOADING,
            statusName: "Proses Muat",
            completed: true,
          },
          {
            status: TRACKING_STATUS.UNLOADING,
            statusName: "Proses Bongkar",
            completed: false,
          },
          {
            status: TRACKING_STATUS.DOCUMENT_PREPARATION,
            statusName: "Dokumen Sedang Disiapkan",
            completed: false,
          },
          {
            status: TRACKING_STATUS.DOCUMENT_DELIVERY,
            statusName: "Proses Pengiriman Dokumen",
            completed: false,
          },
          {
            status: TRACKING_STATUS.COMPLETED,
            statusName: "Selesai",
            completed: false,
          },
        ],
        // Data untuk armada pengganti (jika ada)
        replacementFleet: null,
        // Data untuk driver pengganti (jika ada)
        replacementDriver: null,
        // Status perubahan armada
        fleetChangeStatus: null,
      },
      {
        id: "fleet-008",
        licensePlate: "AE 8888 LBA",
        vehicleImage: "/img/truck.png",
        truckType: "Colt Diesel Engkel - Box",
        driver: {
          id: "uuid-8",
          name: "Michael Chen",
          phoneNumber: "081234567897",
          profileImage: "https://example.com/driver8.jpg",
        },
        hasSOSAlert: false,
        currentStatus: TRACKING_STATUS.COMPLETED,
        milestones: [
          {
            status: TRACKING_STATUS.SCHEDULED,
            statusName: "Armada Dijadwalkan",
            completed: true,
          },
          {
            status: TRACKING_STATUS.LOADING,
            statusName: "Proses Muat",
            completed: true,
          },
          {
            status: TRACKING_STATUS.UNLOADING,
            statusName: "Proses Bongkar",
            completed: true,
          },
          {
            status: TRACKING_STATUS.DOCUMENT_PREPARATION,
            statusName: "Dokumen Sedang Disiapkan",
            completed: true,
          },
          {
            status: TRACKING_STATUS.DOCUMENT_DELIVERY,
            statusName: "Proses Pengiriman Dokumen",
            completed: true,
          },
          {
            status: TRACKING_STATUS.COMPLETED,
            statusName: "Selesai",
            completed: true,
          },
        ],
        // Data untuk armada pengganti (jika ada)
        replacementFleet: null,
        // Data untuk driver pengganti (jika ada)
        replacementDriver: null,
        // Status perubahan armada
        fleetChangeStatus: "COMPLETED",
      },
      {
        id: "fleet-009",
        licensePlate: "AE 9999 LBA",
        vehicleImage: "/img/truck.png",
        truckType: "Colt Diesel Engkel - Box",
        driver: {
          id: "uuid-9",
          name: "David Wilson",
          phoneNumber: "081234567898",
          profileImage: "https://example.com/driver9.jpg",
        },
        hasSOSAlert: false,
        currentStatus: TRACKING_STATUS.COMPLETED,
        milestones: [
          {
            status: TRACKING_STATUS.SCHEDULED,
            statusName: "Armada Dijadwalkan",
            completed: true,
          },
          {
            status: TRACKING_STATUS.LOADING,
            statusName: "Proses Muat",
            completed: true,
          },
          {
            status: TRACKING_STATUS.UNLOADING,
            statusName: "Proses Bongkar",
            completed: true,
          },
          {
            status: "FLEET_REPLACEMENT_PROCESS",
            statusName: "Proses Pergantian Armada",
            completed: true,
          },
          {
            status: TRACKING_STATUS.COMPLETED,
            statusName: "Selesai",
            completed: true,
          },
        ],
        // Data armada pengganti yang sudah selesai
        replacementFleet: {
          id: "fleet-009-replacement",
          licensePlate: "AE 9900 LBA",
          vehicleImage: "/img/truck.png",
          truckType: "Colt Diesel Engkel - Box",
        },
        // Data driver pengganti
        replacementDriver: {
          id: "uuid-9-replacement",
          name: "Sarah Johnson",
          phoneNumber: "081234567899",
          profileImage: "https://example.com/driver9-replacement.jpg",
        },
        // Status perubahan armada sudah selesai
        fleetChangeStatus: "COMPLETED",
      },
    ],
    otherStatus: [
      {
        orderStatus: ORDER_STATUS.CANCELLED_BY_TRANSPORTER,
        orderStatusUnit: 1,
      },
    ],
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
