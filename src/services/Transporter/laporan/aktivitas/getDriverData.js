import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false;

export const mockDriverData = {
  data: {
    Message: {
      Code: 200,
      Text: "OK",
    },
    Data: {
      activities: [
        {
          driverId: "db51b22d-9c34-4f38-8aad-6eb9a32ef5c0",
          name: "Yudha Backend Driver",
          phoneNumber: "081331994244",
          profileImage:
            "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/photo-1753166402594.webp",
          currentStatus: "READY_FOR_ORDER",
          createdAt: "2025-08-01 17:08:30",
          currentFleet: {
            id: "6ac54d79-b342-491c-8642-c8733090fde3",
            licensePlate: "L 1234 YUD",
            truckType: "Colt Diesel Double",
            carrierType: "Bak Terbuka",
            currentLocation: "-",
          },
          activeOrder: {
            orderCode: "",
            invoiceNumber: "",
            estimatedDistance: 0,
            pickupLocation: "",
            dropoffLocation: "",
          },
        },
        {
          driverId: "60354a66-db3f-426c-8be0-64c6db1e7561",
          name: "testtttt",
          phoneNumber: "081231228192912",
          profileImage:
            "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1753863236033.webp",
          currentStatus: "NON_ACTIVE",
          createdAt: "2025-07-30 15:41:06",
          currentFleet: {
            id: "",
            licensePlate: "",
            truckType: "",
            carrierType: "",
            currentLocation: "-",
          },
          activeOrder: {
            orderCode: "",
            invoiceNumber: "",
            estimatedDistance: 0,
            pickupLocation: "",
            dropoffLocation: "",
          },
        },
        {
          driverId: "51e64187-d4cb-4065-9776-7e1224fc6b35",
          name: "Test Driver",
          phoneNumber: "085737777777",
          profileImage:
            "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/photo-1753166402594.webp",
          currentStatus: "READY_FOR_ORDER",
          createdAt: "2025-07-21 15:09:17",
          currentFleet: {
            id: "420aed87-8033-4958-8545-79d5c73c5dd5",
            licensePlate: "B 1234 ABC",
            truckType: "Colt Diesel Double",
            carrierType: "Bak Terbuka",
            currentLocation: "-",
          },
          activeOrder: {
            orderCode: "",
            invoiceNumber: "",
            estimatedDistance: 0,
            pickupLocation: "",
            dropoffLocation: "",
          },
        },
        {
          driverId: "87d56abd-ed4c-43d5-830c-c274b0cebbad",
          name: "tesssst",
          phoneNumber: "081230030000203",
          profileImage:
            "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1753863236033.webp",
          currentStatus: "NON_ACTIVE",
          createdAt: "2025-07-30 17:02:54",
          currentFleet: {
            id: "",
            licensePlate: "",
            truckType: "",
            carrierType: "",
            currentLocation: "-",
          },
          activeOrder: {
            orderCode: "",
            invoiceNumber: "",
            estimatedDistance: 0,
            pickupLocation: "",
            dropoffLocation: "",
          },
        },
        {
          driverId: "716d9017-81e7-4f70-94e0-ce7e9c51c84f",
          name: "Rudiger",
          phoneNumber: "081343452345",
          profileImage:
            "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1753863236033.webp",
          currentStatus: "NON_ACTIVE",
          createdAt: "2025-08-08 09:33:30",
          currentFleet: {
            id: "",
            licensePlate: "",
            truckType: "",
            carrierType: "",
            currentLocation: "-",
          },
          activeOrder: {
            orderCode: "",
            invoiceNumber: "",
            estimatedDistance: 0,
            pickupLocation: "",
            dropoffLocation: "",
          },
        },
        {
          driverId: "3f7ac67d-1482-4aba-999f-8fc74669bc64",
          name: "Richard Driver test update",
          phoneNumber: "081234567801",
          profileImage:
            "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/photo-1753166402594.webp",
          currentStatus: "READY_FOR_ORDER",
          createdAt: "2025-08-01 14:13:15",
          currentFleet: {
            id: "b5a371b7-b2d9-47d5-9e70-1108ef6573e6",
            licensePlate: "B 1234 RIC",
            truckType: "Colt Diesel Double",
            carrierType: "Bak Terbuka",
            currentLocation: "-",
          },
          activeOrder: {
            orderCode: "",
            invoiceNumber: "",
            estimatedDistance: 0,
            pickupLocation: "",
            dropoffLocation: "",
          },
        },
        {
          driverId: "f1511c2f-0581-4903-b6e8-d98750884f58",
          name: "Pras Driver 2",
          phoneNumber: "085737777778",
          profileImage:
            "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/photo-1753166402594.webp",
          currentStatus: "READY_FOR_ORDER",
          createdAt: "2025-08-11 11:08:56",
          currentFleet: {
            id: "dc90f50a-139e-485d-a3d9-972087a28dca",
            licensePlate: "L 9191 PRS",
            truckType: "Colt Diesel Double",
            carrierType: "Bak Terbuka",
            currentLocation: "-",
          },
          activeOrder: {
            orderCode: "",
            invoiceNumber: "",
            estimatedDistance: 0,
            pickupLocation: "",
            dropoffLocation: "",
          },
        },
        {
          driverId: "7d44bbd7-4ca3-444e-87de-e355f07b4f84",
          name: "John Tor Driver",
          phoneNumber: "081234567891",
          profileImage:
            "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1752811896934.webp",
          currentStatus: "NON_ACTIVE",
          createdAt: "2025-07-24 07:24:11",
          currentFleet: {
            id: "654ec099-6a83-4350-98bb-93a16ea2c897",
            licensePlate: "B 1234 ABC",
            truckType: "Colt Diesel Double",
            carrierType: "Bak Terbuka",
            currentLocation: "-",
          },
          activeOrder: {
            orderCode: "MT25AA583",
            invoiceNumber: "INV/MT25AA583",
            estimatedDistance: 20.69,
            pickupLocation:
              "Taman - Waru, Taman, Sidoarjo, Jawa Timur, Indonesia",
            dropoffLocation:
              "Pacet Hill, Hutan, Padusan, Kabupaten Mojokerto, Jawa Timur, Indonesia",
          },
        },
        {
          driverId: "d740eaa1-01ed-4320-ba6c-5542ee6fda71",
          name: "John Son Driver 2",
          phoneNumber: "081357188334",
          profileImage:
            "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/photo-1753166402594.webp",
          currentStatus: "NON_ACTIVE",
          createdAt: "2025-07-22 17:51:57",
          currentFleet: {
            id: "",
            licensePlate: "",
            truckType: "",
            carrierType: "",
            currentLocation: "-",
          },
          activeOrder: {
            orderCode: "",
            invoiceNumber: "",
            estimatedDistance: 0,
            pickupLocation: "",
            dropoffLocation: "",
          },
        },
        {
          driverId: "bb62a28d-832d-42a3-8d17-f2f4119e4c47",
          name: "John Son Driver",
          phoneNumber: "081357188952",
          profileImage:
            "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/photo-1753166402594.webp",
          currentStatus: "NON_ACTIVE",
          createdAt: "2025-07-24 07:24:37",
          currentFleet: {
            id: "edf88e21-88dc-4830-8068-777c07f68547",
            licensePlate: "B 1234 ABD",
            truckType: "Colt Diesel Double",
            carrierType: "Bak Terbuka",
            currentLocation: "-",
          },
          activeOrder: {
            orderCode: "MT25AA605",
            invoiceNumber: "INV/MT25AA605",
            estimatedDistance: 88.58,
            pickupLocation:
              "Surabaya North Quay, Perak Utara, Surabaya, Jawa Timur, Indonesia",
            dropoffLocation:
              "Bandulan Gang V, Bandulan, Kota Malang, Jawa Timur, Indonesia",
          },
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        totalItems: 36,
        totalPages: 4,
      },
    },
    Type: "GET_DRIVER_ACTIVITIES",
  },
};

export const getDriverData = async (params = {}) => {
  const {
    limit = 10,
    page = 1,
    sort,
    order,
    search = "",
    status = "",
    startDate = "",
    endDate = "",
  } = params;

  let result;
  if (useMockData) {
    result = mockDriverData;
  } else {
    result = await fetcherMuatrans.get(`/v1/transporter/activities/driver`, {
      params: {
        limit,
        page,
        sort,
        order,
        search,
        status,
        startDate,
        endDate,
      },
    });
  }
  return {
    data: result?.data?.Data || {},
    raw: result,
  };
};

export const useGetDriverData = (params = {}) => {
  const { data, error, isLoading } = useSWR([`getDriverData`, params], () =>
    getDriverData(params)
  );
  return {
    data: data?.data || {},
    raw: data?.raw,
    isLoading,
    isError: !!error,
  };
};
