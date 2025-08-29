import { NextResponse } from "next/server";

import { fleetTrackingData } from "./mockData";

export async function GET(request, { params }) {
  try {
    const { orderId } = params;

    if (!orderId) {
      return NextResponse.json(
        {
          Message: {
            Code: 400,
            Text: "Order ID is required",
          },
        },
        { status: 400 }
      );
    }

    const data = fleetTrackingData[orderId];

    if (!data) {
      return NextResponse.json(
        {
          Message: {
            Code: 404,
            Text: "Fleet tracking data not found",
          },
        },
        { status: 404 }
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({
      Message: {
        Code: 200,
        Text: "Status armada berhasil diambil",
      },
      Data: data,
      Type: "FLEET_TRACKING_SUCCESS",
    });
  } catch (error) {
    console.error("Fleet tracking error:", error);

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
