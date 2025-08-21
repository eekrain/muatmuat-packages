import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";
import {
  OrderStatusEnum,
  OrderStatusIcon,
  OrderStatusTitle,
} from "@/lib/constants/Shipper/detailpesanan/detailpesanan.enum";
import { DriverStatusEnum } from "@/lib/constants/Shipper/detailpesanan/driver-status.enum";

const useMockData = true; // cs detailpesanan

const stepStatus = [
  {
    orderStatus: OrderStatusEnum.SCHEDULED_FLEET,
    statusName: "Pesanan Terkonfirmasi",
  },
  {
    orderStatus: OrderStatusEnum.LOADING,
    statusName: "Proses Muat",
  },
  {
    orderStatus: OrderStatusEnum.UNLOADING,
    statusName: "Proses Bongkar",
  },
  {
    orderStatus: OrderStatusEnum.PREPARE_DOCUMENT,
    statusName: "Proses Bongkar",
  },
  {
    orderStatus: OrderStatusEnum.DOCUMENT_DELIVERY,
    statusName: "Proses Bongkar",
  },
  {
    orderStatus: OrderStatusEnum.COMPLETED,
    statusName: "Selesai",
  },
];

const sosDefault = {
  sosId: "3c0c2992-d782-4ad6-9f13-f8ac8b2dd577",
  sosDescription: "Kendaraan mengalami kendala teknis di jalan tol",
  sosTime: "2025-08-05T14:30:00Z",
  status: "ACTIVE",
  priorityLevel: "HIGH",
};

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Status armada berhasil diambil",
    },
    Data: {
      fleetTracking: [
        {
          transporterId: "95459a4f-5db7-4f30-bc00-6e22c3a1aaaa",
          companyName: "PT. Siba Surya",
          companyAddress: "Kec. Tegalsari, Kota Surabaya",
          companyPicture: "https://picsum.photos/100?random=11",
          fleetsOrdered: 3,
          fleets: [
            {
              fleetId: "95459a4f-5db7-4f30-bc00-6e22c3a1a001",
              licensePlate: "B 1234 XYZ",
              truckImage: "https://picsum.photos/100?random=111",
              driverInfo: {
                driverId: "uuid-driver-456",
                driverName: "Eka Candra",
                driverStatus: `${DriverStatusEnum.UNLOADING.MENUJU.code}_1`,
              },
              orderStatus: OrderStatusEnum.SCHEDULED_FLEET,
              stepStatus,
              sosStatus: {
                hasSOS: false,
                ...sosDefault,
              },
            },
            {
              fleetId: "95459a4f-5db7-4f30-bc00-6e22c3a1a002",
              licensePlate: "B 1234 XYZ",
              truckImage: "https://picsum.photos/100?random=222",
              driverInfo: {
                driverId: "uuid-driver-456",
                driverName: "Doni Prasetyo",
                driverStatus: "MENUJU_KE_LOKASI_MUAT_1",
              },
              orderStatus: OrderStatusEnum.SCHEDULED_FLEET,
              stepStatus,
              sosStatus: {
                hasSOS: false,
                ...sosDefault,
              },
            },
            {
              fleetId: "95459a4f-5db7-4f30-bc00-6e22c3a1a003",
              licensePlate: "B 1234 XYZ",
              truckImage: "https://picsum.photos/100?random=222",
              driverInfo: {
                driverId: "uuid-driver-456",
                driverName: "Doni Prasetyo",
                driverStatus: "MENUJU_KE_LOKASI_MUAT_1",
              },
              orderStatus: OrderStatusEnum.SCHEDULED_FLEET,
              stepStatus,
              sosStatus: {
                hasSOS: false,
                ...sosDefault,
              },
            },
          ],
        },
        {
          transporterId: "95459a4f-5db7-4f30-bc00-6e22c3a1abbb",
          companyName: "PT. Graha AIRI",
          companyAddress: "Kec. Tegalsari, Kota Surabaya",
          companyPicture: "https://picsum.photos/100?random=22",
          fleetsOrdered: 3,
          fleets: [
            // {
            //   fleetId: "95459a4f-5db7-4f30-bc00-6e22c3a1a111",
            //   licensePlate: "B 1234 XYZ",
            //   truckImage: "https://picsum.photos/100?random=333",
            //   driverInfo: {
            //     driverId: "uuid-driver-456",
            //     driverName: "Ahmad Suryanto",
            //     driverStatus: "MENUJU_KE_LOKASI_MUAT_1",
            //   },
            //   orderStatus: OrderStatusEnum.SCHEDULED_FLEET,
            //   stepStatus,
            //   sosStatus: {
            //     hasSOS: false,
            //     ...sosDefault,
            //   },
            // },
            // {
            //   fleetId: "95459a4f-5db7-4f30-bc00-6e22c3a1a112",
            //   licensePlate: "B 1234 XYZ",
            //   truckImage: "https://picsum.photos/100?random=444",
            //   driverInfo: {
            //     driverId: "uuid-driver-456",
            //     driverName: "Budi Wijaya",
            //     driverStatus: "MENUJU_KE_LOKASI_MUAT_1",
            //   },
            //   orderStatus: OrderStatusEnum.SCHEDULED_FLEET,
            //   stepStatus,
            //   sosStatus: {
            //     hasSOS: false,
            //     ...sosDefault,
            //   },
            // },
          ],
        },
        {
          transporterId: "95459a4f-5db7-4f30-bc00-6e22c3a1abbb",
          companyName: "PT. Eka Candra",
          companyAddress: "Kec. Tegalsari, Kota Surabaya",
          companyPicture: "https://picsum.photos/100?random=33",
          fleetsOrdered: 3,
          fleets: [
            // {
            //   fleetId: "95459a4f-5db7-4f30-bc00-6e22c3a1a111",
            //   licensePlate: "B 1234 XYZ",
            //   truckImage: "https://picsum.photos/100?random=333",
            //   driverInfo: {
            //     driverId: "uuid-driver-456",
            //     driverName: "Ahmad Suryanto",
            //     driverStatus: "MENUJU_KE_LOKASI_MUAT_1",
            //   },
            //   orderStatus: OrderStatusEnum.SCHEDULED_FLEET,
            //   stepStatus,
            //   sosStatus: {
            //     hasSOS: false,
            //     ...sosDefault,
            //   },
            // },
            // {
            //   fleetId: "95459a4f-5db7-4f30-bc00-6e22c3a1a112",
            //   licensePlate: "B 1234 XYZ",
            //   truckImage: "https://picsum.photos/100?random=444",
            //   driverInfo: {
            //     driverId: "uuid-driver-456",
            //     driverName: "Budi Wijaya",
            //     driverStatus: "MENUJU_KE_LOKASI_MUAT_1",
            //   },
            //   orderStatus: OrderStatusEnum.SCHEDULED_FLEET,
            //   stepStatus,
            //   sosStatus: {
            //     hasSOS: false,
            //     ...sosDefault,
            //   },
            // },
          ],
        },
      ],
    },
    Type: "FLEET_TRACKING_SUCCESS",
  },
};

