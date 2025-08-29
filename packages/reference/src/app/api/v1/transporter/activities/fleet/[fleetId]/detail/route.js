import { NextResponse } from "next/server";

import {
  errorResponse,
  fleetDetailData,
  successResponse,
  validationErrorResponse,
} from "./mockData";

export async function GET(req, { params }) {
  try {
    const { fleetId } = params;
    const { searchParams } = new URL(req.url);

    // Extract query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") || "desc";
    const search = searchParams.get("search") || "";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";

    // Validation
    if (!fleetId) {
      return NextResponse.json(
        validationErrorResponse("fleetId", fleetId, "Fleet ID is required"),
        { status: 400 }
      );
    }

    // UUID validation
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(fleetId)) {
      return NextResponse.json(
        validationErrorResponse(
          "fleetId",
          fleetId,
          "Fleet ID must be a valid UUID"
        ),
        { status: 400 }
      );
    }

    if (page <= 0) {
      return NextResponse.json(
        validationErrorResponse("page", page, "Page must be greater than 0"),
        { status: 400 }
      );
    }

    if (limit <= 0 || limit > 100) {
      return NextResponse.json(
        validationErrorResponse(
          "limit",
          limit,
          "Limit must be between 1 and 100"
        ),
        { status: 400 }
      );
    }

    const allowedSortFields = ["createdAt", "status", "orderCode"];
    if (!allowedSortFields.includes(sort)) {
      return NextResponse.json(
        validationErrorResponse("sort", sort, "Invalid sort field"),
        { status: 400 }
      );
    }

    if (!["asc", "desc"].includes(order)) {
      return NextResponse.json(
        validationErrorResponse(
          "order",
          order,
          "Order must be 'asc' or 'desc'"
        ),
        { status: 400 }
      );
    }

    // Date validation
    if (startDate && !/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
      return NextResponse.json(
        validationErrorResponse(
          "startDate",
          startDate,
          "Start date must be in YYYY-MM-DD format"
        ),
        { status: 400 }
      );
    }

    if (endDate && !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
      return NextResponse.json(
        validationErrorResponse(
          "endDate",
          endDate,
          "End date must be in YYYY-MM-DD format"
        ),
        { status: 400 }
      );
    }

    // Search validation
    if (search && search.length > 255) {
      return NextResponse.json(
        validationErrorResponse(
          "search",
          search,
          "Search keyword must not exceed 255 characters"
        ),
        { status: 400 }
      );
    }

    // Check if fleet exists
    if (!fleetDetailData[fleetId]) {
      return NextResponse.json(
        {
          Message: {
            Code: 404,
            Text: "Fleet not found",
          },
          Data: null,
          Type: "GET_FLEET_DETAIL",
        },
        { status: 404 }
      );
    }

    let filteredActivities = [...fleetDetailData[fleetId].activities];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredActivities = filteredActivities.filter(
        (activity) =>
          activity.orderInfo.orderCode.toLowerCase().includes(searchLower) ||
          activity.orderInfo.invoiceNumber
            .toLowerCase()
            .includes(searchLower) ||
          activity.orderInfo.pickupLocation
            .toLowerCase()
            .includes(searchLower) ||
          activity.orderInfo.dropoffLocation
            .toLowerCase()
            .includes(searchLower) ||
          activity.driverInfo.name.toLowerCase().includes(searchLower) ||
          activity.driverInfo.phoneNumber.includes(search)
      );
    }

    // Apply date filters
    if (startDate || endDate) {
      filteredActivities = filteredActivities.filter((activity) => {
        if (!activity.orderInfo.loadingTime) return true;

        const activityDate = new Date(activity.orderInfo.loadingTime)
          .toISOString()
          .split("T")[0];
        const start = startDate || "1900-01-01";
        const end = endDate || "2100-12-31";

        return activityDate >= start && activityDate <= end;
      });
    }

    // Apply sorting
    filteredActivities.sort((a, b) => {
      let aValue, bValue;

      switch (sort) {
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "orderCode":
          aValue = a.orderInfo.orderCode;
          bValue = b.orderInfo.orderCode;
          break;
        default:
          aValue = a.orderInfo.loadingTime || "1900-01-01T00:00:00Z";
          bValue = b.orderInfo.loadingTime || "1900-01-01T00:00:00Z";
      }

      if (order === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Calculate pagination
    const totalItems = filteredActivities.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedActivities = filteredActivities.slice(startIndex, endIndex);

    const response = successResponse({
      activities: paginatedActivities,
      pagination: {
        page,
        limit,
        total: totalItems,
        totalPages,
      },
    });

    response.Message.Text = "Fleet detail retrieved successfully";
    response.Type = "GET_FLEET_DETAIL";

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Fleet detail API error:", error);
    return NextResponse.json(errorResponse("Internal server error occurred"), {
      status: 500,
    });
  }
}
