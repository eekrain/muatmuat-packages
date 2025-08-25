// Period options untuk dropdown
export const translatedPeriodOptions = (t) => [
  {
    name: t("PenaltyTable.periodOptionAll"),
    value: "",
    format: "day",
  },
  {
    name: t("AppMuatpartsAnalisaProdukHariIni"),
    value: 0,
    format: "day",
  },
  {
    name: t("AppMuatpartsAnalisaProduk1MingguTerakhir"),
    value: 7,
    format: "day",
  },
  {
    name: t("AppMuatpartsAnalisaProduk30HariTerakhir"),
    value: 30,
    format: "month",
  },
  {
    name: t("AppMuatpartsAnalisaProduk90HariTerakhir"),
    value: 90,
    format: "month",
  },
  {
    name: t("AppMuatpartsAnalisaProduk1TahunTerakhir"),
    value: 365,
    format: "year",
  },
];
