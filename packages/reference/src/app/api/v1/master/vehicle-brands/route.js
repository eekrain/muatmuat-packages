import { NextResponse } from "next/server";

import {
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

    // Parse URL parameters
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    // Mock validation logic
    if (page < 1) {
      return NextResponse.json(
        {
          ...errorResponse,
          Data: {
            errors: [
              {
                field: "page",
                message: "Page must be greater than 0",
              },
            ],
          },
        },
        {
          status: 400,
        }
      );
    }

    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        {
          ...errorResponse,
          Data: {
            errors: [
              {
                field: "limit",
                message: "Limit must be between 1 and 100",
              },
            ],
          },
        },
        {
          status: 400,
        }
      );
    }

    // Get all vehicle brands from mock data
    let vehicleBrands = successResponse.Data.vehicleBrands;

    // Apply search filter if provided
    if (search) {
      vehicleBrands = vehicleBrands.filter((brand) =>
        brand.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Calculate pagination
    const totalItems = vehicleBrands.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBrands = vehicleBrands.slice(startIndex, endIndex);

    // Return success response with filtered and paginated data
    return NextResponse.json(
      {
        ...successResponse,
        Data: {
          vehicleBrands: paginatedBrands,
          pagination: {
            page: page,
            limit: limit,
            totalItems: totalItems,
            totalPages: totalPages,
          },
        },
      },
      {
        status: successResponse.Message.Code,
      }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(serverErrorResponse, {
      status: 500,
    });
  }
}
