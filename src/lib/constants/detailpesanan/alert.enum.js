export const AlertTypeEnum = {
  REMINDER_REPAYMENT_ORDER: "REMINDER_REPAYMENT_ORDER", //nothing
  WAITING_TIME_CHARGE: "WAITING_TIME_CHARGE", //button
  SHOW_QRCODE_DRIVER: "SHOW_QRCODE_DRIVER", //info
  REFUND_IN_PROCESS: "REFUND_IN_PROCESS", //info
  REFUND_COMPLETED: "REFUND_COMPLETED", //info
  ORDER_CHANGES_CONFIRMATION: "ORDER_CHANGES_CONFIRMATION", //button
  CONFIRMATION_WAITING_PREPARE_FLEET: "CONFIRMATION_WAITING_PREPARE_FLEET", //nothing
  CANCELED_BY_SYSTEM: "CANCELED_BY_SYSTEM", //nothing
};

export const AlertLabelEnum = {
  REMINDER_REPAYMENT_ORDER:
    "Pesanan Anda memiliki tambahan biaya. Mohon selesaikan pembayaran sebelum tanggal <b>18 Juni 2024</b>.",
  WAITING_TIME_CHARGE: "Driver kamu akan dikenakan biaya waktu tunggu.",
  SHOW_QRCODE_DRIVER: "Harap tunjukkan QR Code ke pihak driver",
  REFUND_IN_PROCESS: "Pengembalian dana sedang dalam proses.",
  REFUND_COMPLETED: "Pengembalian dana berhasil diproses.",
  ORDER_CHANGES_CONFIRMATION: "Perubahan pesanan telah kamu lakukan.",
  CONFIRMATION_WAITING_PREPARE_FLEET:
    "Mohon konfirmasi pesanan ini dikarenakan kami membutuhkan waktu lebih lama untuk mempersiapkan armada.",
  CANCELED_BY_SYSTEM: "Mohon Maaf, Pesanan Tidak Dapat Diproses",
};

export const AlertInfoEnum = {
  SHOW_QRCODE_DRIVER:
    "QR Code diperlukan agar driver dapat melanjutkan proses muat atau bongkar barang.",
  REFUND_IN_PROCESS:
    "Pengembalian dana sedang dalam proses, jumlah dana akan disesuakan setelah dikurangi <b>Admin Pembatalan</b> dan <b>Tambahan Biaya</b>. Info lebih lanjut hubungi Customer Service.",
  REFUND_COMPLETED:
    "Proses pengembalian dana telah berhasil dicairkan ke rekening kamu. Info lebih lanjut hubungi Customer Service.",
  CANCELED_BY_SYSTEM:
    "Karena tingginya volume pemesanan saat ini, kami belum dapat menyiapkan armada yang sesuai dengan pesananmu. Kami akan mengembalikan dana secara penuh dan memberikan kompensasi sebagai bentuk permohonan maaf atas ketidaknyamanan ini.",
};
