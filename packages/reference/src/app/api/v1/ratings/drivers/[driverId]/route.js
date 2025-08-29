import { NextResponse } from "next/server";

import {
  baseRatingHistory,
  serverErrorResponse,
  successShell,
} from "./mockData";

export async function GET(req, { params }) {
  const { driverId } = params;
  if (!driverId) {
    return NextResponse.json(
      { message: "Driver ID is required" },
      { status: 400 }
    );
  }

  try {
    await new Promise((res) => setTimeout(res, 1000)); // Simulate latency

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort");
    const order = searchParams.get("order");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const ratings = searchParams.getAll("rating").map(Number);
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    let filteredData = [...baseRatingHistory];

    // 1. Date Filtering
    if (dateFrom && dateTo) {
      const startDate = new Date(dateFrom);
      const endDate = new Date(dateTo);
      endDate.setHours(23, 59, 59, 999); // Include the whole end day
      filteredData = filteredData.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    // 2. Search Filtering
    if (search) {
      filteredData = filteredData.filter(
        (item) =>
          item.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
          item.armada.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 3. Rating Filtering
    if (ratings.length > 0) {
      filteredData = filteredData.filter((item) =>
        ratings.includes(Math.floor(item.rating))
      );
    }

    // 4. Summary Calculation (after all filters)
    const totalRatingSum = filteredData.reduce(
      (sum, item) => sum + item.rating,
      0
    );
    const averageRating =
      filteredData.length > 0 ? totalRatingSum / filteredData.length : 0;

    // 5. Sorting
    if (sort && order) {
      filteredData.sort((a, b) => {
        const valA = a[sort];
        const valB = b[sort];
        if (order === "asc") {
          return valA > valB ? 1 : -1;
        } else {
          return valA < valB ? 1 : -1;
        }
      });
    }

    // 6. Pagination
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / limit);
    const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

    const response = { ...successShell };
    response.Data = {
      history: paginatedData,
      summary: { totalRating: averageRating.toFixed(1) },
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
      },
    };

    // Add empty state messages
    if (totalItems === 0) {
      if (search)
        response.Data.emptyState = { title: "Keyword Tidak Ditemukan" };
      else if (ratings.length > 0 || dateFrom)
        response.Data.emptyState = {
          title: "Data Tidak Ditemukan. Mohon coba hapus beberapa filter",
        };
      else response.Data.emptyState = { title: "Tidak ada data" };
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(serverErrorResponse, { status: 500 });
  }
}
