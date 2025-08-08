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

    // Extract query parameters if needed
    const { searchParams } = new URL(req.url);
    const templateType = searchParams.get("type"); // Optional: for different template types

    // Add mock validation logic here
    // Example: Check if template exists or user has permission
    const hasPermission = true; // Mock permission check

    if (!hasPermission) {
      return NextResponse.json(errorResponse, {
        status: errorResponse.Message.Code,
      });
    }

    // Mock different template types if needed
    let templateData = successResponse;
    if (templateType === "bulk") {
      templateData = {
        ...successResponse,
        Data: {
          templateUrl:
            "https://muattrans-storage.s3.ap-southeast-1.amazonaws.com/templates/fleet-bulk-template.xlsx",
        },
      };
    }

    // Return success response with template URL
    return NextResponse.json(templateData, {
      status: templateData.Message.Code,
    });
  } catch {
    // Error handling without console logging
    return NextResponse.json(serverErrorResponse, {
      status: 500,
    });
  }
}
