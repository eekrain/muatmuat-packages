export const successResponse = {
  Message: {
    Code: 200,
    Text: "Status transporter berhasil diperbarui",
  },
  Data: {
    id: "uuid-transporter-1",
    companyName: "PT Transport Jaya",
    isActive: false,
    status: "NON_ACTIVE",
    updatedAt: "2023-08-06T10:30:00Z",
  },
  Type: "UPDATE_TRANSPORTER_STATUS",
};

export const errorResponse = {
  Message: {
    Code: 400,
    Text: "Tidak dapat mengubah status transporter",
  },
  Data: {
    errors: [
      {
        field: "status",
        message:
          "Transporter memiliki pesanan aktif dan tidak dapat dinonaktifkan",
      },
    ],
  },
  Type: "UPDATE_TRANSPORTER_STATUS_ERROR",
};

export const serverErrorResponse = {
  Message: {
    Code: 500,
    Text: "Terjadi kesalahan server",
  },
  Data: null,
  Type: "SERVER_ERROR",
};
