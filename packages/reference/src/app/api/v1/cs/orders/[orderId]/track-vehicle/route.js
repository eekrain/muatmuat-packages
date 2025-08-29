import { NextResponse } from "next/server";

import { trackingData } from "./mockData";

export async function GET(request, { params }) {
  const { orderId } = params;
  const data = trackingData[orderId];

  if (!data) {
    return NextResponse.json(
      { Message: { Code: 404, Text: "Tracking data not found" } },
      { status: 404 }
    );
  }

  await new Promise((resolve) => setTimeout(resolve, 500));
  return NextResponse.json({ Data: data });
}
