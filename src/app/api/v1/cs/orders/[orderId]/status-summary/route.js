import { NextResponse } from "next/server";

import { orderStatusSummaryData } from "./mockData";

export async function GET(request, { params }) {
  const { orderId } = params;

  try {
    const data = orderStatusSummaryData[orderId];

    if (!data) {
      return NextResponse.json(
        {
          Message: {
            Code: 404,
            Text: "Order status summary not found",
          },
        },
        { status: 404 }
      );
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    return NextResponse.json({
      Message: {
        Code: 200,
        Text: "Status summary berhasil diambil",
      },
      Data: data,
      Type: "STATUS_SUMMARY_SUCCESS",
    });
  } catch (error) {
    return NextResponse.json(
      {
        Message: {
          Code: 500,
          Text: "Internal server error",
        },
      },
      { status: 500 }
    );
  }
}
