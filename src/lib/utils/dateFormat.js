import {
  addDays,
  differenceInDays,
  format,
  isPast,
  parseISO,
  subDays,
} from "date-fns";
import { enUS, id } from "date-fns/locale";

/**
 * [INTERNAL] A robust, centralized function to parse various date inputs.
 * Returns a valid Date object or null if the input is invalid.
 * @private
 */
const _parseDate = (dateInput) => {
  if (!dateInput) return null;
  try {
    // Standardize input to a Date object. parseISO is best for strings.
    const date =
      typeof dateInput === "string" ? parseISO(dateInput) : new Date(dateInput);

    // The getTime() of an invalid date is NaN. This is the best check.
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date value received: ${dateInput}`);
    }
    return date;
  } catch (error) {
    console.error(error.message);
    return null;
  }
};

/**
 * Formats an ISO string into "d MMM yyyy HH:mm WIB".
 * Allows for day padding (e.g., '03' vs '3').
 */
export function formatDate(isoString, padDay = false) {
  const date = _parseDate(isoString);
  if (!date) return "";

  const formatString = padDay ? "dd MMM yyyy HH:mm" : "d MMM yyyy HH:mm";
  const formattedDate = format(date, formatString, { locale: id });
  return `${formattedDate} WIB`;
}

/**
 * Formats an ISO string with the full month name.
 */
export function formatDateFullMonth(isoString) {
  const date = _parseDate(isoString);
  if (!date) return "";

  const formattedDate = format(date, "d MMMM yyyy HH:mm", { locale: id });
  return `${formattedDate} WIB`;
}

/**
 * DEPRECATED USAGE WARNING: This function uses the native `toLocaleDateString`,
 * which can have inconsistent results across different JS environments (browsers vs. Node.js).
 * Refactoring to date-fns/format is recommended for full consistency if possible.
 * The implementation below is a cleaned-up version of the original.
 */
export function formatDateInput(dateString, ops = [], wib = true, newFormat) {
  const date = _parseDate(dateString);
  if (!date) return "";

  try {
    // The core logic using toLocaleDateString is preserved as requested.
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

    const resultDate = date
      .toLocaleDateString("id-ID", selectedOptions)
      .replace(",", ""); // e.g., "31 Jul 2025 02:45"

    if (wib) return `${resultDate} WIB`;
    return resultDate;
  } catch (error) {
    console.error("Error in formatDateInput:", error);
    return "";
  }
}

/**
 * An object containing date classification methods, preserving the original API
 * without the unsafe "new ClasifyDate()" instantiation on import.
 */
export const clasifyformatdate = {
  getClasifyPeriode(val) {
    const pastDate = subDays(new Date(), val);
    return format(pastDate, "yyyy-MM-dd");
  },
  getClasifyPeriodeByRange(value) {
    const date = _parseDate(value);
    return date ? format(date, "yyyy-MM-dd") : "";
  },
};

/**
 * Gets a future date by adding a number of days to today.
 */
export const getAdjustedDate = (daysToAdd) => {
  return addDays(new Date(), daysToAdd);
};

/**
 * Converts a date string to English format "d MMM yyyy HH:mm".
 */
export function convertDate(dateString) {
  const date = _parseDate(dateString);
  if (!date) return "";
  return format(date, "d MMM yyyy HH:mm", { locale: enUS });
}

/**
 * Formats an ISO string to a short date format "d MMM yyyy".
 */
export const formatShortDate = (isoString) => {
  const date = _parseDate(isoString);
  if (!date) return "";
  return format(date, "d MMM yyyy", { locale: id });
};

/**
 * Formats a date range, intelligently showing time remaining for upcoming end dates.
 */
export const formatDateRange = (startDate, endDate) => {
  const start = _parseDate(startDate);
  const end = _parseDate(endDate);

  // If there's an end date, check for time remaining first.
  if (end && !isPast(end)) {
    const daysRemaining = differenceInDays(end, new Date());
    if (daysRemaining < 1) {
      return "Berakhir dalam 24 jam";
    }
    if (daysRemaining <= 7) {
      return `Berakhir ${daysRemaining + 1} hari lagi`;
    }
  }

  // Fallback to standard date range formatting.
  const formattedStart = start ? formatShortDate(start) : "";
  const formattedEnd = end ? formatShortDate(end) : "";

  if (formattedStart && formattedEnd) {
    // If start and end dates are the same, just show one.
    return formattedStart === formattedEnd
      ? formattedStart
      : `${formattedStart} - ${formattedEnd}`;
  }

  // Return whichever one is valid, or a default message.
  return formattedStart || formattedEnd || "";
};
