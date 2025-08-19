import { NextResponse } from "next/server";

import {
  inactiveTransporterResponse,
  newTransporterResponse,
  successResponse,
  transporterDetailsErrorResponse,
  transporterDetailsServerErrorResponse,
  transporterDetailsUnauthorizedResponse,
} from "./mockData";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(req, { params }) {
  try {
    // Add realistic delay for testing
    await delay(800);

    const { transporterId } = await params;

    // Mock validation logic
    if (!transporterId) {
      return NextResponse.json(
        {
          ...transporterDetailsErrorResponse,
          Message: {
            ...transporterDetailsErrorResponse.Message,
            Text: "ID transporter tidak valid",
          },
        },
        { status: 400 }
      );
    }

    // Simulate different scenarios based on transporter ID
    switch (transporterId) {
      case "unauthorized": {
        return NextResponse.json(transporterDetailsUnauthorizedResponse, {
          status: 401,
        });
      }

      case "not-found": {
        return NextResponse.json(transporterDetailsErrorResponse, {
          status: 404,
        });
      }

      case "server-error": {
        return NextResponse.json(transporterDetailsServerErrorResponse, {
          status: 500,
        });
      }

      case "inactive": {
        return NextResponse.json(inactiveTransporterResponse, { status: 200 });
      }

      case "new": {
        return NextResponse.json(newTransporterResponse, { status: 200 });
      }

      default: {
        // Return success response with dynamic ID
        const responseData = {
          ...successResponse,
          Data: {
            ...successResponse.Data,
            id: transporterId,
          },
        };

        return NextResponse.json(responseData, { status: 200 });
      }
    }
  } catch {
    return NextResponse.json(transporterDetailsServerErrorResponse, {
      status: 500,
    });
  }
}
