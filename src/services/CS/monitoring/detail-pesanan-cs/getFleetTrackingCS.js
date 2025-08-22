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
          companyName: "PT. Bahagia Sejahtera",
          companyAddress: "Kec. Tegalsari, Kota Surabaya",
          companyPicture: "https://picsum.photos/100?random=11",
          companyPhone: "021-123-4567",
          fleetsOrdered: 3,
          fleets: [
            {
              fleetId: "95459a4f-5db7-4f30-bc00-6e22c3a1a001",
              licensePlate: "B 1234 XYZ",
              truckImage: "https://picsum.photos/100?random=111",
              driverInfo: {
                driverId: "d1234567-8901-4567-8901-123456789001",
                driverName: "Eka Candra",
                driverStatus: `${DriverStatusEnum.UNLOADING.MENUJU.code}_1`,
              },
              orderStatus: OrderStatusEnum.SCHEDULED_FLEET,
              stepStatus,
              sosStatus: {
                hasSOS: false,
                sosId: "3c0c2992-d782-4ad6-9f13-f8ac8b2dd577",
                sosDescription:
                  "Kendaraan mengalami kendala teknis di jalan tol",
                sosTime: "2025-08-05T14:30:00Z",
                status: "ACTIVE",
                priorityLevel: "HIGH",
              },
            },
            {
              fleetId: "95459a4f-5db7-4f30-bc00-6e22c3a1a002",
              licensePlate: "B 5678 ABC",
              truckImage: "https://picsum.photos/100?random=222",
              driverInfo: {
                driverId: "d2345678-9012-5678-9012-123456789002",
                driverName: "Doni Prasetyo",
                driverStatus: "MENUJU_KE_LOKASI_MUAT_1",
              },
              orderStatus: OrderStatusEnum.SCHEDULED_FLEET,
              stepStatus,
              sosStatus: {
                hasSOS: false,
                sosId: "4d1d3993-e893-5bd7-af24-g9bd9c3ee688",
                sosDescription:
                  "Kendaraan mengalami kendala teknis di jalan tol",
                sosTime: "2025-08-05T14:30:00Z",
                status: "ACTIVE",
                priorityLevel: "HIGH",
              },
            },
            {
              fleetId: "95459a4f-5db7-4f30-bc00-6e22c3a1a003",
              licensePlate: "B 9012 DEF",
              truckImage: "https://picsum.photos/100?random=333",
              driverInfo: {
                driverId: "d3456789-0123-6789-0123-123456789003",
                driverName: "Rudi Santoso",
                driverStatus: "MENUJU_KE_LOKASI_MUAT_1",
              },
              orderStatus: OrderStatusEnum.SCHEDULED_FLEET,
              stepStatus,
              sosStatus: {
                hasSOS: false,
                sosId: "5e2e4aa4-f9a4-6ce8-bg35-hacea4dfh799",
                sosDescription:
                  "Kendaraan mengalami kendala teknis di jalan tol",
                sosTime: "2025-08-05T14:30:00Z",
                status: "ACTIVE",
                priorityLevel: "HIGH",
              },
            },
          ],
        },
        {
          transporterId: "a5559b5f-6ec8-5g41-cd11-7f33d4b2bccc",
          companyName: "PT. Siba Surya",
          companyAddress: "Kec. Tegalsari, Kota Surabaya",
          companyPicture: "https://picsum.photos/100?random=22",
          companyPhone: "021-234-5678",
          fleetsOrdered: 3,
          fleets: [
            {
              fleetId: "a5559b5f-6ec8-5g41-cd11-7f33d4b2b111",
              licensePlate: "B 3456 GHI",
              truckImage: "https://picsum.photos/100?random=444",
              driverInfo: {
                driverId: "d4567890-1234-7890-1234-123456789004",
                driverName: "Ahmad Suryanto",
                driverStatus: "MENUJU_KE_LOKASI_MUAT_1",
              },
              orderStatus: OrderStatusEnum.SCHEDULED_FLEET,
              stepStatus,
              sosStatus: {
                hasSOS: false,
                sosId: "6f3f5bb5-gab5-7df9-ch46-ibdfb5egiaa8",
                sosDescription:
                  "Kendaraan mengalami kendala teknis di jalan tol",
                sosTime: "2025-08-05T14:30:00Z",
                status: "ACTIVE",
                priorityLevel: "HIGH",
              },
            },
            {
              fleetId: "a5559b5f-6ec8-5g41-cd11-7f33d4b2b112",
              licensePlate: "B 7890 JKL",
              truckImage: "https://picsum.photos/100?random=555",
              driverInfo: {
                driverId: "d5678901-2345-8901-2345-123456789005",
                driverName: "Budi Wijaya",
                driverStatus: "MENUJU_KE_LOKASI_MUAT_1",
              },
              orderStatus: OrderStatusEnum.SCHEDULED_FLEET,
              stepStatus,
              sosStatus: {
                hasSOS: false,
                sosId: "7g4g6cc6-hbc6-8ega-di57-jcegc6fhjbb9",
                sosDescription:
                  "Kendaraan mengalami kendala teknis di jalan tol",
                sosTime: "2025-08-05T14:30:00Z",
                status: "ACTIVE",
                priorityLevel: "HIGH",
              },
            },
            {
              fleetId: "a5559b5f-6ec8-5g41-cd11-7f33d4b2b113",
              licensePlate: "B 2468 MNO",
              truckImage: "https://picsum.photos/100?random=666",
              driverInfo: {
                driverId: "d6789012-3456-9012-3456-123456789006",
                driverName: "Nugroho",
                driverStatus: "MENUJU_KE_LOKASI_MUAT_1",
              },
              orderStatus: OrderStatusEnum.SCHEDULED_FLEET,
              stepStatus,
              sosStatus: {
                hasSOS: false,
                sosId: "8h5h7dd7-icd7-9fhb-ej68-kdfhd7gikcc0",
                sosDescription:
                  "Kendaraan mengalami kendala teknis di jalan tol",
                sosTime: "2025-08-05T14:30:00Z",
                status: "ACTIVE",
                priorityLevel: "HIGH",
              },
            },
          ],
        },
        {
          transporterId: "b6669c6g-7fd9-6h52-de22-8g44e5c3cddd",
          companyName: "PT Kaltim Jaya Makmur",
          companyAddress: "Kec. Tegalsari, Kota Surabaya",
          companyPicture: "https://picsum.photos/100?random=33",
          companyPhone: "021-345-6789",
          fleetsOrdered: 3,
          fleets: [],
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
