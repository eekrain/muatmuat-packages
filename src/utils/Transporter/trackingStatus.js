// Translation function will be passed as parameter

// Tracking Status constants
export const TRACKING_STATUS = {
  // Initial Status
  CONFIRMED: "CONFIRMED",
  SCHEDULED: "SCHEDULED",
  SCHEDULED_FLEET: "SCHEDULED_FLEET",

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

  // Document Flow
  DOCUMENT_PREPARATION: "DOCUMENT_PREPARATION",
  DOCUMENT_DELIVERY: "DOCUMENT_DELIVERY",

  // Final Status
  COMPLETED: "COMPLETED",

  // Cancelled Status
  CANCELLED_BY_TRANSPORTER: "CANCELLED_BY_TRANSPORTER",
  CANCELLED_BY_SHIPPER: "CANCELLED_BY_SHIPPER",
  CANCELLED_BY_SYSTEM: "CANCELLED_BY_SYSTEM",

  // Legacy/Unused (kept for backward compatibility)
  WAITING_PICKUP: "WAITING_PICKUP",
  WAITING_DROPOFF: "WAITING_DROPOFF",
  WAITING_CHANGE_FLEET: "WAITING_CHANGE_FLEET",
  FLEET_FOUND: "FLEET_FOUND",
  WAITING_CONFIRMATION_SHIPPER: "WAITING_CONFIRMATION_SHIPPER",
  HEADING_TO_LOADING: "HEADING_TO_LOADING",
  HEADING_TO_UNLOADING: "HEADING_TO_UNLOADING",
};

