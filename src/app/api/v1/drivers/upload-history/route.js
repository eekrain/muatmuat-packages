import { NextResponse } from "next/server";

import {
  authErrorResponse,
  errorResponse,
  mockUploadHistory,
  serverErrorResponse,
  successResponse,
} from "./mockData";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(req) {
  try {
    // Add realistic delay for testing
    await delay(1000);

    // Check for authorization header
    const authHeader = req.headers.get("authorization");

    // Mock validation logic - check if authorization header is present
    if (!authHeader) {
      return NextResponse.json(authErrorResponse, {
        status: authErrorResponse.Message.Code,
      });
    }

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "uploadedAt";
    const order = searchParams.get("order") || "desc";

    // Validate search parameter
    if (search && search.length > 0 && search.length < 3) {
      return NextResponse.json(errorResponse, {
        status: errorResponse.Message.Code,
      });
    }

    // Filter data based on search term
    let filteredHistory = [...mockUploadHistory];

    if (search) {
      filteredHistory = mockUploadHistory.filter(
        (item) =>
          item.fileName.toLowerCase().includes(search.toLowerCase()) ||
          item.uploadedBy.toLowerCase().includes(search.toLowerCase()) ||
          item.status.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort data
    filteredHistory.sort((a, b) => {
      let aValue = a[sort];
      let bValue = b[sort];

      // Handle date sorting
      if (sort === "uploadedAt") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (order === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Calculate pagination
    const total = filteredHistory.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedHistory = filteredHistory.slice(startIndex, endIndex);

    // Return success response with paginated data
    const response = {
      ...successResponse,
      Data: {
        history: paginatedHistory,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
    };

    // Log for debugging purposes
    // eslint-disable-next-line no-console
    console.log("Upload history retrieved:", {
      search,
      page,
      limit,
      total,
      totalPages,
      recordsReturned: paginatedHistory.length,
    });

    return NextResponse.json(response, {
      status: response.Message.Code,
    });
  } catch (error) {
    // Log error for debugging
    // eslint-disable-next-line no-console
    console.error("API Error:", error);
    return NextResponse.json(serverErrorResponse, {
      status: 500,
    });
  }
}
