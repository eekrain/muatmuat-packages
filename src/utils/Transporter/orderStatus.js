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
};

// Order action definitions (single source of truth for actions and labels)
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

export const ORDER_STATUS_CONFIG = {
  [ORDER_STATUS.WAITING_CONFIRMATION_SHIPPER]: {
    label: "Menunggu Konfirmasi Shipper",
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
};

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