export const getTrackingStatusConfig = (t) => ({
  // Alias statuses for Fleet Change flow (to align with DriverStatusEnum codes)
  // These are not part of TRACKING_STATUS but may appear from other modules
  MENUNGGU_ARMADA_PENGGANTI: {
    label: t(
      "TrackingStatus.waitingChangeFleet",
      {},
      "Menunggu Armada Pengganti"
    ),
    variant: "primary",
  },
  ARMADA_PENGGANTI_BERJALAN: {
    label: t(
      "TrackingStatus.replacementFleetInTransit",
      {},
      "Armada Pengganti Berjalan"
    ),
    variant: "primary",
  },
  MUATAN_PINDAH_ARMADA: {
    label: t("TrackingStatus.fleetFound", {}, "Muatan Pindah Armada"),
    variant: "primary",
  },
  [TRACKING_STATUS.LOADING]: {
    label: t("TrackingStatus.loading", {}, "Sedang Muat"),
    variant: "primary",
  },
  [TRACKING_STATUS.UNLOADING]: {
    label: t("TrackingStatus.unloading", {}, "Proses Bongkar"),
    variant: "primary",
  },
  [TRACKING_STATUS.IN_TRANSIT]: {
    label: t("TrackingStatus.inTransit", {}, "Dalam Perjalanan"),
    variant: "primary",
  },
  [TRACKING_STATUS.COMPLETED]: {
    label: t("TrackingStatus.completed", {}, "Selesai"),
    variant: "success",
  },
  [TRACKING_STATUS.CONFIRMED]: {
    label: t("TrackingStatus.confirmed", {}, "Terkonfirmasi"),
    variant: "primary",
  },
  [TRACKING_STATUS.SCHEDULED]: {
    label: t("TrackingStatus.scheduled", {}, "Dijadwalkan"),
    variant: "primary",
  },
  [TRACKING_STATUS.SCHEDULED_FLEET]: {
    label: t("TrackingStatus.scheduledFleet", {}, "Armada Dijadwalkan"),
    variant: "primary",
  },
  [TRACKING_STATUS.WAITING_PICKUP]: {
    label: t("TrackingStatus.waitingPickup", {}, "Menunggu Muat"),
    variant: "warning",
  },
  [TRACKING_STATUS.WAITING_DROPOFF]: {
    label: t("TrackingStatus.waitingDropoff", {}, "Menunggu Bongkar"),
    variant: "warning",
  },
  [TRACKING_STATUS.MENUJU_KE_LOKASI_MUAT]: {
    label: t(
      "TrackingStatus.headingToLoadingLocation",
      {},
      "Menuju ke Lokasi Muat"
    ),
    variant: "primary",
  },
  [TRACKING_STATUS.MENUJU_KE_LOKASI_BONGKAR]: {
    label: t(
      "TrackingStatus.headingToUnloadingLocation",
      {},
      "Menuju ke Lokasi Bongkar"
    ),
    variant: "primary",
  },
  [TRACKING_STATUS.SEDANG_BONGKAR]: {
    label: t("TrackingStatus.currentlyUnloading", {}, "Sedang Bongkar"),
    variant: "primary",
  },
  [TRACKING_STATUS.ANTRI_DI_LOKASI_MUAT]: {
    label: t(
      "TrackingStatus.queueingAtLoadingLocation",
      {},
      "Antri di Lokasi Muat"
    ),
    variant: "primary",
  },
  [TRACKING_STATUS.TIBA_DI_LOKASI_MUAT]: {
    label: t(
      "TrackingStatus.arrivedAtLoadingLocation",
      {},
      "Tiba di Lokasi Muat"
    ),
    variant: "primary",
  },
  [TRACKING_STATUS.ANTRI_DI_LOKASI_BONGKAR]: {
    label: t(
      "TrackingStatus.queueingAtUnloadingLocation",
      {},
      "Antri di Lokasi Bongkar"
    ),
    variant: "primary",
  },
  [TRACKING_STATUS.TIBA_DI_LOKASI_BONGKAR]: {
    label: t(
      "TrackingStatus.arrivedAtUnloadingLocation",
      {},
      "Tiba di Lokasi Bongkar"
    ),
    variant: "primary",
  },
  [TRACKING_STATUS.DOCUMENT_PREPARATION]: {
    label: t(
      "TrackingStatus.documentPreparation",
      {},
      "Dokumen Sedang Disiapkan"
    ),
    variant: "primary",
  },
  [TRACKING_STATUS.DOCUMENT_DELIVERY]: {
    label: t(
      "TrackingStatus.documentDelivery",
      {},
      "Proses Pengiriman Dokumen"
    ),
    variant: "primary",
  },
  [TRACKING_STATUS.CANCELLED_BY_TRANSPORTER]: {
    label: t(
      "TrackingStatus.cancelledByTransporter",
      {},
      "Dibatalkan Transporter"
    ),
    variant: "error",
  },
  [TRACKING_STATUS.CANCELLED_BY_SHIPPER]: {
    label: t("TrackingStatus.cancelledByShipper", {}, "Dibatalkan Shipper"),
    variant: "error",
  },
  [TRACKING_STATUS.CANCELLED_BY_SYSTEM]: {
    label: t("TrackingStatus.cancelledBySystem", {}, "Dibatalkan Sistem"),
    variant: "error",
  },
  [TRACKING_STATUS.WAITING_CONFIRMATION_SHIPPER]: {
    label: t(
      "TrackingStatus.waitingConfirmationShipper",
      {},
      "Menunggu Konfirmasi Shipper"
    ),
    variant: "warning",
  },
  [TRACKING_STATUS.HEADING_TO_LOADING]: {
    label: t("TrackingStatus.headingToLoading", {}, "Menuju ke Lokasi Muat"),
    variant: "primary",
  },
  [TRACKING_STATUS.HEADING_TO_UNLOADING]: {
    label: t(
      "TrackingStatus.headingToUnloading",
      {},
      "Menuju ke Lokasi Bongkar"
    ),
    variant: "primary",
  },
  [TRACKING_STATUS.WAITING_CHANGE_FLEET]: {
    label: t(
      "TrackingStatus.waitingChangeFleet",
      {},
      "Menunggu Armada Pengganti"
    ),
    variant: "primary",
  },
  [TRACKING_STATUS.FLEET_FOUND]: {
    label: t("TrackingStatus.fleetFound", {}, "Muatan Pindah Armada"),
    variant: "primary",
  },
});

