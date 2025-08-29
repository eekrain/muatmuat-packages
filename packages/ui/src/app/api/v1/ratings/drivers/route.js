import { NextResponse } from "next/server";

import { baseDrivers, serverErrorResponse, successShell } from "./mockData";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(req) {
  try {
    await delay(1000);

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort");
    const order = searchParams.get("order");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const ratings = searchParams.getAll("rating").map(Number);

    let filteredData = [...baseDrivers];

    // Search Logic
    if (search) {
      filteredData = filteredData.filter(
        (driver) =>
          driver.name.toLowerCase().includes(search.toLowerCase()) ||
          driver.phoneNumber.includes(search)
      );
    }

    // Filter Logic
    if (ratings.length > 0) {
      filteredData = filteredData.filter((driver) =>
        ratings.includes(Math.floor(driver.rating))
      );
    }

    // Sorting Logic
    if (sort && order) {
      filteredData.sort((a, b) => {
        const valA = a[sort];
        const valB = b[sort];
        if (order === "asc") {
          return typeof valA === "string"
            ? valA.localeCompare(valB)
            : valA - valB;
        } else {
          return typeof valB === "string"
            ? valB.localeCompare(valA)
            : valB - valA;
        }
      });
    }

    // Summary Calculation (on filtered data)
    const totalRatingSum = filteredData.reduce(
      (sum, driver) => sum + driver.rating,
      0
    );
    const overallAverageRating =
      filteredData.length > 0
        ? (totalRatingSum / filteredData.length).toFixed(1)
        : 0;

    // Pagination Logic
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / limit);
    const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

    // Build Response
    const response = { ...successShell };
    response.Data = {
      drivers: paginatedData,
      summary: { overallAverageRating },
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
      },
    };

    if (totalItems === 0) {
      if (search) {
        response.Data.emptyState = { title: "Keyword Tidak Ditemukan" };
      } else if (ratings.length > 0) {
        response.Data.emptyState = {
          title: "Data Tidak Ditemukan. Mohon coba hapus beberapa filter",
        };
      }
    }

    if (baseDrivers.length === 0) {
      response.Data.emptyState = {
        title: "Oops, rating driver masih kosong",
        subtitle:
          "Mulai terima permintaan sekarang untuk menampilkan data rating driver disini",
        actionButton: { text: "Lihat Permintaan", url: "/monitoring" },
      };
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(serverErrorResponse, { status: 500 });
  }
}
