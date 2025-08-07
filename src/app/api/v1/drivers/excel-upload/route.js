import { NextResponse } from "next/server";

import {
  errorResponse,
  fileTooLargeResponse,
  noFileResponse,
  serverErrorResponse,
  successResponse,
} from "./mockData";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Generate a unique batch ID for mock response
function generateBatchId() {
  return `batch-${crypto.randomUUID()}`;
}

// Mock function to simulate Excel file processing
function simulateExcelProcessing(file) {
  const validExtensions = [
    ".xls",
    ".xlsx",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  const isValidExcel = validExtensions.some(
    (ext) =>
      file.name.toLowerCase().endsWith(ext.toLowerCase()) || file.type === ext
  );

  if (!isValidExcel) {
    return {
      isValid: false,
      error: "INVALID_FORMAT",
    };
  }

  // Simulate random processing results
  const totalDrivers = Math.floor(Math.random() * 50) + 10; // 10-60 drivers
  const failedCount = Math.floor(Math.random() * 5); // 0-4 failures
  const successCount = totalDrivers - failedCount;
  const status = failedCount === 0 ? "COMPLETED" : "COMPLETED"; // Could be 'FAILED' for major failures

  return {
    isValid: true,
    batchId: generateBatchId(),
    totalDrivers,
    successCount,
    failedCount,
    status,
    processedAt: new Date().toISOString(),
  };
}

export async function POST(req) {
  try {
    // Add realistic delay for file processing
    await delay(3000); // 3 seconds for Excel processing

    // Handle form data
    const formData = await req.formData();
    const file = formData.get("file");

    // Check if file is provided
    if (!file) {
      return NextResponse.json(noFileResponse, {
        status: noFileResponse.Message.Code,
      });
    }

    // Check file size (10MB limit)
    if (file.size > 10000000) {
      return NextResponse.json(fileTooLargeResponse, {
        status: fileTooLargeResponse.Message.Code,
      });
    }

    // Simulate Excel file processing
    const processingResult = simulateExcelProcessing(file);

    if (!processingResult.isValid) {
      if (processingResult.error === "INVALID_FORMAT") {
        return NextResponse.json(errorResponse, {
          status: errorResponse.Message.Code,
        });
      }
    }

    // Create dynamic success response with processing results
    const dynamicSuccessResponse = {
      ...successResponse,
      Data: {
        ...successResponse.Data,
        batchId: processingResult.batchId,
        totalDrivers: processingResult.totalDrivers,
        successCount: processingResult.successCount,
        failedCount: processingResult.failedCount,
        processedAt: processingResult.processedAt,
        status: processingResult.status,
        reportUrl: `/v1/drivers/upload-reports/${processingResult.batchId}`,
      },
    };

    // Return success response with processed data
    return NextResponse.json(dynamicSuccessResponse, {
      status: dynamicSuccessResponse.Message.Code,
    });
  } catch {
    return NextResponse.json(serverErrorResponse, {
      status: 500,
    });
  }
}
