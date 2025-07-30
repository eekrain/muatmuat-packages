export const DriverStatus = {
  NON_ACTIVE: "NON_ACTIVE",
  NOT_PAIRED: "NOT_PAIRED",
  READY_FOR_ORDER: "READY_FOR_ORDER",
  ON_DUTY: "ON_DUTY",
  WAITING_LOADING_TIME: "WAITING_LOADING_TIME",
  IN_PROGRESS: "IN_PROGRESS",
  VERIFIED: "VERIFIED",
  REJECTED: "REJECTED",
};

export const DRIVER_STATUS_CONFIG = {
  [DriverStatus.NON_ACTIVE]: {
    label: "Nonaktif",
    variant: "neutral",
  },
  [DriverStatus.NOT_PAIRED]: {
    label: "Belum Dipasangkan",
    variant: "warning",
  },
  [DriverStatus.READY_FOR_ORDER]: {
    label: "Siap Menerima Order",
    variant: "success",
  },
  [DriverStatus.ON_DUTY]: {
    label: "Bertugas",
    variant: "primary",
  },
  [DriverStatus.WAITING_LOADING_TIME]: {
    label: "Menunggu Jam Muat",
    variant: "warning",
  },
  [DriverStatus.IN_PROGRESS]: {
    label: "Dalam Tinjauan",
    variant: "primary",
  },
  [DriverStatus.REJECTED]: {
    label: "Verifikasi Ditolak",
    variant: "error",
  },
};

export const getDriverStatusBadge = (status) => {
  const config = DRIVER_STATUS_CONFIG[status];
  if (!config) {
    return {
      label: status,
      variant: "neutral",
    };
  }
  return config;
};
