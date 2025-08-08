export const successResponse = {
  Message: {
    Code: 200,
    Text: "Upload history retrieved successfully",
  },
  Data: {
    history: [
      {
        id: "upload-123e4567-e89b-12d3-a456-426614174000",
        fileName: "driver_batch_2025_07_15.xlsx",
        uploadedAt: "2025-07-15T10:30:00Z", // Referensi ke [dbt_mt_drivers.created_at] di ERD
        uploadedBy: "John Doe", // Referensi ke [dbm_mt_user.full_name] di ERD
        status: "SUCCESS", // Values: SUCCESS, FAILED
        reportUrl:
          "/v1/drivers/upload-reports/batch-123e4567-e89b-12d3-a456-426614174000",
      },
    ],
    pagination: {
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1,
    },
  },
  Type: "GET_UPLOAD_HISTORY",
};

export const errorResponse = {
  Message: {
    Code: 400,
    Text: "Invalid search parameters",
  },
  Data: {
    errors: [
      {
        field: "search",
        message: "Search term must be at least 3 characters",
      },
    ],
  },
  Type: "GET_UPLOAD_HISTORY",
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

// Mock data for generating multiple upload history records
export const mockUploadHistory = [
  {
    id: "upload-123e4567-e89b-12d3-a456-426614174000",
    fileName: "driver_batch_2025_07_15.xlsx",
    uploadedAt: "2025-07-15T10:30:00Z",
    uploadedBy: "John Doe",
    status: "SUCCESS",
    reportUrl:
      "/v1/drivers/upload-reports/batch-123e4567-e89b-12d3-a456-426614174000",
  },
  {
    id: "upload-456e7890-e12d-34a5-b678-901234567890",
    fileName: "drivers_import_2025_07_14.xlsx",
    uploadedAt: "2025-07-14T14:22:00Z",
    uploadedBy: "Jane Smith",
    status: "FAILED",
    reportUrl:
      "/v1/drivers/upload-reports/batch-456e7890-e12d-34a5-b678-901234567890",
  },
  {
    id: "upload-789a0123-b45c-67d8-e901-234567890123",
    fileName: "bulk_drivers_2025_07_13.xlsx",
    uploadedAt: "2025-07-13T09:15:00Z",
    uploadedBy: "Mike Johnson",
    status: "SUCCESS",
    reportUrl:
      "/v1/drivers/upload-reports/batch-789a0123-b45c-67d8-e901-234567890123",
  },
  {
    id: "upload-abc1234d-ef56-789g-hij0-123456789abc",
    fileName: "driver_data_import.xlsx",
    uploadedAt: "2025-07-12T16:45:00Z",
    uploadedBy: "Sarah Wilson",
    status: "SUCCESS",
    reportUrl:
      "/v1/drivers/upload-reports/batch-abc1234d-ef56-789g-hij0-123456789abc",
  },
  {
    id: "upload-def5678e-fg90-123h-ijk4-567890123def",
    fileName: "new_drivers_batch.xlsx",
    uploadedAt: "2025-07-11T11:20:00Z",
    uploadedBy: "Robert Brown",
    status: "FAILED",
    reportUrl:
      "/v1/drivers/upload-reports/batch-def5678e-fg90-123h-ijk4-567890123def",
  },
];
