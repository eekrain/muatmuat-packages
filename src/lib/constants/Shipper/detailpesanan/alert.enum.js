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
  REFUND_IN_PROCESS: "AlertLabelEnum.messageRefundInProcess",
  REFUND_COMPLETED: "AlertLabelEnum.messageRefundCompleted",
  ORDER_CHANGES_CONFIRMATION: "messageOrderChangesConfirmation",
  CONFIRMATION_WAITING_PREPARE_FLEET: "messageConfirmationWaitingPrepareFleet",
  CANCELED_BY_SYSTEM: "messageCanceledBySystem",
};

// Kalau mobile pake yang ini
export const AlertLabelResponsiveEnum = {
  REMINDER_REPAYMENT_ORDER:
    "AlertLabelResponsiveEnum.messageReminderRepaymentOrderMobile",
  WAITING_TIME_CHARGE: "messageWaitingTimeCharge",
  SHOW_QRCODE_DRIVER: "messageShowQrcodeDriver",
  REFUND_IN_PROCESS: "AlertLabelEnum.messageRefundInProcess",
  REFUND_COMPLETED: "AlertLabelEnum.messageRefundCompleted",
  ORDER_CHANGES_CONFIRMATION: "messageOrderChangesConfirmation",
  CONFIRMATION_WAITING_PREPARE_FLEET: "messageConfirmationWaitingPrepareFleet",
  CANCELED_BY_SYSTEM: "messageCanceledBySystem",
};

export const AlertInfoEnum = {
  SHOW_QRCODE_DRIVER: "AlertInfoEnum.messageShowQrcodeDriverInfo",
  REFUND_IN_PROCESS: "AlertInfoEnum.messageRefundInProcessInfo",
  REFUND_COMPLETED: "AlertInfoEnum.messageRefundCompletedInfo",
  CANCELED_BY_SYSTEM: "infoCanceledBySystem",
};

export const AlertNeedConfirmEnum = {
  CONFIRMATION_WAITING_PREPARE_FLEET: true,
};
