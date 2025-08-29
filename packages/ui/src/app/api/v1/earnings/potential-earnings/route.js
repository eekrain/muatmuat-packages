// app/api/v1/earnings/potential-earnings/route.js
import { NextResponse } from "next/server";

import { baseEarnings, serverErrorResponse, successShell } from "./mockData";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(req) {
  try {
    await delay(1000); // Simulate network latency

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort");
    const order = searchParams.get("order"); // 'asc' or 'desc'
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const statuses = searchParams.getAll("status"); // Can be multiple

    let filteredData = [...baseEarnings];

    // 1. Search Logic
    if (search) {
      filteredData = filteredData.filter((item) =>
        item.orderNumber.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 2. Filter Logic
    if (statuses && statuses.length > 0) {
      filteredData = filteredData.filter((item) =>
        statuses.includes(item.status)
      );
    }

    // 3. Sorting Logic
    if (sort && order) {
      filteredData.sort((a, b) => {
        const valA = a[sort];
        const valB = b[sort];

        if (typeof valA === "string") {
          return order === "asc"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }
        if (typeof valA === "number") {
          return order === "asc" ? valA - valB : valB - valA;
        }
        return 0;
      });
    }

    // Calculate total potential from filtered data (before pagination)
    const totalPotential = filteredData.reduce(
      (sum, item) => sum + item.potentialAmount,
      0
    );

    // 4. Pagination Logic
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const paginatedData = filteredData.slice(startIndex, startIndex + limit);

    // Construct the response
    const response = { ...successShell };
    response.Data = {
      earnings: paginatedData,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
      },
      summary: {
        totalPotential,
      },
      // Include empty states based on results
      ...(totalItems === 0 &&
        (search || statuses.length > 0) && {
          emptyState: {
            title:
              "Data Tidak Ditemukan. Mohon coba hapus atau mengubah filter.",
          },
        }),
      ...(totalItems === 0 &&
        search && { emptyState: { title: "Keyword Tidak Ditemukan" } }),
      ...(baseEarnings.length === 0 && {
        emptyState: {
          title: "Oops, potensi pendapatan masih kosong",
          subtitle:
            "Mulai terima permintaan sekarang untuk menampilkan data potensi pendapatan disini",
          actionButton: { text: "Lihat Permintaan", url: "/monitoring" },
        },
      }),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(serverErrorResponse, { status: 500 });
  }
}
