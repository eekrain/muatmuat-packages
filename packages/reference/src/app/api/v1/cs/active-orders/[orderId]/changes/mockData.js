export const successResponse = {
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
};

// LD-89: No price adjustment scenario
export const noPriceAdjustmentResponse = {
  Message: {
    Code: 200,
    Text: "Detail perubahan pesanan berhasil diambil",
  },
  Data: {
    changeId: "change-002",
    changeType: "TIME_ONLY",
    requestedAt: "2025-01-15T09:00:00Z",
    requestedBy: {
      userId: "user-002",
      userType: "SHIPPER",
      userName: "PT Global Logistics",
    },
    urgencyLevel: "MEDIUM",
    changes: {
      scheduleChanges: {
        hasScheduleChange: true,
        originalPickupDateTime: "2025-01-15T08:00:00Z",
        newPickupDateTime: "2025-01-15T09:00:00Z",
        originalDeliveryDateTime: "2025-01-16T16:00:00Z",
        newDeliveryDateTime: "2025-01-16T17:00:00Z",
      },
      locationChanges: {
        hasLocationChange: false,
        pickupLocationChanges: [],
        deliveryLocationChanges: [],
      },
      routeImpact: {
        originalEstimatedDistance: 45000,
        newEstimatedDistance: 45000,
        distanceDifference: 0,
        originalEstimatedDuration: 360,
        newEstimatedDuration: 360,
        durationDifference: 0,
      },
    },
    financialImpact: {
      hasPriceAdjustment: false,
      originalPrice: 2500000,
      priceAdjustment: 0,
      newTotalPrice: 2500000,
      penaltyAmount: 0,
      adminFee: 0,
      taxAmount: 0,
      totalAdjustment: 0,
    },
    status: {
      isConfirmed: false,
      confirmedBy: null,
      confirmationDateTime: null,
      rejectionReason: null,
    },
  },
  Type: "ORDER_CHANGE_DETAILS",
};

// LD-91: Only pickup location change
export const pickupLocationOnlyResponse = {
  Message: {
    Code: 200,
    Text: "Detail perubahan pesanan berhasil diambil",
  },
  Data: {
    changeId: "change-003",
    changeType: "LOCATION_ONLY",
    requestedAt: "2025-01-15T10:15:00Z",
    requestedBy: {
      userId: "user-003",
      userType: "SHIPPER",
      userName: "CV Mandiri Jaya",
    },
    urgencyLevel: "LOW",
    changes: {
      scheduleChanges: {
        hasScheduleChange: false,
        originalPickupDateTime: "2025-01-15T08:00:00Z",
        newPickupDateTime: "2025-01-15T08:00:00Z",
        originalDeliveryDateTime: "2025-01-16T16:00:00Z",
        newDeliveryDateTime: "2025-01-16T16:00:00Z",
      },
      locationChanges: {
        hasLocationChange: true,
        pickupLocationChanges: [
          {
            changeType: "MODIFIED",
            originalLocation: {
              address: "Jl. Gatot Subroto No. 456, Jakarta Selatan",
              city: "Jakarta Selatan",
              province: "DKI Jakarta",
            },
            newLocation: {
              address: "Jl. Kuningan Raya No. 101, Jakarta Selatan",
              city: "Jakarta Selatan",
              province: "DKI Jakarta",
            },
          },
        ],
        deliveryLocationChanges: [],
      },
      routeImpact: {
        originalEstimatedDistance: 45000,
        newEstimatedDistance: 47000,
        distanceDifference: 2000,
        originalEstimatedDuration: 360,
        newEstimatedDuration: 380,
        durationDifference: 20,
      },
    },
    financialImpact: {
      hasPriceAdjustment: true,
      originalPrice: 2500000,
      priceAdjustment: 100000,
      newTotalPrice: 2600000,
      penaltyAmount: 0,
      adminFee: 10000,
      taxAmount: 11000,
      totalAdjustment: 121000,
    },
    status: {
      isConfirmed: false,
      confirmedBy: null,
      confirmationDateTime: null,
      rejectionReason: null,
    },
  },
  Type: "ORDER_CHANGE_DETAILS",
};

export const errorResponse = {
  Message: {
    Code: 400,
    Text: "Order ID tidak valid atau tidak ditemukan",
  },
  Data: null,
  Type: "ORDER_CHANGE_DETAILS",
};

export const serverErrorResponse = {
  Message: {
    Code: 500,
    Text: "Terjadi kesalahan pada server",
  },
  Data: null,
  Type: "ORDER_CHANGE_DETAILS",
};
