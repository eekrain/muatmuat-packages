import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false;

export const mockFleetDetailData = {
  data: {
    Message: {
      Code: 200,
      Text: "OK",
    },
    Data: {
      activities: [
        {
          id: "8ae426f8-5eb4-4a33-b759-8a05ad4b953a",
          driverInfo: {
            id: "37f98c1b-a3fc-4b80-b882-db2a29928df2",
            name: "Driver Fajri",
            phoneNumber: "082290380510",
          },
          orderInfo: {
            orderId: "d84ecc3d-87f8-4b84-a8e0-a2d591210242",
            orderCode: "MT25AA564",
            invoiceNumber: "INV/MT25AA564",
            estimatedDistance: 5.69,
            pickupLocation:
              "muatmuat, Jalan Kedung Doro, RT.001/RW.06, Kedungdoro, Surabaya, Jawa Timur, Indonesia",
            dropoffLocation:
              "Galaxy Mall 2, Mulyorejo, Surabaya, Jawa Timur, Indonesia",
            loadTimeStart: "2025-08-13T02:58:35.721Z",
            loadTimeEnd: null,
            status: "LOADING",
            createdAt: "2025-08-13T02:57:17.865Z",
          },
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        totalItems: 1,
        totalPages: 1,
      },
    },
    Type: "GET_FLEET_ACTIVITIES_DETAIL",
  },
};

export const getFleetDetailData = async (fleetId, params = {}) => {
  const {
    limit = 10,
    page = 1,
    sort,
    order,
    search = "",
    startDate = "",
    endDate = "",
  } = params;

  let result;
  if (useMockData) {
    result = mockFleetDetailData;
  } else {
    result = await fetcherMuatrans.get(
      `/v1/transporter/activities/fleet/${fleetId}/detail`,
      {
        params: {
          limit,
          page,
          sort,
          order,
          search,
          startDate,
          endDate,
          fleetId,
        },
      }
    );
  }
  return {
    data: result?.data?.Data || {},
    raw: result,
  };
};

export const useGetFleetDetailData = (fleetId, params = {}) => {
  const { data, error, isLoading } = useSWR(
    [`getFleetDetailData`, fleetId, params],
    () => getFleetDetailData(fleetId, params)
  );
  return {
    data: data?.data || {},
    raw: data?.raw,
    isLoading,
    isError: !!error,
  };
};
