import { normalizeFleetOrder } from "./normalizeFleetOrder";

/**
 * Normalizer khusus untuk update order (PUT /v1/orders/{orderId}/update)
 * Menambahkan field modificationType dan modifications sesuai kontrak backend.
 * Saat ini, modificationType selalu 'BOTH' dan modifications berisi perubahan jadwal & lokasi.
 *
 * @param {string} orderType
 * @param {object} formValues
 * @param {object} calculatedPrice
 * @returns {object} Payload siap kirim ke API update order
 */
export function normalizeUpdateOrder(orderType, formValues, calculatedPrice) {
  const base = normalizeFleetOrder(orderType, formValues, calculatedPrice);
  return {
    modificationType: "BOTH", // Bisa diubah ke logic dinamis jika perlu
    modifications: {
      schedule: {
        loadTimeStart: formValues.loadTimeStart,
        loadTimeEnd: formValues.loadTimeEnd,
        showRangeOption: formValues.showRangeOption,
      },
      location: {
        lokasiMuat: formValues.lokasiMuat,
        lokasiBongkar: formValues.lokasiBongkar,
      },
    },
    ...base,
  };
}
