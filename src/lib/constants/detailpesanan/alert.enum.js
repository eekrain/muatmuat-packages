export const AlertTypeEnum = {
  REMINDER_REPAYMENT_ORDER: "REMINDER_REPAYMENT_ORDER", //nothing
  WAITING_TIME_CHARGE: "WAITING_TIME_CHARGE", //button
  SHOW_QRCODE_DRIVER: "SHOW_QRCODE_DRIVER", //info
  REFUND_IN_PROCESS: "REFUND_IN_PROCESS", //info
  REFUND_COMPLETED: "REFUND_COMPLETED", //info
  ORDER_CHANGES_CONFIRMATION: "ORDER_CHANGES_CONFIRMATION", //button
  CONFIRMATION_WAITING_PREPARE_FLEET: "CONFIRMATION_WAITING_PREPARE_FLEET", //nothing
  CANCELED_BY_SYSTEM: "CANCELED_BY_SYSTEM", //nothing
};

export const AlertLabelEnum = {
  REMINDER_REPAYMENT_ORDER: "messageReminderRepaymentOrder",
  WAITING_TIME_CHARGE: "messageWaitingTimeCharge",
  SHOW_QRCODE_DRIVER: "messageShowQrcodeDriver",
  REFUND_IN_PROCESS: "messageRefundInProcess",
  REFUND_COMPLETED: "messageRefundCompleted",
  ORDER_CHANGES_CONFIRMATION: "messageOrderChangesConfirmation",
  CONFIRMATION_WAITING_PREPARE_FLEET: "messageConfirmationWaitingPrepareFleet",
  CANCELED_BY_SYSTEM: "messageCanceledBySystem",
};

export const AlertInfoEnum = {
  // Ini haruse bukan tooltip, tapi button bro
  // WAITING_TIME_CHARGE: "Informasi biaya waktu tunggu",
  SHOW_QRCODE_DRIVER:
    "QR Code diperlukan agar driver dapat melanjutkan proses muat atau bongkar barang.",
  REFUND_IN_PROCESS: "infoRefundInProcess",
  REFUND_COMPLETED: "infoRefundCompleted",
  CANCELED_BY_SYSTEM: "infoCanceledBySystem",
};

export const AlertNeedConfirmEnum = {
  CONFIRMATION_WAITING_PREPARE_FLEET: true,
};
