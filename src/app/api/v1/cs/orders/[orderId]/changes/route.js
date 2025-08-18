import { NextResponse } from "next/server";

import { orderChangeDetailsData } from "./mockData";

export async function GET(request, { params }) {
  const { orderId } = params;
  const data = orderChangeDetailsData[orderId];

  if (!data) {
    return NextResponse.json(
      { Message: { Code: 404, Text: "Order change details not found" } },
      { status: 404 }
    );
  }

  await new Promise((resolve) => setTimeout(resolve, 100));

  return NextResponse.json({ Data: data });
}
