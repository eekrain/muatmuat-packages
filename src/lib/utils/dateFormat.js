export function formatDate(isoString, padDay = false) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  const date = new Date(isoString);

  // Konversi ke zona waktu WIB (GMT+7)

  const day = padDay ? String(date.getDate()).padStart(2, "0") : date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  //30 sept 2025 12:00 wib
  return `${day} ${month} ${year} ${hours}:${minutes} WIB`;
}
// 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0429
export function formatDateFullMonth(isoString) {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const date = new Date(isoString);

  // Konversi ke zona waktu WIB (GMT+7)
  // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0366
  // date.setHours(date.getUTCHours() + 7); ilham ngawur

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day} ${month} ${year} ${hours}:${minutes} WIB`;
}

export function formatDateInput(dateString, ops = [], wib = true, newFormat) {
  const allOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  };
  const selectedOptions = newFormat
    ? newFormat
    : Object.fromEntries(
        Object.entries(allOptions).filter(([key]) => ops.includes(key))
      );
  let resultDate = new Date(dateString)
    .toLocaleDateString("id-ID", selectedOptions)
    .replace(",", "");

  if (/^[A-Z]/.test(resultDate)) {
    resultDate = resultDate.replace(" ", ", ");
  }

  if (wib) return `${resultDate} WIB`;
  return resultDate;
}

class ClasifyDate {
  constructor() {
    const currentDate = new Date();
    this.date = currentDate.getDate();
    this.month = currentDate.getMonth() + 1;
    this.year = currentDate.getFullYear();
  }
  getClasifyPeriode(val) {
    const today = new Date();
    const date = new Date(new Date().setDate(today.getDate() - val)).getDate();
    const month =
      new Date(new Date().setDate(today.getDate() - val)).getMonth() + 1;
    const year = new Date(
      new Date().setDate(today.getDate() - val)
    ).getFullYear();
    return `${year}-${month.toString().padStart(2, "0")}-${date
      .toString()
      .padStart(2, "0")}`;
  }
  getClasifyPeriodeByRange(value) {
    const newDate = new Date(value);
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    return `${year}-${month.toString().padStart(2, "0")}-${date
      .toString()
      .padStart(2, "0")}`;
  }
}
export const clasifyformatdate = new ClasifyDate();

export const getAdjustedDate = (daysToAdd) => {
  const today = new Date();
  today.setDate(today.getDate() + daysToAdd);
  return today;
};

export function convertDate(dateString) {
  const inputDate = new Date(dateString);
  // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0562
  const WIB_OFFSET_IN_HOURS = 0;
  const WIBDate = new Date(
    inputDate.getTime() + WIB_OFFSET_IN_HOURS * 60 * 60 * 1000
  );
  const options = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  };
  const formattedDate = WIBDate.toLocaleDateString("en-US", options);
  return formattedDate?.replace("GMT+7", "");
}

export const formatShortDate = (isoString) => {
  // Handle missing or invalid input
  if (!isoString) {
    return "";
  }

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  // Create a valid date object
  // Handle strings with or without the Z suffix
  const date = new Date(isoString);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return "";
  }

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  //result 1 JAN 2025
  return `${day} ${month} ${year}`;
};

export const formatDateRange = (startDate, endDate) => {
  // Define month names in Indonesian
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  // Helper function to format a single date
  const formatSingleDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Helper function to check time remaining until end date
  const getTimeRemaining = (endDateString) => {
    const now = new Date();
    const end = new Date(endDateString);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

    if (diffTime <= 0) {
      return null; // Already ended
    }

    if (diffHours <= 24) {
      return "Berakhir 24 jam lagi";
    }

    if (diffDays <= 7) {
      // Show "n hari lagi" for up to 7 days
      return `Berakhir ${diffDays} hari lagi`;
    }

    return null; // Use normal date format
  };

  // Handle different scenarios
  if (!startDate && !endDate) {
    return ""; // or return a default message like 'Tanggal tidak tersedia'
  }

  if (startDate && !endDate) {
    return formatSingleDate(startDate);
  }

  if (!startDate && endDate) {
    const timeRemaining = getTimeRemaining(endDate);
    return timeRemaining || formatSingleDate(endDate);
  }

  // Both dates are provided
  const timeRemaining = getTimeRemaining(endDate);
  if (timeRemaining) {
    return timeRemaining;
  }

  // Format as normal date range
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startDay = start.getDate();
  const startMonth = monthNames[start.getMonth()];
  const startYear = start.getFullYear();

  const endDay = end.getDate();
  const endMonth = monthNames[end.getMonth()];
  const endYear = end.getFullYear();

  return `${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}`;
};
