import { NextResponse } from "next/server";

import { baseTransporters, successShell } from "./mockData";

export async function GET(req) {
  try {
    // await new Promise((res) => setTimeout(res, 1000));

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort");
    const order = searchParams.get("order");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const ratings = searchParams.getAll("ratingFilter").map(Number);

    let filteredData = [...baseTransporters];

    if (search) {
      filteredData = filteredData.filter((item) =>
        item.companyName.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (ratings.length > 0) {
      filteredData = filteredData.filter((item) =>
        ratings.includes(Math.floor(item.rating))
      );
    }

    const overallAverage =
      baseTransporters.reduce((sum, item) => sum + item.rating, 0) /
      baseTransporters.length;
    const filteredAverage =
      filteredData.length > 0
        ? filteredData.reduce((sum, item) => sum + item.rating, 0) /
          filteredData.length
        : 0;

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
      transporters: paginatedData,
      summary: {
        averageRatingAll:
          search || ratings.length > 0
            ? filteredAverage.toFixed(1)
            : overallAverage.toFixed(1),
      },
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        itemsPerPage: limit,
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { Message: { Code: 500, Text: "Internal Server Error" } },
      { status: 500 }
    );
  }
}
