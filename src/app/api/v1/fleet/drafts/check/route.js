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
    // Add realistic delay for testing
    await delay(1000);

    // Simulate checking for existing drafts
    // In a real implementation, this would query the database

    // Mock validation logic - simulate different scenarios
    const url = new URL(req.url);
    const forceError = url.searchParams.get("forceError");

    if (forceError === "true") {
      return NextResponse.json(errorResponse, {
        status: errorResponse.Message.Code,
      });
    }

    // Simulate random draft scenarios for testing
    const scenarios = [
      {
        hasExistingDrafts: true,
        draftCount: 3,
      },
      {
        hasExistingDrafts: true,
        draftCount: 1,
      },
      {
        hasExistingDrafts: false,
        draftCount: 0,
      },
    ];

    const randomScenario =
      // scenarios[Math.floor(Math.random() * scenarios.length)];
      scenarios[0];

    // Return success response with random scenario data
    return NextResponse.json(
      {
        ...successResponse,
        Data: {
          ...successResponse.Data,
          ...randomScenario,
        },
      },
      {
        status: successResponse.Message.Code,
      }
    );
  } catch {
    // Log error for debugging
    return NextResponse.json(serverErrorResponse, {
      status: 500,
    });
  }
}
