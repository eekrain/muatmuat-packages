export const FleetSearchStatusEnum = {
  SEARCHING: "SEARCHING",
  FOUND: "FOUND",
  NOT_FOUND: "NOT_FOUND",
};

export const LocationTypeEnum = {
  PICKUP: "PICKUP",
  DROPOFF: "DROPOFF",
};

// URUTAN DISINI SANGAT PENTING, JIKA ADA PERUBAHAN PASTIKAN UPDATE JG DI SEMUA TEMPAT
// MENENTUKAN KONDISI BUTTON YANG AKAN TAMPIL, AKAN DI DAPATKAN INDEX SEBAGAI RANK
// MISAL JIKA RANK < 6 (UNLOADING), MAKA BUTTON BATAL PESANAN DI BOTTOMSHEET AKAN TAMPIL
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

  WAITING_PAYMENT_3: "WAITING_PAYMENT_3",
  WAITING_PAYMENT_4: "WAITING_PAYMENT_4",
  WAITING_CONFIRMATION_CHANGES: "WAITING_CONFIRMATION_CHANGES",
  PREPARE_FLEET_CHANGES: "PREPARE_FLEET_CHANGES",
  CONFIRMED_CHANGES: "CONFIRMED_CHANGES",
  FLEET_CHANGE: "FLEET_CHANGE",
};

export const getOrderStatusRank = (orderStatus) => {
  return Object.values(OrderStatusEnum).indexOf(orderStatus);
};

export const OrderStatusTitle = {
  PREPARE_FLEET: "statusMempersiapkanArmada",
  WAITING_PAYMENT_1: "statusMenungguPembayaran", // sebelum generate VA
  WAITING_PAYMENT_2: "statusMenungguPembayaran", // setelah generate VA
  SCHEDULED_FLEET: "statusArmadaDijadwalkan",
  CONFIRMED: "statusPesananTerkonfirmasi",
  LOADING: "statusProsesMuat",
  UNLOADING: "statusProsesBongkar",
  WAITING_REPAYMENT_1: "statusMenungguPelunasan", // sebelum generate VA
  WAITING_REPAYMENT_2: "statusMenungguPelunasan", // setelah generate VA
  PREPARE_DOCUMENT: "statusDokumenDisiapkan",
  DOCUMENT_DELIVERY: "statusPengirimanDokumen",
  COMPLETED: "statusSelesai",
  CANCELED_BY_SYSTEM: "statusDibatalkan",
  CANCELED_BY_SHIPPER: "statusDibatalkan",
  CANCELED_BY_TRANSPORTER: "statusDibatalkan",

  WAITING_PAYMENT_3: "statusMenungguPembayaran", // sebelum generate VA
  WAITING_PAYMENT_4: "statusMenungguPembayaran", // setelah generate VA
  WAITING_CONFIRMATION_CHANGES: "statusMenungguKonfirmasi",
  PREPARE_FLEET_CHANGES: "statusMempersiapkanArmada",
  CONFIRMED_CHANGES: "statusPesananTerkonfirmasi",
  FLEET_CHANGE: "useOrderListPage.fleetChangeProcess",
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
    "/icons/stepper/stepper-document-delivery.svg",
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
