import {
  AlertInfoEnum,
  AlertLabelEnum,
  AlertLabelResponsiveEnum,
  AlertNeedConfirmEnum,
  AlertTypeEnum,
} from "@/lib/constants/detailpesanan/alert.enum";

export const getAlertMetadata = ({
  type,
  t,
  onLihatDetailWaktuTunggu = () => alert("Not implemented yet"),
  onLihatPerubahan = () => alert("Not implemented yet"),
  isMobile = false,
}) => {
  const info = AlertInfoEnum[type];
  if (
    type === AlertTypeEnum.CONFIRMATION_WAITING_PREPARE_FLEET &&
    !AlertNeedConfirmEnum.CONFIRMATION_WAITING_PREPARE_FLEET
  )
    return false;
  if (info) return { label: t(AlertLabelEnum[type]), info };

  if (type === AlertTypeEnum.WAITING_TIME_CHARGE) {
    return {
      label: t(AlertLabelEnum.WAITING_TIME_CHARGE),
      button: {
        onClick: onLihatDetailWaktuTunggu,
        label: "Lihat Detail",
      },
    };
  }

  if (type === AlertTypeEnum.ORDER_CHANGES_CONFIRMATION) {
    return {
      label: t(AlertLabelEnum.ORDER_CHANGES_CONFIRMATION),
      button: {
        onClick: onLihatPerubahan,
        label: "Lihat Perubahan",
      },
    };
  }

  return {
    label: isMobile ? AlertLabelResponsiveEnum[type] : AlertLabelEnum[type],
  };
};
