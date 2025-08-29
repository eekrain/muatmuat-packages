export const dashboardData = {
  Message: {
    Code: 200,
    Text: "Dashboard data retrieved successfully",
  },
  Data: {
    user: {
      id: "user-cs-001",
      name: "Daffa Toldo",
      role: "CS",
    },
    orderCounts: {
      active: 30,
      history: 156,
      urgent: 4,
    },
    urgentCounts: {
      PERLU_RESPON_PERUBAHAN: 0,
      PERLU_KONFIRMASI_SIAP: 2,
      PERLU_ASSIGN_ARMADA: 2,
    },
    urgentOrders: [
      {
        id: "order-004",
        orderNumber: "MT25A004A",
        urgencyLevel: "high",
        responseDeadline: new Date(
          Date.now() + 2 * 60 * 60 * 1000
        ).toISOString(),
      },
    ],
    navigationAccess: {
      canViewOrders: true,
      canManageDocuments: true,
      canCancelOrders: false,
    },
  },
  Type: "CS_DASHBOARD_DATA",
};
