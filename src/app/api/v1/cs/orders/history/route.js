import { NextResponse } from "next/server";

import { historyOrdersData } from "./mockData";

// Pastikan path ke mock data benar

// Fungsi helper untuk mengelompokkan data (jika diperlukan untuk view by di masa depan)
const groupDataByTransporter = (orders) => {
  const grouped = orders.reduce((acc, order) => {
    const transporterId = order.transporter.id;
    const shipperId = order.shipper.id;
    if (!acc[transporterId]) {
      acc[transporterId] = { transporter: order.transporter, shippers: {} };
    }
    if (!acc[transporterId].shippers[shipperId]) {
      acc[transporterId].shippers[shipperId] = {
        shipper: order.shipper,
        orders: [],
      };
    }
    acc[transporterId].shippers[shipperId].orders.push(order);
    return acc;
  }, {});
  return Object.values(grouped).map((group) => ({
    ...group,
    shippers: Object.values(group.shippers),
  }));
};

const groupDataByShipper = (orders) => {
  const grouped = orders.reduce((acc, order) => {
    const shipperId = order.shipper.id;
    const transporterId = order.transporter.id;
    if (!acc[shipperId]) {
      acc[shipperId] = { shipper: order.shipper, transporters: {} };
    }
    if (!acc[shipperId].transporters[transporterId]) {
      acc[shipperId].transporters[transporterId] = {
        transporter: order.transporter,
        orders: [],
      };
    }
    acc[shipperId].transporters[transporterId].orders.push(order);
    return acc;
  }, {});
  return Object.values(grouped).map((group) => ({
    ...group,
    transporters: Object.values(group.transporters),
  }));
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const search = searchParams.get("search")?.toLowerCase() || "";
  const viewBy = searchParams.get("viewBy") || "pesanan";

  // Filtering parameters
  const transporterIds = searchParams.getAll("transporterId");
  const shipperIds = searchParams.getAll("shipperId");
  const statuses = searchParams.getAll("status");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");

  // Sorting parameters
  const sortBy = searchParams.get("sortBy") || "loadingSchedule.startDate";
  const order = searchParams.get("order") || "desc"; // Default untuk riwayat biasanya descending

  let filteredOrders = historyOrdersData.orders;

  // Apply Period Filter
  if (dateFrom && dateTo) {
    const from = new Date(dateFrom);
    const to = new Date(dateTo);
    to.setHours(23, 59, 59, 999);
    filteredOrders = filteredOrders.filter((o) => {
      const orderDate = new Date(o.loadingSchedule.startDate);
      return orderDate >= from && orderDate <= to;
    });
  }

  // Apply search
  if (search) {
    filteredOrders = filteredOrders.filter(
      (o) =>
        o.orderCode.toLowerCase().includes(search) ||
        o.transporter.name.toLowerCase().includes(search) ||
        o.shipper.name.toLowerCase().includes(search)
    );
  }

  // Apply filters
  if (transporterIds.length > 0) {
    filteredOrders = filteredOrders.filter((o) =>
      transporterIds.includes(o.transporter.id)
    );
  }
  if (shipperIds.length > 0) {
    filteredOrders = filteredOrders.filter((o) =>
      shipperIds.includes(o.shipper.id)
    );
  }
  if (statuses.length > 0) {
    filteredOrders = filteredOrders.filter((o) =>
      statuses.includes(o.orderStatus)
    );
  }

  // Apply sorting
  filteredOrders.sort((a, b) => {
    const getNestedValue = (obj, path) =>
      path.split(".").reduce((o, key) => o?.[key], obj);
    const valA = getNestedValue(a, sortBy);
    const valB = getNestedValue(b, sortBy);
    if (valA < valB) return order === "asc" ? -1 : 1;
    if (valA > valB) return order === "asc" ? 1 : -1;
    return 0;
  });

  await new Promise((resolve) => setTimeout(resolve, 500));

  if (viewBy === "transporter") {
    const groupedData = groupDataByTransporter(filteredOrders);
    return NextResponse.json({
      Message: { Code: 200, Text: "Grouped history orders retrieved" },
      Data: { groupedData: groupedData, viewBy: "transporter" },
    });
  }

  if (viewBy === "shipper") {
    const groupedData = groupDataByShipper(filteredOrders);
    return NextResponse.json({
      Message: { Code: 200, Text: "Grouped history orders retrieved" },
      Data: { groupedData: groupedData, viewBy: "shipper" },
    });
  }

  // Default: viewBy = 'pesanan'
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / limit);
  const paginatedOrders = filteredOrders.slice(
    (page - 1) * limit,
    page * limit
  );

  return NextResponse.json({
    Message: { Code: 200, Text: "History orders retrieved successfully" },
    Data: {
      orders: paginatedOrders,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    },
    Type: "CS_ORDER_HISTORY",
  });
}
