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
    await delay(800);

    const url = new URL(req.url);
    const search = (
      url.searchParams.get("search") ||
      url.searchParams.get("searchTerm") ||
      ""
    ).trim();

    if (search && search.length > 0 && search.length < 3) {
      return NextResponse.json(errorResponse, {
        status: errorResponse.Message.Code,
      });
    }

    return NextResponse.json(successResponse, {
      status: successResponse.Message.Code,
    });
  } catch {
    return NextResponse.json(serverErrorResponse, { status: 500 });
  }
}
