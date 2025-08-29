import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false;

// Mock API result for development/testing
export const mockAPIResult = {
  Message: {
    Code: 200,
    Text: "OK",
  },
  Data: {
    orders: [
      {
        orderId: "2f8d1b39-ae1c-45c0-a1be-326431d64255",
        invoice: "MT25AA003",
        orderType: "INSTANT",
        loadTimeStart: "2025-07-19T10:09:00.000Z",
        loadTimeEnd: "",
        locations: {
          pickup: [
            {
              sequence: 1,
              fullAddress:
                "Galaxy Mall 2, Mulyorejo, Surabaya, Jawa Timur, Indonesia",
              city: "Kota Surabaya",
            },
          ],
          dropoff: [
            {
              sequence: 1,
              fullAddress:
                "Pakuwon Mall, Jalan Mayjend. Jonosewojo, Babatan, Surabaya, Jawa Timur, Indonesia",
              city: "Kota Surabaya",
            },
          ],
          hasMultiplePickup: false,
          hasMultipleDropoff: false,
        },
        vehicle: {
          carrierName: "Box 40ft",
          truckTypeName: "Tractor Head 4 x 2",
          truckCount: 1,
        },
        statusInfo: [
          {
            statusLabel: "Dibatalkan",
            statusCode: "CANCELED_BY_SHIPPER",
          },
        ],
        totalUnit: 1,
        paymentDeadline: "",
        requiresConfirmation: false,
        isRefundProcessing: false,
        createdAt: "2025-07-18T03:36:07.477Z",
        hasReview: false,
        additionalCost: 211030,
      },
      {
        orderId: "dcdaf886-56d6-4d84-89d6-a21ec18d0bc1",
        invoice: "INV/MT25AA004",
        orderType: "SCHEDULED",
        loadTimeStart: "2025-07-20T10:46:00.000Z",
        loadTimeEnd: "",
        locations: {
          pickup: [
            {
              sequence: 1,
              fullAddress:
                "Galaxy Mall 2, Mulyorejo, Surabaya, Jawa Timur, Indonesia",
              city: "Kota Surabaya",
            },
            {
              sequence: 2,
              fullAddress:
                "Pusat Oleh-oleh Bu Rudy, Jalan Dharmahusada, Mojo, Surabaya, Jawa Timur, Indonesia",
              city: "Kota Surabaya",
            },
          ],
          dropoff: [
            {
              sequence: 1,
              fullAddress:
                "Ciputra World Surabaya, Jalan Mayjen Sungkono, Gunung Sari, Surabaya, Jawa Timur, Indonesia",
              city: "Kota Jakarta Pusat",
            },
          ],
          hasMultiplePickup: true,
          hasMultipleDropoff: false,
        },
        vehicle: {
          carrierName: "Bak Terbuka",
          truckTypeName: "Medium Truk 4 x 2 (Rigid)",
          truckCount: 1,
        },
        statusInfo: [
          {
            statusLabel: "Menunggu Pembayaran",
            statusCode: "WAITING_PAYMENT_2",
          },
        ],
        totalUnit: 1,
        paymentDeadline: "2025-07-19T03:48:42.031Z",
        requiresConfirmation: true,
        isRefundProcessing: false,
        createdAt: "2025-07-18T03:48:41.947Z",
        hasReview: false,
        additionalCost: 200000,
      },
      {
        orderId: "661e5850-d7fa-482a-ab9e-b76c15e66998",
        invoice: "INV/MT25AA032",
        orderType: "SCHEDULED",
        loadTimeStart: "2025-07-20T14:17:00.000Z",
        loadTimeEnd: "2025-07-20T18:17:00.000Z",
        locations: {
          pickup: [
            {
              sequence: 1,
              fullAddress:
                "DKV ISTTS, Jalan Ngagel Jaya Tengah, Baratajaya, Surabaya, Jawa Timur, Indonesia",
              city: "Kota Surabaya",
            },
            {
              sequence: 2,
              fullAddress:
                "Universitas Kristen Petra, Jalan Siwalankerto, Siwalankerto, Surabaya, Jawa Timur, Indonesia",
              city: "Kota Surabaya",
            },
            {
              sequence: 3,
              fullAddress:
                "Widya Mandala Catholic University, Campus Dinoyo, Jalan Dinoyo, Keputran, Surabaya, Jawa Timur, Indonesia",
              city: "Kota Surabaya",
            },
          ],
          dropoff: [
            {
              sequence: 1,
              fullAddress:
                "Galaxy Mall 2, Mulyorejo, Surabaya, Jawa Timur, Indonesia",
              city: "Kota Surabaya",
            },
            {
              sequence: 2,
              fullAddress:
                "Pakuwon City Mall 3 and Bella Apartment, Jl. Mutiara I No, RT.000/RW.00, Kejawaan Putih Tamba, Surabaya, Jawa Timur, Indonesia",
              city: "Surabaya",
            },
            {
              sequence: 3,
              fullAddress:
                "Atlas Sports Club, Jalan Dharmahusada Indah Barat III, Mojo, Surabaya, Jawa Timur, Indonesia",
              city: "Kota Surabaya",
            },
          ],
          hasMultiplePickup: true,
          hasMultipleDropoff: true,
        },
        vehicle: {
          carrierName: "Bak Terbuka",
          truckTypeName: "Medium Truk 4 x 2 (Rigid)",
          truckCount: 1,
        },
        statusInfo: [
          {
            statusLabel: "Menunggu Pembayaran",
            statusCode: "WAITING_PAYMENT_2",
          },
        ],
        totalUnit: 1,
        paymentDeadline: "2025-07-19T07:25:47.084Z",
        requiresConfirmation: true,
        isRefundProcessing: false,
        createdAt: "2025-07-18T07:25:46.962Z",
        hasReview: false,
        additionalCost: 207000,
      },
      {
        orderId: "c649ee80-8941-41ef-a753-777c329972bc",
        invoice: "MT25AA088",
        orderType: "INSTANT",
        loadTimeStart: "2025-07-22T16:31:00.000Z",
        loadTimeEnd: "2025-07-22T18:34:00.000Z",
        locations: {
          pickup: [
            {
              sequence: 1,
              fullAddress:
                "Galaxy Mall 2, Mulyorejo, Surabaya, Jawa Timur, Indonesia",
              city: "Kota Surabaya",
            },
          ],
          dropoff: [
            {
              sequence: 1,
              fullAddress:
                "Pakuwon Mall, Jalan Mayjend. Jonosewojo, Babatan, Surabaya, Jawa Timur, Indonesia",
              city: "Kota Surabaya",
            },
          ],
          hasMultiplePickup: false,
          hasMultipleDropoff: false,
        },
        vehicle: {
          carrierName: "Box 40ft",
          truckTypeName: "Tractor Head 4 x 2",
          truckCount: 1,
        },
        statusInfo: [
          {
            statusLabel: "Mempersiapkan Armada",
            statusCode: "PREPARE_FLEET",
          },
        ],
        totalUnit: 1,
        paymentDeadline: "",
        requiresConfirmation: false,
        isRefundProcessing: false,
        createdAt: "2025-07-21T09:36:41.983Z",
        hasReview: false,
        additionalCost: 207000,
      },
      {
        orderId: "1c2a62bc-d4ba-46d6-91ff-ecb9c3eab2b3",
        invoice: "INV/MT25AA085",
        orderType: "SCHEDULED",
        loadTimeStart: "2025-07-23T13:35:00.000Z",
        loadTimeEnd: "2025-07-23T16:43:00.000Z",
        locations: {
          pickup: [
            {
              sequence: 1,
              fullAddress:
                "Galaxy Mall 2, Mulyorejo, Surabaya, Jawa Timur, Indonesia",
              city: "Kota Surabaya",
            },
          ],
          dropoff: [
            {
              sequence: 1,
              fullAddress:
                "Pakuwon Mall, Jalan Mayjend. Jonosewojo, Babatan, Surabaya, Jawa Timur, Indonesia",
              city: "Kota Surabaya",
            },
          ],
          hasMultiplePickup: false,
          hasMultipleDropoff: false,
        },
        vehicle: {
          carrierName: "Bak Terbuka",
          truckTypeName: "Medium Truk 4 x 2 (Rigid)",
          truckCount: 4,
        },
        statusInfo: [
          {
            statusLabel: "Menunggu Pembayaran",
            statusCode: "WAITING_PAYMENT_2",
          },
        ],
        totalUnit: 4,
        paymentDeadline: "2025-07-22T03:46:11.302Z",
        requiresConfirmation: true,
        isRefundProcessing: false,
        createdAt: "2025-07-21T03:46:11.211Z",
        hasReview: false,
        additionalCost: 207000,
      },
      {
        orderId: "0a22e45e-25b7-459d-b826-7c618d47250e",
        invoice: "MT25AA104",
        orderType: "INSTANT",
        loadTimeStart: "2025-07-23T19:21:00.000Z",
        loadTimeEnd: "2025-07-23T21:22:00.000Z",
        locations: {
          pickup: [
            {
              sequence: 1,
              fullAddress:
                "Galaxy Mall 2, Mulyorejo, Surabaya, Jawa Timur, Indonesia",
              city: "Kota Surabaya",
            },
          ],
          dropoff: [
            {
              sequence: 1,
              fullAddress:
                "Pakuwon Mall, Jalan Mayjend. Jonosewojo, Babatan, Surabaya, Jawa Timur, Indonesia",
              city: "Kota Surabaya",
            },
          ],
          hasMultiplePickup: false,
          hasMultipleDropoff: false,
        },
        vehicle: {
          carrierName: "Box",
          truckTypeName: "Colt Diesel Double",
          truckCount: 1,
        },
        statusInfo: [
          {
            statusLabel: "Mempersiapkan Armada",
            statusCode: "PREPARE_FLEET",
          },
        ],
        totalUnit: 1,
        paymentDeadline: "",
        requiresConfirmation: false,
        isRefundProcessing: false,
        createdAt: "2025-07-23T09:31:47.112Z",
        hasReview: false,
        additionalCost: 211030,
      },
      {
        orderId: "28c4c896-5435-41d8-a0a2-1e6cd7c02058",
        invoice: "INV/MT25AA146",
        orderType: "SCHEDULED",
        loadTimeStart: "2025-07-27T09:31:00.000Z",
        loadTimeEnd: "",
        locations: {
          pickup: [
            {
              sequence: 1,
              fullAddress:
                "Galaxy Mall 2, Mulyorejo, Surabaya, Jawa Timur, Indonesia",
              city: "Kota Surabaya",
            },
          ],
          dropoff: [
            {
              sequence: 1,
              fullAddress:
                "Graha Airi, Jalan Kedung Doro, RT.001/RW.06, Kedungdoro, Surabaya, Jawa Timur, Indonesia",
              city: "Kota Surabaya",
            },
          ],
          hasMultiplePickup: false,
          hasMultipleDropoff: false,
        },
        vehicle: {
          carrierName: "Dropside 30ft(2AS)",
          truckTypeName: "Tractor Head 6 x 4",
          truckCount: 4,
        },
        statusInfo: [
          {
            statusLabel: "Menunggu Pembayaran",
            statusCode: "WAITING_PAYMENT_2",
          },
        ],
        totalUnit: 4,
        paymentDeadline: "2025-07-26T02:32:05.916Z",
        requiresConfirmation: true,
        isRefundProcessing: false,
        createdAt: "2025-07-25T02:32:05.853Z",
        hasReview: false,
        additionalCost: 0,
      },
      {
        orderId: "be47fbfb-b9db-42fb-9126-4ea4d20f92bf",
        invoice: "INV/MT25AA191",
        orderType: "SCHEDULED",
        loadTimeStart: "2025-07-30T13:23:00.000Z",
        loadTimeEnd: "",
        locations: {
          pickup: [
            {
              sequence: 1,
              fullAddress:
                "Pakuwon City Mall 3 and Bella Apartment, Jl. Mutiara I No, RT.000/RW.00, Kejawaan Putih Tamba, Surabaya, Jawa Timur, Indonesia",
              city: "Kota Surabaya",
            },
            {
              sequence: 2,
              fullAddress:
                "Galaxy Mall 2, Mulyorejo, Surabaya, Jawa Timur, Indonesia",
              city: "Kota Surabaya",
            },
          ],
          dropoff: [
            {
              sequence: 1,
              fullAddress:
                "Ciputra World XXI, Jalan Mayjen Sungkono, Gunung Sari, Surabaya, Jawa Timur, Indonesia",
              city: "Surabaya",
            },
            {
              sequence: 2,
              fullAddress:
                "Pakuwon Mall, Jalan Mayjend. Jonosewojo, Babatan, Surabaya, Jawa Timur, Indonesia",
              city: "Kota Surabaya",
            },
          ],
          hasMultiplePickup: true,
          hasMultipleDropoff: true,
        },
        vehicle: {
          carrierName: "Box 40ft",
          truckTypeName: "Tractor Head 4 x 2",
          truckCount: 1,
        },
        statusInfo: [
          {
            statusLabel: "Menunggu Pembayaran",
            statusCode: "WAITING_PAYMENT_2",
          },
        ],
        totalUnit: 1,
        paymentDeadline: "2025-07-29T06:28:01.218Z",
        requiresConfirmation: true,
        isRefundProcessing: false,
        createdAt: "2025-07-28T06:28:01.131Z",
        hasReview: false,
        additionalCost: 200000,
      },
      {
        orderId: "db2ebc46-2f72-4349-83cd-498cfb4270a7",
        invoice: "MT25AA289",
        orderType: "INSTANT",
        loadTimeStart: "2025-08-02T11:41:00.000Z",
        loadTimeEnd: "",
        locations: {
          pickup: [
            {
              sequence: 1,
              fullAddress:
                "Pakuwon City Mall 3 and Bella Apartment, Jl. Mutiara I No, RT.000/RW.00, Kejawaan Putih Tamba, Surabaya, Jawa Timur, Indonesia",
              city: "Kota Surabaya",
            },
            {
              sequence: 2,
              fullAddress:
                "Galaxy Mall 2, Mulyorejo, Surabaya, Jawa Timur, Indonesia",
              city: "Kota Surabaya",
            },
          ],
          dropoff: [
            {
              sequence: 1,
              fullAddress:
                "Graha Airi, Jalan Kedung Doro, RT.001/RW.06, Kedungdoro, Surabaya, Jawa Timur, Indonesia",
              city: "Kota Surabaya",
            },
            {
              sequence: 2,
              fullAddress:
                "Pakuwon Mall, Jalan Mayjend. Jonosewojo, Babatan, Surabaya, Jawa Timur, Indonesia",
              city: "Kota Surabaya",
            },
          ],
          hasMultiplePickup: true,
          hasMultipleDropoff: true,
        },
        vehicle: {
          carrierName: "Bak Terbuka",
          truckTypeName: "Medium Truk 4 x 2 (Rigid)",
          truckCount: 1,
        },
        statusInfo: [
          {
            statusLabel: "Mempersiapkan Armada",
            statusCode: "PREPARE_FLEET",
          },
        ],
        totalUnit: 1,
        paymentDeadline: "",
        requiresConfirmation: false,
        isRefundProcessing: false,
        createdAt: "2025-08-01T04:44:31.102Z",
        hasReview: false,
        additionalCost: 207000,
      },
      {
        orderId: "66e50c08-7612-4b5f-8b29-5a7d67946cdc",
        invoice: "MT25AA435",
        orderType: "INSTANT",
        loadTimeStart: "2025-08-07T10:14:00.000Z",
        loadTimeEnd: "",
        locations: {
          pickup: [
            {
              sequence: 1,
              fullAddress:
                "Galaxy Mall 2, Mulyorejo, Surabaya, Jawa Timur, Indonesia",
              city: "Kota Surabaya",
            },
          ],
          dropoff: [
            {
              sequence: 1,
              fullAddress:
                "Pakuwon Mall, Jalan Mayjend. Jonosewojo, Babatan, Surabaya, Jawa Timur, Indonesia",
              city: "Kota Surabaya",
            },
          ],
          hasMultiplePickup: false,
          hasMultipleDropoff: false,
        },
        vehicle: {
          carrierName: "Bak Terbuka",
          truckTypeName: "Medium Truk 4 x 2 (Rigid)",
          truckCount: 1,
        },
        statusInfo: [
          {
            statusLabel: "Mempersiapkan Armada",
            statusCode: "PREPARE_FLEET",
          },
        ],
        totalUnit: 1,
        paymentDeadline: "",
        requiresConfirmation: false,
        isRefundProcessing: false,
        createdAt: "2025-08-06T03:15:47.805Z",
        hasReview: false,
        additionalCost: 0,
      },
    ],
    pagination: {
      currentPage: 1,
      totalPages: 2,
      totalItems: 12,
      itemsPerPage: 10,
    },
  },
  Type: "/v1/orders/list?page=1&limit=10",
};

// Fetcher function for order list
export const getOrderList = async (url) => {
  let result;
  if (useMockData) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    result = mockAPIResult;
  } else {
    result = await fetcherMuatrans.get(url);
  }
  return {
    orders: result?.data?.Data.orders || [],
    pagination: result?.data?.Data.pagination || {},
  };
};
// SWR mutation hook
export const useGetOrderList = (queryString) =>
  useSWR(`v1/orders/list?${queryString}`, getOrderList);