// Deprecated: Use getTrackingStatusBadgeWithTranslation instead
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
  [TRACKING_STATUS.SCHEDULED_FLEET]: {
    label: "Armada Dijadwalkan",
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
  [TRACKING_STATUS.DOCUMENT_PREPARATION]: {
    label: "Dokumen Sedang Disiapkan",
    variant: "primary",
  },
  [TRACKING_STATUS.DOCUMENT_DELIVERY]: {
    label: "Proses Pengiriman Dokumen",
    variant: "primary",
  },
  [TRACKING_STATUS.CANCELLED_BY_TRANSPORTER]: {
    label: "Dibatalkan Transporter",
    variant: "error",
  },
  [TRACKING_STATUS.CANCELLED_BY_SHIPPER]: {
    label: "Dibatalkan Shipper",
    variant: "error",
  },
  [TRACKING_STATUS.CANCELLED_BY_SYSTEM]: {
    label: "Dibatalkan Sistem",
    variant: "error",
  },
  [TRACKING_STATUS.WAITING_CONFIRMATION_SHIPPER]: {
    label: "Menunggu Konfirmasi Shipper",
    variant: "warning",
  },
  [TRACKING_STATUS.HEADING_TO_LOADING]: {
    label: "Menuju ke Lokasi Muat",
    variant: "primary",
  },
  [TRACKING_STATUS.HEADING_TO_UNLOADING]: {
    label: "Menuju ke Lokasi Bongkar",
    variant: "primary",
  },
  // Add mapping for order status that should use tracking status
  [TRACKING_STATUS.LOADING]: {
    label: "Sedang Muat",
    variant: "primary",
  },
  [TRACKING_STATUS.SCHEDULED_FLEET]: {
    label: "Armada Dijadwalkan",
    variant: "primary",
  },
  [TRACKING_STATUS.UNLOADING]: {
    label: "Proses Bongkar",
    variant: "primary",
  },
  [TRACKING_STATUS.COMPLETED]: {
    label: "Selesai",
    variant: "success",
  },
  [TRACKING_STATUS.WAITING_CHANGE_FLEET]: {
    label: "Menunggu Armada Pengganti",
    variant: "primary",
  },
  [TRACKING_STATUS.FLEET_FOUND]: {
    label: "Muatan Pindah Armada",
    variant: "primary",
  },
};

// Tracking Status Flow Groups
export const TRACKING_STATUS_FLOW = {
  INITIAL: [
    TRACKING_STATUS.CONFIRMED,
    TRACKING_STATUS.SCHEDULED,
    TRACKING_STATUS.SCHEDULED_FLEET,
  ],
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
  DOCUMENT: [
    TRACKING_STATUS.DOCUMENT_PREPARATION,
    TRACKING_STATUS.DOCUMENT_DELIVERY,
  ],
  FINAL: [TRACKING_STATUS.COMPLETED],
};

// Deprecated: Use getTrackingStatusBadgeWithTranslation instead
// Helper function to get tracking status badge configuration
export const getTrackingStatusBadge = (status) => {
  // Check if status contains a number (e.g., "MENUJU_KE_LOKASI_BONGKAR_1")
  const statusWithNumber = status?.match(/^(.+)_(\d+)$/);

  if (statusWithNumber) {
    const [, baseStatus, number] = statusWithNumber;

    // Try to find config for exact status first
    let config = TRACKING_STATUS_CONFIG[status];

    // If not found, try to find config for base status
    if (!config) {
      config = TRACKING_STATUS_CONFIG[baseStatus];
    }

    // If not found, try to find similar status
    if (!config) {
      const similarStatus = Object.keys(TRACKING_STATUS_CONFIG).find(
        (key) => key.startsWith(baseStatus) && key !== baseStatus
      );

      if (similarStatus) {
        config = TRACKING_STATUS_CONFIG[similarStatus];
      }
    }

    // If still not found, try to find any status that contains the base status
    if (!config) {
      const containingStatus = Object.keys(TRACKING_STATUS_CONFIG).find(
        (key) => key.includes(baseStatus) || baseStatus.includes(key)
      );

      if (containingStatus) {
        config = TRACKING_STATUS_CONFIG[containingStatus];
      }
    }

    if (config) {
      return {
        ...config,
        label: `${config.label} ${number}`,
      };
    }
  }

  // Fallback to direct lookup
  const config = TRACKING_STATUS_CONFIG[status];
  if (!config) {
    return {
      label: status,
      variant: "muted",
    };
  }
  return config;
};

