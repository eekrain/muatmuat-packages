export const idrFormat = (num, opts) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
    ...opts,
  }).format(num || 0);

export const thousandSeparator = (num, opts) =>
  new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
    ...opts,
  }).format(num || 0);
