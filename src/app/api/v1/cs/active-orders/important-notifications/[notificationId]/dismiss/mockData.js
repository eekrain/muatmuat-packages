export const successResponse = {
  Message: {
    Code: 200,
    Text: "Notifikasi berhasil ditandai sebagai dibaca",
  },
  Data: {
    notificationId: "string",
    action: "string",
    processedAt: "string",
    success: true,
  },
  Type: "NOTIFICATION_DISMISSED",
};

export const errorResponse = {
  Message: {
    Code: 400,
    Text: "Request tidak valid",
  },
  Data: {
    errors: [
      {
        field: "action",
        message: "action harus diisi dan bernilai READ atau SNOOZE",
      },
    ],
  },
  Type: "VALIDATION_ERROR",
};

export const serverErrorResponse = {
  Message: {
    Code: 500,
    Text: "Internal Server Error",
  },
  Data: {
    errors: [
      {
        field: "general",
        message: "Terjadi kesalahan pada sistem kami",
      },
    ],
  },
  Type: "INTERNAL_SERVER_ERROR",
};
