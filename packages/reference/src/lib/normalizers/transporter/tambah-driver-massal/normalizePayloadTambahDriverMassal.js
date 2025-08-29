/**
 * Normalize payload for tambah driver massal (bulk driver creation)
 * @param {Object} formData - Form data from the driver form
 * @returns {Object} - Normalized payload for API
 */
export const normalizePayloadTambahDriverMassal = (formData) => {
  const { driverList } = formData;

  return {
    drivers: driverList.map((driver) => ({
      name: driver.fullName,
      phoneNumber: driver.whatsappNumber,
      ktpDocument: driver.ktpPhoto,
      simDocument: driver.simB2Photo,
      simExpiryDate: driver.simB2ExpiryDate,
    })),
  };
};
