// Translation function will be passed as parameter

export const ORDER_STATUS = {
  WAITING_CONFIRMATION_SHIPPER: "WAITING_CONFIRMATION_SHIPPER",
  CONFIRMED: "CONFIRMED",
  NEED_ASSIGN_FLEET: "NEED_ASSIGN_FLEET",
  NEED_CONFIRMATION_READY: "NEED_CONFIRMATION_READY",
  NEED_CHANGE_RESPONSE: "NEED_CHANGE_RESPONSE",
  SCHEDULED_FLEET: "SCHEDULED_FLEET",
  LOADING: "LOADING",
  UNLOADING: "UNLOADING",
  PREPARE_DOCUMENT: "PREPARE_DOCUMENT",
  DOCUMENT_DELIVERY: "DOCUMENT_DELIVERY",
  COMPLETED: "COMPLETED",
  HEADING_TO_LOADING: "HEADING_TO_LOADING",
  HEADING_TO_UNLOADING: "HEADING_TO_UNLOADING",
  DOCUMENT_PREPARATION: "DOCUMENT_PREPARATION",
  CANCELLED_BY_TRANSPORTER: "CANCELLED_BY_TRANSPORTER",
  CANCELLED_BY_SHIPPER: "CANCELLED_BY_SHIPPER",
  CANCELLED_BY_SYSTEM: "CANCELLED_BY_SYSTEM",
  CHANGE_FLEET: "WAITING_CHANGE_FLEET",
  FLEET_FOUND: "FLEET_FOUND",
  WAITING_PAYMENT: "WAITING_PAYMENT",
};

// Order action definitions with translation support
export const getOrderActions = (t) => ({
  TRACK_FLEET: {
    type: "TRACK_FLEET",
    label: t("OrderActions.trackFleet", {}, "Lacak Armada"),
  },
  VIEW_FLEET: {
    type: "VIEW_FLEET",
    label: t("OrderActions.viewFleet", {}, "Lihat Armada"),
  },
  VIEW_ORDER_DETAIL: {
    type: "VIEW_ORDER_DETAIL",
    label: t("OrderActions.viewOrderDetail", {}, "Detail Pesanan"),
  },
  DETAIL_ARMADA: {
    type: "DETAIL_ARMADA",
    label: t("OrderActions.detailArmada", {}, "Detail Armada"),
  },
  CANCEL_ORDER: {
    type: "CANCEL_ORDER",
    label: t("OrderActions.cancelOrder", {}, "Batalkan Pesanan"),
  },
  CANCEL_FLEET: {
    type: "CANCEL_FLEET",
    label: t("OrderActions.cancelFleet", {}, "Batalkan Armada"),
  },
  ASSIGN_FLEET: {
    type: "ASSIGN_FLEET",
    label: t("OrderActions.assignFleet", {}, "Assign Armada"),
  },
  CHANGE_UNIT_COUNT: {
    type: "CHANGE_UNIT_COUNT",
    label: t("OrderActions.changeUnitCount", {}, "Ubah Jumlah Unit"),
  },
  RESPOND_CHANGE: {
    type: "RESPOND_CHANGE",
    label: t("OrderActions.respondChange", {}, "Respon Perubahan"),
  },
  CONFIRM_READY: {
    type: "CONFIRM_READY",
    label: t("OrderActions.confirmReady", {}, "Konfirmasi Siap"),
  },
  VIEW_CHANGE: {
    type: "VIEW_CHANGE",
    label: t("OrderActions.viewChange", {}, "Lihat Perubahan"),
  },
});

