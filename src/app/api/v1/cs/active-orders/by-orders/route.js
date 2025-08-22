import { NextResponse } from "next/server";

import {
  errorResponse,
  serverErrorResponse,
  successResponse,
} from "./mockData";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(req) {
  try {
    // Simulate network latency
    await delay(800);

    const url = new URL(req.url);
    const search = (
      url.searchParams.get("search") ||
      url.searchParams.get("searchTerm") ||
      ""
    ).trim();

    // Basic validation: search term must be at least 3 characters if provided
    if (search && search.length > 0 && search.length < 3) {
      return NextResponse.json(errorResponse, {
        status: errorResponse.Message.Code,
      });
    }

    // Extract pagination params if needed (not used to alter mock response but available)
    // const page = parseInt(url.searchParams.get('page') || '1', 10);
    // const limit = parseInt(url.searchParams.get('limit') || '10', 10);

    // Return success
    return NextResponse.json(successResponse, {
      status: successResponse.Message.Code,
    });
  } catch {
    // Return generic server error for unexpected exceptions
    return NextResponse.json(serverErrorResponse, { status: 500 });
  }
}
