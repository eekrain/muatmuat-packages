import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false;

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "OK",
    },
    Data: {
      isFirstTimer: false,
      orders: [
        {
          id: "c7415f7f-48f6-4de2-8950-0035e2c61b4d",
          orderCode: "MT25AA453",
          loadTimeStart: "2025-08-09T08:40:00.000Z",
          loadTimeEnd: "2025-08-09T10:40:00.000Z",
          carrierName: "Box",
          truckTypeName: "Medium Truk 4 x 2 (Rigid)",
          orderStatus: "WAITING_PAYMENT_2",
          totalPrice: "455785.00",
          pickupLocation:
            "Graha Airi, Jalan Kedung Doro, RT.001/RW.06, Kedungdoro, Surabaya, Jawa Timur, Indonesia",
          dropoffLocation:
            "Plaza Marina ASIA CELLULAR lt.2 H. 247, Jalan Margorejo Indah Utara, Sidosermo, Surabaya, Jawa Timur, Indonesia",
          locationCount: {
            pickup: 1,
            dropoff: 1,
          },
          hasMultipleLocations: false,
          createdAt: "2025-08-06T09:41:51.542Z",
          updatedAt: "2025-08-06T09:41:51.844Z",
        },
        {
          id: "366807f6-cbe8-4754-9c7a-0ff97e924c66",
          orderCode: "MT25AA448",
          loadTimeStart: "2025-08-09T13:12:00.000Z",
          loadTimeEnd: "2025-08-09T17:12:00.000Z",
          carrierName: "Bak Terbuka",
          truckTypeName: "Medium Truk 4 x 2 (Rigid)",
          orderStatus: "WAITING_PAYMENT_2",
          totalPrice: "433868.00",
          pickupLocation:
            "Galaxy Mall 2, Mulyorejo, Surabaya, Jawa Timur, Indonesia",
          dropoffLocation:
            "Pakuwon Mall, Jalan Mayjend. Jonosewojo, Babatan, Surabaya, Jawa Timur, Indonesia",
          locationCount: {
            pickup: 1,
            dropoff: 1,
          },
          hasMultipleLocations: false,
          createdAt: "2025-08-06T06:14:13.831Z",
          updatedAt: "2025-08-06T06:14:15.730Z",
        },
        {
          id: "66e50c08-7612-4b5f-8b29-5a7d67946cdc",
          orderCode: "MT25AA435",
          loadTimeStart: "2025-08-07T10:14:00.000Z",
          loadTimeEnd: null,
          carrierName: "Bak Terbuka",
          truckTypeName: "Medium Truk 4 x 2 (Rigid)",
          orderStatus: "PREPARE_FLEET",
          totalPrice: "226868.00",
          pickupLocation:
            "Galaxy Mall 2, Mulyorejo, Surabaya, Jawa Timur, Indonesia",
          dropoffLocation:
            "Pakuwon Mall, Jalan Mayjend. Jonosewojo, Babatan, Surabaya, Jawa Timur, Indonesia",
          locationCount: {
            pickup: 1,
            dropoff: 1,
          },
          hasMultipleLocations: false,
          createdAt: "2025-08-06T03:15:47.805Z",
          updatedAt: "2025-08-06T03:15:47.805Z",
        },
        {
          id: "db2ebc46-2f72-4349-83cd-498cfb4270a7",
          orderCode: "MT25AA289",
          loadTimeStart: "2025-08-02T11:41:00.000Z",
          loadTimeEnd: null,
          carrierName: "Bak Terbuka",
          truckTypeName: "Medium Truk 4 x 2 (Rigid)",
          orderStatus: "PREPARE_FLEET",
          totalPrice: "437888.00",
          pickupLocation:
            "Pakuwon City Mall 3 and Bella Apartment, Jl. Mutiara I No, RT.000/RW.00, Kejawaan Putih Tamba, Surabaya, Jawa Timur, Indonesia",
          dropoffLocation:
            "Graha Airi, Jalan Kedung Doro, RT.001/RW.06, Kedungdoro, Surabaya, Jawa Timur, Indonesia",
          locationCount: {
            pickup: 2,
            dropoff: 2,
          },
          hasMultipleLocations: true,
          createdAt: "2025-08-01T04:44:31.102Z",
          updatedAt: "2025-08-01T04:44:31.102Z",
        },
        {
          id: "be47fbfb-b9db-42fb-9126-4ea4d20f92bf",
          orderCode: "MT25AA191",
          loadTimeStart: "2025-07-30T13:23:00.000Z",
          loadTimeEnd: null,
          carrierName: "Box 40ft",
          truckTypeName: "Tractor Head 4 x 2",
          orderStatus: "WAITING_PAYMENT_2",
          totalPrice: "806406.00",
          pickupLocation:
            "Pakuwon City Mall 3 and Bella Apartment, Jl. Mutiara I No, RT.000/RW.00, Kejawaan Putih Tamba, Surabaya, Jawa Timur, Indonesia",
          dropoffLocation:
            "Ciputra World XXI, Jalan Mayjen Sungkono, Gunung Sari, Surabaya, Jawa Timur, Indonesia",
          locationCount: {
            pickup: 2,
            dropoff: 2,
          },
          hasMultipleLocations: true,
          createdAt: "2025-07-28T06:28:01.131Z",
          updatedAt: "2025-07-28T06:28:01.488Z",
        },
        {
          id: "28c4c896-5435-41d8-a0a2-1e6cd7c02058",
          orderCode: "MT25AA146",
          loadTimeStart: "2025-07-27T09:31:00.000Z",
          loadTimeEnd: null,
          carrierName: "Dropside 30ft(2AS)",
          truckTypeName: "Tractor Head 6 x 4",
          orderStatus: "WAITING_PAYMENT_2",
          totalPrice: "1460785.00",
          pickupLocation:
            "Galaxy Mall 2, Mulyorejo, Surabaya, Jawa Timur, Indonesia",
          dropoffLocation:
            "Graha Airi, Jalan Kedung Doro, RT.001/RW.06, Kedungdoro, Surabaya, Jawa Timur, Indonesia",
          locationCount: {
            pickup: 1,
            dropoff: 1,
          },
          hasMultipleLocations: false,
          createdAt: "2025-07-25T02:32:05.853Z",
          updatedAt: "2025-07-25T02:32:07.146Z",
        },
        {
          id: "0a22e45e-25b7-459d-b826-7c618d47250e",
          orderCode: "MT25AA104",
          loadTimeStart: "2025-07-23T19:21:00.000Z",
          loadTimeEnd: "2025-07-23T21:22:00.000Z",
          carrierName: "Box",
          truckTypeName: "Colt Diesel Double",
          orderStatus: "PREPARE_FLEET",
          totalPrice: "510353.00",
          pickupLocation:
            "Galaxy Mall 2, Mulyorejo, Surabaya, Jawa Timur, Indonesia",
          dropoffLocation:
            "Pakuwon Mall, Jalan Mayjend. Jonosewojo, Babatan, Surabaya, Jawa Timur, Indonesia",
          locationCount: {
            pickup: 1,
            dropoff: 1,
          },
          hasMultipleLocations: false,
          createdAt: "2025-07-23T09:31:47.112Z",
          updatedAt: "2025-07-23T09:31:47.112Z",
        },
        {
          id: "c649ee80-8941-41ef-a753-777c329972bc",
          orderCode: "MT25AA088",
          loadTimeStart: "2025-07-22T16:31:00.000Z",
          loadTimeEnd: "2025-07-22T18:34:00.000Z",
          carrierName: "Box 40ft",
          truckTypeName: "Tractor Head 4 x 2",
          orderStatus: "PREPARE_FLEET",
          totalPrice: "807708.00",
          pickupLocation:
            "Galaxy Mall 2, Mulyorejo, Surabaya, Jawa Timur, Indonesia",
          dropoffLocation:
            "Pakuwon Mall, Jalan Mayjend. Jonosewojo, Babatan, Surabaya, Jawa Timur, Indonesia",
          locationCount: {
            pickup: 1,
            dropoff: 1,
          },
          hasMultipleLocations: false,
          createdAt: "2025-07-21T09:36:41.983Z",
          updatedAt: "2025-07-29T09:48:31.660Z",
        },
        {
          id: "1c2a62bc-d4ba-46d6-91ff-ecb9c3eab2b3",
          orderCode: "MT25AA085",
          loadTimeStart: "2025-07-23T13:35:00.000Z",
          loadTimeEnd: "2025-07-23T16:43:00.000Z",
          carrierName: "Bak Terbuka",
          truckTypeName: "Medium Truk 4 x 2 (Rigid)",
          orderStatus: "WAITING_PAYMENT_2",
          totalPrice: "1114472.00",
          pickupLocation:
            "Galaxy Mall 2, Mulyorejo, Surabaya, Jawa Timur, Indonesia",
          dropoffLocation:
            "Pakuwon Mall, Jalan Mayjend. Jonosewojo, Babatan, Surabaya, Jawa Timur, Indonesia",
          locationCount: {
            pickup: 1,
            dropoff: 1,
          },
          hasMultipleLocations: false,
          createdAt: "2025-07-21T03:46:11.211Z",
          updatedAt: "2025-07-21T03:46:11.590Z",
        },
        {
          id: "661e5850-d7fa-482a-ab9e-b76c15e66998",
          orderCode: "MT25AA032",
          loadTimeStart: "2025-07-20T14:17:00.000Z",
          loadTimeEnd: "2025-07-20T18:17:00.000Z",
          carrierName: "Bak Terbuka",
          truckTypeName: "Medium Truk 4 x 2 (Rigid)",
          orderStatus: "WAITING_PAYMENT_2",
          totalPrice: "447258.00",
          pickupLocation:
            "DKV ISTTS, Jalan Ngagel Jaya Tengah, Baratajaya, Surabaya, Jawa Timur, Indonesia",
          dropoffLocation:
            "Galaxy Mall 2, Mulyorejo, Surabaya, Jawa Timur, Indonesia",
          locationCount: {
            pickup: 3,
            dropoff: 3,
          },
          hasMultipleLocations: true,
          createdAt: "2025-07-18T07:25:46.962Z",
          updatedAt: "2025-07-18T07:25:49.654Z",
        },
      ],
      pagination: {
        currentPage: 1,
        totalPages: 2,
        totalItems: 11,
        itemsPerPage: 10,
        hasNext: true,
        hasPrevious: false,
      },
      sorting: {
        field: "createdAt",
        order: "desc",
        availableSorts: [
          "createdAt",
          "loadTimeStart",
          "totalPrice",
          "orderStatus",
        ],
      },
    },
    Type: "/v1/transporter/orders",
  },
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
    isFirstTimer: result?.data?.Data.isFirstTimer || false,
    orders: result?.data?.Data.orders || [],
    pagination: result?.data?.Data.pagination || {},
  };
};
// SWR mutation hook
export const useGetOrderList = (queryString) =>
  useSWR(`v1/transporter/orders?${queryString}`, getOrderList);