// Deprecated: Use getOrderActions instead
export const ORDER_ACTIONS = {
  TRACK_FLEET: {
    type: "TRACK_FLEET",
    label: "Lacak Armada",
  },
  VIEW_FLEET: {
    type: "VIEW_FLEET",
    label: "Lihat Armada",
  },
  VIEW_ORDER_DETAIL: {
    type: "VIEW_ORDER_DETAIL",
    label: "Detail Pesanan",
  },
  DETAIL_ARMADA: {
    type: "DETAIL_ARMADA",
    label: "Detail Armada",
  },
  CANCEL_ORDER: {
    type: "CANCEL_ORDER",
    label: "Batalkan Pesanan",
  },
  CANCEL_FLEET: {
    type: "CANCEL_FLEET",
    label: "Batalkan Armada",
  },
  ASSIGN_FLEET: {
    type: "ASSIGN_FLEET",
    label: "Assign Armada",
  },
  CHANGE_UNIT_COUNT: {
    type: "CHANGE_UNIT_COUNT",
    label: "Ubah Jumlah Unit",
  },
  RESPOND_CHANGE: {
    type: "RESPOND_CHANGE",
    label: "Respon Perubahan",
  },
  CONFIRM_READY: {
    type: "CONFIRM_READY",
    label: "Konfirmasi Siap",
  },
};

export const getOrderStatusConfig = (t) => ({
  [ORDER_STATUS.WAITING_CONFIRMATION_SHIPPER]: {
    label: t(
      "OrderStatus.waitingConfirmationShipper",
      {},
      "Menunggu Konfirmasi"
    ),
    variant: "primary",
  },
  [ORDER_STATUS.CONFIRMED]: {
    label: t("OrderStatus.confirmed", {}, "Pesanan Terkonfirmasi"),
    variant: "primary",
  },
  [ORDER_STATUS.NEED_ASSIGN_FLEET]: {
    label: t("OrderStatus.needAssignFleet", {}, "Perlu Assign Armada"),
    variant: "warning",
    icon: "/icons/warning14.svg",
  },
  [ORDER_STATUS.NEED_CONFIRMATION_READY]: {
    label: t("OrderStatus.needConfirmationReady", {}, "Perlu Konfirmasi Siap"),
    variant: "error",
    icon: "/icons/warning14.svg",
  },
  [ORDER_STATUS.NEED_CHANGE_RESPONSE]: {
    label: t("OrderStatus.needChangeResponse", {}, "Perlu Respon Perubahan"),
    variant: "warning",
    icon: "/icons/warning14.svg",
  },
  [ORDER_STATUS.SCHEDULED_FLEET]: {
    label: t("OrderStatus.scheduledFleet", {}, "Armada Dijadwalkan"),
    variant: "primary",
  },
  [ORDER_STATUS.LOADING]: {
    label: t("OrderStatus.loading", {}, "Proses Muat"),
    variant: "primary",
  },
  [ORDER_STATUS.UNLOADING]: {
    label: t("OrderStatus.unloading", {}, "Proses Bongkar"),
    variant: "primary",
  },
  [ORDER_STATUS.PREPARE_DOCUMENT]: {
    label: t("OrderStatus.prepareDocument", {}, "Dokumen Sedang Disiapkan"),
    variant: "primary",
  },
  [ORDER_STATUS.DOCUMENT_DELIVERY]: {
    label: t("OrderStatus.documentDelivery", {}, "Proses Pengiriman Dokumen"),
    variant: "primary",
  },
  [ORDER_STATUS.COMPLETED]: {
    label: t("OrderStatus.completed", {}, "Selesai"),
    variant: "success",
  },
  [ORDER_STATUS.HEADING_TO_LOADING]: {
    label: t("OrderStatus.headingToLoading", {}, "Menuju ke Lokasi Muat"),
    variant: "primary",
  },
  [ORDER_STATUS.HEADING_TO_UNLOADING]: {
    label: t(
      "OrderStatus.headingToUnloading",
      {},
      "Menuju ke Lokasi Bongkar 1"
    ),
    variant: "primary",
  },
  [ORDER_STATUS.DOCUMENT_PREPARATION]: {
    label: t("OrderStatus.documentPreparation", {}, "Dokumen Sedang Disiapkan"),
    variant: "primary",
  },
  [ORDER_STATUS.CANCELLED_BY_TRANSPORTER]: {
    label: t(
      "OrderStatus.cancelledByTransporter",
      {},
      "Dibatalkan Transporter"
    ),
    variant: "error",
  },
  [ORDER_STATUS.CANCELLED_BY_SHIPPER]: {
    label: t("OrderStatus.cancelledByShipper", {}, "Dibatalkan Shipper"),
    variant: "error",
  },
  [ORDER_STATUS.CANCELLED_BY_SYSTEM]: {
    label: t("OrderStatus.cancelledBySystem", {}, "Dibatalkan Sistem"),
    variant: "error",
  },
  ["ARMADA_DIJADWALKAN"]: {
    label: t("OrderStatus.armadaScheduled", {}, "Armada Dijadwalkan"),
    variant: "primary",
  },
  [ORDER_STATUS.CHANGE_FLEET]: {
    label: t("OrderStatus.changeFleet", {}, "Menunggu Armada Pengganti"),
    variant: "primary",
  },
  [ORDER_STATUS.FLEET_FOUND]: {
    label: t("OrderStatus.fleetFound", {}, "Muatan Pindah Armada"),
    variant: "primary",
  },
  [ORDER_STATUS.WAITING_PAYMENT]: {
    label: t("OrderStatus.waitingPayment", {}, "Menunggu Pembayaran"),
    variant: "warning",
  },
});

