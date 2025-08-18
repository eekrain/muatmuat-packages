export const orderChangeDetailsData = {
  "order-004": {
    changeType: "LOCATION_AND_TIME",
    originalData: {
      loadTimeStart: "2025-01-02T11:00:00Z",
      loadTimeEnd: "2025-01-02T15:00:00Z",
      estimatedDistance: 178000, // in meters
      locations: [
        {
          locationType: "PICKUP",
          fullAddress: "Kota Surabaya, Kec. Tegalsari",
          sequence: 1,
        },
        {
          locationType: "PICKUP",
          fullAddress: "Kab. Sidoarjo, Kec. Sedati",
          sequence: 2,
        },
        {
          locationType: "DROPOFF",
          fullAddress: "Kab. Pasuruan, Kec. Klojen",
          sequence: 1,
        },
        {
          locationType: "DROPOFF",
          fullAddress: "Kab. Malang, Kec. Singosari",
          sequence: 2,
        },
      ],
    },
    requestedChanges: {
      loadTimeStart: "2025-01-01T11:00:00Z",
      loadTimeEnd: "2025-01-01T15:00:00Z",
      estimatedDistance: 182000,
      locations: [
        {
          locationType: "PICKUP",
          fullAddress: "Kota Surabaya, Kec. Wonorejo",
          sequence: 1,
        },
        {
          locationType: "PICKUP",
          fullAddress: "Kab. Sidoarjo, Kec. Sedati",
          sequence: 2,
        },
        {
          locationType: "DROPOFF",
          fullAddress: "Kab. Pasuruan, Kec. Klojen",
          sequence: 1,
        },
        {
          locationType: "DROPOFF",
          fullAddress: "Kab. Malang, Kec. Blimbing",
          sequence: 2,
        },
      ],
    },
    incomeAdjustment: {
      hasAdjustment: true,
      originalAmount: 24500000,
      adjustedAmount: 25400000,
    },
  },
};
