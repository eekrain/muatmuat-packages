export const ORDER_STATUS = {
  PREPARE_FLEET: "PREPARE_FLEET",
  NEED_ASSIGN_FLEET: "NEED_ASSIGN_FLEET",
  WAITING_PAYMENT_1: "WAITING_PAYMENT_1",
  WAITING_PAYMENT_2: "WAITING_PAYMENT_2",
  SCHEDULED_FLEET: "SCHEDULED_FLEET",
  CONFIRMED: "CONFIRMED",
  LOADING: "LOADING",
  UNLOADING: "UNLOADING",
  WAITING_REPAYMENT_1: "WAITING_REPAYMENT_1",
  WAITING_REPAYMENT_2: "WAITING_REPAYMENT_2",
  PREPARE_DOCUMENT: "PREPARE_DOCUMENT",
  DOCUMENT_DELIVERY: "DOCUMENT_DELIVERY",
  COMPLETED: "COMPLETED",
  CANCELED_BY_SYSTEM: "CANCELED_BY_SYSTEM",
  CANCELED_BY_SHIPPER: "CANCELED_BY_SHIPPER",
  CANCELED_BY_TRANSPORTER: "CANCELED_BY_TRANSPORTER",
  WAITING_PAYMENT_3: "WAITING_PAYMENT_3",
  WAITING_PAYMENT_4: "WAITING_PAYMENT_4",
  WAITING_CONFIRMATION_CHANGES: "WAITING_CONFIRMATION_CHANGES",
  PREPARE_FLEET_CHANGES: "PREPARE_FLEET_CHANGES",
  CONFIRMED_CHANGES: "CONFIRMED_CHANGES",
  FLEET_CHANGE: "FLEET_CHANGE",
};

export const ORDER_STATUS_CONFIG = {
  [ORDER_STATUS.PREPARE_FLEET]: {
    label: "Persiapan Armada",
    variant: "primary",
  },
  [ORDER_STATUS.NEED_ASSIGN_FLEET]: {
    label: "Perlu Assign Armada",
    variant: "warning",
  },
  [ORDER_STATUS.WAITING_PAYMENT_1]: {
    label: "Menunggu Pembayaran 1",
    variant: "warning",
  },
  [ORDER_STATUS.WAITING_PAYMENT_2]: {
    label: "Menunggu Pembayaran 2",
    variant: "warning",
  },
  [ORDER_STATUS.SCHEDULED_FLEET]: {
    label: "Menunggu Konfirmasi",
    variant: "primary",
  },
  [ORDER_STATUS.CONFIRMED]: {
    label: "Pesanan Terkonfirmasi",
    variant: "primary",
  },
  [ORDER_STATUS.LOADING]: {
    label: "Sedang Muat",
    variant: "primary",
  },
  [ORDER_STATUS.UNLOADING]: {
    label: "Sedang Bongkar",
    variant: "primary",
  },
  [ORDER_STATUS.WAITING_REPAYMENT_1]: {
    label: "Menunggu Pelunasan 1",
    variant: "warning",
  },
  [ORDER_STATUS.WAITING_REPAYMENT_2]: {
    label: "Menunggu Pelunasan 2",
    variant: "warning",
  },
  [ORDER_STATUS.PREPARE_DOCUMENT]: {
    label: "Persiapan Dokumen",
    variant: "primary",
  },
  [ORDER_STATUS.DOCUMENT_DELIVERY]: {
    label: "Pengiriman Dokumen",
    variant: "primary",
  },
  [ORDER_STATUS.COMPLETED]: {
    label: "Selesai",
    variant: "success",
  },
  [ORDER_STATUS.CANCELED_BY_SYSTEM]: {
    label: "Dibatalkan Sistem",
    variant: "error",
  },
  [ORDER_STATUS.CANCELED_BY_SHIPPER]: {
    label: "Dibatalkan Shipper",
    variant: "error",
  },
  [ORDER_STATUS.CANCELED_BY_TRANSPORTER]: {
    label: "Dibatalkan Transporter",
    variant: "error",
  },
  [ORDER_STATUS.WAITING_PAYMENT_3]: {
    label: "Menunggu Pembayaran 3",
    variant: "warning",
  },
  [ORDER_STATUS.WAITING_PAYMENT_4]: {
    label: "Menunggu Pembayaran 4",
    variant: "warning",
  },
  [ORDER_STATUS.WAITING_CONFIRMATION_CHANGES]: {
    label: "Menunggu Konfirmasi Perubahan",
    variant: "warning",
  },
  [ORDER_STATUS.PREPARE_FLEET_CHANGES]: {
    label: "Persiapan Armada Perubahan",
    variant: "primary",
  },
  [ORDER_STATUS.CONFIRMED_CHANGES]: {
    label: "Perubahan Terkonfirmasi",
    variant: "success",
  },
  [ORDER_STATUS.FLEET_CHANGE]: {
    label: "Perubahan Armada",
    variant: "primary",
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
