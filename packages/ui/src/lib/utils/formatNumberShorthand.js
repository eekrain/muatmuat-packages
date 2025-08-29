/**
 * Formats a number into a shorthand string based on Indonesian notation.
 * - Billions (>= 1,000,000,000) are formatted with an "M" (Miliar) suffix.
 * - Millions (>= 1,000,000) are formatted with a "JT" (Juta) suffix.
 * - Thousands (>= 1,000) are formatted with an "RB" (Ribu) suffix.
 * - Numbers < 1,000 are returned as is.
 * The format does not include spaces or decimals (e.g., "45RB", "12JT", "1M").
 *
 * @param {any} value The number to format. Handles values up to 99,999,999,999.
 * @returns {string} The formatted number as a string, or the original value if input is not a valid number.
 */
export const formatNumberShorthand = (value) => {
  // Return original value if it's not a number or is null/undefined
  if (isNaN(parseFloat(value)) || !isFinite(value)) {
    return value;
  }

  const num = Number(value);
  const absNum = Math.abs(num);

  // Using numeric separators for better readability of thresholds
  const MILIAR = 1_000_000_000;
  const JUTA = 1_000_000;
  const RIBU = 1_000;

  let formattedString;

  // Logic must be ordered from largest to smallest threshold
  if (absNum >= MILIAR) {
    formattedString = `${Math.floor(absNum / MILIAR)}M`;
  } else if (absNum >= JUTA) {
    formattedString = `${Math.floor(absNum / JUTA)}JT`;
  } else if (absNum >= RIBU) {
    formattedString = `${Math.floor(absNum / RIBU)}RB`;
  } else {
    // For numbers less than 1,000, return them as an integer string
    formattedString = String(Math.floor(absNum));
  }

  // Add the negative sign back if the original number was negative
  return num < 0 ? `-${formattedString}` : formattedString;
};
