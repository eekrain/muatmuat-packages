import { NextResponse } from "next/server";

import { vehiclesData } from "./mockData";

export async function GET(request, { params }) {
  const { orderId } = params;
  const data = vehiclesData[orderId] || [];

  await new Promise((resolve) => setTimeout(resolve, 50));

  return NextResponse.json({
    Message: { Code: 200, Text: "Vehicles retrieved" },
    Data: data,
  });
}
