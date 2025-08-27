export const successResponse = {
  Message: {
    Code: 200,
    Text: "Notifikasi penting berhasil diambil",
  },
  Data: {
    notificationId: "string", // [dbt_mt_notifications.id]
    type: "ORDER_URGENT|SYSTEM_ALERT|POLICY_UPDATE", // [dbt_mt_notifications.type]
    isRead: "boolean", // [dbt_mt_notifications.isRead]
    transporters: ["string"], // [dbt_mt_notifications.transporters]
  },
  Type: "IMPORTANT_NOTIFICATIONS",
};

export const errorResponse = {
  Message: {
    Code: 400,
    Text: "Gagal mengambil notifikasi penting",
  },
  Data: {
    errors: [
      {
        field: "general",
        message: "Parameter tidak valid",
      },
    ],
  },
  Type: "IMPORTANT_NOTIFICATIONS_ERROR",
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
