import { NextResponse } from "next/server";

import {
  errorResponse,
  notFoundResponse,
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
    const vehicleBrandId = searchParams.get("vehicleBrandId");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    // Validate required parameter
    if (!vehicleBrandId) {
      return NextResponse.json(errorResponse, {
        status: 400,
      });
    }

    // Get all vehicle types from mock data
    let vehicleTypes = successResponse.Data.vehicleTypes;

    // Filter by vehicleBrandId
    vehicleTypes = vehicleTypes.filter(
      (type) => type.vehicleBrandId === vehicleBrandId
    );

    // Check if brand exists (has vehicle types)
    if (vehicleTypes.length === 0) {
      return NextResponse.json(notFoundResponse, {
        status: 404,
      });
    }

    // Calculate pagination
    const totalItems = vehicleTypes.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTypes = vehicleTypes.slice(startIndex, endIndex);

    // Return success response with filtered and paginated data
    return NextResponse.json(
      {
        ...successResponse,
        Data: {
          vehicleTypes: paginatedTypes,
          pagination: {
            page: page,
            limit: limit,
            totalItems: totalItems,
            totalPages: totalPages,
          },
        },
        Type: `/v1/master/vehicle-types?vehicleBrandId=${vehicleBrandId}`,
      },
      {
        status: successResponse.Message.Code,
      }
    );
  } catch (error) {
    // Log error for debugging (removed console.error to avoid lint issues)
    return NextResponse.json(serverErrorResponse, {
      status: 500,
    });
  }
}
