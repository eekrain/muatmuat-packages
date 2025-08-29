import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true; // Set to false when real API is ready

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Detail perubahan pesanan berhasil diambil",
    },
    Data: {
      changeId: "change-001",
      changeType: "LOCATION_AND_TIME",
      requestedAt: "2025-01-15T08:30:00Z",
      requestedBy: {
        userId: "user-001",
        userType: "SHIPPER",
        userName: "PT Sumber Makmur Industries",
      },
      urgencyLevel: "HIGH",
      changes: {
        scheduleChanges: {
          hasScheduleChange: true,
          originalPickupDateTime: "2025-01-15T08:00:00Z",
          newPickupDateTime: "2025-01-15T10:00:00Z",
          originalDeliveryDateTime: "2025-01-16T16:00:00Z",
          newDeliveryDateTime: "2025-01-16T18:00:00Z",
        },
        locationChanges: {
          hasLocationChange: true,
          pickupLocationChanges: [
            {
              changeType: "MODIFIED",
              originalLocation: {
                address: "Jl. Sudirman No. 123, Jakarta Pusat",
                city: "Jakarta Pusat",
                province: "DKI Jakarta",
              },
              newLocation: {
                address: "Jl. MH Thamrin No. 888, Jakarta Pusat",
                city: "Jakarta Pusat",
                province: "DKI Jakarta",
              },
            },
          ],
          deliveryLocationChanges: [
            {
              changeType: "MODIFIED",
              originalLocation: {
                address: "Jl. Ahmad Yani No. 789, Surabaya",
                city: "Surabaya",
                province: "Jawa Timur",
              },
              newLocation: {
                address: "Jl. Diponegoro No. 321, Malang",
                city: "Malang",
                province: "Jawa Timur",
              },
            },
          ],
        },
        routeImpact: {
          originalEstimatedDistance: 45000,
          newEstimatedDistance: 52000,
          distanceDifference: 7000,
          originalEstimatedDuration: 360,
          newEstimatedDuration: 420,
          durationDifference: 60,
        },
      },
      financialImpact: {
        hasPriceAdjustment: true,
        originalPrice: 2500000,
        priceAdjustment: 250000,
        newTotalPrice: 2750000,
        penaltyAmount: 0,
        adminFee: 15000,
        taxAmount: 27500,
        totalAdjustment: 292500,
      },
      status: {
        isConfirmed: false,
        confirmedBy: null,
        confirmationDateTime: null,
        rejectionReason: null,
      },
    },
    Type: "ORDER_CHANGE_DETAILS",
  },
};

// Fetcher function
export const getOrderChanges = async (orderId) => {
  let result;
  if (useMockData) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    result = mockAPIResult;
  } else {
    result = await fetcherMuatrans.get(
      `/v1/cs/active-orders/${orderId}/changes`
    );
  }
  return result.data.Data;
};

// SWR hook for GET request
export const useGetOrderChanges = (orderId) =>
  useSWR(orderId ? `order-changes/${orderId}` : null, () =>
    getOrderChanges(orderId)
  );

// Transform function to convert API data to UI component format
export const transformOrderChangesForUI = (apiData) => {
  if (!apiData) return null;

  const {
    changeId,
    changeType,
    requestedAt,
    requestedBy,
    urgencyLevel,
    changes,
    financialImpact,
    status,
  } = apiData;

  return {
    // Basic change information
    changeId,
    changeType,
    requestedAt,
    requestedBy,
    urgencyLevel,

    // Schedule changes
    hasScheduleChange: changes?.scheduleChanges?.hasScheduleChange || false,
    originalLoadTime: {
      start: changes?.scheduleChanges?.originalPickupDateTime,
      end: changes?.scheduleChanges?.originalDeliveryDateTime,
    },
    newLoadTime: {
      start: changes?.scheduleChanges?.newPickupDateTime,
      end: changes?.scheduleChanges?.newDeliveryDateTime,
    },

    // Location changes
    hasLocationChange: changes?.locationChanges?.hasLocationChange || false,
    pickupChanges: changes?.locationChanges?.pickupLocationChanges || [],
    deliveryChanges: changes?.locationChanges?.deliveryLocationChanges || [],

    // Route impact
    distanceChange: {
      original: changes?.routeImpact?.originalEstimatedDistance || 0,
      new: changes?.routeImpact?.newEstimatedDistance || 0,
      difference: changes?.routeImpact?.distanceDifference || 0,
    },
    durationChange: {
      original: changes?.routeImpact?.originalEstimatedDuration || 0,
      new: changes?.routeImpact?.newEstimatedDuration || 0,
      difference: changes?.routeImpact?.durationDifference || 0,
    },

    // Financial impact
    hasIncomeAdjustment: financialImpact?.hasPriceAdjustment || false,
    originalAmount: financialImpact?.originalPrice || 0,
    adjustedAmount: financialImpact?.newTotalPrice || 0,
    priceAdjustment: financialImpact?.priceAdjustment || 0,
    adminFee: financialImpact?.adminFee || 0,
    taxAmount: financialImpact?.taxAmount || 0,
    totalAdjustment: financialImpact?.totalAdjustment || 0,

    // Status information
    isConfirmed: status?.isConfirmed || false,
    confirmedBy: status?.confirmedBy,
    confirmationDateTime: status?.confirmationDateTime,
    rejectionReason: status?.rejectionReason,
  };
};
