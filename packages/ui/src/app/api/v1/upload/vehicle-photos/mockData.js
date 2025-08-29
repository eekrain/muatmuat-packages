export const successResponse = {
  Message: {
    Code: 201,
    Text: "Created",
  },
  Data: {
    photoUrl:
      "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/photo-1753889861983.webp",
    originalFileName: "ChatGPT Image Jul 30, 2025, 11_26_53 AM.png",
    fileSize: 1505892,
  },
  Type: "/v1/upload/vehicle-photos",
};

export const errorResponse = {
  Message: {
    Code: 400,
    Text: "Format file tidak valid",
  },
  Data: {
    errors: [
      {
        field: "photo",
        message: "File harus berformat jpg, jpeg, atau png",
      },
    ],
  },
  Type: "VEHICLE_PHOTO_UPLOAD",
};
