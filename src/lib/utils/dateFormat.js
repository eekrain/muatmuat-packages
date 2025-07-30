import { addDays, format, parseISO, subDays } from "date-fns";
import { id } from "date-fns/locale";

export function formatDate(isoString, padDay = false) {
  if (!isoString) return "";

  const date = parseISO(isoString);

  // Format the date using date-fns with Indonesian locale
  // The format will be: "30 Sep 2025 12:00 WIB"
  const formattedDate = format(
    date,
    padDay ? "dd MMM yyyy HH:mm" : "d MMM yyyy HH:mm",
    {
      locale: id,
    }
  );

  // Add WIB timezone indicator
  return `${formattedDate} WIB`;
}

export function formatDateFullMonth(isoString) {
  const date = parseISO(isoString);

  // Format with full month names in Indonesian
  const formattedDate = format(date, "d MMMM yyyy HH:mm", {
    locale: id,
  });

  // Add WIB timezone indicator
  return `${formattedDate} WIB`;
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
    const pastDate = subDays(today, val);
    return format(pastDate, "yyyy-MM-dd");
  }

  getClasifyPeriodeByRange(value) {
    const newDate = parseISO(value);
    return format(newDate, "yyyy-MM-dd");
  }
}
export const clasifyformatdate = new ClasifyDate();

export const getAdjustedDate = (daysToAdd) => {
  const today = new Date();
  return addDays(today, daysToAdd);
};

export function convertDate(dateString) {
  try {
    const inputDate = parseISO(dateString);

    // Format the date in English locale with timezone
    const formattedDate = format(inputDate, "d MMM yyyy HH:mm", {
      locale: "en-US",
    });

    return formattedDate;
  } catch (error) {
    return "";
  }
}

export const formatShortDate = (isoString) => {
  // Handle missing or invalid input
  if (!isoString) {
    return "";
  }

  try {
    const date = parseISO(isoString);

    // Format with short month names in Indonesian
    const formattedDate = format(date, "d MMM yyyy", {
      locale: id,
    });

    return formattedDate;
  } catch (error) {
    return "";
  }
};

export const formatDateRange = (startDate, endDate) => {
  // Helper function to format a single date
  const formatSingleDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      return format(date, "d MMM yyyy", { locale: id });
    } catch (error) {
      return "";
    }
  };

  // Helper function to check time remaining until end date
  const getTimeRemaining = (endDateString) => {
    try {
      const now = new Date();
      const end = parseISO(endDateString);
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
    } catch (error) {
      return null;
    }
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
  try {
    const start = parseISO(startDate);
    const end = parseISO(endDate);

    const startFormatted = format(start, "d MMM yyyy", { locale: id });
    const endFormatted = format(end, "d MMM yyyy", { locale: id });

    return `${startFormatted} - ${endFormatted}`;
  } catch (error) {
    return "";
  }
};
