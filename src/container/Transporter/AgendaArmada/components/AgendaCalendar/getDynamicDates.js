export const getDynamicDates = (startDate, position = 0, startOffset = 0) => {
  const dates = [];

  // Use startDate and adjust by position, fallback to current date
  const baseDate = startDate ? new Date(startDate) : new Date();

  // Adjust the base date by the position (can be negative or positive)
  const adjustedStartDate = new Date(baseDate);
  adjustedStartDate.setDate(adjustedStartDate.getDate() + position);

  // Generate 10 consecutive dates starting from the adjusted date
  const currentDate = new Date(adjustedStartDate);
  for (let i = 0; i < 10; i++) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Always show 5 dates starting from startOffset
  const selectedDates = dates.slice(startOffset, startOffset + 5);

  return selectedDates.map((date) => {
    const dayNames = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    const dayName = dayNames[date.getDay()];
    const dateNum = date.getDate();

    return `${dayName}, ${dateNum}`;
  });
};
