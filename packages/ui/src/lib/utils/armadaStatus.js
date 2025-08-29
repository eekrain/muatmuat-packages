// Translation function will be passed as parameter

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
  READY_FOR_ORDER: "/icons/armada-truck/truck-green.png",
  ON_DUTY: "/icons/armada-truck/truck-blue.png",
  WAITING_LOADING_TIME: "/icons/armada-truck/truck-yellow.png",
  NOT_PAIRED: "/icons/armada-truck/truck-grey.png",
  INACTIVE: "/icons/armada-truck/truck-red.png",
};

export const getArmadaStatusConfig = (t) => ({
  [ARMADA_STATUS.IN_REVIEW]: {
    label: t("ArmadaStatus.inReview", {}, "Dalam Tinjauan"),
    variant: "primary",
  },
  [ARMADA_STATUS.VERIFICATION_REJECTED]: {
    label: t("ArmadaStatus.verificationRejected", {}, "Verifikasi Ditolak"),
    variant: "error",
  },
  [ARMADA_STATUS.WAITING_GPS_INSTALLATION]: {
    label: t(
      "ArmadaStatus.waitingGpsInstallation",
      {},
      "Menunggu Pemasangan GPS"
    ),
    variant: "warning",
  },
  [ARMADA_STATUS.CALIBRATION_PROCESS]: {
    label: t("ArmadaStatus.calibrationProcess", {}, "Proses Kalibrasi"),
    variant: "warning",
  },
  [ARMADA_STATUS.READY_FOR_ORDER]: {
    label: t("ArmadaStatus.readyForOrder", {}, "Siap Menerima Order"),
    variant: "success",
  },
  [ARMADA_STATUS.WAITING_LOADING_TIME]: {
    label: t("ArmadaStatus.waitingLoadingTime", {}, "Akan Muat Hari Ini"),
    variant: "warning",
  },
  [ARMADA_STATUS.ON_DUTY]: {
    label: t("ArmadaStatus.onDuty", {}, "Bertugas"),
    variant: "primary",
  },
  [ARMADA_STATUS.NOT_PAIRED]: {
    label: t("ArmadaStatus.notPaired", {}, "Belum Dipasangkan"),
    variant: "warning",
  },
  [ARMADA_STATUS.INACTIVE]: {
    label: t("ArmadaStatus.inactive", {}, "Nonaktif"),
    variant: "neutral",
  },
  [ARMADA_STATUS.DELETED]: {
    label: t("ArmadaStatus.deleted", {}, "Dihapus"),
    variant: "error",
  },
});

// Deprecated: Use getArmadaStatusBadgeWithTranslation instead
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

// Deprecated: Use getArmadaStatusBadgeWithTranslation instead
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

// New function that accepts translation function
export const getArmadaStatusBadgeWithTranslation = (status, t) => {
  const config = getArmadaStatusConfig(t)[status];
  if (!config) {
    return {
      label: status,
      variant: "neutral",
    };
  }
  return config;
};

export const getTruckIcon = (status) => {
  return (
    ARMADA_TRUCK_IMAGE_STATUS[status] || "/icons/armada-truck/truck-red.png"
  );
};
