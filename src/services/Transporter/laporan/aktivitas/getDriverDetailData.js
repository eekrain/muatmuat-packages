import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false;

export const mockDriverDetailData = {
  data: {
    Message: {
      Code: 200,
      Text: "OK",
    },
    Data: {
      activities: [
        {
          id: "dce1be66-9138-48c7-bb92-b814d14be05f",
          fleetInfo: {
            id: "654ec099-6a83-4350-98bb-93a16ea2c897",
            licensePlate: "B 1234 ABC",
            truckType: "Colt Diesel Double",
            carrierType: "Bak Terbuka",
          },
          orderInfo: {
            orderId: "7f93b597-a23c-4ef9-8587-33ad665877e1",
            orderCode: "MT25AA567",
            invoiceNumber: "INV/MT25AA567",
            estimatedDistance: 20.69,
            pickupLocation:
              "Jalan Joyoboyo, Sawunggaling, Surabaya, Jawa Timur, Indonesia",
            dropoffLocation:
              "Jalan Stasiun Krian, Krian, Sidoarjo, Jawa Timur, Indonesia",
            loadTimeStart: "2025-08-13T04:50:43.456Z",
            loadTimeEnd: "2025-08-13T04:51:29.838Z",
            status: "LOADING",
            createdAt: "2025-08-13T04:31:56.447Z",
          },
        },
        {
          id: "e7e7750e-9726-4d74-9840-581e87c94d07",
          fleetInfo: {
            id: "654ec099-6a83-4350-98bb-93a16ea2c897",
            licensePlate: "B 1234 ABC",
            truckType: "Colt Diesel Double",
            carrierType: "Bak Terbuka",
          },
          orderInfo: {
            orderId: "8a366c40-2b6b-4f39-8c16-be7d49006ed0",
            orderCode: "MT25AA569",
            invoiceNumber: "INV/MT25AA569",
            estimatedDistance: 20.69,
            pickupLocation:
              "Taman - Waru, Taman, Sidoarjo, Jawa Timur, Indonesia",
            dropoffLocation:
              "Pacet Hill, Hutan, Padusan, Kabupaten Mojokerto, Jawa Timur, Indonesia",
            loadTimeStart: "2025-08-13T06:42:54.223Z",
            loadTimeEnd: "2025-08-13T06:44:57.599Z",
            status: "COMPLETED",
            createdAt: "2025-08-13T06:35:11.374Z",
          },
        },
        {
          id: "e08b9ff7-74e8-4a41-87e4-2cf97925edfc",
          fleetInfo: {
            id: "654ec099-6a83-4350-98bb-93a16ea2c897",
            licensePlate: "B 1234 ABC",
            truckType: "Colt Diesel Double",
            carrierType: "Bak Terbuka",
          },
          orderInfo: {
            orderId: "2c2f7fb4-ad2e-4994-b678-1227a6dd1b1c",
            orderCode: "MT25AA583",
            invoiceNumber: "INV/MT25AA583",
            estimatedDistance: 20.69,
            pickupLocation:
              "Taman - Waru, Taman, Sidoarjo, Jawa Timur, Indonesia",
            dropoffLocation:
              "Pacet Hill, Hutan, Padusan, Kabupaten Mojokerto, Jawa Timur, Indonesia",
            loadTimeStart: null,
            loadTimeEnd: null,
            status: "LOADING",
            createdAt: "2025-08-14T06:26:48.230Z",
          },
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        totalItems: 3,
        totalPages: 1,
      },
    },
    Type: "GET_DRIVER_ACTIVITIES_DETAIL",
  },
};

export const getDriverDetailData = async (driverId, params = {}) => {
  const {
    limit = 10,
    page = 1,
    sort = "loadingTime",
    order = "asc",
    search = "",
  } = params;

  let result;
  if (useMockData) {
    result = mockDriverDetailData;
  } else {
    result = await fetcherMuatrans.get(
      `/v1/transporter/activities/driver/${driverId}/detail`,
      {
        params: {
          limit,
          page,
          sort,
          order,
          search,
          driverId,
        },
      }
    );
  }
  return {
    data: result?.data?.Data || {},
    raw: result,
  };
};

export const useGetDriverDetailData = (driverId, params = {}) => {
  const { data, error, isLoading } = useSWR(
    [`getDriverDetailData`, driverId, params],
    () => getDriverDetailData(driverId, params)
  );
  return {
    data: data?.data || {},
    raw: data?.raw,
    isLoading,
    isError: !!error,
  };
};
