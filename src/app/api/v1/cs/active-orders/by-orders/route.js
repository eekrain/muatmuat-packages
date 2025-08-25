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
    // Simulate network latency
    await delay(800);

    const url = new URL(req.url);
    const search = (
      url.searchParams.get("search") ||
      url.searchParams.get("searchTerm") ||
      ""
    ).trim();

    // Basic validation: search term must be at least 3 characters if provided
    if (search && search.length > 0 && search.length < 3) {
      return NextResponse.json(errorResponse, {
        status: errorResponse.Message.Code,
      });
    }

    // Extract query params
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const statusParam = (url.searchParams.get("status") || "").trim();
    const sort = (url.searchParams.get("sort") || "").trim();

    // Work on a deep clone to avoid mutating the original mock
    const cloned = JSON.parse(JSON.stringify(successResponse));
    let items = cloned.Data.orders || [];

    // Filter by status (supports comma separated values)
    if (statusParam) {
      const statuses = statusParam
        .split(",")
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean);
      if (statuses.length > 0) {
        items = items.filter((o) =>
          statuses.includes((o.orderStatus || "").toUpperCase())
        );
      }
    }

    // Search across orderNumber, transporterName, shipperName, cargo names and orderId
    if (search) {
      const q = search.toLowerCase();
      items = items.filter((o) => {
        const orderNumber = (o.orderNumber || "").toLowerCase();
        const transporter = (
          o.transporterInfo?.transporterName || ""
        ).toLowerCase();
        const shipper = (o.shipperInfo?.shipperName || "").toLowerCase();
        const cargo = (o.fleetInfo?.cargoName || []).join(" ").toLowerCase();
        const id = (o.orderId || "").toLowerCase();
        return (
          orderNumber.includes(q) ||
          transporter.includes(q) ||
          shipper.includes(q) ||
          cargo.includes(q) ||
          id.includes(q)
        );
      });
    }

    // Sorting: support UI's sort keys
    if (sort) {
      if (sort === "WAKTU_MUAT_TERDEKAT") {
        items.sort(
          (a, b) => new Date(a.loadTimeStart) - new Date(b.loadTimeStart)
        );
      } else if (sort === "WAKTU_MUAT_TERLAMA") {
        items.sort(
          (a, b) => new Date(b.loadTimeStart) - new Date(a.loadTimeStart)
        );
      } else if (sort === "NO_PESANAN_AZ") {
        items.sort((a, b) =>
          (a.orderNumber || "").localeCompare(b.orderNumber || "")
        );
      } else if (sort === "NO_PESANAN_ZA") {
        items.sort((a, b) =>
          (b.orderNumber || "").localeCompare(a.orderNumber || "")
        );
      }
    }

    // Pagination
    const totalItems = items.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));
    const currentPage = Math.max(1, Math.min(page, totalPages));
    const startIndex = (currentPage - 1) * limit;
    const paged = items.slice(startIndex, startIndex + limit);

    cloned.Data.orders = paged;
    cloned.Data.pagination = {
      totalItems,
      totalPages,
      currentPage,
      itemsPerPage: limit,
    };

    // Return the filtered & paginated mock
    return NextResponse.json(cloned, {
      status: cloned.Message.Code,
    });
  } catch {
    // Return generic server error for unexpected exceptions
    return NextResponse.json(serverErrorResponse, { status: 500 });
  }
}
