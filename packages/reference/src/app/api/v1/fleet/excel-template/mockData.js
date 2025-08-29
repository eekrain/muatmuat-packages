export const successResponse = {
  Message: {
    Code: 200,
    Text: "Template berhasil diambil",
  },
  Data: {
    templateUrl:
      "https://muattrans-storage.s3.ap-southeast-1.amazonaws.com/templates/fleet-template.xlsx",
  },
};

export const errorResponse = {
  Message: {
    Code: 404,
    Text: "Template tidak ditemukan",
  },
  Data: {
    errors: [
      {
        field: "template",
        message: "Template Excel untuk armada tidak tersedia",
      },
    ],
  },
  Type: "TEMPLATE_NOT_FOUND",
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
