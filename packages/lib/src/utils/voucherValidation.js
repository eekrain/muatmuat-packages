/**
 * Utility functions for voucher validation
 */

/**
 * Format currency to Indonesian format
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted currency string (e.g., "Rp 1.000.000")
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace("IDR", "Rp");
};

/**
 * Client-side voucher validation
 * @param {Object} voucher - The voucher object to validate
 * @param {number} orderAmount - The current order amount
 * @returns {Object} - Validation result with isValid and errorMessage
 */
export const validateVoucherClientSide = (voucher, orderAmount) => {
  // Check if voucher exists
  if (!voucher) {
    return {
      isValid: false,
      errorMessage: "Voucher tidak ditemukan",
    };
  }

  // Check minimum order amount
  if (orderAmount < voucher.minOrderAmount) {
    return {
      isValid: false,
      errorMessage: `Minimal Transaksi ${formatCurrency(voucher.minOrderAmount)}`,
    };
  }

  // Check if voucher is out of stock
  if (voucher.isOutOfStock) {
    return {
      isValid: false,
      errorMessage: "Kuota voucher sudah habis",
    };
  }

  // Check if voucher is expired
  const now = new Date();
  const validFrom = new Date(voucher.validFrom);
  const validTo = new Date(voucher.validTo);

  if (now < validFrom) {
    return {
      isValid: false,
      errorMessage: "Voucher belum dapat digunakan",
    };
  }

  if (now > validTo) {
    return {
      isValid: false,
      errorMessage: "Voucher sudah berakhir",
    };
  }

  // Voucher is valid
  return {
    isValid: true,
    errorMessage: null,
  };
};

/**
 * Check if voucher is expiring soon (within specified days)
 * @param {string} validTo - The voucher expiry date
 * @param {number} days - Number of days to check (default: 3)
 * @returns {boolean} - True if expiring soon
 */
export const isVoucherExpiringSoon = (validTo, days = 3) => {
  if (!validTo) return false;

  const now = new Date();
  const expiryDate = new Date(validTo);
  const daysFromNow = new Date();
  daysFromNow.setDate(now.getDate() + days);

  return expiryDate <= daysFromNow && expiryDate > now;
};
