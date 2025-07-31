import {
  AlertInfoEnum,
  AlertLabelEnum,
  AlertTypeEnum,
} from "@/lib/constants/detailpesanan/alert.enum";

export const getAlertMetadata = (type, t) => {
  const info = AlertInfoEnum[type];
  if (type === AlertTypeEnum.CONFIRMATION_WAITING_PREPARE_FLEET) return false;
  if (info) return { label: t(AlertLabelEnum[type]), info };

  if (type === AlertTypeEnum.WAITING_TIME_CHARGE) {
    return {
      label: t(AlertLabelEnum.WAITING_TIME_CHARGE),
      button: {
        onClick: () => alert("Lihat Detail"),
        label: "Lihat Detail",
      },
    };
  }

  if (type === AlertTypeEnum.ORDER_CHANGES_CONFIRMATION) {
    return {
      label: t(AlertLabelEnum.ORDER_CHANGES_CONFIRMATION),
      button: {
        onClick: () => alert("Konfirmasi"),
        label: "Konfirmasi",
      },
    };
  }

  return { label: AlertLabelEnum[type] };
};
