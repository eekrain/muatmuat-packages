export const successResponse = {
  Message: {
    Code: 200,
    Text: "Driver preview retrieved successfully",
  },
  Data: {
    batchId: "batch-123e4567-e89b-12d3-a456-426614174000",
    totalDrivers: 25,
    drivers: [
      {
        tempId: "temp-001",
        name: "John Doe", // Referensi ke [dbt_mt_drivers.name] di ERD
        phoneNumber: "081234567890", // Referensi ke [dbt_mt_drivers.phone_number] di ERD
        simExpiryDate: "2026-12-31", // Referensi ke [dbt_mt_drivers.sim_expiry_date] di ERD
      },
      {
        tempId: "temp-002",
        name: "Jane Smith",
        phoneNumber: "081234567891",
        simExpiryDate: "2027-03-15",
      },
      {
        tempId: "temp-003",
        name: "Ahmad Budi",
        phoneNumber: "081234567892",
        simExpiryDate: "2025-11-20",
      },
      {
        tempId: "temp-004",
        name: "Siti Nurhaliza",
        phoneNumber: "081234567893",
        simExpiryDate: "2026-08-10",
      },
      {
        tempId: "temp-005",
        name: "Eko Prasetyo",
        phoneNumber: "081234567894",
        simExpiryDate: "2027-01-25",
      },
    ],
  },
  Type: "GET_DRIVER_PREVIEW",
};

export const errorResponse = {
  Message: {
    Code: 404,
    Text: "Batch not found",
  },
  Data: null,
  Type: "GET_DRIVER_PREVIEW",
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

export const invalidBatchIdResponse = {
  Message: {
    Code: 400,
    Text: "Invalid batch ID format",
  },
  Data: {
    errors: [
      {
        field: "batchId",
        message: "Batch ID must be a valid UUID format",
      },
    ],
  },
  Type: "INVALID_BATCH_ID",
};
