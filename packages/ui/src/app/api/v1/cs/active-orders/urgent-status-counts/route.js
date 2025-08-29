/* eslint-disable no-console */
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
    await delay(1000);

    const url = new URL(req.url);
    // Example support: query param 'onlyUrgent=true'
    const onlyUrgent = url.searchParams.get("onlyUrgent");

    // Basic validation example
    if (onlyUrgent && !["true", "false"].includes(onlyUrgent.toLowerCase())) {
      return NextResponse.json(errorResponse, {
        status: errorResponse.Message.Code,
      });
    }

    // Optionally filter mock data based on query
    if (onlyUrgent === "true") {
      const filtered = {
        ...successResponse,
        Data: {
          ...successResponse.Data,
          statusCounts: successResponse.Data.statusCounts.filter(
            (s) => s.isUrgent
          ),
        },
      };
      return NextResponse.json(filtered, {
        status: successResponse.Message.Code,
      });
    }

    return NextResponse.json(successResponse, {
      status: successResponse.Message.Code,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(serverErrorResponse, { status: 500 });
  }
}
