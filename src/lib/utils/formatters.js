import { format } from "date-fns";
import { id } from "date-fns/locale";

export const idrFormat = (num, opts) => `Rp${thousandSeparator(num, opts)}`;

export const thousandSeparator = (num, opts) =>
  new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
    currencyDisplay: "narrowSymbol",
    ...opts,
  }).format(num || 0);

// 4 Okt 2024 05:20 WIB
export const formatDate = (date) => {
  // IF GMT+7 return WIB, IF GMT+8 return WITA, IF GMT+9 return WIT
  const timezone =
    date.getTimezoneOffset() === -420
      ? "WIB"
      : date.getTimezoneOffset() === -480
        ? "WITA"
        : date.getTimezoneOffset() === -540
          ? "WIT"
          : null;

  return `${format(
    date,
    timezone ? "dd MMM yyyy HH:mm" : "dd MMM yyyy HH:mm z",
    {
      locale: id,
    }
  )} ${timezone}`;
};
