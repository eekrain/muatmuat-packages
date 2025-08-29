import { NextResponse } from "next/server";

import {
  fileSizeErrorResponse,
  invalidExtensionErrorResponse,
  noFileErrorResponse,
  serverErrorResponse,
  successResponse,
  successResponseWithFailures,
} from "./mockData";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Helper function to generate mock bulk import ID
function generateBulkImportId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Helper function to validate Excel file
function validateExcelFile(file) {
  const allowedExtensions = [".xlsx", ".xls"];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!file) {
    return { isValid: false, error: noFileErrorResponse };
  }

  if (file.size > maxSize) {
    return { isValid: false, error: fileSizeErrorResponse };
  }

  const fileName = file.name.toLowerCase();
  const hasValidExtension = allowedExtensions.some((ext) =>
    fileName.endsWith(ext)
  );

  if (!hasValidExtension) {
    return { isValid: false, error: invalidExtensionErrorResponse };
  }

  return { isValid: true };
}

export async function POST(req) {
  try {
    // Add realistic delay for file processing
    await delay(2000);

    // Handle form data
    const formData = await req.formData();
    const file = formData.get("file");

    // Validate the uploaded file
    const validation = validateExcelFile(file);
    if (!validation.isValid) {
      return NextResponse.json(validation.error, {
        status: validation.error.Message.Code,
      });
    }

    // Mock file processing for Excel uploads
    if (file) {
      // Mock processing logic - simulate different scenarios
      const isLargeFile = file.size > 2000000; // 2MB threshold for demo
      const hasErrors = Math.random() < 0.3; // 30% chance of having processing errors

      // Generate mock response data based on file characteristics
      const mockData = {
        bulkImportId: generateBulkImportId(),
        fileName: `processed_${Date.now()}_${file.name}`,
        originalFileName: file.name,
        fileSize: file.size,
        totalRows: isLargeFile
          ? Math.floor(Math.random() * 200) + 50
          : Math.floor(Math.random() * 50) + 10,
      };

      // Calculate mock processing results
      mockData.processedRows = mockData.totalRows;

      if (hasErrors) {
        mockData.failedRows = Math.floor(mockData.totalRows * 0.1); // 10% failure rate
        mockData.successRows = mockData.totalRows - mockData.failedRows;
        mockData.status =
          mockData.failedRows > 0 ? "COMPLETED_WITH_ERRORS" : "COMPLETED";

        // Return response with some failures
        return NextResponse.json(
          {
            ...successResponseWithFailures,
            Data: {
              ...successResponseWithFailures.Data,
              ...mockData,
            },
          },
          { status: successResponseWithFailures.Message.Code }
        );
      } else {
        mockData.failedRows = 0;
        mockData.successRows = mockData.totalRows;
        mockData.status = "COMPLETED";

        // Return successful response
        return NextResponse.json(
          {
            ...successResponse,
            Data: {
              ...successResponse.Data,
              ...mockData,
            },
          },
          { status: successResponse.Message.Code }
        );
      }
    }

    // This shouldn't happen due to validation, but just in case
    return NextResponse.json(noFileErrorResponse, {
      status: noFileErrorResponse.Message.Code,
    });
  } catch {
    return NextResponse.json(serverErrorResponse, {
      status: 500,
    });
  }
}
