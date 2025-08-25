// src/lib/utils/generateDynamicPeriodOptions.js

/**
 * Formats a Date object into a 'YYYY-MM-DD' string.
 * @param {Date} date - The date to format.
 * @returns {string} The formatted date string.
 */
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Generates dynamic period options with API-compatible values and date ranges.
 * @returns {Array<Object>} An array of period options.
 */
export const generateDynamicPeriodOptions = () => {
  const today = new Date();
  const todayFormatted = formatDate(today);

  // Bulan Ini
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // 1 Minggu Terakhir (7 days total, so today - 6 days)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(today.getDate() - 6);

  // 30 Hari Terakhir (30 days total, so today - 29 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 29);

  // 1 Tahun Terakhir
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  const periodOptions = [
    {
      name: "Bulan Ini (Default)",
      value: "Dalam Bulan Ini",
      startDate: formatDate(startOfMonth),
      endDate: todayFormatted,
    },
    {
      name: "Hari Ini",
      value: "Dalam Hari Ini",
      startDate: todayFormatted,
      endDate: todayFormatted,
    },
    {
      name: "1 Minggu Terakhir",
      value: "Dalam 1 Minggu Terakhir",
      startDate: formatDate(oneWeekAgo),
      endDate: todayFormatted,
    },
    {
      name: "30 Hari Terakhir",
      value: "Dalam 30 Hari Terakhir",
      startDate: formatDate(thirtyDaysAgo),
      endDate: todayFormatted,
    },
    {
      name: "1 Tahun Terakhir",
      value: "Dalam 1 Tahun Terakhir",
      startDate: formatDate(oneYearAgo),
      endDate: todayFormatted,
    },
  ];

  return periodOptions;
};
