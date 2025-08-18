/**
 * Formats phone numbers by adding dashes every 4 digits
 * @param {string} phoneNumber - Raw phone number (e.g., "081234567890")
 * @returns {string} - Formatted phone number (e.g., "0812-3456-7890")
 */
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber || typeof phoneNumber !== "string") {
    return phoneNumber;
  }

  // Remove any existing formatting (spaces, dashes, etc.)
  const cleanNumber = phoneNumber.replace(/\D/g, "");

  // Split the number into chunks of 4 digits
  const chunks = [];
  for (let i = 0; i < cleanNumber.length; i += 4) {
    chunks.push(cleanNumber.slice(i, i + 4));
  }

  // Join the chunks with dashes
  return chunks.join("-");
};

/**
 * Formats phone number with "No. HP : " prefix for display
 * @param {string} phoneNumber - Raw phone number
 * @returns {string} - Formatted phone number with prefix
 */
export const formatPhoneNumberWithPrefix = (phoneNumber) => {
  const formattedNumber = formatPhoneNumber(phoneNumber);
  return `${formattedNumber}`;
};

const phoneFormatter = {
  formatPhoneNumber,
  formatPhoneNumberWithPrefix,
};

export default phoneFormatter;
