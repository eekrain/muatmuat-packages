export const orderStatusSummaryData = {
  "order-001": {
    primaryStatus: {
      statusCode: "LOADING",
      statusName: "Proses Muat",
      statusDescription:
        "Armada sedang dalam proses memuat barang di lokasi muat",
      lastUpdated: "2025-08-25T10:30:00Z",
    },
    isMultipleStatus: true,
    statusBreakdown: [
      {
        statusCode: "LOADING",
        statusName: "Proses Muat",
        unitCount: 15,
        percentage: 60.0,
        fleetIds: ["fleet-001", "fleet-002", "fleet-003"],
      },
      {
        statusCode: "ON_THE_WAY",
        statusName: "Dalam Perjalanan",
        unitCount: 8,
        percentage: 32.0,
        fleetIds: ["fleet-004", "fleet-005"],
      },
      {
        statusCode: "WAITING",
        statusName: "Menunggu",
        unitCount: 2,
        percentage: 8.0,
        fleetIds: ["fleet-006"],
      },
    ],
    orderChanges: {
      hasChanges: true,
      changeCount: 3,
      lastChangeDateTime: "2025-08-25T09:15:00Z",
      pendingChanges: [
        {
          changeId: "change-001",
          changeType: "ROUTE_CHANGE",
          changeDescription:
            "Perubahan rute pengiriman dari Bandung ke Cirebon",
          changedAt: "2025-08-25T09:15:00Z",
          isChangeConfirmed: false,
          requiresResponse: true,
        },
        {
          changeId: "change-002",
          changeType: "TIME_CHANGE",
          changeDescription: "Perubahan jadwal muat dari 08:00 menjadi 10:00",
          changedAt: "2025-08-25T08:45:00Z",
          isChangeConfirmed: true,
          requiresResponse: false,
        },
      ],
    },
    paymentInfo: {
      paymentStatus: "PENDING",
      paymentMethod: "BANK_TRANSFER",
      totalPrice: 15750000.0,
      paymentDue: "2025-08-25T23:59:59Z",
    },
  },
  "order-002": {
    primaryStatus: {
      statusCode: "DELIVERED",
      statusName: "Selesai",
      statusDescription: "Semua armada telah menyelesaikan pengiriman",
      lastUpdated: "2025-08-25T14:20:00Z",
    },
    isMultipleStatus: false,
    statusBreakdown: [
      {
        statusCode: "DELIVERED",
        statusName: "Selesai",
        unitCount: 5,
        percentage: 100.0,
        fleetIds: [
          "fleet-007",
          "fleet-008",
          "fleet-009",
          "fleet-010",
          "fleet-011",
        ],
      },
    ],
    orderChanges: {
      hasChanges: false,
      changeCount: 0,
      lastChangeDateTime: null,
      pendingChanges: [],
    },
    paymentInfo: {
      paymentStatus: "PAID",
      paymentMethod: "VIRTUAL_ACCOUNT",
      totalPrice: 8500000.0,
      paymentDue: null,
    },
  },
  "order-003": {
    primaryStatus: {
      statusCode: "CANCELLED",
      statusName: "Dibatalkan",
      statusDescription: "Pesanan dibatalkan oleh shipper",
      lastUpdated: "2025-08-25T11:45:00Z",
    },
    isMultipleStatus: false,
    statusBreakdown: [
      {
        statusCode: "CANCELLED",
        statusName: "Dibatalkan",
        unitCount: 3,
        percentage: 100.0,
        fleetIds: ["fleet-012", "fleet-013", "fleet-014"],
      },
    ],
    orderChanges: {
      hasChanges: true,
      changeCount: 1,
      lastChangeDateTime: "2025-08-25T11:40:00Z",
      pendingChanges: [
        {
          changeId: "change-003",
          changeType: "ORDER_CANCELLATION",
          changeDescription:
            "Pembatalan pesanan karena perubahan rencana bisnis",
          changedAt: "2025-08-25T11:40:00Z",
          isChangeConfirmed: true,
          requiresResponse: false,
        },
      ],
    },
    paymentInfo: {
      paymentStatus: "REFUNDED",
      paymentMethod: "BANK_TRANSFER",
      totalPrice: 0.0,
      paymentDue: null,
    },
  },
};