// Deprecated: Use getOrderStatusBadgeWithTranslation instead
export const ORDER_STATUS_CONFIG = {
  [ORDER_STATUS.WAITING_CONFIRMATION_SHIPPER]: {
    label: "Menunggu Konfirmasi",
    variant: "primary",
  },
  [ORDER_STATUS.CONFIRMED]: {
    label: "Pesanan Terkonfirmasi",
    variant: "primary",
  },
  [ORDER_STATUS.NEED_ASSIGN_FLEET]: {
    label: "Perlu Assign Armada",
    variant: "warning",
    icon: "/icons/warning14.svg",
  },
  [ORDER_STATUS.NEED_CONFIRMATION_READY]: {
    label: "Perlu Konfirmasi Siap",
    variant: "error",
    icon: "/icons/warning14.svg",
  },
  [ORDER_STATUS.NEED_CHANGE_RESPONSE]: {
    label: "Perlu Respon Perubahan",
    variant: "warning",
    icon: "/icons/warning14.svg",
  },
  [ORDER_STATUS.SCHEDULED_FLEET]: {
    label: "Armada Dijadwalkan",
    variant: "primary",
  },
  [ORDER_STATUS.LOADING]: {
    label: "Proses Muat",
    variant: "primary",
  },
  [ORDER_STATUS.UNLOADING]: {
    label: "Proses Bongkar",
    variant: "primary",
  },
  [ORDER_STATUS.PREPARE_DOCUMENT]: {
    label: "Dokumen Sedang Disiapkan",
    variant: "primary",
  },
  [ORDER_STATUS.DOCUMENT_DELIVERY]: {
    label: "Proses Pengiriman Dokumen",
    variant: "primary",
  },
  [ORDER_STATUS.COMPLETED]: {
    label: "Selesai",
    variant: "success",
  },
  [ORDER_STATUS.HEADING_TO_LOADING]: {
    label: "Menuju ke Lokasi Muat",
    variant: "primary",
  },
  [ORDER_STATUS.HEADING_TO_UNLOADING]: {
    label: "Menuju ke Lokasi Bongkar 1",
    variant: "primary",
  },
  [ORDER_STATUS.DOCUMENT_PREPARATION]: {
    label: "Dokumen Sedang Disiapkan",
    variant: "primary",
  },
  [ORDER_STATUS.CANCELLED_BY_TRANSPORTER]: {
    label: "Dibatalkan Transporter",
    variant: "error",
  },
  [ORDER_STATUS.CANCELLED_BY_SHIPPER]: {
    label: "Dibatalkan Shipper",
    variant: "error",
  },
  [ORDER_STATUS.CANCELLED_BY_SYSTEM]: {
    label: "Dibatalkan Sistem",
    variant: "error",
  },
  ["ARMADA_DIJADWALKAN"]: {
    label: "Armada Dijadwalkan",
    variant: "primary",
  },
  [ORDER_STATUS.CHANGE_FLEET]: {
    label: "Menunggu Armada Pengganti",
    variant: "primary",
  },
  [ORDER_STATUS.FLEET_FOUND]: {
    label: "Muatan Pindah Armada",
    variant: "primary",
  },
  [ORDER_STATUS.WAITING_PAYMENT]: {
    label: "Menunggu Pembayaran",
    variant: "warning",
  },
};

