import { NextResponse } from "next/server";

import {
  errorResponse,
  serverErrorResponse,
  successResponse,
} from "./mockData";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(req, { params: _params }) {
  try {
    // Simulate network latency
    await delay(1000);

    // Basic validation example (no query params expected for this endpoint)
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    // If an unexpected param is provided, return a 400 mock error
    if (searchParams.has("unexpected")) {
      return NextResponse.json(errorResponse, {
        status: errorResponse.Message.Code,
      });
    }

    // Return success response
    return NextResponse.json(successResponse, {
      status: successResponse.data.Message.Code,
    });
  } catch {
    // Return a generic server error in case of unexpected exceptions
    return NextResponse.json(serverErrorResponse, { status: 500 });
  }
}
