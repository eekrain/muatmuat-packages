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
    await delay(800);

    const orderId = params?.orderId;

    // Basic validation: orderId must be present and look like a non-empty string
    if (!orderId || typeof orderId !== "string" || orderId.trim() === "") {
      return NextResponse.json(errorResponse, {
        status: errorResponse.Message.Code,
      });
    }

    // Deep clone so consumers can mutate safely
    const cloned = JSON.parse(JSON.stringify(successResponse));

    // Optionally, we could vary the response based on orderId (simple rule below)
    if (orderId.includes("empty")) {
      cloned.Data.transporterContacts.pics = [];
      cloned.Data.shipperContacts.pics = [];
    }

    return NextResponse.json(cloned, { status: cloned.Message.Code });
  } catch {
    // Unexpected error - return generic server error
    return NextResponse.json(serverErrorResponse, { status: 500 });
  }
}
