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
    await delay(800);

    const url = new URL(req.url);
    const search = (
      url.searchParams.get("search") ||
      url.searchParams.get("searchTerm") ||
      ""
    ).trim();

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

    const cloned = JSON.parse(JSON.stringify(successResponse));
    const transporters = cloned.Data.transporters || [];

    // Filter orders inside each shipper by status and search, and remove empty shippers/transporters
    const statuses = statusParam
      ? statusParam
          .split(",")
          .map((s) => s.trim().toUpperCase())
          .filter(Boolean)
      : [];

    const q = search ? search.toLowerCase() : "";

    const filteredTransporters = transporters
      .map((t) => {
        const shippers = (t.shippers || [])
          .map((s) => {
            const orders = (s.orders || []).filter((o) => {
              // status filter
              if (
                statuses.length > 0 &&
                !statuses.includes((o.orderStatus || "").toUpperCase())
              ) {
                return false;
              }

              // search filter: match orderNumber, shipperName, transporterName, cargo, or id
              if (q) {
                const orderNumber = (o.orderNumber || "").toLowerCase();
                const shipperName = (s.shipperName || "").toLowerCase();
                const transporterName = (t.transporterName || "").toLowerCase();
                const cargo = (o.fleetInfo?.cargoName || [])
                  .join(" ")
                  .toLowerCase();
                const id = (o.orderId || "").toLowerCase();
                return (
                  orderNumber.includes(q) ||
                  shipperName.includes(q) ||
                  transporterName.includes(q) ||
                  cargo.includes(q) ||
                  id.includes(q)
                );
              }

              return true;
            });

            return { ...s, orders };
          })
          .filter((s) => (s.orders || []).length > 0);

        return { ...t, shippers };
      })
      .filter((t) => (t.shippers || []).length > 0);

    // Flatten to a list of orders for sorting/pagination decisions
    const allOrders = [];
    filteredTransporters.forEach((t) => {
      t.shippers.forEach((s) => {
        s.orders.forEach((o) => {
          allOrders.push({ transporter: t, shipper: s, order: o });
        });
      });
    });

    // Sorting
    if (sort) {
      if (sort === "WAKTU_MUAT_TERDEKAT") {
        allOrders.sort(
          (a, b) =>
            new Date(a.order.loadTimeStart) - new Date(b.order.loadTimeStart)
        );
      } else if (sort === "WAKTU_MUAT_TERLAMA") {
        allOrders.sort(
          (a, b) =>
            new Date(b.order.loadTimeStart) - new Date(a.order.loadTimeStart)
        );
      } else if (sort === "NO_PESANAN_AZ") {
        allOrders.sort((a, b) =>
          (a.order.orderNumber || "").localeCompare(b.order.orderNumber || "")
        );
      } else if (sort === "NO_PESANAN_ZA") {
        allOrders.sort((a, b) =>
          (b.order.orderNumber || "").localeCompare(a.order.orderNumber || "")
        );
      }
    }

    // Pagination over flattened orders
    const totalItems = allOrders.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));
    const currentPage = Math.max(1, Math.min(page, totalPages));
    const startIndex = (currentPage - 1) * limit;
    const pagedOrders = allOrders.slice(startIndex, startIndex + limit);

    // Reconstruct transporters structure from pagedOrders
    const reconstructed = [];
    pagedOrders.forEach(({ transporter, shipper, order }) => {
      let t = reconstructed.find(
        (x) => x.transporterId === transporter.transporterId
      );
      if (!t) {
        t = { ...transporter, shippers: [] };
        reconstructed.push(t);
      }

      let s = t.shippers.find((x) => x.shipperId === shipper.shipperId);
      if (!s) {
        s = { ...shipper, orders: [] };
        t.shippers.push(s);
      }

      s.orders.push(order);
    });

    cloned.Data.transporters = reconstructed;
    cloned.Data.pagination = {
      totalItems,
      totalPages,
      currentPage,
      itemsPerPage: limit,
    };

    return NextResponse.json(cloned, { status: cloned.Message.Code });
  } catch {
    return NextResponse.json(serverErrorResponse, { status: 500 });
  }
}
