export const successResponse = {
  Message: {
    Code: 200,
    Text: "Photo uploaded successfully",
  },
  Data: {
    fileUrl:
      "https://storage.muatrans.com/drivers/photos/123e4567-e89b-12d3-a456-426614174000.jpg",
    fileName: "PROFILE.jpg",
    fileSize: "202234",
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
  Type: "UPLOAD_DRIVER_PHOTO",
};