// Deprecated: Use getOrderStatusBadgeWithTranslation instead
export const getOrderStatusBadge = (status) => {
  const config = ORDER_STATUS_CONFIG[status];
  if (!config) {
    return {
      label: status,
      variant: "neutral",
    };
  }
  return config;
};

// New function that accepts translation function
export const getOrderStatusBadgeWithTranslation = (status, t) => {
  const config = getOrderStatusConfig(t)[status];
  if (!config) {
    return {
      label: status,
      variant: "neutral",
    };
  }
  return config;
};

// Helper function to create ORDER_STATUS_ACTIONS config with translation
export const createOrderStatusActionsConfig = (t) => {
  const ORDER_ACTIONS_T = getOrderActions(t);
  return {
    [ORDER_STATUS.SCHEDULED_FLEET]: {
      width: "w-[122px]",
      actions: [
        {
          ...ORDER_ACTIONS_T.VIEW_FLEET,
          isError: false,
        },
        {
          ...ORDER_ACTIONS_T.VIEW_ORDER_DETAIL,
          isError: false,
        },
        {
          ...ORDER_ACTIONS_T.CANCEL_FLEET,
          isError: true,
        },
        {
          ...ORDER_ACTIONS_T.CANCEL_ORDER,
          isError: true,
        },
      ],
    },
    [ORDER_STATUS.WAITING_CONFIRMATION_SHIPPER]: {
      width: "w-[122px]",
      actions: [
        {
          ...ORDER_ACTIONS_T.VIEW_FLEET,
          isError: false,
        },
        {
          ...ORDER_ACTIONS_T.VIEW_ORDER_DETAIL,
          isError: false,
        },
        {
          ...ORDER_ACTIONS_T.CANCEL_ORDER,
          isError: true,
        },
      ],
    },
    [ORDER_STATUS.NEED_ASSIGN_FLEET]: {
      width: "w-[122px]",
      actions: [
        {
          ...ORDER_ACTIONS_T.ASSIGN_FLEET,
          isError: false,
        },
        {
          ...ORDER_ACTIONS_T.CHANGE_UNIT_COUNT,
          isError: false,
        },
        {
          ...ORDER_ACTIONS_T.VIEW_ORDER_DETAIL,
          isError: false,
        },
        {
          ...ORDER_ACTIONS_T.CANCEL_ORDER,
          isError: true,
        },
      ],
    },
    [ORDER_STATUS.NEED_CHANGE_RESPONSE]: {
      width: "w-[137px]",
      actions: [
        {
          ...ORDER_ACTIONS_T.RESPOND_CHANGE,
          isError: false,
        },
        {
          ...ORDER_ACTIONS_T.VIEW_FLEET,
          isError: false,
        },
        {
          ...ORDER_ACTIONS_T.VIEW_ORDER_DETAIL,
          isError: false,
        },
        {
          ...ORDER_ACTIONS_T.CANCEL_FLEET,
          isError: true,
        },
        {
          ...ORDER_ACTIONS_T.CANCEL_ORDER,
          isError: true,
        },
      ],
    },
    [ORDER_STATUS.NEED_CONFIRMATION_READY]: {
      width: "w-[122px]",
      actions: [
        {
          ...ORDER_ACTIONS_T.CONFIRM_READY,
          isError: false,
        },
        {
          ...ORDER_ACTIONS_T.VIEW_FLEET,
          isError: false,
        },
        {
          ...ORDER_ACTIONS_T.VIEW_ORDER_DETAIL,
          isError: false,
        },
        {
          ...ORDER_ACTIONS_T.CANCEL_FLEET,
          isError: true,
        },
        {
          ...ORDER_ACTIONS_T.CANCEL_ORDER,
          isError: true,
        },
      ],
    },
    [ORDER_STATUS.CONFIRMED]: {
      width: "w-[122px]",
      actions: [
        {
          ...ORDER_ACTIONS_T.VIEW_FLEET,
          isError: false,
        },
        {
          ...ORDER_ACTIONS_T.VIEW_ORDER_DETAIL,
          isError: false,
        },
      ],
    },
    [ORDER_STATUS.PREPARE_DOCUMENT]: {
      width: "w-[122px]",
      actions: [
        {
          ...ORDER_ACTIONS_T.VIEW_FLEET,
          isError: false,
        },
        {
          ...ORDER_ACTIONS_T.VIEW_ORDER_DETAIL,
          isError: false,
        },
      ],
    },
    [ORDER_STATUS.DOCUMENT_DELIVERY]: {
      width: "w-[122px]",
      actions: [
        {
          ...ORDER_ACTIONS_T.VIEW_FLEET,
          isError: false,
        },
        {
          ...ORDER_ACTIONS_T.VIEW_ORDER_DETAIL,
          isError: false,
        },
      ],
    },
  };
};

