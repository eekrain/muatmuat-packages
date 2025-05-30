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
