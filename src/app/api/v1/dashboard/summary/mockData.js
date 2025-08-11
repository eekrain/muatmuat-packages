// app/api/v1/dashboard/summary/mockData.js

export const mockDashboardSummaryData = {
  lastUpdated: "2025-01-22T18:15:00Z",
  dataAvailable: true,
  sections: {
    orders: {
      waitingConfirmation: { count: 2 },
      confirmed: { count: 2 },
      scheduled: { count: 2 },
      loading: { count: 2 },
      unloading: { count: 2 },
      documentPreparation: { count: 2 },
      documentDelivery: { count: 2 },
      completed: { count: 2 },
    },
    earnings: {
      totalEarnings: 10000000,
      disbursed: 100000000,
      potentialEarnings: 2000000,
      pending: 100000000,
      totalClaims: 10000000,
    },
    alerts: {
      needResponse: { count: 2 },
      needConfirmation: { count: 2 },
      needAssignment: { count: 2 },
      newReviews: { count: 2 },
      sosReports: { count: 1 },
    },
    performance: {
      overallRating: 4.9,
      cancelledOrders: 2,
      penalties: 2,
    },
  },
};

export const mockAccountStatusData = {
  accountStatus: "suspended",
  isSuspended: true,
  suspensionMessage:
    "Akun kamu ditangguhkan, hubungi dukungan pelanggan untuk aktivasi kembali",
  contactSupport: {
    linkText: "disini",
  },
};

export const successShell = {
  Message: { Code: 200, Text: "Dashboard summary retrieved successfully" },
  Data: {},
  Type: "DASHBOARD_SUMMARY_WITH_STATUS",
};

export const serverErrorResponse = {
  Message: { Code: 500, Text: "Internal Server Error" },
  Data: {
    errors: [{ field: "general", message: "An unexpected error occurred." }],
  },
  Type: "INTERNAL_SERVER_ERROR",
};
