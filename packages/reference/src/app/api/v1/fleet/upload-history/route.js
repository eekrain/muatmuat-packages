import { NextResponse } from "next/server";

import {
  emptyHistoryResponse,
  errorResponse,
  mockUploadHistory,
  serverErrorResponse,
  successResponse,
} from "./mockData";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Helper function to validate pagination parameters
function validatePaginationParams(page, limit) {
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;

  if (pageNum < 1) {
    return {
      isValid: false,
      error: {
        ...errorResponse,
        Data: {
          errors: [
            {
              field: "page",
              message: "Page number harus lebih besar dari 0",
            },
          ],
        },
      },
    };
  }

  if (limitNum < 1 || limitNum > 100) {
    return {
      isValid: false,
      error: {
        ...errorResponse,
        Data: {
          errors: [
            {
              field: "limit",
              message: "Limit harus antara 1 dan 100",
            },
          ],
        },
      },
    };
  }

  return {
    isValid: true,
    page: pageNum,
    limit: limitNum,
  };
}

export async function GET(req) {
  try {
    // Add realistic delay for database query
    await delay(600);

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const status = searchParams.get("status"); // Optional filter
    const uploader = searchParams.get("uploader"); // Optional filter
    const filename = searchParams.get("filename"); // Optional search (renamed from filename to match frontend)
    const sort = searchParams.get("sort"); // Sort field
    const order = searchParams.get("order"); // Sort order (asc/desc)

    // Validate pagination parameters
    const validation = validatePaginationParams(page, limit);
    if (!validation.isValid) {
      return NextResponse.json(validation.error, {
        status: validation.error.Message.Code,
      });
    }

    const { page: validPage, limit: validLimit } = validation;

    // Generate mock history data (simulate different scenarios)
    let totalItems = 25; // default

    // Simulate different scenarios based on query parameters
    if (status === "empty") {
      return NextResponse.json(emptyHistoryResponse, {
        status: emptyHistoryResponse.Message.Code,
      });
    }

    if (filename === "large") {
      totalItems = 150; // Large dataset for testing
    } else if (filename === "small") {
      totalItems = 5; // Small dataset
    }

    // Generate full history data
    let fullHistory = mockUploadHistory.generateHistoryData(totalItems);

    // Apply filters if provided
    if (status && status !== "all") {
      fullHistory = fullHistory.filter(
        (item) => item.status.toLowerCase() === status.toLowerCase()
      );
    }

    if (uploader) {
      fullHistory = fullHistory.filter((item) =>
        item.uploadBy.toLowerCase().includes(uploader.toLowerCase())
      );
    }

    if (filename && filename !== "large" && filename !== "small") {
      fullHistory = fullHistory.filter((item) =>
        item.originalFileName.toLowerCase().includes(filename.toLowerCase())
      );
    }

    // Apply sorting if provided
    if (sort && order) {
      fullHistory.sort((a, b) => {
        let valueA = a[sort];
        let valueB = b[sort];

        // Handle date sorting
        if (sort === "uploadedAt") {
          valueA = new Date(valueA);
          valueB = new Date(valueB);
        }

        // Handle string sorting
        if (typeof valueA === "string") {
          valueA = valueA.toLowerCase();
          valueB = valueB.toLowerCase();
        }

        if (order === "asc") {
          return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
        } else {
          return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
        }
      });
    }

    // Apply pagination
    const paginatedData = mockUploadHistory.paginateHistory(
      fullHistory,
      validPage,
      validLimit
    );

    // Return paginated response
    return NextResponse.json(
      {
        ...successResponse,
        Data: paginatedData,
      },
      { status: successResponse.Message.Code }
    );
  } catch {
    return NextResponse.json(serverErrorResponse, {
      status: 500,
    });
  }
}
