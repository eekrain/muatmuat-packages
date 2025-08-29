export const successResponse = {
  Message: {
    Code: 200,
    Text: "Jumlah status urgent berhasil diambil",
  },
  Data: {
    statusCounts: [
      {
        status: "assign_armada",
        displayName: "Perlu Assign Armada",
        count: 1,
        isUrgent: true,
        urgencyRule: "PICKUP_TIME_BASED",
      },
      {
        status: "konfirmasi_siap",
        displayName: "Perlu Konfirmasi Siap",
        count: 1,
        isUrgent: false,
        urgencyRule: "PICKUP_TIME_LIMITED",
      },
      {
        status: "respon_perubahan",
        displayName: "Perlu Respon Perubahan",
        count: 1,
        isUrgent: true,
        urgencyRule: "ALWAYS_URGENT",
      },
    ],
    totalUrgentCount: 3,
  },
  Type: "URGENT_STATUS_COUNTS",
};

export const errorResponse = {
  Message: {
    Code: 400,
    Text: "Invalid request",
  },
  Data: {
    errors: [
      {
        field: "general",
        message: "Parameter tidak valid",
      },
    ],
  },
  Type: "GET_URGENT_STATUS_COUNTS_ERROR",
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
