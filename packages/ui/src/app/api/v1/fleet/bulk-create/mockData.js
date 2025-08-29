export const successResponse = {
  Message: {
    Code: 200,
    Text: "Fleet data saved successfully",
  },
  Data: {
    savedFleets: 40, // [dbt_mt_fleet_bulk_import.successRows]
  },
  Type: "SAVE_FLEET_DATA",
};

export const errorResponse = {
  Message: {
    Code: 400,
    Text: "Bad Request",
  },
  Data: {
    validationErrors: [
      {
        field: "licensePlate",
        value: "L1234SS",
        message: "labelAlertNopolSudahTerdaftar",
      },
    ],
  },
  Type: "SAVE_FLEET_DATA",
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
