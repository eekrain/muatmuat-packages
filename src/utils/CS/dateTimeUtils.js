import { format } from "date-fns";
import { id } from "date-fns/locale";

/**
 * Formats muat (loading) time for display in order list
 * @param {Object} order - Order object with loadTimeStart and loadTimeEnd
 * @returns {Object} Object containing dateLabel (with "Muat" prefix), timeRange, and dateColor
 */
export const formatMuatTime = (order) => {
  const startDate = new Date(order.loadTimeStart);
  const endDate = new Date(order.loadTimeEnd);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const orderDate = new Date(startDate);
  orderDate.setHours(0, 0, 0, 0);

  // Calculate days difference
  const timeDiff = orderDate.getTime() - today.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  let dateLabel = "";
  let dateColor = "";

  if (daysDiff === 0) {
    dateLabel = "Muat Hari Ini";
    dateColor = "text-success-400"; // Green for today
  } else if (daysDiff === 1) {
    dateLabel = "Muat Besok";
    dateColor = "text-success-400"; // Green for tomorrow
  } else if (daysDiff >= 2 && daysDiff <= 5) {
    dateLabel = `Muat ${daysDiff} Hari Lagi`;
    dateColor = "text-warning-900"; // Orange for 2-5 days
  } else if (daysDiff > 5) {
    dateLabel = `Muat ${daysDiff} Hari Lagi`;
    dateColor = "text-primary-700"; // Blue for >5 days
  } else {
    // For past dates (negative daysDiff)
    dateLabel = `Muat ${format(startDate, "dd MMM yyyy", { locale: id })}`;
    dateColor = "text-gray-600";
  }

  // Format time range based on day difference
  let timeRange = "";
  if (daysDiff === 0) {
    // Today: show date and time start only
    timeRange = `${format(startDate, "dd MMM yyyy HH:mm")} WIB`;
  } else if (daysDiff === 1) {
    // Tomorrow: show date time start - time end
    if (
      order.loadTimeEnd &&
      format(startDate, "HH:mm") !== format(endDate, "HH:mm")
    ) {
      timeRange = `${format(startDate, "dd MMM yyyy HH:mm")} WIB s/d ${format(endDate, "HH:mm")} WIB`;
    } else {
      timeRange = `${format(startDate, "dd MMM yyyy HH:mm")} WIB`;
    }
  } else {
    // Other days: show date time start - date time end
    if (order.loadTimeEnd) {
      // Check if end date is different day
      const startDateStr = format(startDate, "dd MMM yyyy");
      const endDateStr = format(endDate, "dd MMM yyyy");

      if (startDateStr === endDateStr) {
        // Same day: show date once with time range
        timeRange = `${format(startDate, "dd MMM yyyy HH:mm")} WIB s/d ${format(endDate, "HH:mm")} WIB`;
      } else {
        // Different days: show full date and time for both
        timeRange = `${format(startDate, "dd MMM yyyy HH:mm")} WIB s/d ${format(endDate, "dd MMM yyyy HH:mm")} WIB`;
      }
    } else {
      timeRange = `${format(startDate, "dd MMM yyyy HH:mm")} WIB`;
    }
  }

  return { dateLabel, timeRange, dateColor };
};
