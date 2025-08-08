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

export async function GET(req) {
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

    // Mock template availability check
    // Simulate 5% chance of template not being found for testing
    const templateExists = Math.random() > 0.05;

    if (!templateExists) {
      return NextResponse.json(errorResponse, {
        status: errorResponse.Message.Code,
      });
    }

    // Generate mock template URL
    const mockTemplateUrl = `https://storage.example.com/templates/driver-import-template-${Date.now()}.xlsx`;

    // Return success response with template URL
    const response = {
      ...successResponse,
      Data: {
        ...successResponse.Data,
        templateUrl: mockTemplateUrl,
      },
    };

    // Log for debugging purposes
    // eslint-disable-next-line no-console
    console.log("Excel template URL generated:", response.Data.templateUrl);

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