// Deprecated: Use getOrderStatusActionsWithTranslation instead
// Action configurations for different order statuses (for Transporter)
export const ORDER_STATUS_ACTIONS = {
  [ORDER_STATUS.SCHEDULED_FLEET]: {
    width: "w-[122px]",
    actions: [
      {
        ...ORDER_ACTIONS.VIEW_FLEET,
        isError: false,
      },
      {
        ...ORDER_ACTIONS.VIEW_ORDER_DETAIL,
        isError: false,
      },
      {
        ...ORDER_ACTIONS.CANCEL_FLEET,
        isError: true,
      },
      {
        ...ORDER_ACTIONS.CANCEL_ORDER,
        isError: true,
      },
    ],
  },
  [ORDER_STATUS.WAITING_CONFIRMATION_SHIPPER]: {
    width: "w-[122px]",
    actions: [
      {
        ...ORDER_ACTIONS.VIEW_FLEET,
        isError: false,
      },
      {
        ...ORDER_ACTIONS.VIEW_ORDER_DETAIL,
        isError: false,
      },
      {
        ...ORDER_ACTIONS.CANCEL_ORDER,
        isError: true,
      },
    ],
  },
  [ORDER_STATUS.NEED_ASSIGN_FLEET]: {
    width: "w-[122px]",
    actions: [
      {
        ...ORDER_ACTIONS.ASSIGN_FLEET,
        isError: false,
      },
      {
        ...ORDER_ACTIONS.CHANGE_UNIT_COUNT,
        isError: false,
      },
      {
        ...ORDER_ACTIONS.VIEW_ORDER_DETAIL,
        isError: false,
      },
      {
        ...ORDER_ACTIONS.CANCEL_ORDER,
        isError: true,
      },
    ],
  },
  [ORDER_STATUS.NEED_CHANGE_RESPONSE]: {
    width: "w-[137px]",
    actions: [
      {
        ...ORDER_ACTIONS.RESPOND_CHANGE,
        isError: false,
      },
      {
        ...ORDER_ACTIONS.VIEW_FLEET,
        isError: false,
      },
      {
        ...ORDER_ACTIONS.VIEW_ORDER_DETAIL,
        isError: false,
      },
      {
        ...ORDER_ACTIONS.CANCEL_FLEET,
        isError: true,
      },
      {
        ...ORDER_ACTIONS.CANCEL_ORDER,
        isError: true,
      },
    ],
  },
  [ORDER_STATUS.NEED_CONFIRMATION_READY]: {
    width: "w-[122px]",
    actions: [
      {
        ...ORDER_ACTIONS.CONFIRM_READY,
        isError: false,
      },
      {
        ...ORDER_ACTIONS.VIEW_FLEET,
        isError: false,
      },
      {
        ...ORDER_ACTIONS.VIEW_ORDER_DETAIL,
        isError: false,
      },
      {
        ...ORDER_ACTIONS.CANCEL_FLEET,
        isError: true,
      },
      {
        ...ORDER_ACTIONS.CANCEL_ORDER,
        isError: true,
      },
    ],
  },
  [ORDER_STATUS.CONFIRMED]: {
    width: "w-[122px]",
    actions: [
      {
        ...ORDER_ACTIONS.VIEW_FLEET,
        isError: false,
      },
      {
        ...ORDER_ACTIONS.VIEW_ORDER_DETAIL,
        isError: false,
      },
    ],
  },
  [ORDER_STATUS.PREPARE_DOCUMENT]: {
    width: "w-[122px]",
    actions: [
      {
        ...ORDER_ACTIONS.VIEW_FLEET,
        isError: false,
      },
      {
        ...ORDER_ACTIONS.VIEW_ORDER_DETAIL,
        isError: false,
      },
    ],
  },
  [ORDER_STATUS.DOCUMENT_DELIVERY]: {
    width: "w-[122px]",
    actions: [
      {
        ...ORDER_ACTIONS.VIEW_FLEET,
        isError: false,
      },
      {
        ...ORDER_ACTIONS.VIEW_ORDER_DETAIL,
        isError: false,
      },
    ],
  },
};

