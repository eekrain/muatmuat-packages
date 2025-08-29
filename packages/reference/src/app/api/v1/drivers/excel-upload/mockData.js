export const successResponse = {
  Message: {
    Code: 200,
    Text: "Excel file processed successfully",
  },
  Data: {
    batchId: "batch-123e4567-e89b-12d3-a456-426614174000", // Referensi ke [dbt_mt_drivers.bulk_upload_batch] di ERD
    totalDrivers: 25,
    successCount: 23,
    failedCount: 2,
    processedAt: "2025-07-15T10:30:00Z", // Referensi ke [dbt_mt_drivers.created_at] di ERD
    status: "COMPLETED",
    reportUrl:
      "/v1/drivers/upload-reports/batch-123e4567-e89b-12d3-a456-426614174000",
  },
  Type: "UPLOAD_EXCEL_FILE",
};

export const errorResponse = {
  Message: {
    Code: 400,
    Text: "Invalid file format or content",
  },
  Data: {
    errors: [
      {
        field: "file",
        message: "File must be .xls or .xlsx format",
      },
    ],
  },
  Type: "UPLOAD_EXCEL_FILE",
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

export const fileTooLargeResponse = {
  Message: {
    Code: 413,
    Text: "File too large",
  },
  Data: {
    errors: [
      {
        field: "file",
        message: "File size must be less than 10MB",
      },
    ],
  },
  Type: "FILE_TOO_LARGE",
};

export const noFileResponse = {
  Message: {
    Code: 400,
    Text: "No file provided",
  },
  Data: {
    errors: [
      {
        field: "file",
        message: "Please select an Excel file to upload",
      },
    ],
  },
  Type: "NO_FILE_PROVIDED",
};
