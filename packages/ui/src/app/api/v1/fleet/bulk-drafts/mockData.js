export const successResponse = {
  Message: {
    Code: 200,
    Text: "Fleet draft saved successfully",
  },
  Data: {
    draftId: "draft-001", // [dbm_mt_fleet.id]
    licensePlate: "B1234CD",
    fleetStatus: "DRAFT", // [dbm_mt_fleet.fleetStatus]
    completionPercent: 75,
    createdAt: "2025-01-15T10:30:00Z",
  },
  Type: "SAVE_FLEET_DRAFT",
};

export const errorResponse = {
  Message: {
    Code: 400,
    Text: "Invalid fleet data",
  },
  Data: {
    errors: [
      {
        field: "licensePlate",
        message: "License plate is required",
      },
      {
        field: "truckTypeId",
        message: "Truck type is required",
      },
    ],
  },
  Type: "VALIDATION_ERROR",
};

export const duplicateLicensePlateError = {
  Message: {
    Code: 409,
    Text: "License plate already exists",
  },
  Data: {
    errors: [
      {
        field: "licensePlate",
        message: "Nomor plat kendaraan sudah terdaftar",
      },
    ],
  },
  Type: "DUPLICATE_LICENSE_PLATE",
};

export const invalidDocumentError = {
  Message: {
    Code: 400,
    Text: "Invalid document format",
  },
  Data: {
    errors: [
      {
        field: "documents",
        message: "Document type STNK is required",
      },
    ],
  },
  Type: "INVALID_DOCUMENT",
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