// Helper function to generate LOADING actions based on truck count with translation
const getLoadingActionsWithTranslation = (truckCount, t) => {
  const ORDER_ACTIONS_T = getOrderActions(t);
  const baseActions = [
    { ...ORDER_ACTIONS_T.TRACK_FLEET, isError: false },
    { ...ORDER_ACTIONS_T.VIEW_FLEET, isError: false },
    { ...ORDER_ACTIONS_T.VIEW_ORDER_DETAIL, isError: false },
  ];

  if (truckCount === 1) {
    // For 1 unit: add only "Batalkan Pesanan"
    baseActions.push({ ...ORDER_ACTIONS_T.CANCEL_ORDER, isError: true });
  } else {
    // For > 1 unit: add both "Batalkan Armada" and "Batalkan Pesanan"
    baseActions.push({ ...ORDER_ACTIONS_T.CANCEL_FLEET, isError: true });
    baseActions.push({ ...ORDER_ACTIONS_T.CANCEL_ORDER, isError: true });
  }

  return {
    width: truckCount === 1 ? "w-[122px]" : "w-[137px]",
    actions: baseActions,
  };
};

// Deprecated: Use getLoadingActionsWithTranslation instead
// Helper function to generate LOADING actions based on truck count
const getLoadingActions = (truckCount) => {
  const baseActions = [
    { ...ORDER_ACTIONS.TRACK_FLEET, isError: false },
    { ...ORDER_ACTIONS.VIEW_FLEET, isError: false },
    { ...ORDER_ACTIONS.VIEW_ORDER_DETAIL, isError: false },
  ];

  if (truckCount === 1) {
    // For 1 unit: add only "Batalkan Pesanan"
    baseActions.push({ ...ORDER_ACTIONS.CANCEL_ORDER, isError: true });
  } else {
    // For > 1 unit: add both "Batalkan Armada" and "Batalkan Pesanan"
    baseActions.push({ ...ORDER_ACTIONS.CANCEL_FLEET, isError: true });
    baseActions.push({ ...ORDER_ACTIONS.CANCEL_ORDER, isError: true });
  }

  return {
    width: truckCount === 1 ? "w-[122px]" : "w-[137px]",
    actions: baseActions,
  };
};