// New function that accepts translation function
export const getTrackingStatusBadgeWithTranslation = (status, t) => {
  // Check if status contains a number (e.g., "MENUJU_KE_LOKASI_BONGKAR_1")
  const statusWithNumber = status?.match(/^(.+)_(\d+)$/);

  if (statusWithNumber) {
    const [, baseStatus, number] = statusWithNumber;
    const CONFIG = getTrackingStatusConfig(t);

    // Try to find config for exact status first
    let config = CONFIG[status];

    // If not found, try to find config for base status
    if (!config) {
      config = CONFIG[baseStatus];
    }

    // If not found, try to find similar status
    if (!config) {
      const similarStatus = Object.keys(CONFIG).find(
        (key) => key.startsWith(baseStatus) && key !== baseStatus
      );

      if (similarStatus) {
        config = CONFIG[similarStatus];
      }
    }

    // If still not found, try to find any status that contains the base status
    if (!config) {
      const containingStatus = Object.keys(CONFIG).find(
        (key) => key.includes(baseStatus) || baseStatus.includes(key)
      );

      if (containingStatus) {
        config = CONFIG[containingStatus];
      }
    }

    if (config) {
      return {
        ...config,
        label: `${config.label} ${number}`,
      };
    }
  }

  // Fallback to direct lookup
  const config = getTrackingStatusConfig(t)[status];
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

// Helper function to check if status allows fleet change option
// Fleet change is NOT allowed from LOADING up to MENUJU_KE_LOKASI_BONGKAR
export const isFleetChangeAllowed = (status) => {
  if (!status) return false;

  // Remove number suffix if present (e.g., "LOADING_1" -> "LOADING")
  // Also handle custom statuses like "CUSTOM_MENUJU_KE_LOKASI_BONGKAR_2"
  let baseStatus = status.replace(/_\d+$/, "");

  // Handle custom prefixes (e.g., "CUSTOM_MENUJU_KE_LOKASI_BONGKAR" -> "MENUJU_KE_LOKASI_BONGKAR")
  if (baseStatus.startsWith("CUSTOM_")) {
    baseStatus = baseStatus.replace(/^CUSTOM_/, "");
  }

  // Statuses where fleet change is NOT allowed (from LOADING to MENUJU_KE_LOKASI_BONGKAR)
  const disallowedStatuses = [
    TRACKING_STATUS.LOADING,
    TRACKING_STATUS.IN_TRANSIT,
    TRACKING_STATUS.MENUJU_KE_LOKASI_BONGKAR,
  ];

  // Return true if status is NOT in the disallowed list
  return !disallowedStatuses.includes(baseStatus);
};

// Driver Status to Tracking Status mapping
export const mapDriverStatusToTracking = (driverStatus) => {
  const mainStatus = driverStatus?.mainStatus;
  const subStatus = driverStatus?.subStatus;

  // Map based on main status first
  if (mainStatus === TRACKING_STATUS.LOADING) {
    return TRACKING_STATUS.LOADING;
  }
  if (mainStatus === TRACKING_STATUS.UNLOADING) {
    return TRACKING_STATUS.UNLOADING;
  }
  if (mainStatus === TRACKING_STATUS.COMPLETED) {
    return TRACKING_STATUS.COMPLETED;
  }
  if (mainStatus === TRACKING_STATUS.CONFIRMED) {
    return TRACKING_STATUS.CONFIRMED;
  }
  if (mainStatus === TRACKING_STATUS.SCHEDULED) {
    return TRACKING_STATUS.SCHEDULED;
  }
  if (mainStatus === TRACKING_STATUS.SCHEDULED_FLEET) {
    return TRACKING_STATUS.SCHEDULED_FLEET;
  }
  if (mainStatus === TRACKING_STATUS.DOCUMENT_PREPARATION) {
    return TRACKING_STATUS.DOCUMENT_PREPARATION;
  }
  if (mainStatus === TRACKING_STATUS.DOCUMENT_DELIVERY) {
    return TRACKING_STATUS.DOCUMENT_DELIVERY;
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
