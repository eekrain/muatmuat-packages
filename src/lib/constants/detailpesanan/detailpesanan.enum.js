export const FleetSearchStatusEnum = {
  SEARCHING: "SEARCHING",
  FOUND: "FOUND",
  NOT_FOUND: "NOT_FOUND",
};

export const LocationTypeEnum = {
  PICKUP: "PICKUP",
  DROPOFF: "DROPOFF",
};

export const OrderStatusEnum = {
  PREPARE_FLEET: "PREPARE_FLEET",
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

  FLEET_CHANGE: "FLEET_CHANGE",
  WAITING_CONFIRMATION_CHANGES: "WAITING_CONFIRMATION_CHANGES",
  WAITING_PAYMENT_3: "WAITING_PAYMENT_3",
  WAITING_PAYMENT_4: "WAITING_PAYMENT_4",
  CONFIRMED_CHANGES: "CONFIRMED_CHANGES",
};

export const OrderStatusTitle = {
  PREPARE_FLEET: "Mempersiapkan Armada",
  WAITING_PAYMENT_1: "Menunggu Pembayaran", // sebelum generate VA
  WAITING_PAYMENT_2: "Menunggu Pembayaran", // setelah generate VA
  SCHEDULED_FLEET: "ArmadaDi jadwalkan",
  CONFIRMED: "Pesanan Terkonfirmasi",
  LOADING: "Proses Muat",
  UNLOADING: "Proses Bongkar",
  WAITING_REPAYMENT_1: "Menunggu Pelunasan", // sebelum generate VA
  WAITING_REPAYMENT_2: "Menunggu Pelunasan", // setelah generate VA
  PREPARE_DOCUMENT: "Dokumen Disiapkan",
  DOCUMENT_DELIVERY: "Pengiriman Dokumen",
  COMPLETED: "Selesai",
  CANCELED_BY_SYSTEM: "Dibatalkan",
  CANCELED_BY_SHIPPER: "Dibatalkan",
  CANCELED_BY_TRANSPORTER: "Dibatalkan",

  FLEET_CHANGE: "PergantianArmada",
  WAITING_CONFIRMATION_CHANGES: "MenungguKonfirmasi",
  WAITING_PAYMENT_3: "MenungguPembayaran",
  WAITING_PAYMENT_4: "MenungguPembayaran",
  CONFIRMED_CHANGES: "PesananTerkonfirmasi",
};

export const OrderStatusIcon = {
  [OrderStatusEnum.PREPARE_FLEET]: "/icons/stepper/stepper-scheduled.svg",
  [OrderStatusEnum.WAITING_PAYMENT_1]: "/icons/stepper/stepper-scheduled.svg",
  [OrderStatusEnum.WAITING_PAYMENT_2]: "/icons/stepper/stepper-scheduled.svg",
  [OrderStatusEnum.SCHEDULED_FLEET]: "/icons/stepper/stepper-scheduled.svg",
  [OrderStatusEnum.CONFIRMED]: "/icons/stepper/stepper-scheduled.svg",
  [OrderStatusEnum.LOADING]: "/icons/stepper/stepper-box.svg",
  [OrderStatusEnum.UNLOADING]: "/icons/stepper/stepper-box-opened.svg",
  [OrderStatusEnum.FLEET_CHANGE]: "/icons/stepper/stepper-fleet-change.svg",
  [OrderStatusEnum.WAITING_REPAYMENT_1]: "/icons/stepper/stepper-repayment.svg",
  [OrderStatusEnum.WAITING_REPAYMENT_2]: "/icons/stepper/stepper-repayment.svg",
  [OrderStatusEnum.PREPARE_DOCUMENT]:
    "/icons/stepper/stepper-document-preparing.svg",
  [OrderStatusEnum.DOCUMENT_DELIVERY]:
    "/icons/stepper/stepper-document-preparing.svg",
  [OrderStatusEnum.COMPLETED]: "/icons/stepper/stepper-completed.svg",
  [OrderStatusEnum.CANCELED_BY_SYSTEM]: "/icons/close20.svg",
  [OrderStatusEnum.CANCELED_BY_SHIPPER]: "/icons/close20.svg",
  [OrderStatusEnum.CANCELED_BY_TRANSPORTER]: "/icons/close20.svg",
};

export const PaymentStatusEnum = {
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
};

export const OrderTypeEnum = {
  INSTANT: "INSTANT",
  SCHEDULED: "SCHEDULED",
};