/**
 * Fetches fleet tracking information for a specific order
 * @param {string} orderId - The order ID to get fleet tracking for
 * @returns {Promise} API response with fleet tracking data
 */
export const getFleetTrackingCS = async (orderId) => {
  let response;
  if (useMockData) {
    response = mockAPIResult;
  } else {
    response = await fetcherMuatrans.get(
      `/v1/cs/orders/${orderId}/fleet/tracking`
    );
  }
  response = response.data?.Data?.fleetTracking || [];

  response = response.map((item) => ({
    ...item,
    fleets: item.fleets.map((fleet) => ({
      ...fleet,
      stepStatus: {
        stepperData: fleet.stepStatus?.map((status) => ({
          label: OrderStatusTitle[status.orderStatus],
          status: status.orderStatus,
          icon: OrderStatusIcon[status.orderStatus],
        })),
        activeIndex: fleet.stepStatus?.findIndex(
          (status) => status.orderStatus === fleet.orderStatus
        ),
      },
    })),
  }));

  return response;
};

/**
 * SWR hook for fetching order fleet tracking data
 * @param {string} orderId - The order ID to get fleet tracking for
 * @returns {object} SWR response object with data, error, and loading states
 */
export const useGetFleetTrackingCS = (orderId) =>
  useSWR(orderId ? `order-fleet-tracking/${orderId}` : null, () =>
    getFleetTrackingCS(orderId)
  );
