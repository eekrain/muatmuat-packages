/**
 * Normalize payload for tambah driver massal (bulk driver creation)
 * @param {Object} formData - Form data from the driver form
 * @returns {Object} - Normalized payload for API
 */
export const normalizePayloadTambahDriverMassal = (formData) => {
  const { driverList } = formData;

  return {
    drivers: driverList.map((driver) => ({
      full_name: driver.fullName,
      whatsapp_number: driver.whatsappNumber,
      ktp_photo: driver.ktpPhoto,
      sim_b2_photo: driver.simB2Photo,
      sim_b2_expiry_date: driver.simB2ExpiryDate,
    })),
  };
};