// Helper function to generate UNLOADING actions based on truck count with translation
const getUnloadingActionsWithTranslation = (truckCount, t) => {
  const ORDER_ACTIONS_T = getOrderActions(t);
  const baseActions = [
    { ...ORDER_ACTIONS_T.TRACK_FLEET, isError: false },
    { ...ORDER_ACTIONS_T.VIEW_FLEET, isError: false },
  ];

  if (truckCount === 1) {
    // For 1 unit: add only "Detail Pesanan" (no cancel actions)
    baseActions.push({ ...ORDER_ACTIONS_T.VIEW_ORDER_DETAIL, isError: false });
  } else {
    // For > 1 unit: add "Detail Armada", "Batalkan Armada", and "Batalkan Pesanan"
    baseActions.push({ ...ORDER_ACTIONS_T.DETAIL_ARMADA, isError: false });
    baseActions.push({ ...ORDER_ACTIONS_T.CANCEL_FLEET, isError: true });
    baseActions.push({ ...ORDER_ACTIONS_T.CANCEL_ORDER, isError: true });
  }

  return {
    width: truckCount === 1 ? "w-[122px]" : "w-[137px]",
    actions: baseActions,
  };
};

// Deprecated: Use getUnloadingActionsWithTranslation instead
// Helper function to generate UNLOADING actions based on truck count
const getUnloadingActions = (truckCount) => {
  const baseActions = [
    { ...ORDER_ACTIONS.TRACK_FLEET, isError: false },
    { ...ORDER_ACTIONS.VIEW_FLEET, isError: false },
  ];

  if (truckCount === 1) {
    // For 1 unit: add only "Detail Pesanan" (no cancel actions)
    baseActions.push({ ...ORDER_ACTIONS.VIEW_ORDER_DETAIL, isError: false });
  } else {
    // For > 1 unit: add "Detail Armada", "Batalkan Armada", and "Batalkan Pesanan"
    baseActions.push({ ...ORDER_ACTIONS.DETAIL_ARMADA, isError: false });
    baseActions.push({ ...ORDER_ACTIONS.CANCEL_FLEET, isError: true });
    baseActions.push({ ...ORDER_ACTIONS.CANCEL_ORDER, isError: true });
  }

  return {
    width: truckCount === 1 ? "w-[122px]" : "w-[137px]",
    actions: baseActions,
  };
};

// Deprecated: Use getOrderStatusActionsWithTranslation instead
export const getOrderStatusActions = (status, row = null) => {
  // Handle LOADING status with conditional actions
  if (status === ORDER_STATUS.LOADING && row) {
    return getLoadingActions(row.truckCount);
  }

  // Handle UNLOADING status with conditional actions
  if (status === ORDER_STATUS.UNLOADING && row) {
    return getUnloadingActions(row.truckCount);
  }

  return ORDER_STATUS_ACTIONS[status] || null;
};

// New function that accepts translation function
export const getOrderStatusActionsWithTranslation = (status, row = null, t) => {
  const STATUS_ACTIONS = createOrderStatusActionsConfig(t);

  // Handle LOADING status with conditional actions
  if (status === ORDER_STATUS.LOADING && row) {
    return getLoadingActionsWithTranslation(row.truckCount, t);
  }

  // Handle UNLOADING status with conditional actions
  if (status === ORDER_STATUS.UNLOADING && row) {
    return getUnloadingActionsWithTranslation(row.truckCount, t);
  }

  return STATUS_ACTIONS[status] || null;
};
