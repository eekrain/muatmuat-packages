import { NextResponse } from "next/server";

import {
  notFoundResponse,
  serverErrorResponse,
  sosDetailsData,
  successShell,
} from "./mockData";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(request, { params }) {
  try {
    const { orderId, sosId } = params;

    // Validate parameters
    if (!orderId || !sosId) {
      return NextResponse.json(
        {
          Message: {
            Code: 400,
            Text: "Parameter orderId dan sosId wajib disediakan",
          },
          Type: "SOS_DETAIL_BAD_REQUEST",
        },
        { status: 400 }
      );
    }

    // Simulate network delay
    await delay(300);

    // Check if order exists
    const orderData = sosDetailsData[orderId];
    if (!orderData) {
      return NextResponse.json(
        {
          Message: {
            Code: 404,
            Text: "Pesanan tidak ditemukan",
          },
          Type: "ORDER_NOT_FOUND",
        },
        { status: 404 }
      );
    }

    // Check if SOS exists for this order
    const sosData = orderData[sosId];
    if (!sosData) {
      return NextResponse.json(notFoundResponse, { status: 404 });
    }

    // Build successful response
    const response = { ...successShell };
    response.Data = sosData;

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("SOS Details API Error:", error);
    return NextResponse.json(serverErrorResponse, { status: 500 });
  }
}
