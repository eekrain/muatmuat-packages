import { NextResponse } from "next/server";

import { activeOrdersData } from "./mockData";

const groupDataByTransporter = (orders) => {
  const grouped = orders.reduce((acc, order) => {
    const transporterId = order.transporter.id;
    const shipperId = order.shipper.id;

    if (!acc[transporterId]) {
      acc[transporterId] = {
        transporter: order.transporter,
        shippers: {},
      };
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

  return Object.values(grouped).map((transporterGroup) => ({
    ...transporterGroup,
    shippers: Object.values(transporterGroup.shippers),
  }));
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const search = searchParams.get("search")?.toLowerCase() || "";

  const transporterIds = searchParams.getAll("transporterId");
  const shipperIds = searchParams.getAll("shipperId");
  const statuses = searchParams.getAll("status");
  const urgentStatus = searchParams.get("urgentStatus");

  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const viewBy = searchParams.get("viewBy") || "pesanan";

  if (urgentStatus && urgentStatus !== "all") {
    statuses.push(urgentStatus);
  }

  const sortBy = searchParams.get("sortBy") || "loadingSchedule.startDate";
  const order = searchParams.get("order") || "asc";

  let filteredOrders = activeOrdersData.orders;

  if (dateFrom && dateTo) {
    const from = new Date(dateFrom);
    const to = new Date(dateTo);
    to.setHours(23, 59, 59, 999);

    filteredOrders = filteredOrders.filter((o) => {
      const orderDate = new Date(o.loadingSchedule.startDate);
      return orderDate >= from && orderDate <= to;
    });
  }

  if (search) {
    filteredOrders = filteredOrders.filter(
      (o) =>
        o.orderCode.toLowerCase().includes(search) ||
        o.transporter.name.toLowerCase().includes(search) ||
        o.shipper.name.toLowerCase().includes(search)
    );
  }

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
    const uniqueStatuses = [...new Set(statuses)];
    filteredOrders = filteredOrders.filter((o) =>
      uniqueStatuses.includes(o.orderStatus)
    );
  }

  filteredOrders.sort((a, b) => {
    const getNestedValue = (obj, path) =>
      path.split(".").reduce((o, key) => o?.[key], obj);
    const valA = getNestedValue(a, sortBy);
    const valB = getNestedValue(b, sortBy);
    if (valA < valB) return order === "asc" ? -1 : 1;
    if (valA > valB) return order === "asc" ? 1 : -1;
    return 0;
  });

  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / limit);
  const paginatedOrders = filteredOrders.slice(
    (page - 1) * limit,
    page * limit
  );

  await new Promise((resolve) => setTimeout(resolve, 800));

  if (viewBy === "transporter") {
    const groupedData = groupDataByTransporter(filteredOrders);
    return NextResponse.json({
      Message: {
        Code: 200,
        Text: "Grouped active orders retrieved successfully",
      },
      Data: { groupedData: groupedData, pagination: null },
      Type: "CS_ACTIVE_ORDERS_GROUPED",
    });
  }

  return NextResponse.json({
    Message: { Code: 200, Text: "Active orders retrieved successfully" },
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
    Type: "CS_ACTIVE_ORDERS",
  });
}
