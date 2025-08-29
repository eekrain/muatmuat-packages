export const getNowTimezone = (timezone) => {
  const localNow = new Date();

  // Convert to GMT+0 by subtracting local timezone offset
  const gmtNow = new Date(
    localNow.getTime() + localNow.getTimezoneOffset() * 60000
  );

  // Add desired timezone offset (e.g. +07:00 for Jakarta)
  const targetOffset = parseInt(timezone.offset.slice(1, 3)) * 60;
  const adjustedNow = new Date(gmtNow.getTime() + targetOffset * 60000);
  return adjustedNow;
};

export const getLoadTimes = (loadTimeStart, showRangeOption, loadTimeEnd) => {
  const now = new Date();

  // Helper function to format date to ISO string with Z (UTC) format
  // while preserving the exact time values (not adjusting for timezone)
  const formatToISOPreserveTime = (date) => {
    if (!date) return now.toISOString();

    try {
      // Ensure we're working with a Date object
      const dateObj = date instanceof Date ? date : new Date(date);

      // Check if the date is valid
      if (isNaN(dateObj.getTime())) {
        console.error("Invalid date:", date);
        return now.toISOString();
      }

      // Format the date manually to preserve time
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      const hours = String(dateObj.getHours()).padStart(2, "0");
      const minutes = String(dateObj.getMinutes()).padStart(2, "0");
      const seconds = String(dateObj.getSeconds()).padStart(2, "0");

      // Create ISO string with Z suffix (indicating UTC) but with local time values
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return now.toISOString();
    }
  };

  const result = {
    loadTimeStart: formatToISOPreserveTime(loadTimeStart),
  };

  if (showRangeOption && loadTimeEnd) {
    result.loadTimeEnd = formatToISOPreserveTime(loadTimeEnd);
  }

  return result;
};

export const addMinutes = (date, minutes) => {
  const newDate = new Date(date);
  newDate.setMinutes(newDate.getMinutes() + minutes);
  return newDate;
};
