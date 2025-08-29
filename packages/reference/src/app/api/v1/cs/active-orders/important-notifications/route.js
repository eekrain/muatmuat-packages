import { NextResponse } from "next/server";

import {
  errorResponse,
  serverErrorResponse,
  successResponse,
} from "./mockData";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(req, { params }) {
  try {
    // Simulate network latency
    await delay(1000);

    // Basic validation example: require an Authorization header
    const auth = req.headers.get("authorization");
    if (!auth) {
      return NextResponse.json(errorResponse, {
        status: errorResponse.Message.Code,
      });
    }
    const notificationType = ["ORDER_URGENT", "SYSTEM_ALERT", "POLICY_UPDATE"];
    return NextResponse.json({
      ...successResponse,
      Data: {
        ...successResponse.Data,
        type: notificationType[0],
        isRead: false,
        transporters: ["transporter1", "transporter2"],
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(serverErrorResponse, { status: 500 });
  }
}
