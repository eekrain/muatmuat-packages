export const successResponse = {
  Message: {
    Code: 200,
    Text: "Dokumen armada berhasil diupload",
  },
  Data: {
    documentUrl:
      "https://cdn.muatrans.com/vehicles/documents/550e8400-e29b-41d4-a716-446655440005.pdf",
    originalFileName: "stnk-document.pdf",
    fileSize: 2048000,
    uploadedAt: "2024-01-15T10:30:00Z",
  },
  Type: "VEHICLE_DOCUMENT_UPLOAD",
};

export const errorResponse = {
  Message: {
    Code: 400,
    Text: "Format file tidak valid",
  },
  Data: {
    errors: [
      {
        field: "document",
        message: "File harus berformat jpg, jpeg, png, atau pdf",
      },
    ],
  },
  Type: "VEHICLE_DOCUMENT_UPLOAD",
};

// Add additional error responses if needed
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
