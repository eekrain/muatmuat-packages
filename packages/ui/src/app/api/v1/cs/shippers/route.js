import { NextResponse } from "next/server";

import { serverErrorResponse, successResponse } from "./mockData";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(req) {
  try {
    await delay(600);

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const search = (url.searchParams.get("search") || "").toLowerCase();

    // support filters serialized as query params. For example:
    // ?status=active&status=inactive&totalOrders=0&totalOrders=1-10
    const statusFilters = url.searchParams.getAll("status");
    const totalOrdersFilters = url.searchParams.getAll("totalOrders");

    const all = Array.isArray(successResponse.Data.shippers)
      ? [...successResponse.Data.shippers]
      : [];

    let filtered = all;

    // basic search by name or company
    if (search) {
      filtered = filtered.filter((s) => {
        const name = (s.fullName || "").toLowerCase();
        const company = (s.companyName || "").toLowerCase();
        return name.includes(search) || company.includes(search);
      });
    }

    // apply status filters if provided
    if (statusFilters && statusFilters.length > 0) {
      filtered = filtered.filter((s) =>
        statusFilters.includes((s.status || "").toString())
      );
    }

    // apply totalOrders filters (support a few range syntaxes)
    if (totalOrdersFilters && totalOrdersFilters.length > 0) {
      const matchesTotalOrders = (orders) => {
        const n = Number(orders) || 0;
        return totalOrdersFilters.some((f) => {
          if (f === "0") return n === 0;
          if (f === "50+") return n > 50;
          if (f.includes("-")) {
            const [lo, hi] = f.split("-").map((v) => Number(v));
            return n >= lo && n <= hi;
          }
          return false;
        });
      };

      filtered = filtered.filter((s) =>
        matchesTotalOrders(s.activeOrders || 0)
      );
    }

    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));
    const currentPage = Math.min(Math.max(1, page), totalPages);
    const start = (currentPage - 1) * limit;
    const end = start + limit;

    const paged = filtered.slice(start, end);

    const resp = {
      ...successResponse,
      Data: {
        ...successResponse.Data,
        shippers: paged,
        pagination: {
          currentPage,
          totalPages,
          totalItems,
          itemsPerPage: limit,
        },
      },
    };

    return NextResponse.json(resp, { status: resp.Message.Code });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("API Error:", error);
    return NextResponse.json(serverErrorResponse, { status: 500 });
  }
}
