import { NextResponse } from "next/server";

import {
  authErrorResponse,
  errorResponse,
  serverErrorResponse,
  successResponse,
} from "./mockData";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(req) {
  try {
    // Add realistic delay for testing
    await delay(1000);

    // Check for authorization header
    const authHeader = req.headers.get("authorization");

    // Mock validation logic - check if authorization header is present
    if (!authHeader) {
      return NextResponse.json(authErrorResponse, {
        status: authErrorResponse.Message.Code,
      });
    }

    // Parse request body
    const body = await req.json();

    // Extract showPopup from request body (referensi ke [dbm_mt_user.show_first_time_popup] di ERD)
    const { showPopup } = body;

    // Mock validation logic - check if showPopup is a boolean
    if (typeof showPopup !== "boolean") {
      return NextResponse.json(errorResponse, {
        status: errorResponse.Message.Code,
      });
    }

    // Mock update logic - simulate updating database
    // In real implementation, this would update [dbm_mt_user.show_first_time_popup]
    const updatedPreferences = {
      showBulkDriverPopup: showPopup,
    };

    // Return success response with updated preferences
    const response = {
      ...successResponse,
      Data: {
        ...successResponse.Data,
        showBulkDriverPopup: updatedPreferences.showBulkDriverPopup,
      },
    };

    // Log for debugging purposes
    // eslint-disable-next-line no-console
    console.log("Popup preferences updated:", {
      received: { showPopup },
      updated: response.Data,
    });

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
