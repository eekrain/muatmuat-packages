import { NextResponse } from "next/server";

import {
  errorResponse,
  serverErrorResponse,
  successResponse,
  unauthorizedResponse,
} from "./mockData";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(req, { params }) {
  try {
    // Add realistic delay for testing
    await delay(600);

    const { transporterId } = await params;
    const { searchParams } = new URL(req.url);

    // Extract query parameters
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";
    const orderType = searchParams.get("orderType") || "";

    // Mock validation logic
    if (!transporterId) {
      return NextResponse.json(
        {
          ...errorResponse,
          Message: {
            ...errorResponse.Message,
            Text: "ID transporter tidak valid",
          },
        },
        { status: 400 }
      );
    }

    // Simulate different scenarios based on transporter ID
    switch (transporterId) {
      case "unauthorized":
        return NextResponse.json(unauthorizedResponse, { status: 401 });

      case "not-found":
        return NextResponse.json(errorResponse, { status: 404 });

      case "server-error":
        return NextResponse.json(serverErrorResponse, { status: 500 });

      case "empty-cancellations":
        return NextResponse.json(
          {
            ...successResponse,
            Data: {
              cancellations: [],
              pagination: {
                currentPage: 1,
                totalPages: 0,
                totalItems: 0,
                itemsPerPage: limit,
              },
            },
          },
          { status: 200 }
        );

      default: {
        // Filter cancellations based on query parameters
        let filteredCancellations = successResponse.Data.cancellations;

        if (search) {
          filteredCancellations = filteredCancellations.filter(
            (cancellation) =>
              cancellation.orderCode
                .toLowerCase()
                .includes(search.toLowerCase()) ||
              cancellation.reason
                .toLowerCase()
                .includes(search.toLowerCase()) ||
              cancellation.pickupLocation
                .toLowerCase()
                .includes(search.toLowerCase()) ||
              cancellation.dropoffLocation
                .toLowerCase()
                .includes(search.toLowerCase())
          );
        }

        if (status) {
          filteredCancellations = filteredCancellations.filter(
            (cancellation) => cancellation.status === status
          );
        }

        if (orderType) {
          filteredCancellations = filteredCancellations.filter(
            (cancellation) => cancellation.orderType === orderType
          );
        }

        if (startDate) {
          filteredCancellations = filteredCancellations.filter(
            (cancellation) =>
              new Date(cancellation.cancelledAt) >= new Date(startDate)
          );
        }

        if (endDate) {
          filteredCancellations = filteredCancellations.filter(
            (cancellation) =>
              new Date(cancellation.cancelledAt) <= new Date(endDate)
          );
        }

        // Pagination logic
        const totalItems = filteredCancellations.length;
        const totalPages = Math.ceil(totalItems / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedCancellations = filteredCancellations.slice(
          startIndex,
          endIndex
        );

        return NextResponse.json(
          {
            ...successResponse,
            Data: {
              cancellations: paginatedCancellations,
              pagination: {
                currentPage: page,
                totalPages,
                totalItems,
                itemsPerPage: limit,
              },
              filters: {
                search,
                status,
                startDate,
                endDate,
                orderType,
              },
            },
          },
          { status: 200 }
        );
      }
    }
  } catch {
    return NextResponse.json(serverErrorResponse, { status: 500 });
  }
}
