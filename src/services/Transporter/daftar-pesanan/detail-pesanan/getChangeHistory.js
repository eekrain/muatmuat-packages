import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// Use mock data for development since server data is not available yet
const useMockData = true;

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Change history retrieved successfully",
    },
    Data: {
      orderId: "order-uuid-001",
      orderCode: "MT25A002A",
      totalChanges: 3,
      currentPage: 1,
      totalPages: 1,
      timeline: [
        {
          id: "change-uuid-001",
          changeType: "VEHICLE_CHANGE",
          timestamp: "2025-03-15T14:30:00Z",
          formattedTime: "15 Mar 2025, 14:30 WIB",
          title: "Perubahan Armada",
          description: "Armada berhasil diubah dari B 1111 OLD ke B 1234 ABC",
          changedBy: {
            userId: "user-uuid-001",
            userName: "Admin Transport",
            role: "TRANSPORTER",
          },
          changes: {
            vehicle: {
              from: {
                vehicleId: "vehicle-uuid-old",
                licensePlate: "B 1111 OLD",
                truckType: "Colt Diesel Engkel - Box",
                driverName: "Old Driver",
                driverPhone: "081111111111",
                vehicleImage: "https://example.com/old-truck.jpg",
                status: "ARMADA_DIJADWALKAN",
              },
              to: {
                vehicleId: "vehicle-uuid-new",
                licensePlate: "B 1234 ABC",
                truckType: "Colt Diesel Engkel - Box",
                driverName: "John Doe",
                driverPhone: "081234567890",
                vehicleImage: "https://example.com/new-truck.jpg",
                status: "ARMADA_DIJADWALKAN",
              },
            },
          },
          reason: "Armada sebelumnya mengalami kerusakan",
          penaltyAmount: 0.0,
          relatedToShipperChange: false,
          canExpand: true,
        },
        {
          id: "change-uuid-002",
          changeType: "DRIVER_CHANGE",
          timestamp: "2025-03-15T12:15:00Z",
          formattedTime: "15 Mar 2025, 12:15 WIB",
          title: "Perubahan Driver",
          description: "Driver berhasil diubah dari Jane Old ke John Doe",
          changedBy: {
            userId: "user-uuid-001",
            userName: "Admin Transport",
            role: "TRANSPORTER",
          },
          changes: {
            driver: {
              from: {
                driverId: "driver-uuid-old",
                name: "Jane Old",
                phoneNumber: "081111111111",
                profileImage: "https://example.com/old-driver.jpg",
              },
              to: {
                driverId: "driver-uuid-new",
                name: "John Doe",
                phoneNumber: "081234567890",
                profileImage: "https://example.com/new-driver.jpg",
              },
              relatedVehicle: {
                vehicleId: "vehicle-uuid-new",
                licensePlate: "B 1234 ABC",
                truckType: "Colt Diesel Engkel - Box",
                vehicleImage: "https://example.com/truck.jpg",
              },
            },
          },
          reason: "Driver sebelumnya berhalangan hadir",
          penaltyAmount: 0.0,
          relatedToShipperChange: false,
          canExpand: true,
        },
        {
          id: "change-uuid-003",
          changeType: "SHIPPER_RESPONSE",
          timestamp: "2025-03-15T10:00:00Z",
          formattedTime: "15 Mar 2025, 10:00 WIB",
          title: "Respon Perubahan Shipper",
          description: "Terima perubahan dan ubah armada",
          changedBy: {
            userId: "user-uuid-001",
            userName: "Admin Transport",
            role: "TRANSPORTER",
          },
          shipperChangeDetails: {
            responseType: "ACCEPT_WITH_VEHICLE_CHANGE",
            shipperChanges: {
              route: {
                from: {
                  estimatedDistance: 150.0,
                  pickupAddress: "Jl. Lama No. 100",
                  dropoffAddress: "Jl. Tujuan Lama No. 200",
                },
                to: {
                  estimatedDistance: 178.5,
                  pickupAddress: "Jl. Sudirman No. 123",
                  dropoffAddress: "Jl. Thamrin No. 456",
                },
                routeChanged: true,
                routeChangeReason: "Perubahan lokasi pickup dari shipper",
              },
              incomeAdjustment: {
                additionalAmount: 25000.0,
                adjustmentReason: "Penyesuaian perubahan rute",
                formattedAmount: "+Rp25.000",
              },
            },
            transporterResponse: {
              vehicleChange: {
                from: {
                  licensePlate: "B 5555 OLD",
                  truckType: "Colt Diesel Single - Box",
                },
                to: {
                  licensePlate: "B 1234 ABC",
                  truckType: "Colt Diesel Engkel - Box",
                },
              },
            },
          },
          canExpand: true,
          expanded: false,
        },
      ],
      summary: {
        totalVehicleChanges: 1,
        totalDriverChanges: 1,
        totalShipperResponses: 1,
        lastChangeDate: "2025-03-15T14:30:00Z",
      },
    },
    Type: "CHANGE_HISTORY",
  },
};

// Fetcher function
export const fetcherChangeHistory = async (cacheKey) => {
  if (useMockData) {
    return mockAPIResult.data.Data;
  }
  const result = await fetcherMuatrans.get(cacheKey);
  return result?.data?.Data || {};
};

// SWR Hook
export const useGetChangeHistory = (orderId, params = {}, options = {}) => {
  const queryParams = new URLSearchParams(params).toString();

  const cacheKey = orderId
    ? `/v1/transporter/orders/${orderId}/change-history${
        queryParams ? `?${queryParams}` : ""
      }`
    : null;

  return useSWR(cacheKey, fetcherChangeHistory, options);
};
