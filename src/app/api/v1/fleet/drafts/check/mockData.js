export const successResponse = {
  Message: {
    Code: 200,
    Text: "Draft check completed",
  },
  Data: {
    hasExistingDrafts: true,
    draftCount: 3,
  },
  Type: "CHECK_EXISTING_DRAFTS",
};

export const errorResponse = {
  Message: {
    Code: 400,
    Text: "Bad Request",
  },
  Data: {
    errors: [
      {
        field: "general",
        message: "Gagal memeriksa draft yang ada",
      },
    ],
  },
  Type: "VALIDATION_ERROR",
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
