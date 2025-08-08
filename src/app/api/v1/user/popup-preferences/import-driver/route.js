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

    // Check for authorization header
    const authHeader = req.headers.get("authorization");

    // Mock validation logic - check if authorization header is present
    if (!authHeader) {
      return NextResponse.json(errorResponse, {
        status: errorResponse.Message.Code,
      });
    }

    // Mock different popup preference states based on user ID or other criteria
    // For demonstration, we'll randomly show different states
    const shouldShowPopup = Math.random() > 0.3; // 70% chance to show popup

    // Return success response with dynamic popup state
    const response = {
      ...successResponse,
      Data: {
        ...successResponse.Data,
        showPopup: shouldShowPopup,
      },
    };

    // Log for debugging purposes
    // eslint-disable-next-line no-console
    console.log("Popup preferences retrieved:", response.Data);

    return NextResponse.json(response, {
      status: response.Message.Code,
    });
  } catch (error) {
    // Log error for debugging
    // eslint-disable-next-line no-console
    console.error("API Error:", error);
    return NextResponse.json(serverErrorResponse, {
      status: 500,
    });
  }
}
