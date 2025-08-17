/**
 * Memformat nomor telepon dari format internasional (+62) menjadi format lokal dengan tanda hubung.
 * @param {string} phoneNumber - Nomor telepon dalam format internasional (misal: +6281234567891).
 * @returns {string} Nomor telepon yang sudah diformat (misal: 0812-3456-7891) atau pesan error jika format tidak valid.
 */
const phoneNumberFormat = (phoneNumber) => {
  // Memeriksa apakah input adalah string dan dimulai dengan +62
  if (typeof phoneNumber !== "string" || !phoneNumber.startsWith("+62")) {
    return "Format nomor telepon tidak valid. Harap gunakan format +62...";
  }

  // Menghapus '+62' dan menggantinya dengan '0' menggunakan template literal
  // INI BAGIAN YANG DIPERBAIKI
  const localNumber = `0${phoneNumber.substring(3)}`;

  // Memeriksa panjang nomor untuk memastikan bisa diformat
  if (localNumber.length < 9) {
    return "Nomor telepon terlalu pendek untuk diformat.";
  }

  // Menggunakan regex untuk menyisipkan tanda hubung
  // Format: 0XXX-XXXX-XXXX...
  const formattedNumber = localNumber.replace(
    /(\d{4})(\d{4})(\d+)/,
    "$1-$2-$3"
  );

  return formattedNumber;
};

export default phoneNumberFormat;
