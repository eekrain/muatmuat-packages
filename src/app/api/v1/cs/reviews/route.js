import { NextResponse } from "next/server";

import { baseReviews, successShell } from "./mockData";

export async function GET(req) {
  try {
    // await new Promise(res => setTimeout(res, 1000));

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort");
    const order = searchParams.get("order");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const ratings = searchParams.getAll("ratingFilter").map(Number);
    const transporterIds = searchParams.getAll("transporterFilter");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    let filteredData = [...baseReviews];
    if (dateFrom && dateTo) {
      const startDate = new Date(dateFrom);
      const endDate = new Date(dateTo);
      endDate.setHours(23, 59, 59, 999);
      filteredData = filteredData.filter(
        (item) =>
          new Date(item.date) >= startDate && new Date(item.date) <= endDate
      );
    }
    if (search) {
      filteredData = filteredData.filter(
        (item) =>
          item.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
          item.driver.name.toLowerCase().includes(search.toLowerCase()) ||
          item.transporter.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (ratings.length > 0) {
      filteredData = filteredData.filter((item) =>
        ratings.includes(Math.floor(item.rating))
      );
    }
    if (transporterIds.length > 0) {
      filteredData = filteredData.filter((item) =>
        transporterIds.includes(item.transporter.id)
      );
    }

    const totalRatingSum = filteredData.reduce(
      (sum, item) => sum + item.rating,
      0
    );
    const averageRating =
      filteredData.length > 0 ? totalRatingSum / filteredData.length : 0;

    if (sort && order) {
      filteredData.sort((a, b) => {
        const valA = a[sort];
        const valB = b[sort];
        if (order === "asc") return valA > valB ? 1 : -1;
        return valA < valB ? 1 : -1;
      });
    }

    const totalItems = filteredData.length;
    const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

    const response = { ...successShell };
    response.Data = {
      reviews: paginatedData,
      summary: { averageRating: averageRating.toFixed(1) },
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        itemsPerPage: limit,
      },
    };

    if (baseReviews.length === 0) {
      response.Data.emptyState = {
        title: "Oops, Daftar Ulasan masih kosong",
        subtitle: "Belum ada Shipper yang memberikan ulasan kepada Transporter",
      };
    } else if (totalItems === 0) {
      response.Data.emptyState = {
        title: search ? "Keyword Tidak Ditemukan" : "Data Tidak Ditemukan",
        subtitle: search ? "" : "Mohon coba hapus beberapa filter",
      };
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { Message: { Code: 500, Text: "Internal Server Error" } },
      { status: 500 }
    );
  }
}
