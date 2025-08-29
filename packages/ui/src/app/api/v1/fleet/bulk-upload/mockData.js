export const successResponse = {
  Message: {
    Code: 200,
    Text: "Excel file uploaded and processed successfully",
  },
  Data: {
    bulkImportId: "12345678-1234-1234-1234-123456789012", // [dbt_mt_fleet_bulk_import.id]
    fileName: "data_armada.xlsx", // [dbt_mt_fleet_bulk_import.fileName]
    originalFileName: "Data Armada Januari 2025.xlsx", // [dbt_mt_fleet_bulk_import.originalFileName]
    fileSize: 1024576, // [dbt_mt_fleet_bulk_import.fileSize]
    totalRows: 50, // [dbt_mt_fleet_bulk_import.totalRows]
    processedRows: 45, // [dbt_mt_fleet_bulk_import.processedRows]
    successRows: 40, // [dbt_mt_fleet_bulk_import.successRows]
    failedRows: 5, // [dbt_mt_fleet_bulk_import.failedRows]
    status: "COMPLETED", // [dbt_mt_fleet_bulk_import.status]
  },
  Type: "BULK_UPLOAD_EXCEL",
};

export const errorResponse = {
  Message: {
    Code: 400,
    Text: "Excel file validation failed",
  },
  Data: {
    errors: [
      {
        field: "file",
        message: "File format harus .xlsx atau .xls",
      },
    ],
  },
  Type: "BULK_UPLOAD_EXCEL",
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

export const fileSizeErrorResponse = {
  Message: {
    Code: 400,
    Text: "File size too large",
  },
  Data: {
    errors: [
      {
        field: "file",
        message: "Ukuran file maksimal 10MB",
      },
    ],
  },
  Type: "FILE_SIZE_ERROR",
};

export const noFileErrorResponse = {
  Message: {
    Code: 400,
    Text: "No file uploaded",
  },
  Data: {
    errors: [
      {
        field: "file",
        message: "File Excel wajib diunggah",
      },
    ],
  },
  Type: "NO_FILE_ERROR",
};

export const invalidExtensionErrorResponse = {
  Message: {
    Code: 400,
    Text: "Invalid file extension",
  },
  Data: {
    errors: [
      {
        field: "file",
        message: "File harus berformat .xlsx atau .xls",
      },
    ],
  },
  Type: "INVALID_FILE_EXTENSION",
};

// Mock success response with failed status
export const successResponseWithFailures = {
  Message: {
    Code: 200,
    Text: "Excel file uploaded and processed with some errors",
  },
  Data: {
    bulkImportId: "87654321-4321-4321-4321-210987654321",
    fileName: "data_armada_with_errors.xlsx",
    originalFileName: "Data Armada Februari 2025.xlsx",
    fileSize: 2048576,
    totalRows: 100,
    processedRows: 100,
    successRows: 75,
    failedRows: 25,
    status: "COMPLETED_WITH_ERRORS",
  },
  Type: "BULK_UPLOAD_EXCEL",
};
