import { NextResponse } from "next/server";

import {
  emptyDraftsResponse,
  errorResponse,
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

    // Parse query parameters for filtering and pagination
    const url = new URL(req.url);
    const forceError = url.searchParams.get("forceError");
    const noDrafts = url.searchParams.get("noDrafts");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const page = parseInt(url.searchParams.get("page") || "1");
    const search = url.searchParams.get("search");

    // Mock validation - force error for testing
    if (forceError === "true") {
      return NextResponse.json(errorResponse, {
        status: errorResponse.Message.Code,
      });
    }

    // Mock empty state for testing
    if (noDrafts === "true") {
      return NextResponse.json(emptyDraftsResponse, {
        status: emptyDraftsResponse.Message.Code,
      });
    }

    // Get all drafts from mock data
    let drafts = [...successResponse.Data.drafts];

    // Apply search filter if provided
    if (search) {
      const searchLower = search.toLowerCase();
      drafts = drafts.filter(
        (draft) =>
          draft.licensePlate.toLowerCase().includes(searchLower) ||
          draft.truckTypeName.toLowerCase().includes(searchLower) ||
          draft.carrierTypeName.toLowerCase().includes(searchLower) ||
          draft.vehicleBrand.toLowerCase().includes(searchLower) ||
          draft.vehicleType.toLowerCase().includes(searchLower)
      );
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDrafts = drafts.slice(startIndex, endIndex);

    // Return success response with filtered and paginated data
    return NextResponse.json(
      {
        ...successResponse,
        Data: {
          drafts: paginatedDrafts,
          pagination: {
            total: drafts.length,
            page,
            limit,
            totalPages: Math.ceil(drafts.length / limit),
            hasNextPage: endIndex < drafts.length,
            hasPrevPage: page > 1,
          },
        },
      },
      {
        status: successResponse.Message.Code,
      }
    );
  } catch {
    return NextResponse.json(serverErrorResponse, {
      status: 500,
    });
  }
}
