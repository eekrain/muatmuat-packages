import { normalizeFleetOrder } from "./normalizeFleetOrder";

/**
 * Deteksi perubahan schedule berdasarkan loadTimeStart dan loadTimeEnd
 * @param {object} originalData - Data original order
 * @param {object} currentFormValues - Form values saat ini
 * @returns {boolean} True jika ada perubahan schedule
 */
function hasScheduleChanges(originalData, currentFormValues) {
  if (!originalData || !currentFormValues) return false;

  const originalStart = originalData.loadTimeStart;
  const currentStart = currentFormValues.loadTimeStart;
  const originalEnd = originalData.loadTimeEnd;
  const currentEnd = currentFormValues.loadTimeEnd;

  // Bandingkan loadTimeStart
  if (originalStart !== currentStart) return true;

  // Bandingkan loadTimeEnd jika ada
  if (originalEnd !== currentEnd) return true;

  return false;
}

/**
 * Deteksi perubahan location berdasarkan lokasiMuat dan lokasiBongkar
 * @param {object} originalData - Data original order
 * @param {object} currentFormValues - Form values saat ini
 * @returns {boolean} True jika ada perubahan location
 */
function hasLocationChanges(originalData, currentFormValues) {
  if (!originalData || !currentFormValues) return false;

  const originalMuat = originalData.lokasiMuat || [];
  const currentMuat = currentFormValues.lokasiMuat || [];
  const originalBongkar = originalData.lokasiBongkar || [];
  const currentBongkar = currentFormValues.lokasiBongkar || [];

  // Bandingkan jumlah lokasi
  if (
    originalMuat.length !== currentMuat.length ||
    originalBongkar.length !== currentBongkar.length
  ) {
    return true;
  }

  // Bandingkan setiap lokasi muat
  for (let i = 0; i < originalMuat.length; i++) {
    const originalCoords = originalMuat[i]?.dataLokasi?.coordinates;
    const currentCoords = currentMuat[i]?.dataLokasi?.coordinates;
    const originalLocation = originalMuat[i]?.dataLokasi?.location;
    const currentLocation = currentMuat[i]?.dataLokasi?.location;
    const originalLocationId = originalMuat[i]?.locationId;
    const currentLocationId = currentMuat[i]?.locationId;

    if (
      originalLocationId !== currentLocationId ||
      originalCoords?.latitude !== currentCoords?.latitude ||
      originalCoords?.longitude !== currentCoords?.longitude ||
      originalLocation?.name !== currentLocation?.name
    ) {
      return true;
    }
  }

  // Bandingkan setiap lokasi bongkar
  for (let i = 0; i < originalBongkar.length; i++) {
    const originalCoords = originalBongkar[i]?.dataLokasi?.coordinates;
    const currentCoords = currentBongkar[i]?.dataLokasi?.coordinates;
    const originalLocation = originalBongkar[i]?.dataLokasi?.location;
    const currentLocation = currentBongkar[i]?.dataLokasi?.location;
    const originalLocationId = originalBongkar[i]?.locationId;
    const currentLocationId = currentBongkar[i]?.locationId;

    if (
      originalLocationId !== currentLocationId ||
      originalCoords?.latitude !== currentCoords?.latitude ||
      originalCoords?.longitude !== currentCoords?.longitude ||
      originalLocation?.name !== currentLocation?.name
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Validasi requirements untuk setiap modification type
 * @param {string} modificationType - Tipe modifikasi
 * @param {object} formValues - Form values saat ini
 * @returns {boolean} True jika valid
 */
function validateModificationRequirements(modificationType, formValues) {
  const hasDropoffLocation =
    formValues.lokasiBongkar &&
    formValues.lokasiBongkar.some((loc) => loc && loc.dataLokasi);

  const hasValidSchedule =
    formValues.loadTimeStart &&
    new Date(formValues.loadTimeStart) > new Date() &&
    (!formValues.loadTimeEnd ||
      new Date(formValues.loadTimeEnd) > new Date(formValues.loadTimeStart));

  switch (modificationType) {
    case "LOCATION_CHANGE":
      return hasDropoffLocation;
    case "SCHEDULE_CHANGE":
      return hasValidSchedule;
    case "BOTH":
      return hasDropoffLocation && hasValidSchedule;
    default:
      return false;
  }
}

/**
 * Normalizer khusus untuk update order (PUT /v1/orders/{orderId}/update)
 * Menambahkan field modificationType dan modifications sesuai kontrak backend.
 * modificationType ditentukan secara dinamis berdasarkan perubahan yang terdeteksi.
 *
 * @param {string} orderType
 * @param {object} formValues - Form values saat ini
 * @param {object} calculatedPrice
 * @param {object} originalOrderData - Data original order untuk perbandingan
 * @returns {object} Payload siap kirim ke API update order
 */
export function normalizeUpdateOrder(
  orderType,
  formValues,
  calculatedPrice,
  originalOrderData = null
) {
  const base = normalizeFleetOrder(orderType, formValues, calculatedPrice);

  // Deteksi perubahan
  const scheduleChanged = hasScheduleChanges(originalOrderData, formValues);
  const locationChanged = hasLocationChanges(originalOrderData, formValues);

  // Tentukan modification type berdasarkan perubahan yang terdeteksi
  let modificationType;
  if (scheduleChanged && locationChanged) {
    modificationType = "BOTH";
  } else if (scheduleChanged) {
    modificationType = "SCHEDULE_CHANGE";
  } else if (locationChanged) {
    modificationType = "LOCATION_CHANGE";
  } else {
    // Fallback ke BOTH jika tidak ada perubahan terdeteksi
    modificationType = "BOTH";
  }

  // Validasi requirements
  if (!validateModificationRequirements(modificationType, formValues)) {
    throw new Error(
      `Invalid modification type ${modificationType}: requirements not met`
    );
  }

  // Buat modifications object berdasarkan modification type
  const modifications = {};

  if (modificationType === "SCHEDULE_CHANGE" || modificationType === "BOTH") {
    modifications.schedule = {
      loadTimeStart: formValues.loadTimeStart,
      loadTimeEnd: formValues.loadTimeEnd,
    };
  }

  if (modificationType === "LOCATION_CHANGE" || modificationType === "BOTH") {
    modifications.pickupLocations = convertToApiLocationFormat(
      formValues.lokasiMuat,
      "PICKUP"
    );
    modifications.dropoffLocations = convertToApiLocationFormat(
      formValues.lokasiBongkar,
      "DROPOFF"
    );
  }

  return {
    modificationType,
    modifications,
  };
}

/**
 * Konversi data lokasi dari format formValues ke format API
 * @param {Array} locations - Array lokasi dari formValues
 * @param {string} locationType - "PICKUP" atau "DROPOFF"
 * @returns {Array} Array lokasi dalam format API
 */
function convertToApiLocationFormat(locations, locationType) {
  if (!locations || !Array.isArray(locations)) {
    return [];
  }

  return locations
    .filter((location) => location && location.dataLokasi)
    .map((location, index) => ({
      locationId: location.locationId || null, // null jika lokasi baru
      locationType,
      sequence: index + 1,
      fullAddress: location.dataLokasi.location?.name || "",
      detailAddress: location.detailLokasi || "",
      latitude: location.dataLokasi.coordinates?.latitude || 0,
      longitude: location.dataLokasi.coordinates?.longitude || 0,
      district: location.dataLokasi.district?.name || "",
      districtId: location.dataLokasi.district?.value || null,
      city: location.dataLokasi.city?.name || "",
      cityId: location.dataLokasi.city?.value || null,
      province: location.dataLokasi.province?.name || "",
      provinceId: location.dataLokasi.province?.value || null,
      postalCode: location.dataLokasi.postalCode?.name || "",
      picName: location.namaPIC || "",
      picPhoneNumber: location.noHPPIC || "",
    }));
}
