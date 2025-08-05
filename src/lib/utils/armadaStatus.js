export const ARMADA_STATUS = {
  IN_REVIEW: "IN_REVIEW",
  VERIFICATION_REJECTED: "VERIFICATION_REJECTED",
  WAITING_GPS_INSTALLATION: "WAITING_GPS_INSTALLATION",
  CALIBRATION_PROCESS: "CALIBRATION_PROCESS",
  READY_FOR_ORDER: "READY_FOR_ORDER",
  WAITING_LOADING_TIME: "WAITING_LOADING_TIME",
  ON_DUTY: "ON_DUTY",
  NOT_PAIRED: "NOT_PAIRED",
  INACTIVE: "INACTIVE",
  DELETED: "DELETED",
};

export const ARMADA_TRUCK_IMAGE_STATUS = {
  READY_FOR_ORDER: "truck-green.png",
  ON_DELIVERY: "truck-blue.png",
  MAINTENANCE: "truck-yellow.png",
  OFFLINE: "truck-grey.png",
  EMERGENCY: "truck-red.png",
};

export const ARMADA_STATUS_CONFIG = {
  [ARMADA_STATUS.IN_REVIEW]: {
    label: "Dalam Tinjauan",
    variant: "primary",
  },
  [ARMADA_STATUS.VERIFICATION_REJECTED]: {
    label: "Verifikasi Ditolak",
    variant: "error",
  },
  [ARMADA_STATUS.WAITING_GPS_INSTALLATION]: {
    label: "Menunggu Pemasangan GPS",
    variant: "warning",
  },
  [ARMADA_STATUS.CALIBRATION_PROCESS]: {
    label: "Proses Kalibrasi",
    variant: "warning",
  },
  [ARMADA_STATUS.READY_FOR_ORDER]: {
    label: "Siap Menerima Order",
    variant: "success",
  },
  [ARMADA_STATUS.WAITING_LOADING_TIME]: {
    label: "Akan Muat Hari Ini",
    variant: "warning",
  },
  [ARMADA_STATUS.ON_DUTY]: {
    label: "Bertugas",
    variant: "primary",
  },
  [ARMADA_STATUS.NOT_PAIRED]: {
    label: "Belum Dipasangkan",
    variant: "warning",
  },
  [ARMADA_STATUS.INACTIVE]: {
    label: "Nonaktif",
    variant: "neutral",
  },
  [ARMADA_STATUS.DELETED]: {
    label: "Dihapus",
    variant: "error",
  },
};

export const getArmadaStatusBadge = (status) => {
  const config = ARMADA_STATUS_CONFIG[status];
  if (!config) {
    return {
      label: status,
      variant: "neutral",
    };
  }
  return config;
};

export const getTruckIcon = (status) => {
  return ARMADA_TRUCK_IMAGE_STATUS[status] || "truck-grey.png";
};
