import { NextResponse } from "next/server";

import {
  errorResponse,
  fleetActivitiesData,
  successResponse,
  validationErrorResponse,
} from "./mockData";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    // Extract query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") || "desc";
    const search = searchParams.get("search") || "";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";
    const status = searchParams.get("status") || "";
    const fleetType = searchParams.get("fleetType") || "";

    // Validation
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

    const allowedSortFields = [
      "dbm_mt_fleet.licensePlate",
      "dbt_mt_order.orderCode",
      "dbm_mt_fleet.fleetStatus",
      "createdAt",
    ];
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
    if (search && search.length < 1) {
      return NextResponse.json(
        validationErrorResponse(
          "search",
          search,
          "Search keyword must be at least 1 character"
        ),
        { status: 400 }
      );
    }

    let filteredData = [...fleetActivitiesData];

    // Apply search filter
    if (search) {
      filteredData = filteredData.filter(
        (fleet) =>
          fleet.licensePlate.toLowerCase().includes(search.toLowerCase()) ||
          fleet.truckType.toLowerCase().includes(search.toLowerCase()) ||
          fleet.currentLocation.toLowerCase().includes(search.toLowerCase()) ||
          fleet.activeOrderCode.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply status filter
    if (status) {
      filteredData = filteredData.filter((fleet) => fleet.status === status);
    }

    // Apply fleet type filter
    if (fleetType) {
      filteredData = filteredData.filter(
        (fleet) => fleet.fleetTypeId === fleetType
      );
    }

    // Apply date filters
    if (startDate || endDate) {
      filteredData = filteredData.filter((fleet) => {
        const fleetDate = new Date(fleet.createdAt);
        const start = startDate ? new Date(startDate) : new Date("1900-01-01");
        const end = endDate ? new Date(endDate) : new Date("2100-12-31");
        return fleetDate >= start && fleetDate <= end;
      });
    }

    // Apply sorting
    filteredData.sort((a, b) => {
      let aValue, bValue;

      switch (sort) {
        case "dbm_mt_fleet.licensePlate":
          aValue = a.licensePlate;
          bValue = b.licensePlate;
          break;
        case "dbt_mt_order.orderCode":
          aValue = a.activeOrderCode;
          bValue = b.activeOrderCode;
          break;
        case "dbm_mt_fleet.fleetStatus":
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = a.createdAt;
          bValue = b.createdAt;
      }

      if (order === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Calculate pagination
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    const response = successResponse({
      activities: paginatedData,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Fleet activities API error:", error);
    return NextResponse.json(errorResponse("Internal server error occurred"), {
      status: 500,
    });
  }
}
