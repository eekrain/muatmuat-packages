// Tracking Status constants
export const TRACKING_STATUS = {
  // Initial Status
  CONFIRMED: "CONFIRMED",
  SCHEDULED: "SCHEDULED",

  // Pickup/Loading Flow
  MENUJU_KE_LOKASI_MUAT: "MENUJU_KE_LOKASI_MUAT",
  TIBA_DI_LOKASI_MUAT: "TIBA_DI_LOKASI_MUAT",
  ANTRI_DI_LOKASI_MUAT: "ANTRI_DI_LOKASI_MUAT",
  LOADING: "LOADING",

  // Transit
  IN_TRANSIT: "IN_TRANSIT",

  // Dropoff/Unloading Flow
  MENUJU_KE_LOKASI_BONGKAR: "MENUJU_KE_LOKASI_BONGKAR",
  TIBA_DI_LOKASI_BONGKAR: "TIBA_DI_LOKASI_BONGKAR",
  ANTRI_DI_LOKASI_BONGKAR: "ANTRI_DI_LOKASI_BONGKAR",
  SEDANG_BONGKAR: "SEDANG_BONGKAR",
  UNLOADING: "UNLOADING",

  // Final Status
  COMPLETED: "COMPLETED",

  // Legacy/Unused (kept for backward compatibility)
  WAITING_PICKUP: "WAITING_PICKUP",
  WAITING_DROPOFF: "WAITING_DROPOFF",
};

// Tracking Status badge configurations
export const TRACKING_STATUS_CONFIG = {
  [TRACKING_STATUS.LOADING]: {
    label: "Sedang Muat",
    variant: "primary",
  },
  [TRACKING_STATUS.UNLOADING]: {
    label: "Proses Bongkar",
    variant: "primary",
  },
  [TRACKING_STATUS.IN_TRANSIT]: {
    label: "Dalam Perjalanan",
    variant: "primary",
  },
  [TRACKING_STATUS.COMPLETED]: {
    label: "Selesai",
    variant: "success",
  },
  [TRACKING_STATUS.CONFIRMED]: {
    label: "Terkonfirmasi",
    variant: "primary",
  },
  [TRACKING_STATUS.SCHEDULED]: {
    label: "Dijadwalkan",
    variant: "primary",
  },
  [TRACKING_STATUS.WAITING_PICKUP]: {
    label: "Menunggu Muat",
    variant: "warning",
  },
  [TRACKING_STATUS.WAITING_DROPOFF]: {
    label: "Menunggu Bongkar",
    variant: "warning",
  },
  [TRACKING_STATUS.MENUJU_KE_LOKASI_MUAT]: {
    label: "Menuju ke Lokasi Muat",
    variant: "primary",
  },
  [TRACKING_STATUS.MENUJU_KE_LOKASI_BONGKAR]: {
    label: "Menuju ke Lokasi Bongkar",
    variant: "primary",
  },
  [TRACKING_STATUS.SEDANG_BONGKAR]: {
    label: "Sedang Bongkar",
    variant: "primary",
  },
  [TRACKING_STATUS.ANTRI_DI_LOKASI_MUAT]: {
    label: "Antri di Lokasi Muat",
    variant: "primary",
  },
  [TRACKING_STATUS.TIBA_DI_LOKASI_MUAT]: {
    label: "Tiba di Lokasi Muat",
    variant: "primary",
  },
  [TRACKING_STATUS.ANTRI_DI_LOKASI_BONGKAR]: {
    label: "Antri di Lokasi Bongkar",
    variant: "primary",
  },
  [TRACKING_STATUS.TIBA_DI_LOKASI_BONGKAR]: {
    label: "Tiba di Lokasi Bongkar",
    variant: "primary",
  },
};

// Tracking Status Flow Groups
export const TRACKING_STATUS_FLOW = {
  INITIAL: [TRACKING_STATUS.CONFIRMED, TRACKING_STATUS.SCHEDULED],
  PICKUP: [
    TRACKING_STATUS.MENUJU_KE_LOKASI_MUAT,
    TRACKING_STATUS.TIBA_DI_LOKASI_MUAT,
    TRACKING_STATUS.ANTRI_DI_LOKASI_MUAT,
    TRACKING_STATUS.LOADING,
  ],
  TRANSIT: [TRACKING_STATUS.IN_TRANSIT],
  DROPOFF: [
    TRACKING_STATUS.MENUJU_KE_LOKASI_BONGKAR,
    TRACKING_STATUS.TIBA_DI_LOKASI_BONGKAR,
    TRACKING_STATUS.ANTRI_DI_LOKASI_BONGKAR,
    TRACKING_STATUS.SEDANG_BONGKAR,
    TRACKING_STATUS.UNLOADING,
  ],
  FINAL: [TRACKING_STATUS.COMPLETED],
};

// Helper function to get tracking status badge configuration
export const getTrackingStatusBadge = (status) => {
  const config = TRACKING_STATUS_CONFIG[status];
  if (!config) {
    return {
      label: status,
      variant: "muted",
    };
  }
  return config;
};

// Helper function to get the flow group of a status
export const getTrackingStatusFlowGroup = (status) => {
  for (const [group, statuses] of Object.entries(TRACKING_STATUS_FLOW)) {
    if (statuses.includes(status)) {
      return group;
    }
  }
  return null;
};

// Driver Status to Tracking Status mapping
export const mapDriverStatusToTracking = (driverStatus) => {
  const mainStatus = driverStatus?.mainStatus;
  const subStatus = driverStatus?.subStatus;

  // Map based on main status first
  if (mainStatus === "LOADING") {
    return TRACKING_STATUS.LOADING;
  }
  if (mainStatus === "UNLOADING") {
    return TRACKING_STATUS.UNLOADING;
  }
  if (mainStatus === "COMPLETED") {
    return TRACKING_STATUS.COMPLETED;
  }
  if (mainStatus === "CONFIRMED") {
    return TRACKING_STATUS.CONFIRMED;
  }
  if (mainStatus === "SCHEDULED") {
    return TRACKING_STATUS.SCHEDULED;
  }

  // Map based on sub status for more specific states
  if (subStatus?.includes("MENUJU")) {
    return TRACKING_STATUS.IN_TRANSIT;
  }
  if (subStatus?.includes("ANTRI") || subStatus?.includes("TIBA")) {
    if (subStatus.includes("MUAT")) {
      return TRACKING_STATUS.WAITING_PICKUP;
    }
    if (subStatus.includes("BONGKAR")) {
      return TRACKING_STATUS.WAITING_DROPOFF;
    }
  }

  // Default to IN_TRANSIT if no specific mapping found
  return TRACKING_STATUS.IN_TRANSIT;
};
