export const successResponse = {
  Message: {
    Code: 200,
    Text: "Photo uploaded successfully",
  },
  Data: {
    photoUrl:
      "https://storage.muatrans.com/drivers/photos/123e4567-e89b-12d3-a456-426614174000.jpg", // Referensi ke [dbm_mt_driver_photos.photo_url] di ERD
    photoType: "PROFILE", // Referensi ke [dbm_mt_driver_photos.photo_type] di ERD
    uploadedAt: "2025-07-15T10:30:00Z", // Referensi ke [dbm_mt_driver_photos.created_at] di ERD
  },
  Type: "UPLOAD_DRIVER_PHOTO",
};

export const errorResponse = {
  Message: {
    Code: 400,
    Text: "Invalid file format or size",
  },
  Data: {
    errors: [
      {
        field: "file",
        message: "File size exceeds 10MB limit",
      },
    ],
  },
  Type: "UPLOAD_DRIVER_PHOTO",
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

export const authErrorResponse = {
  Message: {
    Code: 401,
    Text: "Unauthorized",
  },
  Data: {
    errors: [
      {
        field: "authorization",
        message: "Authorization header required",
      },
    ],
  },
  Type: "UNAUTHORIZED",
};

export const noFileErrorResponse = {
  Message: {
    Code: 400,
    Text: "No file provided",
  },
  Data: {
    errors: [
      {
        field: "file",
        message: "File is required",
      },
    ],
  },
  Type: "UPLOAD_DRIVER_PHOTO",
};

export const invalidFileTypeErrorResponse = {
  Message: {
    Code: 400,
    Text: "Invalid file format",
  },
  Data: {
    errors: [
      {
        field: "file",
        message: "Only JPG, JPEG, PNG files are allowed",
      },
    ],
  },
  Type: "UPLOAD_DRIVER_PHOTO",
};
