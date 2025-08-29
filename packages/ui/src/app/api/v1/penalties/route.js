import { NextResponse } from "next/server";

import { basePenalties, serverErrorResponse, successShell } from "./mockData";

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
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    let filteredData = [...basePenalties];

    // 1. Date Filtering
    if (dateFrom && dateTo) {
      const startDate = new Date(dateFrom);
      const endDate = new Date(dateTo);
      endDate.setHours(23, 59, 59, 999);
      filteredData = filteredData.filter((item) => {
        const itemDate = new Date(item.cancellationDate);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    // 2. Search Filtering
    if (search) {
      const lowercasedSearch = search.toLowerCase();
      filteredData = filteredData.filter(
        (item) =>
          item.orderNumber.toLowerCase().includes(lowercasedSearch) ||
          item.armada.name.toLowerCase().includes(lowercasedSearch) ||
          item.armada.licensePlate.toLowerCase().includes(lowercasedSearch)
      );
    }

    // 3. Sorting
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

    // 4. Summary Calculation
    const totalPenalties = filteredData.length;

    // 5. Pagination
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / limit);
    const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

    const response = { ...successShell };
    response.Data = {
      penalties: paginatedData,
      summary: { totalPenalties },
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
      },
    };

    if (basePenalties.length === 0) {
      response.Data.emptyState = {
        title: "Tidak ada pesanan yang dibatalkan",
        subtitle:
          "Penalti dihitung dari jumlah pembatalan pesanan oleh Transporter atau Shipper",
      };
    } else if (totalItems === 0) {
      if (search)
        response.Data.emptyState = { title: "Keyword Tidak Ditemukan" };
      else response.Data.emptyState = { title: "Tidak ada data" };
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(serverErrorResponse, { status: 500 });
  }
}
