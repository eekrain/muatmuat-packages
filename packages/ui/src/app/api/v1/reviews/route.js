import { NextResponse } from "next/server";

import { baseReviews, serverErrorResponse, successShell } from "./mockData";

export async function GET(req) {
  try {
    await new Promise((res) => setTimeout(res, 1000));

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "new"; // Default to 'new' tab
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort");
    const order = searchParams.get("order");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const ratings = searchParams.getAll("rating").map(Number);
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    let filteredData = [...baseReviews];

    // Important: We need the total counts *before* status filtering for the tabs
    const newCount = baseReviews.filter((r) => r.status === "new").length;
    const readCount = baseReviews.filter((r) => r.status === "read").length;

    // 1. Status Filtering (for the main data)
    filteredData = filteredData.filter((review) => review.status === status);

    // 2. Date Filtering
    if (dateFrom && dateTo) {
      const startDate = new Date(dateFrom);
      const endDate = new Date(dateTo);
      endDate.setHours(23, 59, 59, 999);
      filteredData = filteredData.filter(
        (item) =>
          new Date(item.date) >= startDate && new Date(item.date) <= endDate
      );
    }

    // 3. Search Filtering
    if (search) {
      const lowercasedSearch = search.toLowerCase();
      filteredData = filteredData.filter(
        (item) =>
          item.orderNumber.toLowerCase().includes(lowercasedSearch) ||
          item.driver.name.toLowerCase().includes(lowercasedSearch)
      );
    }

    // 4. Rating Filtering
    if (ratings.length > 0) {
      filteredData = filteredData.filter((item) =>
        ratings.includes(Math.floor(item.rating))
      );
    }

    // 5. Summary Calculation
    const totalRatingSum = filteredData.reduce(
      (sum, item) => sum + item.rating,
      0
    );
    const averageRating =
      filteredData.length > 0 ? totalRatingSum / filteredData.length : 0;

    // 6. Sorting
    if (sort && order) {
      filteredData.sort((a, b) => {
        const valA = a[sort];
        const valB = b[sort];
        if (order === "asc") return valA > valB ? 1 : -1;
        return valA < valB ? 1 : -1;
      });
    }

    // 7. Pagination
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / limit);
    const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

    const response = { ...successShell };
    response.Data = {
      reviews: paginatedData,
      summary: { averageRating: averageRating.toFixed(1), newCount, readCount },
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
      },
    };

    if (baseReviews.length === 0) {
      response.Data.emptyState = {
        title: "Oops, Daftar Ulasan masih kosong",
        subtitle:
          "Mulai terima permintaan sekarang untuk menampilkan data Daftar Ulasan disini",
        actionButton: { text: "Lihat Permintaan", url: "/monitoring" },
      };
    } else if (totalItems === 0) {
      if (search)
        response.Data.emptyState = { title: "Keyword Tidak Ditemukan" };
      else if (ratings.length > 0 || dateFrom)
        response.Data.emptyState = {
          title: "Data Tidak Ditemukan",
          subtitle: "Mohon coba hapus beberapa filter",
        };
      else response.Data.emptyState = { title: "Tidak ada data" };
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(serverErrorResponse, { status: 500 });
  }
}
